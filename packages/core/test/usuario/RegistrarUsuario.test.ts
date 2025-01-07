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
        const usuario = usuarioPadrao("João Silva", "joao@teste.com", "!Senha123");
        await registrarUsuario.executar(usuario);

        const usuarioRegistrado = await repositorioUsuarioMock.buscarPorEmail(usuario.email);
        expect(usuarioRegistrado).not.toBeNull();
        expect(usuarioRegistrado?.nome_completo).toBe(usuario.nome_completo);
        expect(usuarioRegistrado?.email).toBe(usuario.email);
        expect(usuarioRegistrado?.senha).toBe("$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly");
    });

    it("não deve registrar um usuário com e-mail já em uso", async () => {
        const usuarioExistente = usuarioPadrao("João Silva", "joao@teste.com", "!Senha123");
        await repositorioUsuarioMock.salvar({
            id: "1",
            ...usuarioExistente,
            ativo: true,
            criado_em: new Date(),
            dois_fatores_ativado: false,
            perfis: [],
            data_expiracao_token: undefined,
        });

        const novoUsuario = usuarioPadrao("Maria Oliveira", "joao@teste.com", "!Senha123");
        await expect(registrarUsuario.executar(novoUsuario)).rejects.toThrow("E-mail já está em uso.");
    });

    it("deve criptografar a senha antes de salvar", async () => {
        const usuario = usuarioPadrao("Carlos Souza", "carlos@teste.com", "!Senha123");
        await registrarUsuario.executar(usuario);

        const usuarioRegistrado = await repositorioUsuarioMock.buscarPorEmail(usuario.email);
        expect(usuarioRegistrado).not.toBeNull();
        expect(usuarioRegistrado?.senha).toBe("$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly");
    });

    const usuarioPadrao = (nome_completo: string, email: string, senha: string) => ({
        nome_completo,
        email,
        senha,
    });
});
