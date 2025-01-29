'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; 
import useUsuario from "@/data/hooks/useUsuario";

export default function RecuperarSenha() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const { recuperarSenha } = useUsuario();

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            setToken(token as string);
        }
    }, [router.query]);

    const handleRecuperarSenha = async () => {
        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        const response = await recuperarSenha(token!, novaSenha, confirmarSenha);

        if (response.status === 200) {
            alert('Senha alterada com sucesso!');
            router.push("/login");
        } else {
            alert('Erro ao alterar a senha');
        }
    };

    return (
        <div>
            <h1>Recuperar Senha</h1>
            <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <button onClick={handleRecuperarSenha}>Alterar Senha</button>
        </div>
    );
}
