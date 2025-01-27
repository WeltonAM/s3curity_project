import { AtualizarUsuario, Id } from "../../src";
import { ProvedorCriptografiaMock } from "../mock/ProvedorCriptografiaMock";
import RepositorioUsuarioMock from "../mock/RepositorioUsuarioMock";

describe("AtualizarUsuario", () => {
  let repositorioUsuarioMock: RepositorioUsuarioMock;
  let provedorCriptografiaMock: ProvedorCriptografiaMock;
  let atualizarUsuario: AtualizarUsuario;

  beforeEach(() => {
    repositorioUsuarioMock = new RepositorioUsuarioMock();
    provedorCriptografiaMock = new ProvedorCriptografiaMock();
    atualizarUsuario = new AtualizarUsuario(
      repositorioUsuarioMock,
      provedorCriptografiaMock
    );
  });

  it("deve atualizar os dados do usuário com sucesso", async () => {
    const usuarioExistente = {
      id: Id.novo.valor,
      nome_completo: "João Silva",
      email: "joao@teste.com",
      senha: "$2a$12$hashExistente",
      telefone: "123456789",
      url_imagem_perfil: "",
      horas_trabalho: "08:00-17:00",
      dias_trabalho: "Seg-Sex",
      dois_fatores_ativado: false,
    };

    await repositorioUsuarioMock.salvar(usuarioExistente);

    const dadosAtualizados = {
      nome_completo: "João Silva Atualizado",
      telefone: "987654321",
    };

    const usuarioAtualizado = await atualizarUsuario.executar(
      usuarioExistente.email,
      dadosAtualizados
    );

    expect(usuarioAtualizado.nome_completo).toBe(dadosAtualizados.nome_completo);
    expect(usuarioAtualizado.telefone).toBe(dadosAtualizados.telefone);
    expect(usuarioAtualizado.email).toBe(usuarioExistente.email);
  });

  it("deve lançar erro ao tentar atualizar um usuário inexistente", async () => {
    const emailInexistente = "naoexiste@teste.com";
    const dadosAtualizados = {
      nome_completo: "Novo Nome",
    };

    await expect(
      atualizarUsuario.executar(emailInexistente, dadosAtualizados)
    ).rejects.toThrow("Usuário não encontrado.");
  });

  it("deve criptografar a senha ao atualizar", async () => {
    const usuarioExistente = {
      id: Id.novo.valor,
      nome_completo: "Carlos Souza",
      email: "carlos@teste.com",
      senha: "$2a$12$hashExistente",
    };

    await repositorioUsuarioMock.salvar(usuarioExistente);

    const novaSenha = "!NovaSenha123";
    const dadosAtualizados = {
      senha: novaSenha,
    };

    const usuarioAtualizado = await atualizarUsuario.executar(
      usuarioExistente.email,
      dadosAtualizados
    );

    expect(usuarioAtualizado.senha).toBe(
      "$2a$12$2Wn08lE/gzq9VihLoMSVbe7fdAoCOMg6uVE3RQaJnEJc5Wa7eXuly"
    );
  });

  it("não deve alterar campos não fornecidos nos dados atualizados", async () => {
    const usuarioExistente = {
      id: Id.novo.valor,
      nome_completo: "João Silva",
      email: "joao@teste.com",
      senha: "$2a$12$hashExistente",
      telefone: "123456789",
      url_imagem_perfil: "",
    };

    await repositorioUsuarioMock.salvar(usuarioExistente);

    const dadosAtualizados = {
      telefone: "987654321",
    };

    const usuarioAtualizado = await atualizarUsuario.executar(
      usuarioExistente.email,
      dadosAtualizados
    );

    expect(usuarioAtualizado.nome_completo).toBe(usuarioExistente.nome_completo);
    expect(usuarioAtualizado.telefone).toBe(dadosAtualizados.telefone);
    expect(usuarioAtualizado.url_imagem_perfil).toBe(usuarioExistente.url_imagem_perfil);
  });
});
