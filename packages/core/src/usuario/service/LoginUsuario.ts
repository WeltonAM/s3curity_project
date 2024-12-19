import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import ProvedorAutenticacao from "../provider/ProvedorAutenticacao";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class LoginUsuario {
    constructor(
        private repositorioUsuario: RepositorioUsuario,
        private provedorCriptografia: ProvedorCriptografia,
        private provedorAutenticacao: ProvedorAutenticacao
    ) {}

    async comEmailSenha(email: string, senha: string): Promise<Partial<Usuario>> {
        const usuario = await this.repositorioUsuario.buscarPorEmail(email);
        if (!usuario) {
            throw new Error("Credenciais inválidas.");
        }

        const senhaValida = await this.provedorCriptografia.comparar(senha, usuario.senha || "");
        
        if (!senhaValida) {
            throw new Error("Credenciais inválidas.");
        }

        const { id, nome, email: emailUsuario } = usuario;
        
        return { id, nome, email: emailUsuario };
    }

    async comProvedor(provedor: string, token: string): Promise<Partial<Usuario>> {
        const email = await this.provedorAutenticacao.autenticarComProvedor(provedor, token);

        const usuario = await this.repositorioUsuario.buscarPorEmail(email);

        if (!usuario) {
            throw new Error("Usuário não encontrado para o provedor especificado.");
        }

        const { id, nome, email: emailUsuario } = usuario;
        
        return { id, nome, email: emailUsuario };
    }
}
