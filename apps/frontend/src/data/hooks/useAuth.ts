import { useContext, useTransition } from "react";
import useAPI from "./useApi";
import ContextoSessao from "@/data/contexts/ContextoSessao";
import { useRouter } from "next/navigation";
import useMensagem from "./useMensagem";
import { Usuario } from "@s3curity/core";

interface UseAuthResponse {
  isLoading: boolean;
  login: (email: string, password: string) => void;
  registrar: (usuario: Partial<Usuario>) => void;
  logout: () => void;
}

export default function useAuth(): UseAuthResponse {
  const [isPending, startTransition] = useTransition();
  const { httpPost } = useAPI();
  const { iniciarSessao, encerrarSessao } = useContext(ContextoSessao);
  const router = useRouter();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const login = (email: string, password: string) => {
    startTransition(() => {
      httpPost("/usuario/login", { email, senha: password })
        .then((response) => {
          const { token, message, status } = response;

          if (status !== 200) {
            return adicionarErro(message);
          }

          iniciarSessao(token);
          adicionarSucesso("Login realizado com sucesso!");
          router.push("/");
        })
        .catch(() => {});
    });
  };

  const registrar = (usuario: Partial<Usuario>) => {
    startTransition(() => {
      httpPost("/usuario/registrar", usuario)
        .then((response) => {
          const { status, message } = response;

          if (status !== 201) {
            return adicionarErro(message);
          }

          adicionarSucesso("Cadastro realizado com sucesso!");
          
          router.push("/login"); 
        })
        .catch(() => {});
    });
  };

  const logout = () => {
    encerrarSessao();
  };

  return {
    isLoading: isPending,
    login,
    registrar,
    logout,
  };
}
