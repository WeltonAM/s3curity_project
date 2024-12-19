import { Id } from "../../shared";
import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class RegistrarUsuario {
    constructor(
        private repositorioUsuario: RepositorioUsuario,
        private provedorCriptografia: ProvedorCriptografia
    ) {}

    async executar(nome: string, email: string, senha: string): Promise<void> {
        const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new Error("E-mail já está em uso.");
        }

        const senhaCriptografada = await this.provedorCriptografia.criptografar(senha);

        const novoUsuario: Partial<Usuario> = {
            id: Id.novo.valor, 
            nome,
            email,
            senha: senhaCriptografada
        };

        await this.repositorioUsuario.salvar(novoUsuario);
    }
}
