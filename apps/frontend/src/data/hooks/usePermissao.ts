import useSessao from "@/data/hooks/useSessao";
import { Permissao } from "@s3curity/core";
import { useCallback, useEffect, useState, useTransition } from "react";
import useAPI from "./useApi";

interface UsePermissaoResponse {
  isLoading: boolean;
  permissoes: Partial<Permissao>[];
  possuiPermissao: (permissao: string) => boolean;
}

export default function usePermissao(): UsePermissaoResponse {
  const [isLoading, startTransition] = useTransition();
  const [permissoes, setPermissoes] = useState<Partial<Permissao>[]>([]);
  const { usuario } = useSessao();
  const { httpGet } = useAPI();

  const possuiPermissao = (permissao: string): boolean => {
    return usuario?.permissoes?.some((p) => p.nome === permissao) || false;
  };

  const buscarTodasPermissoes = useCallback(async () => {
    startTransition(() => {
      httpGet("/permissao/todas")
        .then((response) => {
          const { permissoes, status } = response;

          if (status !== 200) {
            return;
          }

          setPermissoes(permissoes);
        })
        .catch(() => {});
    });
  }, [httpGet]);

  useEffect(() => {
    buscarTodasPermissoes();
  }, [buscarTodasPermissoes]);

  return { isLoading, permissoes, possuiPermissao };
}
