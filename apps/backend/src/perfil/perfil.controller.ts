/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { Perfil, SalvarPerfil, Usuario } from '@s3curity/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';
import { PermissaoPrisma } from 'src/permissao/permissao.prisma';

@Controller('perfil')
export class PerfilController {
  constructor(
    private readonly perfilRepo: PerfilPrisma,
    private readonly permissaoRepo: PermissaoPrisma,
  ) {}

  @Get('todos')
  async buscarTodosPerfis(@UsuarioLogado() usuario: Usuario) {
    const perfis = await this.perfilRepo.buscarTodosPerfis();
    return { status: 200, perfis };
  }

  @Post('salvar')
  async salvarPerfil(
    @UsuarioLogado() usuario: Usuario,
    @Body() perfil: Partial<Perfil>,
  ) {
    const casoDeUso = new SalvarPerfil(this.perfilRepo);

    const novoPerfil = await casoDeUso.executar(perfil);

    return { status: 201, message: 'Perfil salvo com sucesso.', novoPerfil };
  }

  @Get('nome/:nome')
  async buscarPerfilPorNome(
    @UsuarioLogado() usuario: Usuario,
    @Param('nome') nome: string,
  ) {
    const perfil = await this.perfilRepo.buscarPerfilPorNome(nome);
    return { status: 200, perfil };
  }

  @Get('usuario/:email')
  async buscarPerfilPorEmail(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
  ) {
    const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(email);
    return { status: 200, message: 'Perfil encontrado com sucesso.', perfis };
  }

  @Delete(':id')
  async deletarPerfil(@Param('id') id: string) {
    try {
      await this.perfilRepo.deletar(id);

      return { status: 200, message: 'Perfil deletado com sucesso.' };
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao deletar perfil.',
      };
    }
  }

  @Post('relacionar')
  async relacionarPerfilComPermissoes(
    @UsuarioLogado() usuario: Usuario,
    @Body() body: { perfilId: string; permissoesIds: string[] },
  ) {
    const { perfilId, permissoesIds } = body;

    if (!perfilId) {
      throw new Error('Perfil não encontrado.');
    }
    if (!permissoesIds || permissoesIds.length === 0) {
      throw new Error('Permissão não encontrada.');
    }

    const permissoesAtuais =
      await this.permissaoRepo.buscarPermissoesPorPerfilId(perfilId);

    const permissoesAtuaisIds = permissoesAtuais.map((p) => p.id);
    const permissoesParaAdicionar = permissoesIds.filter(
      (id) => !permissoesAtuaisIds.includes(id),
    );
    const permissoesParaRemover = permissoesAtuaisIds.filter(
      (id) => !permissoesIds.includes(id),
    );

    for (const permissaoId of permissoesParaAdicionar) {
      await this.perfilRepo.relacionarPerfilComPermissao(perfilId, permissaoId);
    }

    for (const permissaoId of permissoesParaRemover) {
      await this.perfilRepo.removerPerfilPermissao(perfilId, permissaoId);
    }

    return { status: 200, message: 'Permissões atualizadas com sucesso.' };
  }
}
