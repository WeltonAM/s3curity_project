import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react'
import { useState } from 'react'

export interface CampoSenhaProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChangeText?: (s: string) => void
    mostrarIconeCadeado?: boolean
}

export default function CampoSenha(props: CampoSenhaProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const togglePasswordVisibility = () => {
        setMostrarSenha(prevState => !prevState);
    };

    return (
        <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-xs text-zinc-300">Senha</label>
            <input
                type={mostrarSenha ? "text" : "password"}
                id="password"
                name="password"
                className={`p-2 ${props.mostrarIconeCadeado ? 'pl-10' : ''} bg-black rounded-md border border-white/10 text-sm text-white`}
                onChange={(e) => {
                    props.onChange?.(e)
                    props.onChangeText?.(e.target.value)
                }}
            />

            {props.mostrarIconeCadeado ? (
                <IconLock className={`absolute left-3 top-7 text-zinc-600`} size={20} />
            ) :
                null
            }


            {mostrarSenha ? (
                <IconEyeOff
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-7 text-zinc-600 cursor-pointer`}
                    size={20}
                />
            ) : (
                <IconEye
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-7 text-zinc-600 cursor-pointer`}
                    size={20}
                />
            )}
        </div>
    )
}