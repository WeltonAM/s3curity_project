import { Body, Controller, Post } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';
import { LoginUsuario, RegistrarUsuario, Usuario } from '@s3curity/core';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly repo: UsuarioPrisma,
    private readonly cripto: BcryptProvider,
  ) {}

  @Post('login')
  async login(
    @Body() dados: { email: string; senha: string },
  ): Promise<{ token: string; status: number; message: string }> {
    const casoDeUso = new LoginUsuario(this.repo, this.cripto);
    const usuario = await casoDeUso.comEmailSenha(dados.email, dados.senha);
    const segredo = process.env.JWT_SECRET!;

    const token = jwt.sign(usuario, segredo, { expiresIn: '15d' }) as string;

    const expiracao = new Date();
    expiracao.setDate(expiracao.getDate() + 15);

    await this.repo.salvar({ ...usuario, data_expiracao_token: expiracao });

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
