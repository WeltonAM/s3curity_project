import { useState } from "react";
import usePermissao from "@/data/hooks/usePermissao";
import Carregando from "../shared/Carregando";
import { IconInfoTriangle, IconPlus } from "@tabler/icons-react";
import { Permissao } from "@s3curity/core";
import UpsertPermissao from "./UpsertPermissao";

export default function ListarPermissoes() {
    const { permissoes, isLoading, salvarPermissao, deletarPermissao } = usePermissao();
    const [isModalUpsertOpen, setIsModalUpsertOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPermissao, setCurrentPermissao] = useState<Partial<Permissao> | null>(null);

    const { possuiPermissao } = usePermissao();

    const podeCriarPermissao = possuiPermissao('Criar Permissões');
    const podeEditarPermissao = possuiPermissao('Editar Permissões');

    const handleNewPermissao = () => {
        setCurrentPermissao(null);
        setIsEditing(false);
        setIsModalUpsertOpen(true);
    };

    const handleEditPermissao = (permissao: Partial<Permissao>) => {
        setCurrentPermissao(permissao);
        setIsEditing(true);
        setIsModalUpsertOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalUpsertOpen(false);
        setCurrentPermissao(null);
    };

    const handleSavePermissao = async (permissao: Partial<Permissao>) => {
        await salvarPermissao(permissao);
        handleCloseModal();
    };

    const hadleOpenModalDelete = async (permissao: Partial<Permissao>) => {
        setIsModalDeleteOpen(true);
        setCurrentPermissao(permissao);
    };

    const handleCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
        setCurrentPermissao(null);
    };

    const handleDeletePermissaoConfirm = async (id: string) => {
        await deletarPermissao(id);
        handleCloseModalDelete();
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
                {podeCriarPermissao && (
                    <button
                        onClick={handleNewPermissao}
                        className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md hover:bg-green-500"
                    >
                        <IconPlus size={16} stroke={3} />
                        <span>Nova</span>
                    </button>
                )}
            </div>

            <table className="min-w-full table-auto text-sm bg-zinc-800 rounded-md overflow-hidden border border-zinc-500">
                <thead className="bg-zinc-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Nome</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Descrição</th>
                        <th className="px-4 py-2 text-center text-xs border border-zinc-600">Ativo</th>

                        {podeEditarPermissao && (
                            <th className="text-center text-xs border border-zinc-600">Ações</th>
                        )}
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

                            {podeEditarPermissao && (
                                <td className="px-4 py-2 text-center border border-zinc-600">
                                    <button
                                        onClick={() => handleEditPermissao(permissao)}
                                        className="bg-blue-500 hover:bg-blue-400 border border-blue-600 text-white px-2 py-1 rounded-md"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => hadleOpenModalDelete(permissao)}
                                        className="bg-red-500 hover:bg-red-400 border border-red-600 text-white px-2 py-1 rounded-md ml-2"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalUpsertOpen && (
                <UpsertPermissao
                    isEditing={isEditing}
                    permissao={currentPermissao}
                    onClose={handleCloseModal}
                    onSave={handleSavePermissao}
                />
            )}

            {isModalDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
                    <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-md shadow-md w-96">
                        <h2 className="flex gap-4 justify-center items-center text-lg font-bold text-center bg-yellow-500 py-1 px-4 rounded-md">
                            <IconInfoTriangle className="text-red-600" stroke={3} />
                            <span className="text-red-600">Excluir Permissão</span>
                        </h2>

                        <p className="text-center font-normal">
                            Tem certeza que deseja excluir a permissão [<span className="underline font-extrabold">{currentPermissao?.nome}</span>]
                        </p>

                        <button
                            onClick={() => handleDeletePermissaoConfirm(currentPermissao!.id as string)}
                            className="
                                bg-red-600 hover:bg-red-500 text-white
                                font-bold py-2 px-4 rounded
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-offset-gray-800 focus:ring-white"
                        >
                            Deletar
                        </button>

                        <button
                            onClick={handleCloseModalDelete}
                            className="
                                bg-zinc-700 hover:bg-zinc-600 text-zinc-200
                                font-bold py-2 px-4 rounded
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-offset-gray-800focus:ring-white"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>

            )}
        </div>
    );
}
