import { Id } from "../../shared";
import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class RegistrarUsuario {
    constructor(
        private repositorioUsuario: RepositorioUsuario,
        private provedorCriptografia: ProvedorCriptografia
    ) {}

    async executar(usuario: Usuario): Promise<void> {
        const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(usuario.email);
        if (usuarioExistente) {
            throw new Error("E-mail já está em uso.");
        }

        const senhaCriptografada = await this.provedorCriptografia.criptografar(usuario.senha!);

        const novoUsuario: Partial<Usuario> = {
            id: Id.novo.valor,
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            senha: senhaCriptografada,
            ativo: true,
            criadoEm: new Date(),
            doisFatoresAtivado: false,
        };

        await this.repositorioUsuario.salvar(novoUsuario);
    }
}
