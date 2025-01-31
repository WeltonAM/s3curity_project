import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';
import { UsuarioPrisma } from 'src/usuario/usuario.prisma';
import { LoginPrisma } from 'src/login/login.prisma';
import { BcryptProvider } from 'src/usuario/bcrypt.provider';
import ProvedorAutenticacaoGoogle from 'src/google/ProvedorAutenticacaoGoogle';
import { LoginUsuario, RegistrarUsuario } from '@s3curity/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioRepo: UsuarioPrisma,
    private readonly loginRepo: LoginPrisma,
    private readonly cripto: BcryptProvider,
    private readonly provedorGoogle: ProvedorAutenticacaoGoogle,
  ) {}

  async login(email: string, senha: string, ip: string) {
    const casoDeUso = new LoginUsuario(this.usuarioRepo, this.cripto);
    const usuario = await casoDeUso.comEmailSenha(email, senha);

    const token = this.gerarToken(usuario);
    await this.usuarioRepo.salvar({
      ...usuario,
      data_expiracao_token: this.definirExpiracaoToken(),
    });

    await this.loginRepo.registrar({
      usuario_email: email,
      sucesso: true,
      ip,
      data_hora: new Date(),
      provedor: null,
      token,
    });

    return { token, status: 200, message: 'Login efetuado com sucesso!' };
  }

  async registrar(usuario) {
    const casoDeUso = new RegistrarUsuario(this.usuarioRepo, this.cripto);
    const novoUsuario = await casoDeUso.executar(usuario);

    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso!',
      novoUsuario,
    };
  }

  async solicitarRecuperacao(email: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    const token = this.gerarToken({ email }, '5m');

    await this.usuarioRepo.salvar({
      ...usuario,
      token_recuperacao: token,
      data_expiracao_token: this.definirExpiracaoToken(5),
    });

    await this.enviarEmailRecuperacao(email, token);

    return {
      status: 200,
      message: 'E-mail de recuperação enviado com sucesso!',
    };
  }

  async verificarTokenRecuperacao(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
      const usuario = await this.usuarioRepo.buscarPorEmail(decoded.email);

      if (!usuario || usuario.token_recuperacao?.trim() !== token.trim()) {
        return { status: 400, message: 'Token inválido!', email: undefined };
      }

      return { status: 200, message: 'Token válido!', email: usuario.email };
    } catch {
      return { status: 400, message: 'Token inválido!', email: undefined };
    }
  }

  async recuperarSenha(
    token: string,
    novaSenha: string,
    confirmarSenha: string,
  ) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
      const usuario = await this.usuarioRepo.buscarPorEmail(decoded.email);

      if (
        !usuario ||
        usuario.token_recuperacao.trim() !== token.trim() ||
        new Date() > usuario.data_expiracao_token
      ) {
        return { status: 400, message: 'Token inválido ou expirado!' };
      }

      if (novaSenha !== confirmarSenha) {
        return { status: 400, message: 'As senhas não coincidem!' };
      }

      await this.usuarioRepo.salvar({
        id: usuario.id,
        email: usuario.email,
        senha: await this.cripto.criptografar(novaSenha),
        token_recuperacao: null,
      });

      return { status: 200, message: 'Senha alterada com sucesso!' };
    } catch {
      return { status: 400, message: 'Token inválido ou expirado!' };
    }
  }

  async gerarQrCode(email: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario || !usuario.ativo)
      throw new Error('Usuário não encontrado ou inativo.');

    const tokenLogin = this.gerarToken({ email }, '15m');
    const loginUrl = `${process.env.FRONTEND_URL}/loginQRCode?token=${tokenLogin}`;

    try {
      return { status: 200, qrCodeUrl: await QRCode.toDataURL(loginUrl) };
    } catch {
      return { status: 404, qrCodeUrl: null };
    }
  }

  async loginQr(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };
      const usuario = await this.usuarioRepo.buscarPorEmail(decoded.email);

      if (!usuario || !usuario.ativo)
        throw new Error('Usuário não encontrado ou inativo.');

      return {
        token: this.gerarToken(usuario),
        status: 200,
        message: 'Login efetuado com sucesso!',
      };
    } catch {
      return { status: 400, message: 'Token inválido ou expirado.', token: '' };
    }
  }

  async loginComGoogle(token: string, provedor: string) {
    try {
      const usuario = await new LoginUsuario(
        this.usuarioRepo,
        this.cripto,
        this.provedorGoogle,
      ).comProvedor(provedor, token);
      return {
        token: this.gerarToken(usuario),
        status: 200,
        message: 'Login efetuado com sucesso!',
      };
    } catch (error) {
      return { status: 400, message: error.message, token: '' };
    }
  }

  private gerarToken(payload: any, expiresIn: string = '15d') {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
  }

  private definirExpiracaoToken(dias: number = 15) {
    const expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + dias);
    return expiracao;
  }

  private async enviarEmailRecuperacao(email: string, token: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAILTRAP_EMAIL,
        to: email,
        subject: 'Recuperação de senha',
        html: `<a href="${process.env.FRONTEND_URL}/recuperarSenha?token=${token}">Recuperar Senha</a>`,
      });
    } catch (error) {
      console.error('Erro ao enviar o e-mail de recuperação:', error);
      throw new Error('Erro ao enviar o e-mail de recuperação');
    }
  }
}
