import { Body, Controller, Ip, Post } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';
import { LoginUsuario, RegistrarUsuario, Usuario } from '@s3curity/core';
import { LoginPrisma } from 'src/login/login.prisma';
import { PerfilPrisma } from 'src/perfil/perfil.prisma';
import { PermissaoPrisma } from 'src/permissao/permissao.prisma';

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

    const perfis = await this.perfilRepo.buscarPerfisPorUsuarioEmail(
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
  async registrar(
    @Body() usuario: Usuario,
  ): Promise<{ status: number; message: string; usuario?: Usuario }> {
    const casoDeUso = new RegistrarUsuario(this.repo, this.cripto);

    await casoDeUso.executar(usuario);

    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso!',
      usuario: usuario,
    };
  }
}
