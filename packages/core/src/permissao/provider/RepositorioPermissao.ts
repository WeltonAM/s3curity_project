import { Permissao } from '@s3curity/core';

export default interface RepositorioPermissao {
  salvar(permissao: Partial<Permissao>): Promise<void>;

  buscarTodasPermissoes(): Promise<Partial<Permissao>[]>;

  buscarPermissaoPorId(id: string): Promise<Partial<Permissao> | null>;

  buscarPermissaoPorSlug(slug: string): Promise<Partial<Permissao> | null>;

  buscarPermissoesPorPerfilId(perfilId: string): Promise<Partial<Permissao>[]>;

  deletar(permissao: Partial<Permissao>): Promise<void>;
}
