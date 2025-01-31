/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Usuario } from '@s3curity/core'

interface Sessao {
    token: string | null
    usuario: Partial<Usuario> | null
}

interface ContextoSessaoProps {
    carregando: boolean
    token: string | null
    usuario: Partial<Usuario> | null
    iniciarSessao: (token: string) => void
    encerrarSessao: () => void
    atualizarUsuarioSessao: (novosDados: Partial<Usuario>) => void
}

const ContextoSessao = createContext<ContextoSessaoProps>({} as ContextoSessaoProps)
export default ContextoSessao

export function ProvedorSessao(props: { children: React.ReactNode }) {
    const nomeCookie = '_s3curity_token'

    const [carregando, setCarregando] = useState(true)
    const [sessao, setSessao] = useState<Sessao>({ token: null, usuario: null })

    const carregarSessao = useCallback(function () {
        try {
            setCarregando(true)
            const sessao = obterSessao()
            setSessao(sessao)
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        carregarSessao()
    }, [carregarSessao])

    function iniciarSessao(token: string) {
        cookie.set(nomeCookie, token, { expires: 1 })
        const sessao = obterSessao()
        setSessao(sessao)
    }

    function encerrarSessao() {
        cookie.remove(nomeCookie)
        setSessao({ token: null, usuario: null })
    }

    function obterSessao(): Sessao {
        const token = cookie.get(nomeCookie)

        if (!token) {
            return { token: null, usuario: null }
        }

        try {
            const payload: any = jwtDecode(token)
            const valido = payload.exp! > Date.now() / 1000

            if (!valido) {
                return { token: null, usuario: null }
            }

            return {
                token,
                usuario: {
                    id: payload.id,
                    nome_completo: payload.nome_completo,
                    email: payload.email,
                    telefone: payload.telefone,
                    url_imagem_perfil: payload.url_imagem_perfil,
                    dois_fatores_ativado: payload.dois_fatores_ativado,
                    perfis: payload.perfis,
                    permissoes: payload.permissoes,
                },
            }
        } catch (e: any) {
            return { token: null, usuario: null }
        }
    }

    function atualizarUsuarioSessao(novosDados: Partial<Usuario>) {
        setSessao((sessaoAtual) => ({
            ...sessaoAtual,
            usuario: {
                ...sessaoAtual.usuario,
                ...novosDados,
            },
        }));
    }    

    return (
        <ContextoSessao.Provider
            value={{
                carregando,
                token: sessao.token,
                usuario: sessao.usuario,
                iniciarSessao,
                encerrarSessao,
                atualizarUsuarioSessao,
            }}
        >
            {props.children}
        </ContextoSessao.Provider>
    )
}