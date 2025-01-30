'use client';

import usePerfil from "@/data/hooks/usePerfil";
import Carregando from "../shared/Carregando";
import { IconInfoTriangle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Perfil } from "@s3curity/core";
import UpsertPerfil from "./UpsertPerfil";
import usePermissao from "@/data/hooks/usePermissao";
import useMensagem from "@/data/hooks/useMensagem";

export default function ListarPerfis() {
    const { perfis, isLoading, salvarPerfil, deletarPerfil, relacionarPerfilComPermissao } = usePerfil();
    const [isModalUpsertOpen, setIsModalUpsertOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPerfil, setCurrentPerfil] = useState<Partial<Perfil> | null>(null);
    const { adicionarSucesso } = useMensagem();

    const { possuiPermissao } = usePermissao();

    const podeCriarPerfil = possuiPermissao('Criar Perfis');
    const podeEditarPerfil = possuiPermissao('Editar Perfis');

    const handleNewPerfil = () => {
        setCurrentPerfil(null);
        setIsEditing(false);
        setIsModalUpsertOpen(true);
    };

    const handleEditPerfil = (perfil: Partial<Perfil>) => {
        setCurrentPerfil(perfil);
        setIsEditing(true);
        setIsModalUpsertOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalUpsertOpen(false);
        setCurrentPerfil(null);
    };

    const handleSavePerfil = async (perfil: Partial<Perfil>, permissoesIds: string[]) => {
        const novoPerfil = await salvarPerfil(perfil);
   
        if (novoPerfil?.id) {
            await relacionarPerfilComPermissao(novoPerfil.id, permissoesIds);
            adicionarSucesso("Perfil salvo com sucesso!");
        }
    
        handleCloseModal();
    };    

    const hadleOpenModalDelete = async (perfil: Partial<Perfil>) => {
        setIsModalDeleteOpen(true);
        setCurrentPerfil(perfil);
    };

    const handleCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
        setCurrentPerfil(null);
    };

    const handleDeletePerfilConfirm = async (id: string) => {
        await deletarPerfil(id);
        handleCloseModalDelete();
    };

    if (isLoading) {
        return <Carregando />;
    }

    if (!perfis || perfis.length === 0) {
        return <div>Nenhum perfil encontrado.</div>;
    }

    return (
        <div className="flex flex-col justify-between items-center gap-4 w-full">
            <div className="flex justify-end w-full">
                {podeCriarPerfil && (
                    <button
                        onClick={handleNewPerfil}
                        className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md hover:bg-green-500"
                    >
                        <IconPlus size={16} stroke={3} />
                        <span>Novo</span>
                    </button>
                )}
            </div>

            <table className="min-w-full table-auto text-sm bg-zinc-800 rounded-md overflow-hidden border border-zinc-500">
                <thead className="bg-zinc-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Nome</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Descrição</th>
                        <th className="px-4 py-2 text-center text-xs border border-zinc-600">Ativo</th>

                        {podeEditarPerfil && (
                            <th className="text-center text-xs border border-zinc-600">Ações</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {perfis.map((perfil) => (
                        <tr key={perfil.nome} className="hover:bg-zinc-500">
                            <td className="px-4 py-2 border border-zinc-600">{perfil.nome}</td>

                            <td className="px-4 py-2 border border-zinc-600">{perfil.descricao}</td>

                            <td className="px-4 py-2 text-center border border-zinc-600">
                                {perfil.ativo ? "Sim" : "Não"}
                            </td>

                            {podeEditarPerfil && (
                                <td className="px-4 py-2 text-center border border-zinc-600">
                                    <button
                                        onClick={() => handleEditPerfil(perfil)}
                                        className="bg-blue-500 hover:bg-blue-400 border border-blue-600 text-white px-2 py-1 rounded-md"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => hadleOpenModalDelete(perfil)}
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
                <UpsertPerfil
                    isEditing={isEditing}
                    perfil={currentPerfil}
                    onClose={handleCloseModal}
                    onSave={handleSavePerfil}
                />
            )}

            {isModalDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
                    <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-md shadow-md w-96">
                        <h2 className="flex gap-4 justify-center items-center text-lg font-bold text-center bg-yellow-500 py-1 px-4 rounded-md">
                            <IconInfoTriangle className="text-red-600" stroke={3} />
                            <span className="text-red-600">Excluir Perfil</span>
                        </h2>

                        <p className="text-center font-normal">
                            Tem certeza que deseja excluir o perfil [<span className="underline font-extrabold">{currentPerfil?.nome}</span>]
                        </p>

                        <button
                            onClick={() => handleDeletePerfilConfirm(currentPerfil!.id as string)}
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
