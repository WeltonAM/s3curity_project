import { useState, useEffect, useCallback, useTransition } from "react";
import useAPI from "./useApi";
import { Perfil } from "@s3curity/core";

interface UsePerfilResponse {
  isLoading: boolean;
  perfis: Partial<Perfil>[];
}

export default function usePerfil(): UsePerfilResponse {
  const [isLoading, startTransition] = useTransition();
  const [perfis, setPerfis] = useState<Partial<Perfil>[]>([]);
  const { httpGet } = useAPI();

  const buscarTodosPerfis = useCallback(async () => {
    startTransition(() => {
      httpGet("/perfil/todos")
        .then((response) => {
          const { perfis, status } = response;

          if (status !== 200) {
            return;
          }

          setPerfis(perfis);
        })
        .catch(() => {});
    });
  }, [httpGet]);

  useEffect(() => {
    buscarTodosPerfis();
  }, [buscarTodosPerfis]);

  return { perfis, isLoading };
}
