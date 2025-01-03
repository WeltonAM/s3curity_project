'use client';

import { IconX } from "@tabler/icons-react";
import { Mensagem } from "@/data/contexts/ContextoMensagem";
import useMensagem from "@/data/hooks/useMensagem";

export default function Mensagens() {
    const { mensagens, excluir } = useMensagem();

    function renderizarMensagem(msg: Mensagem) {
        return (
            <div
                key={msg.texto}
                className={`flex items-center gap-2 p-4 rounded-md shadow-md mb-2 transition-transform transform max-w-80 ${
                    msg.tipo === "sucesso" ? "bg-green-400" : "bg-red-400"
                }`}
            >
                <div className="mr-3">
                    <h1 className="text-lg font-semibold">
                        {msg.tipo === "sucesso" ? "Sucesso" : "Erro"}
                    </h1>
                    <p>{msg.texto}</p>
                </div>

                <button onClick={() => excluir(msg)} className="ml-auto">
                    <div
                        className={`${
                            msg.tipo === "sucesso" ? "bg-green-500" : "bg-red-500"
                        } rounded-full p-2 flex items-center justify-center`}
                    >
                        <IconX size={20} />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
            {mensagens.length > 0 && renderizarMensagem(mensagens[0])}
        </div>
    );
}
