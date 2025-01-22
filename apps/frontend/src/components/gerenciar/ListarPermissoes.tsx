import { useState } from "react";
import usePermissao from "@/data/hooks/usePermissao";
import Carregando from "../shared/Carregando";
import { IconPlus } from "@tabler/icons-react";
import { Permissao } from "@s3curity/core";
import UpsertPermissao from "./UpsertPermissao";

export default function ListarPermissoes() {
    const { permissoes, isLoading } = usePermissao();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPermissao, setCurrentPermissao] = useState<Partial<Permissao> | null>(null);

    const handleNewPermissao = () => {
        setCurrentPermissao(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEditPermissao = (permissao: Partial<Permissao>) => {
        setCurrentPermissao(permissao);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPermissao(null);
    };

    if (isLoading) {
        return <Carregando />;
    }

    if (!permissoes || permissoes.length === 0) {
        return <div>Nenhuma permissão encontrada.</div>;
    }

    return (
        <div className="flex flex-col justify-between items-center gap-4 w-full">
            <div className="flex justify-end w-full">
                <button
                    onClick={handleNewPermissao}
                    className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md hover:bg-green-500"
                >
                    <IconPlus size={16} stroke={3} />
                    <span>Nova</span>
                </button>
            </div>

            <table className="min-w-full table-auto text-sm bg-zinc-800 rounded-md overflow-hidden border border-zinc-500">
                <thead className="bg-zinc-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Nome</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Descrição</th>
                        <th className="px-4 py-2 text-center text-xs border border-zinc-600">Ativo</th>
                        <th className="text-center text-xs border border-zinc-600">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {permissoes.map((permissao) => (
                        <tr key={permissao.id} className="hover:bg-zinc-500">
                            <td className="px-4 py-2 border border-zinc-600">{permissao.nome}</td>
                            <td className="px-4 py-2 border border-zinc-600">{permissao.descricao}</td>
                            <td className="px-4 py-2 text-center border border-zinc-600">
                                {permissao.ativo ? "Sim" : "Não"}
                            </td>
                            <td className="px-4 py-2 text-center border border-zinc-600">
                                <button
                                    onClick={() => handleEditPermissao(permissao)}
                                    className="bg-blue-500 hover:bg-blue-400 border border-blue-600 text-white px-2 py-1 rounded-md"
                                >
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

            {isModalOpen && (
                <UpsertPermissao
                    isEditing={isEditing}
                    permissao={currentPermissao}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
