/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import { UsuarioPrisma } from './usuario.prisma';
import { AtualizarUsuario, Usuario } from '@s3curity/core';
import { PerfilPrisma } from 'src/perfil/perfil.prisma';
import { UsuarioLogado } from 'src/shared/usuario.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly repo: UsuarioPrisma,
    private readonly cripto: BcryptProvider,
    private readonly perfilRepo: PerfilPrisma,
  ) {}

  @Get('todos')
  async todos(@UsuarioLogado() usuario: Usuario): Promise<{
    status: number;
    message: string;
    usuarios: Partial<Usuario>[];
  }> {
    const usuarios = await this.repo.buscarTodos();

    const usuariosComPerfis = await Promise.all(
      usuarios.map(async (usuario) => {
        const perfis = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
          usuario.email!,
        );

        return {
          ...usuario,
          perfis: perfis.map((perfil) => ({
            id: perfil.id,
            nome: perfil.nome,
            ativo: perfil.ativo,
          })),
        };
      }),
    );

    return {
      status: 200,
      message: 'Usuários recuperados com sucesso!',
      usuarios: usuariosComPerfis,
    };
  }

  @Get('email/:email')
  async buscarPorEmail(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
  ): Promise<{ status: number; message: string; usuario?: Usuario }> {
    const usuarioEncontrado = await this.repo.buscarPorEmail(email);

    if (!usuarioEncontrado) {
      return {
        status: 404,
        message: 'Usuário não encontrado!',
        usuario: undefined,
      };
    }

    return {
      status: 200,
      usuario: {
        id: usuarioEncontrado.id,
        nome_completo: usuarioEncontrado.nome_completo,
        email: usuarioEncontrado.email,
        telefone: usuarioEncontrado.telefone,
        ativo: usuarioEncontrado.ativo,
        url_imagem_perfil: usuarioEncontrado.url_imagem_perfil,
        dias_trabalho: usuarioEncontrado.dias_trabalho,
        horas_trabalho: usuarioEncontrado.horas_trabalho,
      },
      message: 'Usuário recuperado com sucesso!',
    };
  }

  @Post('relacionar-perfis')
  async relacionarPerfis(
    @UsuarioLogado() usuarioLogado: Usuario,
    @Body() body: { usuario: Partial<Usuario>; perfisIds: string[] },
  ): Promise<{ status: number; message: string }> {
    const { usuario, perfisIds } = body;

    const perfisAtuais = await this.perfilRepo.buscarPerfilPorUsuarioEmail(
      usuario.email!,
    );
    const perfisAtuaisIds = perfisAtuais.map((perfil) => perfil.id);

    const perfisParaAdicionar = perfisIds.filter(
      (id) => !perfisAtuaisIds.includes(id),
    );

    const perfisParaRemover = perfisAtuaisIds.filter(
      (id) => !perfisIds.includes(id),
    );

    for (const perfilId of perfisParaAdicionar) {
      await this.repo.relacionarUsuarioComPerfil(usuario, perfilId);
    }

    for (const perfilId of perfisParaRemover) {
      await this.repo.removerRelacaoUsuarioPerfil(usuario.id, perfilId);
    }

    return { status: 200, message: 'Perfis atualizados com sucesso!' };
  }

  @Put('atualizar/:email')
  async atualizar(
    @UsuarioLogado() usuario: Usuario,
    @Param('email') email: string,
    @Body() dadosAtualizados: Partial<Usuario>,
  ): Promise<{
    status: number;
    message: string;
    usuarioAtualizado?: Partial<Usuario>;
  }> {
    const casoDeUso = new AtualizarUsuario(this.repo, this.cripto);
    const usuarioAtualizado = await casoDeUso.executar(email, dadosAtualizados);

    if (dadosAtualizados.senha) {
      dadosAtualizados.senha = await this.cripto.criptografar(
        dadosAtualizados.senha,
      );
    } else {
      delete dadosAtualizados.senha;
    }

    return {
      status: 200,
      message: 'Usuário atualizado com sucesso!',
      usuarioAtualizado: usuarioAtualizado,
    };
  }

  @Delete('deletar/:email')
  async deletar(
    @UsuarioLogado() usuarioLogado: Usuario,
    @Param('email') email: string,
  ): Promise<{ status: number; message: string }> {
    const usuario = await this.repo.buscarPorEmail(email);
    await this.repo.deletar(usuario);

    return { status: 200, message: 'Usuário deletado com sucesso!' };
  }
}
