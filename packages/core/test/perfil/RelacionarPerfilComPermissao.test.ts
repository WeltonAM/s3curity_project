import { RelacionarPerfilComPermissao } from "../../src";
import { RepositorioPerfilMock } from "../mock/RepositorioPerflMock";

describe("relacionarPerfilComPermissao", () => {
  let repositorioPerfilMock: RepositorioPerfilMock;
  let casoDeUso: RelacionarPerfilComPermissao;

  beforeEach(() => {
    repositorioPerfilMock = new RepositorioPerfilMock();
    casoDeUso = new RelacionarPerfilComPermissao(repositorioPerfilMock);
  });

  it("deve relacionar permissões ao perfil corretamente", async () => {
    const perfilId = "perfil-id-123";
    const permissoesIds = ["permissao-id-1", "permissao-id-2"];

    const relacionarSpy = jest.spyOn(
      repositorioPerfilMock,
      "relacionarPerfilComPermissao"
    );

    await casoDeUso.executar(perfilId, permissoesIds);

    expect(relacionarSpy).toHaveBeenCalledTimes(permissoesIds.length);
    permissoesIds.forEach((permissaoId) => {
      expect(relacionarSpy).toHaveBeenCalledWith(perfilId, permissaoId);
    });
  });

  it("deve lançar erro caso 'perfilId' não seja fornecido", async () => {
    const perfilId = "";
    const permissoesIds = ["permissao-id-1"];

    await expect(casoDeUso.executar(perfilId, permissoesIds)).rejects.toThrow(
      "O campo 'perfilId' é obrigatório."
    );
  });

  it("deve lançar erro caso 'permissoesIds' esteja vazio", async () => {
    const perfilId = "perfil-id-123";
    const permissoesIds: string[] = [];

    await expect(casoDeUso.executar(perfilId, permissoesIds)).rejects.toThrow(
      "O campo 'permissoesIds' é obrigatório e deve conter ao menos uma permissão."
    );
  });

  it("deve lançar erro caso 'permissoesIds' não seja fornecido", async () => {
    const perfilId = "perfil-id-123";

    await expect(
      casoDeUso.executar(perfilId, undefined as any)
    ).rejects.toThrow(
      "O campo 'permissoesIds' é obrigatório e deve conter ao menos uma permissão."
    );
  });

  it("não deve relacionar permissões ao perfil se não houver permissões", async () => {
    const perfilId = "perfil-id-123";
    const permissoesIds: string[] = [];

    const relacionarSpy = jest.spyOn(
      repositorioPerfilMock,
      "relacionarPerfilComPermissao"
    );

    await expect(casoDeUso.executar(perfilId, permissoesIds)).rejects.toThrow(
      "O campo 'permissoesIds' é obrigatório e deve conter ao menos uma permissão."
    );

    expect(relacionarSpy).not.toHaveBeenCalled();
  });
});
