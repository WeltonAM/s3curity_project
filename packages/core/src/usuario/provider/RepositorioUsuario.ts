import Usuario from "../model/Usuario";

export default interface RepositorioUsuario {
    salvar(usuario: Partial<Usuario>): Promise<Partial<Usuario>>;
    
    buscarPorEmail(email: string): Promise<Usuario | null>;
}
