import { useContext, useTransition } from "react";
import useAPI from "./useApi";
import ContextoSessao from "@/data/contexts/ContextoSessao";
import { useRouter } from "next/navigation";
import useMensagem from "./useMensagem";

interface UseAuthResponse {
  isLoading: boolean;
  login: (email: string, password: string) => void;
}

export default function useAuth(): UseAuthResponse {
  const [isPending, startTransition] = useTransition();
  const { httpPost } = useAPI();
  const { iniciarSessao } = useContext(ContextoSessao);
  const router = useRouter();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const login = (email: string, password: string) => {
    startTransition(() => {
      httpPost("/usuario/login", { email, senha: password })
        .then((response) => {
          const { token, message } = response;

          if (!token) {
            console.log(response)
            return adicionarErro(message);
          }

          iniciarSessao(token);

          adicionarSucesso("Login realizado com sucesso!");

          router.push("/");
        })
        .catch((err) => {
          adicionarErro(err.message);
        });
    });
  };

  return {
    isLoading: isPending,
    login,
  };
}
