import Usuario from "../model/Usuario";
import RepositorioUsuario from "../provider/RepositorioUsuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";

export default class AtualizarUsuario {
  constructor(
    private repositorioUsuario: RepositorioUsuario,
    private provedorCriptografia: ProvedorCriptografia
  ) {}

  async executar(
    email: string,
    dadosAtualizados: Partial<Usuario>
  ): Promise<Partial<Usuario>> {
    const usuarioExistente =
      await this.repositorioUsuario.buscarPorEmail(email);
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.");
    }

    const usuarioAtualizado: Partial<Usuario> = {
      ...usuarioExistente,
      nome_completo:
        dadosAtualizados.nome_completo || usuarioExistente.nome_completo,
      senha: dadosAtualizados.senha
        ? await this.provedorCriptografia.criptografar(dadosAtualizados.senha)
        : usuarioExistente.senha,
      telefone: dadosAtualizados.telefone || usuarioExistente.telefone,
      url_imagem_perfil:
        dadosAtualizados.url_imagem_perfil ||
        usuarioExistente.url_imagem_perfil,
      horas_trabalho:
        dadosAtualizados.horas_trabalho || usuarioExistente.horas_trabalho,
      dias_trabalho:
        dadosAtualizados.dias_trabalho || usuarioExistente.dias_trabalho,
      dois_fatores_ativado:
        dadosAtualizados.dois_fatores_ativado ??
        usuarioExistente.dois_fatores_ativado,
    };

    await this.repositorioUsuario.salvar(usuarioAtualizado);

    return usuarioAtualizado;
  }
}
