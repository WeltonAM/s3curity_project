import { useContext, useTransition, useState } from "react";
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
  solicitarRecuperacao: (email: string) => Promise<void>;
  verificarTokenRecuperacao: (
    token: string
  ) => Promise<{ status: number; message: string; email?: string }>;
  recuperarSenha: (
    token: string,
    novaSenha: string,
    confirmarSenha: string
  ) => Promise<{ status: number; message: string }>;
  gerarQrCode: (email: string) => Promise<void>;
  qrCodeUrl: string | null;
  verificarTokenLogin: (token: string) => Promise<void>;
  loginComProvedor: (token: string, provedor: string) => Promise<void>;
}

export default function useAuth(): UseAuthResponse {
  const [isPending, startTransition] = useTransition();
  const { httpPost, httpPut, httpGet } = useAPI();
  const { iniciarSessao, encerrarSessao } = useContext(ContextoSessao);
  const router = useRouter();
  const { adicionarErro, adicionarSucesso } = useMensagem();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    startTransition(() => {
      httpPost("/auth/login", { email, senha: password })
        .then((response) => {
          const { token, message, status } = response;

          if (status !== 200) {
            return adicionarErro(message);
          }

          if (message.includes("Verificação enviada por e-mail")) {
            return adicionarSucesso(message);
          } else {
            iniciarSessao(token);
            adicionarSucesso("Login realizado com sucesso!");
            router.push("/");
          }
        })
        .catch(() => {});
    });
  };

  const registrar = (usuario: Partial<Usuario>) => {
    startTransition(() => {
      httpPost("/auth/registrar", usuario)
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

  const solicitarRecuperacao = async (email: string) => {
    try {
      const response = await httpPut("/auth/solicitar-recuperacao", {
        email,
      });

      if (response.status === 200) {
        adicionarSucesso(response.message);
      } else {
        adicionarErro("Erro ao solicitar recuperação de senha.");
      }

      return response;
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      adicionarErro("Erro ao solicitar recuperação de senha.");
      return {
        status: 400,
        message: "Erro ao solicitar recuperação de senha.",
      };
    }
  };

  const verificarTokenRecuperacao = async (
    token: string
  ): Promise<{ status: number; message: string; email?: string }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const response = await httpGet(`/auth/verificar-token/${token}`);

          if (response.status === 200) {
            resolve({
              status: 200,
              message: "Token válido.",
              email: response.email,
            });
          } else {
            adicionarErro(response.message);
            resolve({
              status: response.status,
              message: response.message,
            });
          }
        } catch (error) {
          console.error("Erro ao verificar token de recuperação:", error);
          adicionarErro("Erro ao verificar token de recuperação.");
          resolve({
            status: 400,
            message: "Erro ao verificar token de recuperação.",
          });
        }
      });
    });
  };

  const recuperarSenha = async (
    token: string,
    novaSenha: string,
    confirmarSenha: string
  ): Promise<{ status: number; message: string }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const response = await httpPut("/auth/recuperar-senha", {
            token,
            novaSenha,
            confirmarSenha,
          });

          if (response.status === 200) {
            adicionarSucesso("Senha alterada com sucesso!");
            resolve({
              status: 200,
              message: "Senha alterada com sucesso!",
            });
          } else {
            adicionarErro(response.message);
            resolve({
              status: response.status,
              message: response.message,
            });
          }
        } catch (error) {
          console.error("Erro ao recuperar senha:", error);
          adicionarErro("Erro ao recuperar senha.");
          resolve({
            status: 400,
            message: "Erro ao recuperar senha.",
          });
        }
      });
    });
  };

  const gerarQrCode = async (email: string) => {
    startTransition(async () => {
      try {
        const response = await httpPost("/auth/gerar-qr-code", { email });

        setQrCodeUrl(response.qrCodeUrl);
        if (response.status === 200) {
          setQrCodeUrl(response.qrCodeUrl);
          console.log(qrCodeUrl);
        }
      } catch (error) {
        console.log("Erro ao gerar QR Code", error);
        adicionarErro("Erro ao gerar QR Code");
      }
    });
  };

  const verificarTokenLogin = async (token: string) => {
    try {
      const response = await httpPost("/auth/login-token", { token });

      if (response.status === 200) {
        const { token: userToken } = response;
        iniciarSessao(userToken);
        adicionarSucesso("Login realizado com sucesso!");
        router.push("/");
      } else {
        adicionarErro(response.message);
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao realizar login.", error);
      adicionarErro("Erro ao realizar login.");
      router.push("/login");
    }
  };

  const loginComProvedor = async (token: string, provedor: string) => {
    try {
      const response = await httpPost("/auth/login/provedor", {
        token,
        provedor,
      });

      if (response.status === 200) {
        const { token: userToken } = response;
        iniciarSessao(userToken);
        adicionarSucesso("Login com provedor realizado com sucesso!");
        router.push("/");
      } else {
        adicionarErro(response.message);
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao realizar login com provedor", error);
      adicionarErro("Erro ao realizar login com provedor.");
      router.push("/login");
    }
  };

  const logout = () => {
    encerrarSessao();
  };

  return {
    isLoading: isPending,
    login,
    registrar,
    logout,
    solicitarRecuperacao,
    recuperarSenha,
    verificarTokenRecuperacao,
    gerarQrCode,
    qrCodeUrl,
    verificarTokenLogin,
    loginComProvedor,
  };
}
