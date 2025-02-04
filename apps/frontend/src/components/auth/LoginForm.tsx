/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSessao from '@/data/hooks/useSessao';
import { IconLoader } from '@tabler/icons-react';
import { useState } from 'react';
import Logo from '../shared/Logo';
import CampoEmail from '../shared/CampoEmail';
import CampoSenha from '../shared/CampoSenha';
import Link from 'next/link';
import useAuth from '@/data/hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const { login, isLoading, loginComProvedor } = useAuth();
  const { usuario } = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (usuario?.email) {
      router.push('/');
    }
  }, [usuario, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    const { credential } = response;
    await loginComProvedor(credential, 'google');
  };

  return (
    <div className="flex flex-col items-center justify-center px-10 py-5 rounded-md bg-zinc-900 select-none">
      <Logo width={150} height={150} />
      <span className="font-bold">Entre com sua conta</span>

      <div className="flex flex-col w-full gap-2 mt-4">
        <CampoEmail value={email} onChangeText={setEmail} ladoIcone="right" />

        <CampoSenha
          label="Senha"
          id="password"
          texto={password}
          mostrarIconeSenha
          onChangeText={setPassword}
        />

        <Link href="novaSenha" className="text-xs text-zinc-500 ml-auto">
          Esqueceu sua senha?
        </Link>

        <button
          className={`bg-green-600 rounded-md text-sm py-2 font-bold 
            hover:bg-green-500 hover:text-white ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          <span className="flex items-center justify-center gap-1">
            {isLoading ? <IconLoader className="animate-spin" /> : 'Login'}
          </span>
        </button>

        <div className="flex items-center justify-center my-2">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="mx-2 text-sm text-zinc-400">ou</span>
          <div className="border-t border-zinc-800 w-full"></div>
        </div>

        <div className="flex flex-col gap-1 justify-center items-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
          />

          <div className="flex gap-1 text-sm mt-2">
            <span className="text-zinc-300">Ainda não possui uma conta?</span>
            <Link href="cadastro" className="text-green-500">
              Cadastre-se <span className="underline">aqui</span>
            </Link>
          </div>

          <span className="text-xs text-zinc-500">
            ou faça login pelo Google clicando no G acima.
          </span>
        </div>
      </div>
    </div>
  );
}
