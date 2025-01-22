/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';
import { PerfilPrisma } from './perfil.prisma';
import { Usuario } from '@s3curity/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

@Controller('perfil')
export class PerfilController {
  constructor(private readonly perfilRepo: PerfilPrisma) {}

  @Get('todos')
  async buscarTodosPerfis(@UsuarioLogado() usuario: Usuario) {
    const perfis = await this.perfilRepo.buscarTodosPerfis();
    return { status: 200, perfis };
  }
}
