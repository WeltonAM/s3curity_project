import { Id } from "../../dist";
import { Login, RepositorioLogin } from "../../src";

export default class RepositorioLoginMock implements RepositorioLogin {
  private logins: Login[] = [];

  async registrar(login: Login): Promise<void> {
    const loginComId = {
      ...login,
      id: login.id ?? Id.novo.valor,
      data_hora: login.data_hora ?? new Date(),
    };

    this.logins.push(loginComId);
  }

  async buscarPorUsuarioId(usuarioId: string): Promise<Login[]> {
    return this.logins.filter(login => login.usuario_id === usuarioId);
  }
}
