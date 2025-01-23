import RepositorioPerfil from "../provider/RepositorioPerfil";

export default class relacionarPerfilComPermissao {
  constructor(private repositorioPerfil: RepositorioPerfil) {}

  async executar(perfilId: string, permissoesIds: string[]): Promise<void> {
    if (!perfilId) {
      throw new Error("O campo 'perfilId' é obrigatório.");
    }

    if (!permissoesIds || permissoesIds.length === 0) {
      throw new Error("O campo 'permissoesIds' é obrigatório e deve conter ao menos uma permissão.");
    }

    for (const permissaoId of permissoesIds) {
      await this.repositorioPerfil.relacionarPerfilComPermissao(perfilId, permissaoId);
    }
  }
}
