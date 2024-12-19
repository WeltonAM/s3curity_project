import { Permissao } from "../../permissao";

export default interface Perfil {
    id: string;
    nome: string;
    descricao: string;
    dataCriacao: Date;
    ativo: boolean;
    permissoes: Permissao[];
}
