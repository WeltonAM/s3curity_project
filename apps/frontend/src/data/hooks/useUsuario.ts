import { useState, useEffect, useCallback, useTransition } from "react";
import { Usuario } from "@s3curity/core";
import useAPI from "./useApi";
import useMensagem from "./useMensagem";

interface UseUsuarioResponse {
  isLoading: boolean;
  usuarios: Partial<Usuario>[];
  buscarTodosUsuarios: () => Promise<void>;
}

export default function useUsuario(): UseUsuarioResponse {
  const [isLoading, startTransition] = useTransition();
  const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);
  const { httpGet } = useAPI();
  const { adicionarErro } = useMensagem();

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

  useEffect(() => {
    buscarTodosUsuarios();
  }, [buscarTodosUsuarios]);

  return {
    isLoading,
    usuarios,
    buscarTodosUsuarios,
  };
}
