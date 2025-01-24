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

  async buscarTodos(): Promise<Partial<Usuario>[]> {
    const usuarios = await this.prisma.usuario.findMany();

    return usuarios.map((usuario) => ({
      id: usuario.id,
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      telefone: usuario.telefone,
      ativo: usuario.ativo,
      url_imagem_perfil: usuario.url_imagem_perfil,
      dias_trabalho: usuario.dias_trabalho,
      horas_trabalho: usuario.horas_trabalho,
    }));
  }
}
