/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { createContext, useState } from "react"

export type Mensagem = {
    tipo: "erro" | "sucesso"
    texto: string
    tempo?: number
}

interface ContextoMensagemProps {
    mensagens: Mensagem[]
    adicionarSucesso: (texto: string, tempo?: number) => void
    adicionarErro: (texto: string, tempo?: number) => void
    excluir: (msg: Mensagem) => void
}

const ContextoMensagem = createContext<ContextoMensagemProps>({} as any)

export function ProvedorMensagem(props: any) {
    const [mensagens, setMensagens] = useState<Mensagem[]>([])

    function jaExiste(mensagens: Mensagem[], msg: Mensagem) {
        return mensagens.some((m) => {
            return (
                JSON.stringify(m.texto) === JSON.stringify(msg.texto) &&
                m.tipo === msg.tipo
            )
        })
    }

    function adicionar(mensagens: Mensagem[], msg: Mensagem) {
        if (jaExiste(mensagens, msg)) return
        setMensagens((mensagens) => [...mensagens, msg])
        if (msg.tempo) {
            setTimeout(() => excluir(msg), msg.tempo)
        }
    }

    function adicionarSucesso(texto: string) {
        adicionar(mensagens, { tipo: "sucesso", texto, tempo: 5000 })
    }

    function adicionarErro(texto: string) {
        adicionar(mensagens, { tipo: "erro", texto, tempo: 7000 })
    }

    function excluir(msg: Mensagem) {
        setMensagens((mensagens) => mensagens.filter((m) => m !== msg))
    }

    return (
        <ContextoMensagem.Provider
            value={{
                mensagens,
                adicionarSucesso,
                adicionarErro,
                excluir,
            }}
        >
            {props.children}
        </ContextoMensagem.Provider>
    )
}

export default ContextoMensagem