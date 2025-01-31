import { Injectable } from '@nestjs/common';
import { RepositorioUsuario, Usuario } from '@s3curity/core';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class UsuarioPrisma implements RepositorioUsuario {
  constructor(private readonly prisma: PrismaProvider) {}

  async salvar(usuario: Partial<Usuario>): Promise<Usuario> {
    return await this.prisma.usuario.upsert({
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

  async relacionarUsuarioComPerfil(
    usuario: Partial<Usuario>,
    perfilId: string,
  ): Promise<void> {
    await this.prisma.usuarioPerfil.upsert({
      where: {
        usuario_id_perfil_id: { usuario_id: usuario.id, perfil_id: perfilId },
      },
      create: { usuario_id: usuario.id, perfil_id: perfilId },
      update: {},
    });
  }

  async removerRelacaoUsuarioPerfil(
    usuarioId: string,
    perfilId: string,
  ): Promise<void> {
    await this.prisma.usuarioPerfil.deleteMany({
      where: {
        usuario_id: usuarioId,
        perfil_id: perfilId,
      },
    });
  }

  async deletar(usuario: Partial<Usuario>): Promise<void> {
    await this.prisma.login.deleteMany({
      where: { usuario_email: usuario.email },
    });

    await this.prisma.usuarioPerfil.deleteMany({
      where: { usuario_id: usuario.id },
    });

    await this.prisma.usuario.delete({
      where: { id: usuario.id },
    });
  }
}
