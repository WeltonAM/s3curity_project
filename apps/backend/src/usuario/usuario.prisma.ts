import { Injectable } from '@nestjs/common';
import { RepositorioUsuario, Usuario } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class UsuarioPrisma implements RepositorioUsuario {
  constructor(private readonly prisma: PrismaProvider) {}

  async salvar(usuario: Partial<Usuario>): Promise<void> {
    await this.prisma.usuario.upsert({
      where: { id: usuario.id ?? '' },
      update: usuario,
      create: usuario as any,
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = (await this.prisma.usuario.findUnique({
      where: { email },
    })) as Usuario;

    return usuario ?? null;
  }
}
