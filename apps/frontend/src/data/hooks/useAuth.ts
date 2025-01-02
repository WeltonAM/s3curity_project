import { useState, useContext } from "react";
import useAPI from "./useApi";
import ContextoSessao from "@/data/contexts/ContextoSessao";
import { useRouter } from "next/navigation";

interface UseAuthResponse {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
}

export default function useAuth(): UseAuthResponse {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { httpPost } = useAPI();
  const { iniciarSessao } = useContext(ContextoSessao);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpPost("/usuario/login", {
        email,
        senha: password,
      });

      const { token } = response;

      iniciarSessao(token);

      router.push("/"); 

      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao realizar login. Verifique suas credenciais.");
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    login,
  };
}
