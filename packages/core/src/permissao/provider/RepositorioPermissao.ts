import { Permissao } from '@s3curity/core';

export default interface RepositorioPermissao {
  salvar(permissao: Partial<Permissao>): Promise<void>;

  buscarTodasPermissoes(): Promise<Partial<Permissao>[]>;

  buscarPermissoesPorPerfilId(perfilId: string): Promise<Partial<Permissao>[]>;
}
