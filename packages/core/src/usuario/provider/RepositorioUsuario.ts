import Usuario from "../model/Usuario";

export default interface RepositorioUsuario {
    salvar(usuario: Partial<Usuario>): Promise<Usuario>;
    
    buscarPorEmail(email: string): Promise<Usuario | null>;

    buscarTodos(): Promise<Partial<Usuario>[]>;

    relacionarUsuarioComPerfil(usuario: Partial<Usuario>, perfilId: string): Promise<void>;

    deletar(usuario: Partial<Usuario>): Promise<void>;
}
