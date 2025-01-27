import { Perfil } from "../../dist";
import { Usuario, RepositorioUsuario, Id } from "../../src";

export default class RepositorioUsuarioMock implements RepositorioUsuario {
  private usuarios: Usuario[] = [];

  async salvar(usuario: Partial<Usuario>): Promise<void> {
    const usuarioComId = {
      ...usuario,
      id: usuario.id ?? Id.novo.valor,
      criado_em: usuario.criado_em ?? new Date(),
      ativo: usuario.ativo ?? true,
    };

    const index = this.usuarios.findIndex((u) => u.id === usuarioComId.id);

    if (index >= 0) {
      this.usuarios[index] = usuarioComId as Usuario;
    } else {
      this.usuarios.push(usuarioComId as Usuario);
    }
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = this.usuarios.find((u) => u.email === email);
    return usuario ?? null;
  }

  async buscarTodos(): Promise<Partial<Usuario>[]> {
    return this.usuarios;
  }

  async relacionarUsuarioComPerfil(
    usuario: Partial<Usuario>,
    perfilId: string
  ): Promise<void> {
    const usuarioEncontrado = await this.buscarPorEmail(usuario.email!);

    if (!usuarioEncontrado) {
      throw new Error(`Usuário com e-mail ${usuario.email} não encontrado.`);
    }

    if (usuarioEncontrado) {
      const perfilExistente = usuarioEncontrado.perfis?.find(
        (perfil) => perfil.id === perfilId
      );

      if (!perfilExistente) {
        usuarioEncontrado.perfis = [
          ...(usuarioEncontrado.perfis || []),
          { id: perfilId } as Perfil,
        ];
      }
    }
  }

  async deletar(usuario: Partial<Usuario>): Promise<void> {
    this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
  }
}
