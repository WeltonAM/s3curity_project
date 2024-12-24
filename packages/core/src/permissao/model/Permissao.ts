export default interface Permissao {
    id: string;
    nome: string;
    descricao: string | null;
    criadoEm: Date;
    ativo: boolean;
}
