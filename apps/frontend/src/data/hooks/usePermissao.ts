import useSessao from "@/data/hooks/useSessao";

export default function usePermissao() {
    const { usuario } = useSessao();

    function possuiPermissao(permissao: string): boolean {
        return usuario?.permissoes?.some((p) => p.nome === permissao) || false;
    }

    return { possuiPermissao };
}
