import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import { Permissao, RepositorioPermissao } from '@s3curity/core';

@Injectable()
export class PermissaoPrisma implements RepositorioPermissao {
  constructor(private readonly prisma: PrismaProvider) {}

  async salvar(permissao: Partial<Permissao>): Promise<void> {
    await this.prisma.permissao.upsert({
      where: { id: permissao.id ?? '' },
      update: permissao,
      create: permissao as any,
    });
  }

  async buscarPermissaoPorId(id: string): Promise<Partial<Permissao> | null> {
    const permissao = await this.prisma.permissao.findUnique({
      where: { id: id },
    });

    if (!permissao) {
      return null;
    }

    return {
      id: permissao.id,
      slug: permissao.slug,
      nome: permissao.nome,
      descricao: permissao.descricao,
      ativo: permissao.ativo,
    };
  }

  async buscarTodasPermissoes(): Promise<Partial<Permissao>[]> {
    const permissoes = await this.prisma.permissao.findMany();

    return permissoes.map((permissao) => ({
      id: permissao.id,
      slug: permissao.slug,
      nome: permissao.nome,
      descricao: permissao.descricao,
      ativo: permissao.ativo,
    }));
  }

  async buscarPermissoesPorPerfilId(
    perfilId: string,
  ): Promise<Partial<Permissao>[]> {
    const permissoes = await this.prisma.perfilPermissao.findMany({
      where: { perfil_id: perfilId },
      include: { permissao: true },
    });

    return permissoes.map((perfilPermissao) => ({
      id: perfilPermissao.permissao.id,
      slug: perfilPermissao.permissao.slug,
      nome: perfilPermissao.permissao.nome,
      descricao: perfilPermissao.permissao.descricao,
      ativo: perfilPermissao.permissao.ativo,
    }));
  }

  async buscarPermissaoPorSlug(
    slug: string,
  ): Promise<Partial<Permissao> | null> {
    const permissao = await this.prisma.permissao.findUnique({
      where: { slug: slug },
    });

    if (!permissao) {
      return null;
    }

    return {
      id: permissao.id,
      slug: permissao.slug,
      nome: permissao.nome,
      descricao: permissao.descricao,
      ativo: permissao.ativo,
    };
  }

  async deletar(id: string): Promise<void> {
    await this.prisma.perfilPermissao.deleteMany({
      where: { permissao_id: id },
    });

    await this.prisma.permissao.delete({
      where: { id },
    });
  }
}
