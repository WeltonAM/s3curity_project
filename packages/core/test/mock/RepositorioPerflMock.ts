import { Perfil, RepositorioPerfil } from "../../src";

export class RepositorioPerfilMock implements RepositorioPerfil {
  private perfis: Perfil[] = [];

  async salvar(perfil: Partial<Perfil>): Promise<void> {
    const index = this.perfis.findIndex((p) => p.id === perfil.id);
    if (index !== -1) {
      this.perfis[index] = { ...this.perfis[index], ...perfil } as Perfil;
    } else {
      this.perfis.push(perfil as Perfil);
    }
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
