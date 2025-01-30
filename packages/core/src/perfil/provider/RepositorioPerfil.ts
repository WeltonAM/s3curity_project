import Perfil from "../model/Perfil";

export default interface RepositorioPerfil {
    salvar(perfil: Partial<Perfil>): Promise<Partial<Perfil>>;

    buscarPerfilPorUsuarioEmail(email: string): Promise<Partial<Perfil>[]>;

    buscarPerfilPorNome(nome: string): Promise<Partial<Perfil> | null>;

    relacionarPerfilComPermissao(perfilId: string, permissaoId: string): Promise<void>;

    buscarTodosPerfis(): Promise<Partial<Perfil>[]>;

    deletar(id: string): Promise<void>;
}
