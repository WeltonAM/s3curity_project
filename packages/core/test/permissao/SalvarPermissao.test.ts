import { SalvarPermissao } from "../../src";
import { RepositorioPermissaoMock } from "../mock/RepositorioPermissaoMock";

describe("SalvarPermissao", () => {
  let repositorioPermissaoMock: RepositorioPermissaoMock;
  let salvarPermissao: SalvarPermissao;

  beforeEach(() => {
    repositorioPermissaoMock = new RepositorioPermissaoMock();
    salvarPermissao = new SalvarPermissao(repositorioPermissaoMock);
  });

  it("deve salvar a permissão com o id gerado corretamente a partir do nome", async () => {
    const permissao = {
      nome: "Criar Usuários",
      descricao: "Permite criar novos usuários no sistema.",
    };

    await salvarPermissao.executar(permissao);

    const permissoesSalvas =
      await repositorioPermissaoMock.buscarTodasPermissoes();

    expect(permissoesSalvas).toHaveLength(1);
    const permissaoSalva = permissoesSalvas[0];
    expect(permissaoSalva!.id).toBe("criar-usuarios");
    expect(permissaoSalva!.nome).toBe("Criar Usuários");
    expect(permissaoSalva!.descricao).toBe(
      "Permite criar novos usuários no sistema."
    );
  });

  it("deve salvar permissão sem descrição", async () => {
    const permissao = {
      nome: "Criar Usuários",
      descricao: null,
    };

    await salvarPermissao.executar(permissao);

    const permissoesSalvas =
      await repositorioPermissaoMock.buscarTodasPermissoes();

    const permissaoSalva = permissoesSalvas[0];
    expect(permissaoSalva!.id).toBe("criar-usuarios");
    expect(permissaoSalva!.nome).toBe("Criar Usuários");
    expect(permissaoSalva!.descricao).toBe(null);
  });

  it("deve salvar permissão com ativo", async () => {
    const permissao = {
      nome: "Criar Usuários",
      descricao: "Permissão com ativo",
      ativo: false,
    };

    await salvarPermissao.executar(permissao);

    const permissoesSalvas =
      await repositorioPermissaoMock.buscarTodasPermissoes();

    const permissaoSalva = permissoesSalvas[0];
    expect(permissaoSalva!.id).toBe("criar-usuarios");
    expect(permissaoSalva!.nome).toBe("Criar Usuários");
    expect(permissaoSalva!.descricao).toBe("Permissão sem ativo");
    expect(permissaoSalva!.ativo).toBe(false);
  });

  it("não deve salvar permissão sem nome", async () => {
    const permissao = {
      nome: "",
      descricao: "Permissão sem nome",
    };

    await expect(salvarPermissao.executar(permissao)).rejects.toThrow(
      "O campo 'nome' é obrigatório."
    );
  });

  it("deve gerar o id corretamente mesmo com caracteres especiais e espaços", async () => {
    const permissao = {
      nome: "Criar Usuários com Caracteres Especiais!@#",
      descricao: "Permissão com caracteres especiais no nome.",
    };

    await salvarPermissao.executar(permissao);

    const permissoesSalvas =
      await repositorioPermissaoMock.buscarTodasPermissoes();

    const permissaoSalva = permissoesSalvas[0];
    expect(permissaoSalva!.id).toBe("criar-usuarios-com-caracteres-especiais");
  });
});
