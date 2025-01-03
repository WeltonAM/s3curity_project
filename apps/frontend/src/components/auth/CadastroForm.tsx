'use client'

import { useState } from "react";
import CampoEmail from "../shared/CampoEmail";
import CampoNome from "../shared/CampoNome";
import CampoSenha from "../shared/CampoSenha";
import Link from "next/link";
import CampoTelefone from "../shared/CampoTelefone";
import useAuth from "@/data/hooks/useAuth";
import useMensagem from "@/data/hooks/useMensagem";

export default function CadastroForm() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [telefone, setTelefone] = useState('');

    const { isLoading, registrar } = useAuth();

    const { adicionarErro } = useMensagem();

    const validateNome = (nome: string) => {
        if (nome.trim().length < 3) {
            return "O nome deve ter pelo menos 3 caracteres.";
        }

        if (!nome.includes(" ")) {
            return "O nome precisa incluir pelo menos o sobrenome.";
        }

        if (nome.trim().length > 150) {
            return "O nome não pode ter mais de 150 caracteres.";
        }

        return "";
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return "Por favor, insira um email válido.";
        }

        return "";
    };

    const validateSenha = (senha: string) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/;
        if (!regex.test(senha)) {
            return "A senha deve ter pelo menos 8 caracteres, incluindo uma letra minúscula, maiúscula e um caractere especial.";
        }

        return "";
    };

    const validateConfirmPassword = (confirmPassword: string, password: string) => {
        if (confirmPassword !== password) {
            return "As senhas não coincidem.";
        }

        return "";
    };

    const validateTelefone = (telefone: string) => {
        const telefoneLimpo = telefone.replace(/\D/g, '');

        const regex = /^[0-9]+$/;

        if (!regex.test(telefoneLimpo)) {
            return "O telefone deve conter apenas números.";
        }

        return "";
    };

    const handleCadastro = () => {
        const erros: string[] = [];

        const nomeError = validateNome(nome);
        if (nomeError) erros.push(nomeError);

        const emailError = validateEmail(email);
        if (emailError) erros.push(emailError);

        const senhaError = validateSenha(password);
        if (senhaError) erros.push(senhaError);

        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
        if (confirmPasswordError) erros.push(confirmPasswordError);

        const telefoneError = validateTelefone(telefone);
        if (telefoneError) erros.push(telefoneError);

        if (password !== confirmPassword) {
            erros.push("As senhas não coincidem.");
        }

        if (erros.length > 0) {

            erros.forEach((erro) => {
                return adicionarErro(erro);
            });

            return;
        }

        registrar({
            nome_completo: nome,
            email: email,
            senha: password,
            telefone: telefone
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-10 rounded-md bg-zinc-900 select-none w-[420px]">
            <span className="font-bold">Cadastrar</span>
            <div className="flex flex-col w-full gap-4 mt-4">
                <CampoNome ladoIcone="left" onChangeText={setNome} value={nome} onChange={(e) => setNome(e.target.value)} />
                <CampoEmail value={email} onChangeText={setEmail} ladoIcone="left" iverterIcone />
                <CampoSenha id="password" texto="Senha" mostrarIconeSenha mostrarIconeCadeado value={password} onChangeText={setPassword} />
                <CampoSenha id="confirmPassword" texto="Confirme a senha" mostrarIconeCadeado value={confirmPassword} onChangeText={setConfirmPassword} />
                <CampoTelefone value={telefone} onChangeText={setTelefone} outerClassName="mt-4" />

                <button
                    className="bg-green-600 rounded-md text-sm py-2 font-bold hover:bg-green-500 hover:text-white mt-4"
                    onClick={handleCadastro}
                    disabled={isLoading}
                >
                    {isLoading ? "Cadastrando..." : "Cadastrar-se"}
                </button>

                <div className="flex flex-col gap-1 justify-center items-center">
                    <div className="flex gap-1 text-sm mt-2">
                        <span className="text-zinc-400">Já possui conta?</span>
                        <Link href='login' className="text-green-500">Faça login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
