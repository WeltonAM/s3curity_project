/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';
import { LoginUsuario, RegistrarUsuario, Usuario } from '@s3curity/core';
import { LoginPrisma } from 'src/login/login.prisma';
import { PerfilPrisma } from 'src/perfil/perfil.prisma';
import { PermissaoPrisma } from 'src/permissao/permissao.prisma';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

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

    const perfisComPermissoes = await Promise.all(
      perfis.map(async (perfil) => {
        const permissoes = await this.permissaoRepo.buscarPermissoesPorPerfilId(
          perfil.id,
        );
        return {
          nome: perfil.nome,
          permissoes: permissoes.map((p) => p.nome),
        };
      }),
    );

    const usuarioComPerfisEPermissoes = {
      ...usuario,
      perfis: perfisComPermissoes,
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

    console.log('CONTROLLER: ', novoUsuario);

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
  ): Promise<{ status: number; usuario?: Usuario }> {
    const usuarioEncontrado = await this.repo.buscarPorEmail(email);

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
    };
  }

  @Post('relacionar-perfis')
  async relacionarPerfis(
    @Body() body: { usuarioId: string; perfisIds: string[] },
  ): Promise<{ status: number; message: string }> {
    for (const perfilId of body.perfisIds) {
      await this.repo.relacionarUsuarioComPerfil(body.usuarioId, perfilId);
    }

    return { status: 200, message: 'Perfis relacionados com sucesso!' };
  }
}
