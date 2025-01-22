import Perfil from "../model/Perfil";

export default interface RepositorioPerfil {
    salvar(perfil: Partial<Perfil>): Promise<void>;

    buscarPerfisPorUsuarioEmail(email: string): Promise<Perfil[]>;

    buscarTodosPerfis(): Promise<Partial<Perfil>[]>;
}
