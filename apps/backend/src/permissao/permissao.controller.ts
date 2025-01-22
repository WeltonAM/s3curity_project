/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param } from '@nestjs/common';
import { PermissaoPrisma } from './permissao.prisma';
import { Usuario } from '@s3curity/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

@Controller('permissao')
export class PermissaoController {
  constructor(private readonly permissaoRepo: PermissaoPrisma) {}

  @Get('todas')
  async buscarTodasPermissoes(@UsuarioLogado() usuario: Usuario) {
    const permissoes = await this.permissaoRepo.buscarTodasPermissoes();
    return { status: 200, permissoes };
  }

  @Get(':perfilId')
  async buscarPermissoesPorPerfilId(
    @UsuarioLogado() usuario: Usuario,
    @Param('perfilId') perfilId: string,
  ) {
    const permissoes =
      await this.permissaoRepo.buscarPermissoesPorPerfilId(perfilId);
    return { status: 200, permissoes };
  }
}
