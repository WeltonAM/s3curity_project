import { Permissao } from "@s3curity/core";
import { RepositorioPermissao } from "../../src";

export class RepositorioPermissaoMock implements RepositorioPermissao {
  private permissoes: Permissao[] = [];
  private perfilPermissoes: { perfilId: string; permissaoId: string }[] = [];

  async buscarTodasPermissoes(): Promise<Partial<Permissao>[]> {
    return this.permissoes;
  }

  async buscarPermissoesPorPerfilId(
    perfilId: string
  ): Promise<Partial<Permissao>[]> {
    const permissaoIds = this.perfilPermissoes
      .filter((perfilPermissao) => perfilPermissao.perfilId === perfilId)
      .map((perfilPermissao) => perfilPermissao.permissaoId);

    return this.permissoes.filter((permissao) =>
      permissaoIds.includes(permissao.id)
    );
  }

  async salvar(permissao: Partial<Permissao>): Promise<void> {
    this.permissoes.push(permissao as Permissao);
  }
}
