import { Perfil } from "../../perfil";

export default interface Usuario {
    id?: string;
    nome_completo?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    ativo?: boolean;
    criado_em?: Date;
    token_recupercao?: string;
    data_expiracao_token?: Date;
    dois_fatores_ativado?: boolean;
    url_imagem_perfil?: string;
    perfis?: Perfil[];
}