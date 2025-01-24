export default interface Permissao {
    id: string;
    slug: string;
    nome: string;
    descricao?: string | null;
    criado_em?: Date;
    ativo: boolean;
}
