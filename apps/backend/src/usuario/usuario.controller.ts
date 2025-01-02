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
  ): Promise<{ token: string }> {
    const casoDeUso = new LoginUsuario(this.repo, this.cripto);
    const usuario = await casoDeUso.comEmailSenha(dados.email, dados.senha);
    const segredo = process.env.JWT_SECRET!;

    const token = jwt.sign(usuario, segredo, { expiresIn: '15d' }) as string;

    return { token };
  }

  @Post('registrar')
  async registrar(@Body() usuario: Usuario): Promise<void> {
    const casoDeUso = new RegistrarUsuario(this.repo, this.cripto);

    await casoDeUso.executar(usuario);
  }
}
