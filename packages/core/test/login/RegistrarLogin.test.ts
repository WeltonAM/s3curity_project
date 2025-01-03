import { RegistrarLogin } from "../../src";
import RepositorioLoginMock from "../mock/RepositorioLoginMock";
import RepositorioUsuarioMock from "../mock/RepositorioUsuarioMock";

describe("RegistrarLogin", () => {
    let repositorioLoginMock: RepositorioLoginMock;
    let repositorioUsuarioMock: RepositorioUsuarioMock;
    let registrarLogin: RegistrarLogin;

    beforeEach(() => {
        repositorioLoginMock = new RepositorioLoginMock();
        repositorioUsuarioMock = new RepositorioUsuarioMock();
        registrarLogin = new RegistrarLogin(repositorioLoginMock, repositorioUsuarioMock);
    });

    it("deve registrar um novo login com sucesso", async () => {
        await registrarLoginComSucesso();
    });

    it("não deve registrar um login para um usuário inexistente", async () => {
        await registrarLoginComUsuarioInexistente();
    });

    it("deve registrar o login com informações adicionais como IP e provedor", async () => {
        await registrarLoginComInformacoesExtras();
    });

    const registrarLoginComSucesso = async () => {
        const usuarioId = "1";
        const sucesso = true;
        const ip = "192.168.1.1";

        await repositorioUsuarioMock.salvar({
            id: usuarioId,
            nome_completo: "João Silva",
            email: "joao@teste.com",
            senha: "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly",
            ativo: true,
            criado_em: new Date(),
            dois_fatores_ativado: false,
            perfis: [],
            data_expiracao_token: undefined,
        });

        await registrarLogin.executar(usuarioId, sucesso, ip);

        const loginsRegistrados = await repositorioLoginMock.buscarPorUsuarioId(usuarioId);
        expect(loginsRegistrados.length).toBe(1);
        expect(loginsRegistrados[0]!.usuario_id).toBe(usuarioId);
        expect(loginsRegistrados[0]!.sucesso).toBe(true);
        expect(loginsRegistrados[0]!.ip).toBe(ip);
    };

    const registrarLoginComUsuarioInexistente = async () => {
        const usuarioId = "999";
        const sucesso = true;
        const ip = "192.168.1.1";

        await expect(registrarLogin.executar(usuarioId, sucesso, ip)).rejects.toThrow("Usuário não encontrado.");
    };

    const registrarLoginComInformacoesExtras = async () => {
        const usuarioId = "1";
        const sucesso = true;
        const ip = "192.168.1.1";
        const provedor = "google";
        const token = "valid-token-google";

        await repositorioUsuarioMock.salvar({
            id: usuarioId,
            nome_completo: "João Silva",
            email: "joao@teste.com",
            senha: "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly",
            ativo: true,
            criado_em: new Date(),
            dois_fatores_ativado: false,
            perfis: [],
            data_expiracao_token: undefined,
        });

        await registrarLogin.executar(usuarioId, sucesso, ip, token, provedor);

        const loginsRegistrados = await repositorioLoginMock.buscarPorUsuarioId(usuarioId);
        expect(loginsRegistrados.length).toBe(1);
        expect(loginsRegistrados[0]!.provedor).toBe(provedor);
        expect(loginsRegistrados[0]!.token).toBe(token);
    };
});
