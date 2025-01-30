/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';
import {
  AtualizarUsuario,
  LoginUsuario,
  RegistrarUsuario,
  Usuario,
} from '@s3curity/core';
import { LoginPrisma } from 'src/login/login.prisma';
import { PerfilPrisma } from 'src/perfil/perfil.prisma';
import { PermissaoPrisma } from 'src/permissao/permissao.prisma';
import { UsuarioLogado } from 'src/shared/usuario.decorator';
import * as nodemailer from 'nodemailer';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly repo: UsuarioPrisma,
    private readonly loginRepo: LoginPrisma,
    private readonly cripto: BcryptProvider,
    private readonly perfilRepo: PerfilPrisma,
    private readonly permissaoRepo: PermissaoPrisma,
  ) {}

  @Post('login')
  async login(
    @Body() dados: { email: string; senha: string },
    @Ip() ip: string,
  ): Promise<{ token: string; status: number; message: string }> {
    const casoDeUso = new LoginUsuario(this.repo, this.cripto);
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

    await this.repo.salvar({ ...usuario, data_expiracao_token: expiracao });

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
    const casoDeUso = new RegistrarUsuario(this.repo, this.cripto);
    const novoUsuario = await casoDeUso.executar(usuario);

    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso!',
      novoUsuario: novoUsuario,
    };
  }

  @Get('todos')
  async todos(@UsuarioLogado() usuario: Usuario): Promise<{
    status: number;
    message: string;
    usuarios: Partial<Usuario>[];
  }> {
    const usuarios = await this.repo.buscarTodos();

    const usuariosComPerfis = await Promise.all(
      usuarios.map(async (usuario) => {
        const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
          usuario.email!,
        );

        return {
          ...usuario,
          perfis: perfis.map((perfil) => ({
            id: perfil.id,
            nome: perfil.nome,
            ativo: perfil.ativo,
          })),
        };
      }),
    );

    return {
      status: 200,
      message: 'Usuários recuperados com sucesso!',
      usuarios: usuariosComPerfis,
    };
  }

  @Get('email/:email')
  async buscarPorEmail(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
  ): Promise<{ status: number; message: string; usuario?: Usuario }> {
    const usuarioEncontrado = await this.repo.buscarPorEmail(email);

    if (!usuarioEncontrado) {
      return {
        status: 404,
        message: 'Usuário não encontrado!',
        usuario: undefined,
      };
    }

    return {
      status: 200,
      usuario: {
        id: usuarioEncontrado.id,
        nome_completo: usuarioEncontrado.nome_completo,
        email: usuarioEncontrado.email,
        telefone: usuarioEncontrado.telefone,
        ativo: usuarioEncontrado.ativo,
        url_imagem_perfil: usuarioEncontrado.url_imagem_perfil,
        dias_trabalho: usuarioEncontrado.dias_trabalho,
        horas_trabalho: usuarioEncontrado.horas_trabalho,
      },
      message: 'Usuário recuperado com sucesso!',
    };
  }

  @Post('relacionar-perfis')
  async relacionarPerfis(
    @UsuarioLogado() usuarioLogado: Usuario,
    @Body() body: { usuario: Partial<Usuario>; perfisIds: string[] },
  ): Promise<{ status: number; message: string }> {
    const { usuario, perfisIds } = body;

    const perfisAtuais = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
      usuario.email!,
    );
    const perfisAtuaisIds = perfisAtuais.map((perfil) => perfil.id);

    const perfisParaAdicionar = perfisIds.filter(
      (id) => !perfisAtuaisIds.includes(id),
    );

    const perfisParaRemover = perfisAtuaisIds.filter(
      (id) => !perfisIds.includes(id),
    );

    for (const perfilId of perfisParaAdicionar) {
      await this.repo.relacionarUsuarioComPerfil(usuario, perfilId);
    }

    for (const perfilId of perfisParaRemover) {
      await this.repo.removerRelacaoUsuarioPerfil(usuario.id, perfilId);
    }

    return { status: 200, message: 'Perfis atualizados com sucesso!' };
  }

  @Put('atualizar/:email')
  async atualizar(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
    @Body() dadosAtualizados: Partial<Usuario>,
  ): Promise<{
    status: number;
    message: string;
    usuarioAtualizado?: Partial<Usuario>;
  }> {
    const casoDeUso = new AtualizarUsuario(this.repo, this.cripto);
    const usuarioAtualizado = await casoDeUso.executar(email, dadosAtualizados);

    if (dadosAtualizados.senha) {
      dadosAtualizados.senha = await this.cripto.criptografar(
        dadosAtualizados.senha,
      );
    } else {
      delete dadosAtualizados.senha;
    }

    return {
      status: 200,
      message: 'Usuário atualizado com sucesso!',
      usuarioAtualizado: usuarioAtualizado,
    };
  }

  @Delete('deletar/:email')
  async deletar(
    @UsuarioLogado() usuarioLogado: Usuario,
    @Param('email') email: string,
  ): Promise<{ status: number; message: string }> {
    const usuario = await this.repo.buscarPorEmail(email);
    await this.repo.deletar(usuario);

    return { status: 200, message: 'Usuário deletado com sucesso!' };
  }

  @Put('solicitar-recuperacao')
  async solicitarRecuperacao(
    @Body() dados: { email: string },
  ): Promise<{ status: number; message: string }> {
    const usuario = await this.repo.buscarPorEmail(dados.email);
    const segredo = process.env.JWT_SECRET!;

    const token = jwt.sign({ email: usuario.email }, segredo, {
      expiresIn: '5m',
    });

    await this.repo.salvar({
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
      html: `<p>Para recuperar sua senha, clique no seguinte link:</p><p><a href="${process.env.FRONTEND_URL}/recuperarSenha?token=${token}">Recuperar Senha</a></p>`,
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

      const usuario = await this.repo.buscarPorEmail(decoded.email);

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

      const usuario = await this.repo.buscarPorEmail(decoded.email);

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

      await this.repo.salvar({
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
}
