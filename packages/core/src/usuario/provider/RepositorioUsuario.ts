import Usuario from "../model/Usuario";

export default interface RepositorioUsuario {
    salvar(usuario: Partial<Usuario>): Promise<void>;
    
    buscarPorEmail(email: string): Promise<Usuario | null>;

    buscarTodos(): Promise<Partial<Usuario>[]>;

    relacionarUsuarioComPerfil(usuarioId: string, perfilId: string): Promise<void>;

    deletar(usuarioId: string): Promise<void>;
}
