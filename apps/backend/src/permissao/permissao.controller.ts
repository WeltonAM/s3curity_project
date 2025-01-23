/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissaoPrisma } from './permissao.prisma';
import { Permissao, SalvarPermissao, Usuario } from '@s3curity/core';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

@Controller('permissao')
export class PermissaoController {
  constructor(private readonly permissaoRepo: PermissaoPrisma) {}

  @Get('todas')
  async buscarTodasPermissoes(@UsuarioLogado() usuario: Usuario) {
    const permissoes = await this.permissaoRepo.buscarTodasPermissoes();
    return { status: 200, permissoes };
  }

  @Get(':id')
  async buscarPermissaoPorId(@Param('id') id: string) {
    const permissao = await this.permissaoRepo.buscarPermissaoPorId(id);
    return { status: 200, permissao };
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

  @Get('slug/:slug')
  async buscarPermissaoPorSlug(@Param('slug') slug: string) {
    const permissao = await this.permissaoRepo.buscarPermissaoPorSlug(slug);
    return { status: 200, permissao };
  }

  @Post('salvar')
  async salvarPermissao(
    @Body() permissao: Partial<Permissao>,
  ): Promise<{ status: number; message: string; permissao?: Permissao }> {
    try {
      const casoDeUso = new SalvarPermissao(this.permissaoRepo);

      await casoDeUso.executar(permissao);

      return { status: 201, message: 'Permissão salva com sucesso.' };
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao salvar permissão.',
      };
    }
  }

  @Delete(':id')
  async deletarPermissao(@Param('id') id: string) {
    try {
      const permissao = await this.permissaoRepo.buscarPermissaoPorId(id);
      if (!permissao) {
        return { status: 404, message: 'Permissão não encontrada.' };
      }

      await this.permissaoRepo.deletar(permissao);

      return { status: 200, message: 'Permissão deletada com sucesso.' };
    } catch (error) {
      return {
        status: 500,
        message: 'Erro ao deletar permissão.',
      };
    }
  }
}
