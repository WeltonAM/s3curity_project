import { Permissao } from "../../permissao";

export default interface Perfil {
    id: string;
    nome: string;
    descricao: string | null;
    criadoEm: Date;
    ativo: boolean;
    permissoes: Permissao[]; 
}
