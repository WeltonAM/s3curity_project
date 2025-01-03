export default interface Permissao {
    id: string;
    nome: string;
    descricao: string | null;
    criado_em: Date;
    ativo: boolean;
}
