import { Injectable } from '@nestjs/common';
import { RepositorioPerfil, Perfil } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class PerfilPrisma implements RepositorioPerfil {
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
      include: { perfil: true },
    });

    return perfis.map((usuarioPerfil) => ({
      id: usuarioPerfil.perfil.id,
      nome: usuarioPerfil.perfil.nome,
      descricao: usuarioPerfil.perfil.descricao,
      criado_em: usuarioPerfil.perfil.criado_em,
      ativo: usuarioPerfil.perfil.ativo,
      permissoes: [],
    }));
  }
}
