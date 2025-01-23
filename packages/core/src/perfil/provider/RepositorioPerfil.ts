import Perfil from "../model/Perfil";

export default interface RepositorioPerfil {
    salvar(perfil: Partial<Perfil>): Promise<void>;

    buscarPerfilPorUsuarioEmail(email: string): Promise<Partial<Perfil>[]>;

    buscarPerfilPorNome(nome: string): Promise<Partial<Perfil>[]>;

    relacionarPerfilComPermissao(perfilId: string, permissaoId: string): Promise<void>;

    buscarTodosPerfis(): Promise<Partial<Perfil>[]>;

    deletar(perfil: Partial<Perfil>): Promise<void>;
}
