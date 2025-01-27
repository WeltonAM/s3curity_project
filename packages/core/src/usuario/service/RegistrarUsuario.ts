import { Id } from "../../shared";
import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import RepositorioUsuario from "../provider/RepositorioUsuario";

export default class RegistrarUsuario {
  constructor(
    private repositorioUsuario: RepositorioUsuario,
    private provedorCriptografia: ProvedorCriptografia
  ) {}

  async executar(usuario: Partial<Usuario>): Promise<Partial<Usuario>> {
    const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(
      usuario.email!
    );
    if (usuarioExistente) {
      throw new Error("E-mail já está em uso.");
    }

    const senhaCriptografada = await this.provedorCriptografia.criptografar(
      usuario.senha!
    );

    const novoUsuario: Partial<Usuario> = {
      id: Id.novo.valor,
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      senha: senhaCriptografada,
      ativo: true,
      telefone: usuario.telefone || "",
      url_imagem_perfil: usuario.url_imagem_perfil || "",
      horas_trabalho: usuario.horas_trabalho || "",
      dias_trabalho: usuario.dias_trabalho || "",
      dois_fatores_ativado: false,
      criado_em: new Date(),
    };

    await this.repositorioUsuario.salvar(novoUsuario);

    return novoUsuario;
  }
}
