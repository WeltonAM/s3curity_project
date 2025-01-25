import { useState, useEffect, useCallback, useTransition } from "react";
import { Usuario } from "@s3curity/core";
import useAPI from "./useApi";
import useMensagem from "./useMensagem";

interface UseUsuarioResponse {
  isLoading: boolean;
  usuarios: Partial<Usuario>[];
  buscarTodosUsuarios: () => Promise<void>;
  buscarUsuarioPorEmail: (email: string) => Promise<Partial<Usuario> | null>;
  salvarUsuario: (usuario: Partial<Usuario>) => Promise<void>;
}

export default function useUsuario(): UseUsuarioResponse {
  const [isLoading, startTransition] = useTransition();
  const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);
  const { httpGet, httpPost } = useAPI();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const buscarUsuarioPorEmail = useCallback(
    async (email: string): Promise<Partial<Usuario> | null> => {
      try {
        const response = await httpGet(`/usuario/email/${email}`);
        const { status, usuario } = response;

        if (status !== 200) {
          return null;
        }

        return usuario;
      } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        return null;
      }
    },
    [httpGet]
  );

  const buscarTodosUsuarios = useCallback(async () => {
    startTransition(async () => {
      try {
        const response = await httpGet("/usuario/todos");
        const { status, usuarios } = response;

        if (status === 200) {
          setUsuarios(usuarios);
        }
      } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
        adicionarErro("Falha ao buscar usuários.");
      }
    });
  }, [httpGet, adicionarErro]);

  const salvarUsuario = useCallback(async (usuario: Partial<Usuario>) => {
    try {
      const response = await httpPost("/usuario/registrar", usuario);
      const { status, message } = response;

      if (status === 201) {
        adicionarSucesso(message);
        buscarTodosUsuarios(); 
      } else {
        adicionarErro(message || "Erro ao salvar usuário.");
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      adicionarErro("Falha ao salvar usuário.");
    }
  }, [httpPost, adicionarErro, adicionarSucesso, buscarTodosUsuarios]);

  useEffect(() => {
    buscarTodosUsuarios();
  }, [buscarTodosUsuarios]);

  return {
    isLoading,
    usuarios,
    buscarTodosUsuarios,
    buscarUsuarioPorEmail,
    salvarUsuario,
  };
}
