'use client';

import useUsuario from "@/data/hooks/useUsuario";
import { Usuario } from "@s3curity/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import CampoNome from "../shared/CampoNome";
import CampoTelefone from "../shared/CampoTelefone";
import CampoEmail from "../shared/CampoEmail";
import CampoSenha from "../shared/CampoSenha";
import usePerfil from "@/data/hooks/usePerfil";

interface ModalUsuarioProps {
    isEditing: boolean;
    usuario: Partial<Usuario> | null;
    onClose: () => void;
    onSave: (usuario: Partial<Usuario>, permissoesIds: string[]) => Promise<void>;
}

export default function UpsertUsuario({ isEditing, usuario, onClose, onSave }: ModalUsuarioProps) {
    const { isLoading, buscarUsuarioPorEmail } = useUsuario();
    const { perfis, isLoading: perfisCarregando } = usePerfil();

    const [nome, setNome] = useState<string>(usuario?.nome_completo || "");
    const [telefone, setTelefone] = useState<string>(usuario?.telefone || "");
    const [email, setEmail] = useState<string>(usuario?.email || "");
    const [senha, setSenha] = useState<string>(usuario?.senha || "#Senha123");
    const [ativo, setAtivo] = useState<boolean>(usuario?.ativo || false);
    const [horasTrabalho, setHorasTrabalho] = useState<string>(usuario?.horas_trabalho || "08:00 - 18:00");
    const [diasTrabalho, setDiasTrabalho] = useState<string[]>(usuario?.dias_trabalho?.split(",") || []);
    const [emailEmUso, setEmailEmUso] = useState<boolean>(false);
    const [perfisSelecionados, setPefisSelecionados] = useState<string[]>(usuario?.perfis?.map((p) => p.id) || []);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const verificarEmailEmUso = async (email: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (!isEditing && email) {
                const res = await buscarUsuarioPorEmail(email);
                console.log(res);
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
            setPefisSelecionados((prev) => prev.filter((pid) => pid !== id));
        } else {
            setPefisSelecionados((prev) => [...prev, id]);
        }
    };

    const handleSubmit = async () => {
        const usuarioData = {
            ...usuario,
            nome,
            telefone,
            ativo,
        };

        await onSave(usuarioData, perfisSelecionados);
    };

    const formatHorasTrabalho = (value: string): string => {
        const numericValue = value.replace(/[^0-9]/g, "");
        let formattedValue = numericValue;

        if (numericValue.length > 4) {
            formattedValue = `
                ${numericValue.slice(0, 2)}:${numericValue.slice(2, 4)} - ${numericValue.slice(4, 6)}:${numericValue.slice(6, 8)}
            `;
        } else if (numericValue.length > 2) {
            formattedValue = `${numericValue.slice(0, 2)}:${numericValue.slice(2)}`;
        }

        return formattedValue;
    }

    const validateHorasTrabalho = (horasTrabalho: string): boolean => {
        const parts = horasTrabalho.split(" - ");
        if (parts.length === 2) {
            const start = parts[0];
            const end = parts[1];
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            return timeRegex.test(start) && timeRegex.test(end);
        }
        return false;
    }

    useEffect(() => {
        if (isEditing && usuario?.permissoes) {
            setPefisSelecionados(usuario.permissoes.map((p) => p.id));
        }
    }, [isEditing, usuario]);

    return (
        <div
            className="
                fixed inset-0 bg-black bg-opacity-70 
                backdrop-blur-sm flex items-center 
                justify-center select-none
            "
        >
            <div className="flex flex-col bg-zinc-800 p-6 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-4">
                    {isEditing ? "Editar Usuário" : "Incluir Usuário"}
                </h2>

                <form className="grid grid-cols-1 sm:grid-cols-2 px-4 gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <CampoNome
                                value={nome}
                                ladoIcone="left"
                                onChangeText={setNome}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <CampoTelefone
                                telefoneValue={telefone}
                                onChangeText={setTelefone}
                                lable="Telefone"
                            />
                        </div>

                        {!isEditing && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <CampoEmail
                                        value={email}
                                        ladoIcone="left"
                                        iverterIcone
                                        onChangeText={
                                            (email) => {
                                                setEmail(email);
                                                verificarEmailEmUso(email);
                                            }
                                        }
                                    />

                                    {emailEmUso && !isEditing && (
                                        <div className="text-red-500 text-sm">
                                            Este email já está em uso.
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <CampoSenha
                                        id="senha"
                                        texto={senha}
                                        label="Senha Padrão"
                                        onChangeText={setSenha}
                                        somenteLeitura={true}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="horas_trabalho" className="text-xs text-zinc-300">
                                    Horas de Trabalho
                                </label>

                                <input
                                    type="text"
                                    name="horas_trabalho"
                                    value={horasTrabalho}
                                    onChange={(e) => {
                                        const formattedValue = formatHorasTrabalho(e.target.value);
                                        if (formattedValue.length <= 17) {
                                            setHorasTrabalho(formattedValue);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!validateHorasTrabalho(horasTrabalho)) {
                                            setHorasTrabalho("08:00 - 18:00");
                                        }
                                    }}
                                    placeholder="Ex: 08:00 - 18:00"
                                    className="
                                        p-2 bg-black rounded-md 
                                        border border-white/10 
                                        text-sm text-white -mt-1
                                    "
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
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
