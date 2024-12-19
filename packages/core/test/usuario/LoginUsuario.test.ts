import { LoginUsuario } from "../../src";
import { ProvedorCriptografiaMock } from "../mock/ProvedorCriptografiaMock";
import RepositorioUsuarioMock from "../mock/RepositorioUsuarioMock";
import { ProvedorAutenticacaoMock } from "../mock/ProvedorAutenticacaoMock";

describe("LoginUsuario", () => {
    let repositorioUsuarioMock: RepositorioUsuarioMock;
    let provedorCriptografiaMock: ProvedorCriptografiaMock;
    let provedorAutenticacaoMock: ProvedorAutenticacaoMock;
    let loginUsuario: LoginUsuario;

    beforeEach(() => {
        repositorioUsuarioMock = new RepositorioUsuarioMock();
        provedorCriptografiaMock = new ProvedorCriptografiaMock();
        provedorAutenticacaoMock = new ProvedorAutenticacaoMock();
        loginUsuario = new LoginUsuario(repositorioUsuarioMock, provedorCriptografiaMock, provedorAutenticacaoMock);
    });

    it("deve autenticar o usuário com email e senha válidos", async () => {
        await autenticarComEmailESenha();
    });

    it("não deve autenticar o usuário com email inválido", async () => {
        await autenticarComEmailInvalido();
    });

    it("não deve autenticar o usuário com senha inválida", async () => {
        await autenticarComSenhaInvalida();
    });

    it("deve autenticar o usuário com provedor válido", async () => {
        await autenticarComProvedor();
    });

    it("não deve autenticar o usuário com provedor inválido", async () => {
        await autenticarComProvedorInvalido();
    });

    it("não deve autenticar o usuário com provedor válido mas sem usuário", async () => {
        await autenticarComProvedorSemUsuario();
    });

    const autenticarComEmailESenha = async () => {
        const email = "joao@teste.com";
        const senha = "!Senha123";

        await repositorioUsuarioMock.salvar({
            id: "1",
            nome: "João Silva",
            email,
            senha: "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly",
            ativo: true,
            dataCriacao: new Date(),
            autenticacaoDoisFatoresAtiva: false,
            perfis: [],
            dataExpiracaoToken: undefined,
        });

        const usuario = await loginUsuario.comEmailSenha(email, senha);

        expect(usuario).toEqual({
            id: "1",
            nome: "João Silva",
            email: "joao@teste.com"
        });
    };

    const autenticarComEmailInvalido = async () => {
        const email = "emailinvalido@teste.com";
        const senha = "!Senha123";

        await expect(loginUsuario.comEmailSenha(email, senha)).rejects.toThrow("Credenciais inválidas.");
    };

    const autenticarComSenhaInvalida = async () => {
        const email = "joao@teste.com";
        const senha = "senhaerrada";

        await expect(loginUsuario.comEmailSenha(email, senha)).rejects.toThrow("Credenciais inválidas.");
    };

    const autenticarComProvedor = async () => {
        const email = "google@teste.com";
        const token = "valid-token-google";

        await repositorioUsuarioMock.salvar({
            id: "1",
            nome: "João Silva",
            email: email,
            ativo: true,
            dataCriacao: new Date(),
            autenticacaoDoisFatoresAtiva: false,
            perfis: [],
            dataExpiracaoToken: undefined,
        });

        const usuario = await loginUsuario.comProvedor("google", token);
       
        console.log(usuario)

        expect(usuario).toEqual({
            id: "1",
            nome: "João Silva",
            email: "google@teste.com"
        });
    };

    const autenticarComProvedorInvalido = async () => {
        const email = "google@teste.com";
        const token = "invalid-token";

        await expect(loginUsuario.comProvedor("google", token)).rejects.toThrow("Autenticação falhou: Provedor ou token inválido.");
    };

    const autenticarComProvedorSemUsuario = async () => {
        const token = "valid-token-google";

        await expect(loginUsuario.comProvedor("google", token)).rejects.toThrow("Usuário não encontrado para o provedor especificado.");
    };
});
