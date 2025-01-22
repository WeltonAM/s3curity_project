import { Injectable } from '@nestjs/common';
import { Perfil } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class PerfilPrisma {
  constructor(private readonly prisma: PrismaProvider) {}

  async salvar(perfil: Partial<Perfil>): Promise<void> {
    await this.prisma.perfil.upsert({
      where: { id: perfil.id ?? '' },
      update: perfil,
      create: perfil as any,
    });
  }

  async buscarPerfisPorUsuarioEmail(email: string): Promise<Perfil[]> {
    const perfis = await this.prisma.usuarioPerfil.findMany({
      where: { usuario: { email } },
      include: {
        perfil: {
          include: {
            perfilPermissoes: {
              include: {
                permissao: true,
              },
            },
          },
        },
      },
    });

    return perfis.map((usuarioPerfil) => ({
      id: usuarioPerfil.perfil.id,
      nome: usuarioPerfil.perfil.nome,
      descricao: usuarioPerfil.perfil.descricao,
      criado_em: usuarioPerfil.perfil.criado_em,
      ativo: usuarioPerfil.perfil.ativo,
      permissoes: usuarioPerfil.perfil.perfilPermissoes.map(
        (pp) => pp.permissao,
      ),
    }));
  }

  async buscarTodosPerfis(): Promise<Partial<Perfil>[]> {
    const perfis = await this.prisma.perfil.findMany({
      include: {
        perfilPermissoes: {
          include: {
            permissao: true,
          },
        },
      },
    });

    return perfis.map((perfil) => ({
      nome: perfil.nome,
      descricao: perfil.descricao,
      ativo: perfil.ativo,
    }));
  }
}
