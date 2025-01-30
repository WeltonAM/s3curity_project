import { Perfil, RepositorioPerfil } from "../../src";

export class RepositorioPerfilMock implements RepositorioPerfil {
  private perfis: Perfil[] = [];

  async salvar(perfil: Partial<Perfil>): Promise<Partial<Perfil>> {
    this.perfis.push(perfil as any);
    return perfil;
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
