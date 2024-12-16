'use client'

import { IconBrandGoogleFilled, IconEye, IconEyeOff, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import Logo from "../Logo";

export default function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  const handleLogin = () => {
    console.log(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center px-10 py-5 rounded-md bg-zinc-900 select-none">
      <Logo width={150} height={150} />

      <span className="font-bold">Entre com sua conta</span>

      <div className="flex flex-col w-full gap-2 mt-4">
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="email" className="text-xs text-zinc-300">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="p-2 bg-black rounded-md border border-white/10 text-sm text-white"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <IconMail className={`absolute right-3 top-7 ${emailFocus ? 'text-zinc-400' : 'text-zinc-600'}`} size={20} />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="text-xs text-zinc-300">Senha</label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            className="p-2 bg-black rounded-md border border-white/10 text-sm text-white"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            onChange={(e) => setPassword(e.target.value)}
          />
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

        <button className="text-xs text-zinc-500 ml-auto">Esqueceu sua senha?</button>

        <button className="bg-green-600 rounded-md text-sm py-2 hover:bg-green-500 hover:text-white" onClick={handleLogin}>Login</button>

        <div className="flex items-center justify-center my-2">
          <div className="border-t border-zinc-800 w-full"></div>
          <span className="mx-2 text-sm text-zinc-400">ou</span>
          <div className="border-t border-zinc-800 w-full"></div>
        </div>

        <div className="flex flex-col gap-1 justify-center items-center">
          <button className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
            <IconBrandGoogleFilled />
          </button>

          <div className="flex gap-1 text-sm mt-2">
            <span className="text-zinc-300">Ainda não possui uma conta?</span>

            <button className="text-green-500">Cadastre-se <span className="underline">aqui</span></button>
          </div>

          <span className="text-xs text-zinc-500">
            ou faça login pelo Google clicando no G acima.
          </span>
        </div>
      </div>
    </div>
  );
}