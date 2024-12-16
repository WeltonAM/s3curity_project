'use client'

import CadastroForm from "@/components/shared/auth/CadastroForm";
// import LoginForm from "@/components/shared/auth/LoginForm";
import Pagina from "@/components/template/Pagina";

export default function Autenticacao() {
  return (
    <Pagina>
      {/* <LoginForm /> */}
      <CadastroForm />
    </Pagina>
  );
}
