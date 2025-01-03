import { Permissao } from "../../permissao";

export default interface Perfil {
    id: string;
    nome: string;
    descricao: string | null;
    criado_em: Date;
    ativo: boolean;
    permissoes: Permissao[]; 
}
