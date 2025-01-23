import { Id } from "../../shared";
import Permissao from "../model/Permissao";
import RepositorioPermissao from "../provider/RepositorioPermissao";

export default class SalvarPermissao {
  constructor(private repositorioPermissao: RepositorioPermissao) {}

  async executar(permissao: Partial<Permissao>): Promise<void> {
    if (!permissao.nome || permissao.nome.trim() === "") {
      throw new Error("O campo 'nome' é obrigatório.");
    }

    const slug = permissao.slug || this.gerarSlug(permissao.nome);

    const novaPermissao: Partial<Permissao> = {
      id: permissao.id || Id.novo.valor,
      slug: slug,
      nome: permissao.nome,
      descricao: permissao.descricao || null,
      ativo: permissao.ativo !== undefined ? permissao.ativo : true,
      criado_em: permissao.criado_em || new Date(),
    };

    await this.repositorioPermissao.salvar(novaPermissao);
  }

  private gerarSlug(nome: string): string {
    return nome
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/^-+|-+$/g, "");
  }
}
