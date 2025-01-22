import { Permissao } from '@s3curity/core';

export default interface RepositorioPermissao {
  salvar(permissao: Partial<Permissao>): Promise<void>;

  buscarPermissoesAtivas(): Promise<Permissao[]>;

  buscarPermissoesPorPerfilId(perfilId: string): Promise<Permissao[]>;
}
