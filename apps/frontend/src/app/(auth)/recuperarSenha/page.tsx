'use client';

import CampoSenha from "@/components/shared/CampoSenha";
import Carregando from "@/components/shared/Carregando";
import useAuth from "@/data/hooks/useAuth";
import useMensagem from "@/data/hooks/useMensagem";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecuperarSenha() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [isVerificandoToken, setIsVerificandoToken] = useState(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { verificarTokenRecuperacao, recuperarSenha } = useAuth();
    const { adicionarErro, adicionarSucesso } = useMensagem();

    const handleRecuperarSenha = async () => {
        if (novaSenha !== confirmarSenha) {
            adicionarErro("As senhas não coincidem!");
            return;
        }

        const response = await recuperarSenha(token!, novaSenha, confirmarSenha);

        if (response.status === 200) {
            adicionarSucesso("Senha alterada com sucesso!");
            router.push("/login");
        } else {
            adicionarErro(response.message);
        }
    };

    useEffect(() => {
        const tokenFromURL = searchParams.get("token");

        verificarTokenRecuperacao(tokenFromURL!).then((response) => {
            if (response.status !== 200) {
                adicionarErro(response.message);
                router.push("/login");
            } else {
                setToken(tokenFromURL);
            }

            setIsVerificandoToken(false);
        });

    }, [router, verificarTokenRecuperacao, searchParams, adicionarErro]);

    if (isVerificandoToken) {
        return <Carregando />;
    }

    return (
        <div className="flex flex-col items-center justify-center p-10 rounded-md bg-zinc-900 select-none w-[420px] gap-3">
            <span className="font-bold">Recuperar Senha</span>

            <div className="flex flex-col w-full gap-4">
                <CampoSenha
                    label="Senha"
                    id="novaSenha"
                    texto={novaSenha}
                    mostrarIconeSenha
                    mostrarIconeCadeado
                    onChangeText={setNovaSenha}
                />

                <CampoSenha
                    label="Confirmar senha"
                    id="confirmarSenha"
                    texto={confirmarSenha}
                    mostrarIconeSenha
                    mostrarIconeCadeado
                    onChangeText={setConfirmarSenha}
                />

                <button
                    onClick={handleRecuperarSenha}
                    className="
                        bg-green-600 rounded-md text-sm py-2 
                        font-bold hover:bg-green-500 hover:text-white
                    "
                >
                    Alterar Senha
                </button>
            </div>
        </div>
    );
}
