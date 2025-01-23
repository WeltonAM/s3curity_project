import { Id } from "../../shared";
import Perfil from "../model/Perfil";
import RepositorioPerfil from "../provider/RepositorioPerfil";

export default class SalvarPerfil {
  constructor(private repositorioPerfil: RepositorioPerfil) {}

  async executar(perfil: Partial<Perfil>): Promise<void> {
    if (!perfil.nome || perfil.nome.trim() === "") {
      throw new Error("O campo 'nome' é obrigatório.");
    }

    const perfilExistente = await this.repositorioPerfil.buscarPerfilPorNome(
      perfil.nome
    );
    if (perfilExistente && perfilExistente.id !== perfil.id) {
      throw new Error("Já existe um perfil com este nome.");
    }

    const novoPerfil: Partial<Perfil> = {
      id: perfil.id || Id.novo.valor,
      nome: perfil.nome,
      descricao: perfil.descricao || null,
      ativo: perfil.ativo !== undefined ? perfil.ativo : true,
      criado_em: perfil.criado_em || new Date(),
    };

    await this.repositorioPerfil.salvar(novoPerfil);
  }
}
