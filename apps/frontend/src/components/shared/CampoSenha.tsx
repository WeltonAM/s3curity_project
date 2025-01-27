import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import { useState } from 'react';

export interface CampoSenhaProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    texto?: string;
    label?: string;
    onChangeText?: (s: string) => void;
    mostrarIconeCadeado?: boolean;
    mostrarIconeSenha?: boolean;
    somenteLeitura?: boolean;
}

export default function CampoSenha(props: CampoSenhaProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const togglePasswordVisibility = () => {
        setMostrarSenha((prevState) => !prevState);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(e);
        props.onChangeText?.(e.target.value);
    };

    return (
        <div className="flex flex-col gap-1 relative">
            {
                props.label && (
                    <label htmlFor={props.id} className="text-xs text-zinc-300">
                        {props.label}
                    </label>
                )
            }

            <input
                type={mostrarSenha || props.somenteLeitura ? 'text' : 'password'}
                id={props.id}
                name={props.id}
                readOnly={props.somenteLeitura}
                value={props.texto || ''}
                className={`
                    ${props.mostrarIconeCadeado ? 'pl-10' : ''} 
                    p-2 bg-black rounded-md 
                    border border-white/10 
                    text-sm text-white
                `}
                onChange={handleChange}
            />

            {props.mostrarIconeCadeado && (
                <IconLock 
                    className={`
                        absolute left-3 text-zinc-400
                        ${props.label ? 'top-7' : 'top-2'}
                    `} 
                    size={20}
                />
            )}

            {props.mostrarIconeSenha && (
                mostrarSenha ? (
                    <IconEyeOff
                        onClick={togglePasswordVisibility}
                        className={`
                            absolute right-3 text-zinc-700 cursor-pointer
                            ${props.label ? 'top-7' : 'top-2'}
                        `}
                        size={20}
                    />
                ) : (
                    <IconEye
                        onClick={togglePasswordVisibility}
                        className={`
                            absolute right-3 text-zinc-700 cursor-pointer
                            ${props.label ? 'top-7' : 'top-2'}
                        `}
                        size={20}
                    />
                )
            )}
        </div>
    );
}
