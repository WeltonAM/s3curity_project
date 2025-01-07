import { Injectable } from '@nestjs/common';
import { Login, RepositorioLogin } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class LoginPrisma implements RepositorioLogin {
  constructor(private readonly prisma: PrismaProvider) {}

  async registrar(login: Login): Promise<void> {
    await this.prisma.login.create({
      data: {
        id: login.id ?? undefined,
        usuario_email: login.usuario_email,
        sucesso: login.sucesso,
        ip: login.ip ?? null,
        data_hora: login.data_hora ?? new Date(),
        provedor: login.provedor ?? null,
        token: login.token ?? null,
      },
    });
  }

  async buscarUsuarioPorEmail(email: string): Promise<Login | undefined> {
    const login = await this.prisma.login.findFirst({
      where: { usuario: { email } },
      include: {
        usuario: true,
      },
    });

    if (!login) {
      return undefined;
    }

    return {
      id: login.id,
      usuario_email: login.usuario.email,
      sucesso: login.sucesso,
      ip: login.ip ?? undefined,
      data_hora: login.data_hora,
      provedor: login.provedor ?? undefined,
      token: login.token ?? undefined,
    };
  }
}
