import { RegistrarUsuario } from "../../src";
import { ProvedorCriptografiaMock } from "../mock/ProvedorCriptografiaMock";
import RepositorioUsuarioMock from "../mock/RepositorioUsuarioMock";

describe("RegistrarUsuario", () => {
    let repositorioUsuarioMock: RepositorioUsuarioMock;
    let provedorCriptografiaMock: ProvedorCriptografiaMock;
    let registrarUsuario: RegistrarUsuario;

    beforeEach(() => {
        repositorioUsuarioMock = new RepositorioUsuarioMock();
        provedorCriptografiaMock = new ProvedorCriptografiaMock();
        registrarUsuario = new RegistrarUsuario(repositorioUsuarioMock, provedorCriptografiaMock);
    });

    it("deve registrar um novo usuário com sucesso", async () => {
        await registrarUsuarioComSucesso();
    });

    it("não deve registrar um usuário com e-mail já em uso", async () => {
        await registrarUsuarioComEmailJaEmUso();
    });

    it("deve criptografar a senha antes de salvar", async () => {
        await verificarSenhaCriptografada();
    });

    const registrarUsuarioComSucesso = async () => {
        const nomeCompleto = "João Silva";
        const email = "joao@teste.com";
        const senha = "!Senha123";

        await registrarUsuario.executar(nomeCompleto, email, senha);

        const usuarioRegistrado = await repositorioUsuarioMock.buscarPorEmail(email);
        expect(usuarioRegistrado).not.toBeNull();
        expect(usuarioRegistrado?.nomeCompleto).toBe(nomeCompleto);
        expect(usuarioRegistrado?.email).toBe(email);
        expect(usuarioRegistrado?.senha).toBe("$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly");
    };

    const registrarUsuarioComEmailJaEmUso = async () => {
        const nomeCompleto = "Maria Oliveira";
        const email = "joao@teste.com";
        const senha = "!Senha123";

        await repositorioUsuarioMock.salvar({
            id: "1",
            nomeCompleto: "João Silva",
            email: "joao@teste.com",
            senha: "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly",
            ativo: true,
            criadoEm: new Date(),
            doisFatoresAtivado: false,
            perfis: [],
            dataExpiracaoToken: undefined,
        });

        await expect(registrarUsuario.executar(nomeCompleto, email, senha)).rejects.toThrowError("E-mail já está em uso.");
    };

    const verificarSenhaCriptografada = async () => {
        const nomeCompleto = "Carlos Souza";
        const email = "carlos@teste.com";
        const senha = "!Senha123";

        await registrarUsuario.executar(nomeCompleto, email, senha);

        const usuarioRegistrado = await repositorioUsuarioMock.buscarPorEmail(email);
        expect(usuarioRegistrado).not.toBeNull();
        expect(usuarioRegistrado?.senha).toBe("$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly");
    };
});
