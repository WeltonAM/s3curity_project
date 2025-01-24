'use client';

import useUsuario from "@/data/hooks/useUsuario";
import { Usuario } from "@s3curity/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import usePerfil from "@/data/hooks/usePerfil";

interface ModalUsuarioProps {
    isEditing: boolean;
    perfil: Partial<Usuario> | null;
    onClose: () => void;
    onSave: (perfil: Partial<Usuario>, permissoesIds: string[]) => Promise<void>;
}

export default function UpsertUsuario({ isEditing, perfil, onClose, onSave }: ModalUsuarioProps) {
    const [nome, setNome] = useState<string>(perfil?.nome_completo || "");
    const [telefone, setTelefone] = useState<string>(perfil?.telefone || "");
    const [email, setEmail] = useState<string>(perfil?.email || "");
    const [ativo, setAtivo] = useState<boolean>(perfil?.ativo || false);
    const [horasTrabalho, setHorasTrabalho] = useState<string>(perfil?.horas_trabalho || "09:00 - 18:00");
    const [diasTrabalho, setDiasTrabalho] = useState<string[]>(perfil?.dias_trabalho?.split(",") || []);
    const [emailEmUso, setEmailEmUso] = useState<boolean>(false);
    const [perfisSelecionados, setPerfisSelecionados] = useState<string[]>(perfil?.permissoes?.map((p) => p.id) || []);

    const { isLoading } = useUsuario();
    const { perfis, isLoading: perfisCarregando } = usePerfil();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const verificarNomeEmUso = async (nome: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!isEditing && nome) {
                const res = await buscarUsuarioPorEmail(nome);
                setEmailEmUso(!!res);
            }
        }, 500);
    };

    const handleDiasTrabalhoChange = (dia: string) => {
        setDiasTrabalho((prev) => {
            if (prev.includes(dia)) {
                return prev.filter((d) => d !== dia);
            } else {
                return [...prev, dia];
            }
        });
    };

    const handlePerfisToggle = (id: string) => {
        if (perfisSelecionados.includes(id)) {
            setPerfisSelecionados((prev) => prev.filter((pid) => pid !== id));
        } else {
            setPerfisSelecionados((prev) => [...prev, id]);
        }
    };

    const handleSubmit = async () => {
        const perfilData = {
            ...perfil,
            nome,
            telefone,
            ativo,
        };

        await onSave(perfilData, perfisSelecionados);
    };

    useEffect(() => {
        if (isEditing && perfil?.permissoes) {
            setPerfisSelecionados(perfil.permissoes.map((p) => p.id));
        }
    }, [isEditing, perfil]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center select-none">
            <div className="flex flex-col bg-zinc-800 p-6 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4">
                    {isEditing ? "Editar Usuário" : "Incluir Usuário"}
                </h2>

                <form className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
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
                            {emailEmUso && !isEditing && (
                                <div className="text-red-500 text-sm">
                                    Este email já está em uso.
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                name="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="Telefone"
                                className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950"
                                autoComplete="off"
                            />
                        </div>

                        {!isEditing && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="senha" className="text-sm text-zinc-400 ml-1">
                                        Senha Padrão:
                                    </label>
                                    <input
                                        type="text"
                                        name="senha"
                                        value="#Senha123"
                                        readOnly
                                        placeholder="Senha"
                                        className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950 -mt-2"
                                        autoComplete="off"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="horas_trabalho" className="text-sm text-zinc-400 ml-1">Horas de Trabalho:</label>
                            <input
                                type="text"
                                name="horas_trabalho"
                                value={horasTrabalho}
                                onChange={(e) => setHorasTrabalho(e.target.value)}
                                placeholder="Ex: 09:00 - 18:00"
                                className="border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 px-2 py-1 rounded-md bg-zinc-950 -mt-2"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
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
                            <label htmlFor="dias_trabalho" className="text-sm text-zinc-400">Dias de Trabalho:</label>
                            <div className="flex gap-2">
                                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                                    <label key={dia} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={dia}
                                            checked={diasTrabalho.includes(dia)}
                                            onChange={() => handleDiasTrabalhoChange(dia)}
                                        />
                                        {dia}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-zinc-400">Perfis:</p>
                            {perfisCarregando ? (
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                                    Carregando perfis...
                                </p>
                            ) : (
                                perfis.filter((p) => p.ativo)
                                    .map((p) => (
                                        <label key={p.id} className="flex items-center gap-2 cursor-pointer w-fit">
                                            <input
                                                type="checkbox"
                                                value={p.id}
                                                checked={perfisSelecionados.includes(p.id!)}
                                                onChange={() => handlePerfisToggle(p.id!)}
                                            />
                                            {p.nome}
                                        </label>
                                    ))
                            )}
                        </div>
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
                        disabled={emailEmUso || isLoading}
                        onClick={handleSubmit}
                        className={`
                            flex items-center gap-2 justify-center
                            bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md text-white min-w-24
                            ${emailEmUso ? "cursor-not-allowed" : ""}
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
