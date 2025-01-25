import { SalvarPerfil } from "../../src";
import { RepositorioPerfilMock } from "../mock/RepositorioPerflMock";

describe("SalvarPerfil", () => {
  let repositorioPerfilMock: RepositorioPerfilMock;
  let salvarPerfil: SalvarPerfil;

  beforeEach(() => {
    repositorioPerfilMock = new RepositorioPerfilMock();
    salvarPerfil = new SalvarPerfil(repositorioPerfilMock);
  });

  it("deve salvar o perfil corretamente com os campos obrigatórios", async () => {
    const perfil = {
      nome: "Administrador",
      descricao: "Perfil de administrador do sistema",
    };

    await salvarPerfil.executar(perfil);

    const perfisSalvos = await repositorioPerfilMock.buscarTodosPerfis();

    expect(perfisSalvos).toHaveLength(1);
    const perfilSalvo = perfisSalvos[0]!;
    expect(perfilSalvo!.nome).toBe("Administrador");
    expect(perfilSalvo!.descricao).toBe("Perfil de administrador do sistema");
    expect(perfilSalvo!.ativo).toBe(true);
    expect(perfilSalvo!.criado_em).toBeDefined();
  });

  it("deve lançar erro ao tentar salvar perfil sem nome", async () => {
    const perfil = {
      nome: "",
      descricao: "Perfil sem nome",
    };

    await expect(salvarPerfil.executar(perfil)).rejects.toThrow(
      "O campo 'nome' é obrigatório."
    );
  });

  it("deve gerar um id novo caso não seja fornecido", async () => {
    const perfil = {
      nome: "Usuário Comum",
      descricao: "Perfil de usuário padrão",
    };

    await salvarPerfil.executar(perfil);

    const perfisSalvos = await repositorioPerfilMock.buscarTodosPerfis();
    expect(perfisSalvos[0]!.id).toBeDefined();
    expect(perfisSalvos[0]!.id).toHaveLength(36);
  });

  it("deve atualizar um perfil existente se o id for fornecido", async () => {
    const perfil = {
      id: "123",
      nome: "Administrador",
      descricao: "Perfil antigo",
    };

    await salvarPerfil.executar(perfil);

    const perfilAtualizado = {
      id: "123",
      nome: "Administrador Atualizado",
      descricao: "Perfil atualizado",
    };

    await salvarPerfil.executar(perfilAtualizado);

    const perfisSalvos = await repositorioPerfilMock.buscarTodosPerfis();
    expect(perfisSalvos).toHaveLength(1);
    expect(perfisSalvos[0]!.nome).toBe("Administrador Atualizado");
    expect(perfisSalvos[0]!.descricao).toBe("Perfil atualizado");
  });

  it("deve salvar o perfil com ativo definido como falso", async () => {
    const perfil = {
      nome: "Perfil Inativo",
      descricao: "Perfil com ativo falso",
      ativo: false,
    };

    await salvarPerfil.executar(perfil);

    const perfisSalvos = await repositorioPerfilMock.buscarTodosPerfis();
    const perfilSalvo = perfisSalvos[0]!;
    expect(perfilSalvo!.nome).toBe("Perfil Inativo");
    expect(perfilSalvo!.ativo).toBe(false);
  });

  it("deve preencher a data de criação automaticamente caso não seja fornecida", async () => {
    const perfil = {
      nome: "Perfil sem Data",
    };

    await salvarPerfil.executar(perfil);

    const perfisSalvos = await repositorioPerfilMock.buscarTodosPerfis();
    expect(perfisSalvos[0]!.criado_em).toBeDefined();
  });

  it("deve lançar erro ao tentar salvar perfil com nome duplicado", async () => {
    const perfil = {
      nome: "Perfil com Nome Duplicado",
      descricao: "Perfil com nome duplicado",
    };

    await salvarPerfil.executar(perfil);

    const perfilComNomeDuplicado = {
      nome: "Perfil com Nome Duplicado",
      descricao: "Perfil com nome duplicado",
    };

    await expect(salvarPerfil.executar(perfilComNomeDuplicado)).rejects.toThrow(
      "Já existe um perfil com este nome."
    );
  });
});
