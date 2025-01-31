import { Id, Perfil, RepositorioPerfil } from "../../src";

export class RepositorioPerfilMock implements RepositorioPerfil {
  private perfis: Perfil[] = [];

  async salvar(perfil: Partial<Perfil>): Promise<Perfil> {
    const perfilComId = {
      ...perfil,
      id: perfil.id ?? Id.novo.valor,
      criado_em: perfil.criado_em ?? new Date(),
      ativo: perfil.ativo ?? true,
    };

    const index = this.perfis.findIndex((p) => p.id === perfilComId.id);

    if (index >= 0) {
      this.perfis[index] = perfilComId as Perfil;
    } else {
      this.perfis.push(perfilComId as Perfil);
    }

    return perfilComId as Perfil;
  }

  async buscarPerfilPorNome(nome: string): Promise<Partial<Perfil> | null> {
    return this.perfis.find((perfil) => perfil.nome === nome) || null;
  }

  async buscarPerfilPorUsuarioEmail(email: string): Promise<Perfil[]> {
    return [];
  }

  async buscarPerfilPorId(id: string): Promise<Partial<Perfil> | null> {
    return this.perfis.find((perfil) => perfil.id === id) || null;
  }

  async relacionarPerfilComPermissao(
    perfilId: string,
    permissaoId: string
  ): Promise<void> {
    return;
  }

  async buscarTodosPerfis(): Promise<Partial<Perfil>[]> {
    return this.perfis;
  }

  async deletar(id: string): Promise<void> {
    this.perfis = this.perfis.filter((p) => p.id !== id);
  }
}
