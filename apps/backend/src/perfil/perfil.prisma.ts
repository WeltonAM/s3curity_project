import { Injectable } from '@nestjs/common';
import { Perfil, RepositorioPerfil } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class PerfilPrisma implements RepositorioPerfil {
  constructor(private readonly prisma: PrismaProvider) {}

  async salvar(perfil: Partial<Perfil>): Promise<void> {
    await this.prisma.perfil.upsert({
      where: { id: perfil.id ?? '' },
      update: {
        nome: perfil.nome,
        descricao: perfil.descricao,
        ativo: perfil.ativo,
        criado_em: perfil.criado_em || undefined,
      },
      create: {
        id: perfil.id,
        nome: perfil.nome,
        descricao: perfil.descricao || null,
        ativo: perfil.ativo !== undefined ? perfil.ativo : true,
        criado_em: perfil.criado_em || new Date(),
      },
    });
  }

  async buscarPerfilPorNome(nome: string): Promise<Partial<Perfil>[]> {
    const perfis = await this.prisma.perfil.findMany({
      where: { nome },
      include: {
        perfilPermissoes: {
          include: {
            permissao: true,
          },
        },
      },
    });
    return perfis;
  }

  async buscarPerfilPorUsuarioEmail(email: string): Promise<Partial<Perfil>[]> {
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
      descricao: usuarioPerfil.perfil.descricao || '',
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
      id: perfil.id,
      nome: perfil.nome,
      descricao: perfil.descricao,
      ativo: perfil.ativo,
      permissoes: perfil.perfilPermissoes.map((pp) => pp.permissao),
    }));
  }

  async relacionarPerfilComPermissao(
    perfilId: string,
    permissaoId: string,
  ): Promise<void> {
    await this.prisma.perfilPermissao.create({
      data: {
        perfil_id: perfilId,
        permissao_id: permissaoId,
      },
    });
  }

  async deletar(perfil: Partial<Perfil>): Promise<void> {
    if (!perfil.id) {
      throw new Error("O campo 'id' é obrigatório para deletar o perfil.");
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.perfilPermissao.deleteMany({
        where: { perfil_id: perfil.id },
      });

      await prisma.usuarioPerfil.deleteMany({
        where: { perfil_id: perfil.id },
      });

      await prisma.perfil.delete({
        where: { id: perfil.id },
      });
    });
  }
}
