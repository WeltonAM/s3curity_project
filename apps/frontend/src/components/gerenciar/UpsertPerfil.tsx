'use client';

import usePerfil from "@/data/hooks/usePerfil";
import usePermissao from "@/data/hooks/usePermissao";
import { Perfil } from "@s3curity/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";

interface ModalPerfilProps {
    isEditing: boolean;
    perfil: Partial<Perfil> | null;
    onClose: () => void;
    onSave: (perfil: Partial<Perfil>, permissoesIds: string[]) => Promise<void>;
}

export default function UpsertPerfil({ isEditing, perfil, onClose, onSave }: ModalPerfilProps) {
    const [nome, setNome] = useState<string>(perfil?.nome || "");
    const [descricao, setDescricao] = useState<string>(perfil?.descricao || "");
    const [ativo, setAtivo] = useState<boolean>(perfil?.ativo || false);
    const [nomeEmUso, setNomeEmUso] = useState<boolean>(false);
    const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<string[]>(perfil?.permissoes?.map((p) => p.id) || []);

    const { buscarPerfilPorNome, isLoading } = usePerfil();
    const { permissoes, isLoading: permissoesCarregando } = usePermissao();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const verificarNomeEmUso = async (nome: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!isEditing && nome) {
                const res = await buscarPerfilPorNome(nome);
                setNomeEmUso(!!res);
            }
        }, 500);
    };

    const handlePermissaoToggle = (id: string) => {
        if (permissoesSelecionadas.includes(id)) {
            setPermissoesSelecionadas((prev) => prev.filter((pid) => pid !== id));
        } else {
            setPermissoesSelecionadas((prev) => [...prev, id]);
        }
    };

    const handleSubmit = async () => {
        const perfilData = {
            ...perfil,
            nome,
            descricao,
            ativo,
        };

        await onSave(perfilData, permissoesSelecionadas);
    };

    useEffect(() => {
        if (isEditing && perfil?.permissoes) {
            setPermissoesSelecionadas(perfil.permissoes.map((p) => p.id));
        }
    }, [isEditing, perfil]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
            <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold">
                    {isEditing ? "Editar Perfil" : "Incluir Perfil"}
                </h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            verificarNomeEmUso(e.target.value);
                        }}
                        onBlur={() => verificarNomeEmUso(nome)}
                        placeholder="Nome"
                        className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950"
                        autoComplete="off"
                    />

                    {nomeEmUso && !isEditing && (
                        <div className="text-red-500 text-sm">
                            Este Nome já está em uso.
                        </div>
                    )}

                    <textarea
                        name="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição"
                        className="
                            border border-zinc-900 
                            focus:outline-none focus:ring-1 focus:ring-zinc-700 
                            px-2 py-1 rounded-md bg-zinc-950 
                            resize-y max-h-40 min-h-28
                        "
                        autoComplete="off"
                    />

                    <div className="flex gap-2 items-center">
                        <label className="text-sm text-zinc-400">Ativo:</label>
                        <input
                            type="checkbox"
                            name="ativo"
                            className="cursor-pointer"
                            checked={ativo}
                            onChange={(e) => setAtivo(e.target.checked)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-zinc-400">Permissões:</p>
                        {permissoesCarregando ? (
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                                Carregando permissões...
                            </p>
                        ) : (
                            permissoes.filter((permissao) => permissao.ativo)
                                .map((permissao) => (
                                    <label key={permissao.id} className="flex items-center gap-2 cursor-pointer w-fit">
                                        <input
                                            type="checkbox"
                                            value={permissao.id}
                                            checked={permissoesSelecionadas.includes(permissao.id!)}
                                            onChange={() => handlePermissaoToggle(permissao.id!)}
                                        />
                                        {permissao.nome}
                                    </label>
                                ))
                        )}
                    </div>
                </form>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={nomeEmUso || isLoading}
                        onClick={handleSubmit}
                        className={`
                            flex items-center gap-2 justify-center
                            bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-white min-w-24
                            ${nomeEmUso ? "cursor-not-allowed" : ""}
                            ${isLoading ? "cursor-not-allowed" : ""}
                        `}
                    >
                        {isLoading ? (
                            <IconRotateClockwise className="animate-spin h-5 w-5 mr-2" />
                        ) : (
                            <span>Salvar</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
