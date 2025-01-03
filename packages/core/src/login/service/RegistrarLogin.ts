import { Id } from "../../shared";
import Login from "../model/Login";
import RepositorioLogin from "../provider/RepositorioLogin";
import RepositorioUsuario from "../../usuario/provider/RepositorioUsuario";

export default class RegistrarLogin {
  constructor(
    private repositorioLogin: RepositorioLogin,
    private repositorioUsuario: RepositorioUsuario,
  ) {}

  async executar(
    usuarioId: string,
    sucesso: boolean,
    ip: string,
    token?: string,
    provedor?: string,
  ): Promise<void> {
    const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(usuario);
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.");
    }

    const novoLogin: Login = {
      id: Id.novo.valor, 
      usuario_id: usuarioId,
      sucesso: sucesso,
      ip: ip,
      data_hora: new Date(),
      provedor: provedor, 
      token: token,
    };

    await this.repositorioLogin.registrar(novoLogin);
  }
}
