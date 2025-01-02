/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSessao from '@/data/hooks/useSessao'
import Carregando from '../shared/Carregando'

export default function ForcarAutenticacao(props: any) {
    const { usuario, carregando } = useSessao()
    const router = useRouter()

    useEffect(() => {
        if (!carregando && !usuario?.email) {
            router.push('/login')
        }
    }, [carregando, usuario, router])

    if (carregando || !usuario?.email) {
        return <Carregando />
    }

    return props.children
}
