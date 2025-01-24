'use client';

import usePermissao from "@/data/hooks/usePermissao";
import { Permissao } from "@s3curity/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState, useRef } from "react";

interface ModalPermissaoProps {
    isEditing: boolean;
    permissao: Partial<Permissao> | null;
    onClose: () => void;
    onSave: (permissao: Partial<Permissao>) => Promise<void>;
}

export default function UpsertPermissao({ isEditing, permissao, onClose, onSave }: ModalPermissaoProps) {
    const [nome, setNome] = useState<string>(permissao?.nome || "");
    const [descricao, setDescricao] = useState<string>(permissao?.descricao || "");
    const [ativo, setAtivo] = useState<boolean>(permissao?.ativo || false);
    const [slugEmUso, setSlugEmUso] = useState<boolean>(false);

    const { buscarPermissaoPorSlug, isLoading } = usePermissao();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const gerarSlug = (nome: string): string => {
        return nome
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "")
            .replace(/^-+|-+$/g, "");
    };

    const verificarSlugEmUso = async (nome: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!isEditing && nome) {
                const slug = gerarSlug(nome);
                const res = await buscarPermissaoPorSlug(slug);

                if (res!) {
                    setSlugEmUso(true);
                } else {
                    setSlugEmUso(false);
                }
            }
        }, 500);
    };

    const handleSubmit = async () => {
        const permissaoData = {
            ...permissao,
            nome,
            descricao,
            ativo
        };

        await onSave(permissaoData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
            <div className="flex flex-col gap-4 bg-zinc-800 p-6 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold">
                    {isEditing ? "Editar Permissão" : "Incluir Permissão"}
                </h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            verificarSlugEmUso(e.target.value);
                        }}
                        onBlur={() => verificarSlugEmUso(nome)}
                        placeholder="Nome"
                        className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950"
                        autoComplete="off"
                    />

                    {slugEmUso && !isEditing && (
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
                </form>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={slugEmUso}
                        onClick={handleSubmit}
                        className={`
                            flex items-center gap-2 justify-center
                            bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-white min-w-24
                            ${slugEmUso ? "cursor-not-allowed" : ""}
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
