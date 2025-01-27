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
    usuarioId: string,
    perfilId: string
  ): Promise<void> {
    const usuario = this.usuarios.find((u) => u.id === usuarioId);

    if (usuario) {
      usuario.perfis!.push({ id: perfilId } as Perfil);
    }
  }
}
