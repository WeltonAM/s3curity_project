/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { Perfil, SalvarPerfil, Usuario } from '@s3curity/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilRepo: PerfilPrisma) {}

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

    await casoDeUso.executar(perfil);

    return { status: 201, message: 'Perfil salvo com sucesso.', perfil };
  }

  @Get('buscar/perfil/:nome')
  async buscarPerfilPorNome(
    @UsuarioLogado() usuario: Usuario,
    @Param('nome') nome: string,
  ) {
    const perfis = await this.perfilRepo.buscarPerfilPorNome(nome);
    return { status: 200, message: 'Perfil encontrado com sucesso.', perfis };
  }

  @Get('buscar/usuario/:email')
  async buscarPerfilPorEmail(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
  ) {
    const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(email);
    return { status: 200, message: 'Perfil encontrado com sucesso.', perfis };
  }

  @Post('relacionar')
  async relacionarPerfilComPermissoes(
    @UsuarioLogado() usuario: Usuario,
    @Body() body: { perfilId: string; permissoesIds: string[] },
  ) {
    const { perfilId, permissoesIds } = body;

    if (!perfilId) {
      throw new Error("O campo 'perfilId' é obrigatório.");
    }
    if (!permissoesIds || permissoesIds.length === 0) {
      throw new Error(
        "O campo 'permissoesIds' é obrigatório e deve conter ao menos uma permissão.",
      );
    }

    for (const permissaoId of permissoesIds) {
      await this.perfilRepo.relacionarPerfilComPermissao(perfilId, permissaoId);
    }

    return { status: 200, message: 'Permissões relacionadas com sucesso.' };
  }
}
