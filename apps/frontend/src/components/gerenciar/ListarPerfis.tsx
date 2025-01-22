import usePerfil from "@/data/hooks/usePerfil";
import Carregando from "../shared/Carregando";
import { IconPlus } from "@tabler/icons-react";

export default function ListarPerfis() {
    const { perfis, isLoading } = usePerfil();

    if (isLoading) {
        return <Carregando />;
    }

    if (!perfis || perfis.length === 0) {
        return <div>Nenhum perfil encontrado.</div>;
    }

    return (
        <div className="flex flex-col justify-between items-center gap-4 w-full">
            <div className="flex justify-end w-full">
                <button className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md hover:bg-green-500">
                    <IconPlus size={16} stroke={3} />
                    <span>Novo</span>
                </button>
            </div>

            <table className="min-w-full table-auto text-sm bg-zinc-800 rounded-md overflow-hidden border border-zinc-500">
                <thead className="bg-zinc-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Nome</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Descrição</th>
                        <th className="text-center text-xs border border-zinc-600">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {perfis.map((perfil) => (
                        <tr key={perfil.nome} className="hover:bg-zinc-500">
                            <td className="px-4 py-2 border border-zinc-600">{perfil.nome}</td>
                            <td className="px-4 py-2 border border-zinc-600">{perfil.descricao}</td>
                            <td className="px-4 py-2 text-center border border-zinc-600">
                                <button className="bg-blue-500 hover:bg-blue-400 border border-blue-600 text-white px-2 py-1 rounded-md">
                                    Editar
                                </button>
                                <button className="bg-red-500 hover:bg-red-400 border border-red-600 text-white px-2 py-1 rounded-md ml-2">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
