import { Perfil } from "../../perfil";
import { Permissao } from "../../permissao";

export default interface Usuario {
  id?: string;
  nome_completo?: string;
  email: string;
  senha?: string;
  telefone?: string;
  ativo?: boolean;
  criado_em?: Date;
  token_recuperacao?: string;
  data_expiracao_token?: Date;
  dois_fatores_ativado?: boolean;
  url_imagem_perfil?: string;
  horas_trabalho?: string; 
  dias_trabalho?: string;
  perfis?: Perfil[];
  permissoes?: Permissao[];
}
