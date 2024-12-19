import { Perfil } from "../../perfil";

export default interface Usuario {
    id: string;
    nome: string;
    email: string;
    senha?: string;
    telefone?: string;
    ativo: boolean;
    dataCriacao: Date;
    tokenRecuperacaoSenha?: string;
    dataExpiracaoToken?: Date;
    autenticacaoDoisFatoresAtiva: boolean;
    imagemPerfil?: string;
    perfis: Perfil[];
}
