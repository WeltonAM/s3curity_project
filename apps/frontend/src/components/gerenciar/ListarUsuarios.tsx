'use client';

import Carregando from "../shared/Carregando";
import { IconInfoTriangle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Usuario } from "@s3curity/core";
import UpsertUsuario from "./UpsertUsuario";
import useUsuario from "@/data/hooks/useUsuario";

export default function ListarUsuarios() {
    const { usuarios, isLoading, salvarUsuario } = useUsuario();
    const [isModalUpsertOpen, setIsModalUpsertOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState<Partial<Usuario> | null>(null);

    const handleNewUsuario = () => {
        setCurrentUsuario(null);
        setIsEditing(false);
        setIsModalUpsertOpen(true);
    };

    const handleEditUsuario = (usuario: Partial<Usuario>) => {
        setCurrentUsuario(usuario);
        setIsEditing(true);
        setIsModalUpsertOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalUpsertOpen(false);
        setCurrentUsuario(null);
    };

    const handleSaveUsuario = async (usuario: Partial<Usuario>, perfisIds: string[]) => {
        if (usuario.id) {
            await salvarUsuario(usuario);
            console.log("USUARIO", usuario);
            console.log("PERFIS", perfisIds);
            // await relacionarUsuarioComPermissao(usuario.id, perfisIds);
        }

        handleCloseModal();
    };

    const hadleOpenModalDelete = async (usuario: Partial<Usuario>) => {
        setIsModalDeleteOpen(true);
        setCurrentUsuario(usuario);
    };

    const handleCloseModalDelete = () => {
        setIsModalDeleteOpen(false);
        setCurrentUsuario(null);
    };

    const handleDeleteUsuarioConfirm = async (id: string) => {
        await deletarUsuario(id);
        handleCloseModalDelete();
    };

    if (isLoading) {
        return <Carregando />;
    }

    if (!usuarios || usuarios.length === 0) {
        return <div>Nenhum usuario encontrado.</div>;
    }

    return (
        <div className="flex flex-col justify-between items-center gap-4 w-full">
            <div className="flex justify-end w-full">
                <button
                    onClick={handleNewUsuario}
                    className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md hover:bg-green-500"
                >
                    <IconPlus size={16} stroke={3} />
                    <span>Novo</span>
                </button>
            </div>

            <table className="min-w-full table-auto text-sm bg-zinc-800 rounded-md overflow-hidden border border-zinc-500">
                <thead className="bg-zinc-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Nome</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Telefone</th>
                        <th className="px-4 py-2 text-left text-xs border border-zinc-600">Perfis</th>
                        <th className="px-4 py-2 text-center text-xs border border-zinc-600">Ativo</th>
                        <th className="text-center text-xs border border-zinc-600">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-500">
                            <td className="px-4 py-2 border border-zinc-600">{u.nome_completo}</td>

                            <td className="px-4 py-2 border border-zinc-600">{u.telefone}</td>

                            <td className="px-4 py-2 border border-zinc-600">
                                {u.perfis?.map((p) => p.nome).join(", ")}
                            </td>

                            <td className="px-4 py-2 text-center border border-zinc-600">
                                {u.ativo ? "Sim" : "Não"}
                            </td>

                            <td className="px-4 py-2 text-center border border-zinc-600">
                                <button
                                    onClick={() => handleEditUsuario(u)}
                                    className="bg-blue-500 hover:bg-blue-400 border border-blue-600 text-white px-2 py-1 rounded-md"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => hadleOpenModalDelete(u)}
                                    className="bg-red-500 hover:bg-red-400 border border-red-600 text-white px-2 py-1 rounded-md ml-2"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalUpsertOpen && (
                <UpsertUsuario
                    isEditing={isEditing}
                    usuario={currentUsuario}
                    onClose={handleCloseModal}
                    onSave={handleSaveUsuario}
                />
            )}

            {isModalDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
                    <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-md shadow-md w-96">
                        <h2 className="flex gap-4 justify-center items-center text-lg font-bold text-center bg-yellow-500 py-1 px-4 rounded-md">
                            <IconInfoTriangle className="text-red-600" stroke={3} />
                            <span className="text-red-600">Excluir Usuario</span>
                        </h2>

                        <p className="text-center font-normal">
                            Tem certeza que deseja excluir o usuário [<span className="underline font-extrabold">{currentUsuario?.nome_completo}</span>]
                        </p>

                        <button
                            onClick={() => handleDeleteUsuarioConfirm(currentUsuario!.id as string)}
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
