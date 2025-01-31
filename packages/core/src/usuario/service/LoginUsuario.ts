import Usuario from "../model/Usuario";
import ProvedorCriptografia from "../provider/ProvedorCriptografia";
import ProvedorAutenticacao from "../provider/ProvedorAutenticacao";
import RepositorioUsuario from "../provider/RepositorioUsuario";
import { Id } from "../../shared";

export default class LoginUsuario {
  constructor(
    private repositorioUsuario: RepositorioUsuario,
    private provedorCriptografia: ProvedorCriptografia,
    private provedorAutenticacao?: ProvedorAutenticacao
  ) {}

  async comEmailSenha(email: string, senha: string): Promise<Partial<Usuario>> {
    const usuario = await this.repositorioUsuario.buscarPorEmail(email);
    if (!usuario || !usuario.ativo) {
      throw new Error("Credenciais inválidas.");
    }

    const senhaValida = await this.provedorCriptografia.comparar(
      senha,
      usuario.senha || ""
    );

    if (!senhaValida) {
      throw new Error("Credenciais inválidas.");
    }

    const {
      id,
      nome_completo,
      email: emailUsuario,
      url_imagem_perfil,
      telefone,
    } = usuario;

    return {
      id,
      nome_completo,
      email: emailUsuario,
      telefone,
      url_imagem_perfil,
    };
  }

  async comProvedor(
    provedor: string,
    token: string
  ): Promise<Partial<Usuario>> {
    if (!this.provedorAutenticacao) {
      throw new Error("Nenhum provedor de autenticação configurado.");
    }

    const { email, nome, foto } =
      await this.provedorAutenticacao.autenticarComProvedor(provedor, token);

    let usuario = await this.repositorioUsuario.buscarPorEmail(email);

    if (!usuario) {
      const novoUsuario = await this.repositorioUsuario.salvar({
        id: Id.novo.valor,
        email,
        nome_completo: nome,
        url_imagem_perfil: foto,
        ativo: true,
      });

      usuario = novoUsuario!;
    } else if (!usuario.ativo) {
      throw new Error("Usuário inativo.");
    }

    return {
      id: usuario.id,
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      url_imagem_perfil: usuario.url_imagem_perfil,
    };
  }
}
