import { Body, Controller, Post } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioPrisma } from './usuario.prisma';
import {
  LoginUsuario,
  ProvedorAutenticacao,
  RegistrarUsuario,
  Usuario,
} from '@s3curity/core';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly repo: UsuarioPrisma,
    private readonly cripto: BcryptProvider,
    private readonly provedorAutenticacao: ProvedorAutenticacao,
  ) {}

  @Post('registrar')
  async registrar(@Body() usuario: Usuario) {
    const casoDeUso = new RegistrarUsuario(this.repo, this.cripto);
    await casoDeUso.executar(usuario);
  }

  @Post('login')
  async login(@Body() dados: { email: string; senha: string }) {
    const casoDeUso = new LoginUsuario(this.repo, this.cripto);

    const usuario = await casoDeUso.comEmailSenha(dados.email, dados.senha);

    const segredo = process.env.JWT_SECRET;
    const token = jwt.sign(usuario, segredo, { expiresIn: '15d' });

    return { token };
  }

  @Post('login-com-provedor')
  async loginComProvedor(@Body() dados: { provedor: string; token: string }) {
    const casoDeUso = new LoginUsuario(
      this.repo,
      this.cripto,
      this.provedorAutenticacao,
    );

    const usuario = await casoDeUso.comProvedor(dados.provedor, dados.token);

    const segredo = process.env.JWT_SECRET;
    const token = jwt.sign(usuario, segredo, { expiresIn: '15d' });

    return { token };
  }
}
