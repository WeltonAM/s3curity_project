'use client'

import { IconEye, IconEyeOff, IconLock, IconMail, IconSignature } from "@tabler/icons-react";
import { useState } from "react";
import CampoEmail from "./CampoEmail";

export default function CadastroForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [nomeFocus, setnomeFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telefone, setTelefone] = useState('');
    const [codigoPais, setCodigoPais] = useState('+55');

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const montarTelefoneCompleto = (codigoPais: string, telefone: string) => {
        if (!telefone) return codigoPais;

        const numeroLimpo = telefone.replace(/\D/g, '');

        return `${codigoPais} ${numeroLimpo}`;
    };

    const formatarTelefone = (valor: string) => {
        const numeroLimpo = valor.replace(/\D/g, '').slice(0, 11);

        if (numeroLimpo.length <= 2) {
            return `(${numeroLimpo}`;
        } else if (numeroLimpo.length <= 7) {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2)}`;
        } else {
            return `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 7)}-${numeroLimpo.slice(7)}`;
        }
    };

    const handleCadastro = () => {
        const telefoneCompleto = montarTelefoneCompleto(codigoPais, telefone);
        console.log(nome, email, password, confirmPassword, telefoneCompleto);
    };

    const paises = [
        { nome: "Brasil", codigo: "+55", bandeira: "🇧🇷" },
        { nome: "EUA", codigo: "+1", bandeira: "🇺🇸" },
        { nome: "Portugal", codigo: "+351", bandeira: "🇵🇹" },
        { nome: "Argentina", codigo: "+54", bandeira: "🇦🇷" },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-10 rounded-md bg-zinc-900 select-none w-[420px]">

            <span className="font-bold">Cadastrar</span>

            <div className="flex flex-col w-full gap-4 mt-4">
                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="nome" className="text-xs text-zinc-300">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        autoComplete="username"
                        className="p-2 pl-10 bg-black rounded-md border border-white/10 text-sm text-white"
                        onFocus={() => setnomeFocus(true)}
                        onBlur={() => setnomeFocus(false)}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <IconSignature className={`absolute left-3 top-7 ${nomeFocus ? 'text-zinc-400' : 'text-zinc-600'}`} size={20} />
                </div>

                <CampoEmail value={email} onChangeText={setEmail} ladoIcone="left" iverterIcone />

                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="password" className="text-xs text-zinc-300">Senha</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        className="p-2 pl-10 bg-black rounded-md border border-white/10 text-sm text-white"
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <IconLock className={`absolute left-3 top-7 ${passwordFocus ? 'text-zinc-400' : 'text-zinc-600'}`} size={20} />

                    {passwordVisible ? (
                        <IconEyeOff
                            onClick={togglePasswordVisibility}
                            className={`absolute right-3 top-7 ${passwordFocus ? 'text-zinc-400' : 'text-zinc-600'} cursor-pointer`}
                            size={20}
                        />
                    ) : (
                        <IconEye
                            onClick={togglePasswordVisibility}
                            className={`absolute right-3 top-7 ${passwordFocus ? 'text-zinc-400' : 'text-zinc-600'} cursor-pointer`}
                            size={20}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="confirmPassword" className="text-xs text-zinc-300">Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="p-2 pl-10 bg-black rounded-md border border-white/10 text-sm text-white"
                        onFocus={() => setConfirmPasswordFocus(true)}
                        onBlur={() => setConfirmPasswordFocus(false)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <IconLock className={`absolute left-3 top-7 ${confirmPasswordFocus ? 'text-zinc-400' : 'text-zinc-600'}`} size={20} />
                </div>

                <div className="flex flex-col gap-1 relative mt-4">
                    <div className="flex items-center bg-black rounded-md border border-white/10 text-white">
                        <div className="flex items-center px-2">
                            <select
                                value={codigoPais}
                                onChange={(e) => setCodigoPais(e.target.value)}
                                className="bg-transparent text-md cursor-pointer"
                            >
                                {paises.map((pais) => (
                                    <option key={pais.codigo} value={pais.codigo} className="text-black">
                                        {pais.bandeira}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            className="p-2 flex-1 bg-transparent text-white text-md"
                            value={telefone}
                            maxLength={15}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                        />
                    </div>
                </div>

                <button className="bg-green-600 rounded-md text-sm py-2 font-bold hover:bg-green-500 hover:text-white mt-4" onClick={handleCadastro}>Cadastrar-se</button>

                <div className="flex flex-col gap-1 justify-center items-center">
                    <div className="flex gap-1 text-sm mt-2">
                        <span className="text-zinc-300">Já possui conta?</span>

                        <button className="text-green-500">Faça login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}