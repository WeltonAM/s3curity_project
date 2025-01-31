import { Body, Controller, Post, Put, Get, Param, Ip } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';
import { LoginPrisma } from 'src/login/login.prisma';
import { LoginUsuario, RegistrarUsuario, Usuario } from '@s3curity/core';
import { UsuarioPrisma } from 'src/usuario/usuario.prisma';
import { BcryptProvider } from 'src/usuario/bcrypt.provider';
import { PerfilPrisma } from 'src/perfil/perfil.prisma';
import { PermissaoPrisma } from 'src/permissao/permissao.prisma';
import ProvedorAutenticacaoGoogle from 'src/google/ProvedorAutenticacaoGoogle';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usuarioRepo: UsuarioPrisma,
    private readonly loginRepo: LoginPrisma,
    private readonly cripto: BcryptProvider,
    private readonly perfilRepo: PerfilPrisma,
    private readonly permissaoRepo: PermissaoPrisma,
    private readonly provedorGoogle: ProvedorAutenticacaoGoogle,
  ) {}

  @Post('login')
  async login(
    @Body() dados: { email: string; senha: string },
    @Ip() ip: string,
  ): Promise<{ token: string; status: number; message: string }> {
    const casoDeUso = new LoginUsuario(this.usuarioRepo, this.cripto);
    const usuario = await casoDeUso.comEmailSenha(dados.email, dados.senha);

    const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
      usuario.email,
    );

    const perfisAtivos = perfis
      .filter((perfil) => perfil.ativo)
      .map((perfil) => ({ nome: perfil.nome, id: perfil.id }));

    const permissoes = await Promise.all(
      perfisAtivos.map(async (perfil) => {
        const perfilData = perfis.find((p) => p.id === perfil.id);
        if (perfilData) {
          const permissoesPorPerfil =
            await this.permissaoRepo.buscarPermissoesPorPerfilId(perfilData.id);
          return permissoesPorPerfil
            .filter((p) => p.ativo)
            .map((p) => ({ nome: p.nome, id: p.id }));
        }
        return [];
      }),
    );

    const permissoesUnicas = Array.from(
      new Set([].concat(...permissoes).map((p) => p.id)),
    ).map((id) => permissoes.flat().find((p) => p.id === id));

    const usuarioComPerfisEPermissoes = {
      ...usuario,
      perfis: perfisAtivos,
      permissoes: permissoesUnicas,
    };

    const segredo = process.env.JWT_SECRET!;
    const token = jwt.sign(usuarioComPerfisEPermissoes, segredo, {
      expiresIn: '15d',
    }) as string;

    const expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + 15);

    await this.usuarioRepo.salvar({
      ...usuario,
      data_expiracao_token: expiracao,
    });

    const loginData = {
      usuario_email: dados.email,
      sucesso: true,
      ip: ip,
      data_hora: new Date(),
      provedor: null,
      token,
    };

    await this.loginRepo.registrar(loginData);

    return {
      token,
      status: 200,
      message: 'Login efetuado com sucesso!',
    };
  }

  @Post('registrar')
  async registrar(@Body() usuario: Usuario): Promise<{
    status: number;
    message: string;
    novoUsuario?: Partial<Usuario> | void;
  }> {
    const casoDeUso = new RegistrarUsuario(this.usuarioRepo, this.cripto);
    const novoUsuario = await casoDeUso.executar(usuario);

    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso!',
      novoUsuario: novoUsuario,
    };
  }

  @Put('solicitar-recuperacao')
  async solicitarRecuperacao(
    @Body() dados: { email: string },
  ): Promise<{ status: number; message: string }> {
    const usuario = await this.usuarioRepo.buscarPorEmail(dados.email);
    const segredo = process.env.JWT_SECRET!;

    const token = jwt.sign({ email: usuario.email }, segredo, {
      expiresIn: '5m',
    });

    await this.usuarioRepo.salvar({
      ...usuario,
      token_recuperacao: token,
      data_expiracao_token: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || '587', 10),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_EMAIL,
      to: usuario.email,
      subject: 'Recuperação de senha',
      html: `
        <p>Para recuperar sua senha, clique no seguinte link:</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/recuperarSenha?token=${token}">
            Recuperar Senha
          </a>
        </p>
        <p>Você terá 5min para realizar o processo de recuperação de senha.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message: 'E-mail de recuperação enviado com sucesso!',
    };
  }

  @Get('verificar-token/:token')
  async verificarTokenRecuperacao(
    @Param('token') token: string,
  ): Promise<{ status: number; message: string; email?: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };

      const usuario = await this.usuarioRepo.buscarPorEmail(decoded.email);

      if (!usuario || usuario.token_recuperacao?.trim() !== token.trim()) {
        return {
          status: 400,
          message: 'Token inválido!',
          email: undefined,
        };
      }

      return {
        status: 200,
        message: 'Token válido!',
        email: usuario.email,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 400,
        message: 'Token inválido!',
        email: undefined,
      };
    }
  }

  @Put('recuperar-senha')
  async recuperarSenha(
    @Body() dados: { token: string; novaSenha: string; confirmarSenha: string },
  ): Promise<{ status: number; message: string }> {
    const { token, novaSenha, confirmarSenha } = dados;

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
        return {
          status: 400,
          message: 'Token inválido ou expirado!',
        };
      }

      if (novaSenha !== confirmarSenha) {
        return {
          status: 400,
          message: 'As senhas não coincidem!',
        };
      }

      const senhaCriptografada = await this.cripto.criptografar(novaSenha);

      await this.usuarioRepo.salvar({
        id: usuario.id,
        senha: senhaCriptografada,
        token_recuperacao: null,
        data_expiracao_token: null,
        email: usuario.email,
      });

      return {
        status: 200,
        message: 'Senha alterada com sucesso!',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 400,
        message: 'Token inválido ou expirado!',
      };
    }
  }

  @Post('gerar-qr-code')
  async gerarQrCode(
    @Body() dados: { email: string },
  ): Promise<{ status: number; qrCodeUrl: string | null }> {
    const usuario = await this.usuarioRepo.buscarPorEmail(dados.email);
    if (!usuario || !usuario.ativo) {
      throw new Error('Usuário não encontrado ou inativo.');
    }

    const segredo = process.env.JWT_SECRET!;
    const tokenLogin = jwt.sign({ email: dados.email }, segredo, {
      expiresIn: '15m',
    });

    const loginUrl = `${process.env.FRONTEND_URL}/loginQRCode?token=${tokenLogin}`;

    try {
      const qrCodeUrl = await QRCode.toDataURL(loginUrl);
      return {
        status: 200,
        qrCodeUrl,
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code', error);
      return {
        status: 404,
        qrCodeUrl: null,
      };
    }
  }

  @Post('login-qr')
  async loginQr(
    @Body() dados: { token: string },
  ): Promise<{ token: string; status: number; message: string }> {
    try {
      const decoded = jwt.verify(dados.token, process.env.JWT_SECRET!) as {
        email: string;
      };

      const usuario = await this.usuarioRepo.buscarPorEmail(decoded.email);
      if (!usuario || !usuario.ativo) {
        throw new Error('Usuário não encontrado ou inativo.');
      }

      const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
        usuario.email,
      );
      const perfisAtivos = perfis
        .filter((perfil) => perfil.ativo)
        .map((perfil) => ({ nome: perfil.nome, id: perfil.id }));

      const permissoes = await Promise.all(
        perfisAtivos.map(async (perfil) => {
          const permissoesPorPerfil =
            await this.permissaoRepo.buscarPermissoesPorPerfilId(perfil.id);
          return permissoesPorPerfil
            .filter((p) => p.ativo)
            .map((p) => ({ nome: p.nome, id: p.id }));
        }),
      );

      const permissoesUnicas = Array.from(
        new Set([].concat(...permissoes).map((p) => p.id)),
      ).map((id) => permissoes.flat().find((p) => p.id === id));

      const usuarioComPerfisEPermissoes = {
        ...usuario,
        perfis: perfisAtivos,
        permissoes: permissoesUnicas,
      };

      const segredo = process.env.JWT_SECRET!;
      const token = jwt.sign(usuarioComPerfisEPermissoes, segredo, {
        expiresIn: '15d',
      }) as string;

      return { token, status: 200, message: 'Login efetuado com sucesso!' };
    } catch (error) {
      console.error(error);
      return { status: 400, message: 'Token inválido ou expirado.', token: '' };
    }
  }

  @Post('login/provedor')
  async loginComGoogle(
    @Body() dados: { token: string; provedor: string },
    @Ip() ip: string,
  ) {
    try {
      const casoDeUso = new LoginUsuario(
        this.usuarioRepo,
        this.cripto,
        this.provedorGoogle,
      );

      const usuario = await casoDeUso.comProvedor(dados.provedor, dados.token);

      const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
        usuario.email,
      );
      const perfisAtivos = perfis
        .filter((perfil) => perfil.ativo)
        .map((perfil) => ({ nome: perfil.nome, id: perfil.id }));

      const permissoes = await Promise.all(
        perfisAtivos.map(async (perfil) => {
          const permissoesPorPerfil =
            await this.permissaoRepo.buscarPermissoesPorPerfilId(perfil.id);
          return permissoesPorPerfil
            .filter((p) => p.ativo)
            .map((p) => ({ nome: p.nome, id: p.id }));
        }),
      );

      const permissoesUnicas = Array.from(
        new Set(permissoes.flat().map((p) => p.id)),
      ).map((id) => permissoes.flat().find((p) => p.id === id));

      const segredo = process.env.JWT_SECRET!;
      const token = jwt.sign(
        { ...usuario, perfis: perfisAtivos, permissoes: permissoesUnicas },
        segredo,
        { expiresIn: '15d' },
      );

      await this.loginRepo.registrar({
        usuario_email: usuario.email,
        sucesso: true,
        ip: ip,
        data_hora: new Date(),
        provedor: dados.provedor,
        token,
      });

      return {
        token,
        status: 200,
        message: `Login efetuado com sucesso!`,
      };
    } catch (error) {
      console.error(error);
      return { status: 400, message: error.message, token: '' };
    }
  }
}
