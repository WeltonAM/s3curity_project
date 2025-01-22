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

  async buscarPermissoesAtivas(): Promise<Permissao[]> {
    const permissoes = await this.prisma.permissao.findMany({
      where: { ativo: true },
    });

    return permissoes.map((permissao) => ({
      id: permissao.id,
      nome: permissao.nome,
      descricao: permissao.descricao,
      criado_em: permissao.criado_em,
      ativo: permissao.ativo,
    }));
  }

  async buscarPermissoesPorPerfilId(perfilId: string): Promise<Permissao[]> {
    const permissoes = await this.prisma.perfilPermissao.findMany({
      where: { perfil_id: perfilId },
      include: { permissao: true },
    });

    return permissoes.map((perfilPermissao) => ({
      id: perfilPermissao.permissao.id,
      nome: perfilPermissao.permissao.nome,
      descricao: perfilPermissao.permissao.descricao,
      criado_em: perfilPermissao.permissao.criado_em,
      ativo: perfilPermissao.permissao.ativo,
    }));
  }
}
