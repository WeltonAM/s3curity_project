import { Perfil } from "../../perfil";

export default interface Usuario {
    id: string;
    nomeCompleto: string;
    email: string;
    senha?: string;
    telefone?: string;
    ativo: boolean;
    criadoEm: Date;
    tokenRecuperacao?: string;
    dataExpiracaoToken?: Date;
    doisFatoresAtivado: boolean;
    urlImagemPerfil?: string;
    perfis: Perfil[];
}