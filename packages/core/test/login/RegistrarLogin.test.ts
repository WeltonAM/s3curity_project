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

    it("deve registrar um login com sucesso", async () => {
        const usuarioEmail = "joao@teste.com";
        const sucesso = true;
        const ip = "192.168.0.1";
        const token = "token123";
        const provedor = "google";

        await repositorioUsuarioMock.salvar({
            id: "1",
            nome_completo: "João Silva",
            email: usuarioEmail,
            senha: "senha123",
            ativo: true,
            criado_em: new Date(),
            dois_fatores_ativado: false,
            perfis: [],
        });

        await registrarLogin.executar(usuarioEmail, sucesso, ip, token, provedor);

        const loginRegistrado = await repositorioLoginMock.buscarUsuarioPorEmail(usuarioEmail);
        expect(loginRegistrado).not.toBeNull();
        expect(loginRegistrado?.usuario_email).toBe(usuarioEmail);
        expect(loginRegistrado?.sucesso).toBe(sucesso);
        expect(loginRegistrado?.ip).toBe(ip);
        expect(loginRegistrado?.token).toBe(token);
        expect(loginRegistrado?.provedor).toBe(provedor);
        expect(loginRegistrado?.data_hora).toBeDefined();
    });

    it("não deve registrar login para usuário inexistente", async () => {
        const usuarioEmail = "usuario_inexistente@teste.com";
        const sucesso = true;
        const ip = "192.168.0.1";

        await expect(
            registrarLogin.executar(usuarioEmail, sucesso, ip)
        ).rejects.toThrow("Usuário não encontrado.");
    });

    it("deve registrar login com campos opcionais ausentes", async () => {
        const usuarioEmail = "maria@teste.com";
        const sucesso = false;
        const ip = "127.0.0.1";

        await repositorioUsuarioMock.salvar({
            id: "2",
            nome_completo: "Maria Oliveira",
            email: usuarioEmail,
            senha: "senha456",
            ativo: true,
            criado_em: new Date(),
            dois_fatores_ativado: false,
            perfis: [],
        });

        await registrarLogin.executar(usuarioEmail, sucesso, ip);

        const loginRegistrado = await repositorioLoginMock.buscarUsuarioPorEmail(usuarioEmail);
        expect(loginRegistrado).not.toBeNull();
        expect(loginRegistrado?.usuario_email).toBe(usuarioEmail);
        expect(loginRegistrado?.sucesso).toBe(sucesso);
        expect(loginRegistrado?.ip).toBe(ip);
        expect(loginRegistrado?.token).toBeUndefined();
        expect(loginRegistrado?.provedor).toBeUndefined();
        expect(loginRegistrado?.data_hora).toBeDefined();
    });
});
