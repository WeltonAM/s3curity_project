import useSessao from "@/data/hooks/useSessao";
import { Permissao } from "@s3curity/core";
import { useCallback, useEffect, useState, useTransition } from "react";
import useAPI from "./useApi";
import useMensagem from "./useMensagem";

interface UsePermissaoResponse {
  isLoading: boolean;
  permissoes: Partial<Permissao>[];
  possuiPermissao: (permissao: string) => boolean;
  buscarPermissaoPorId: (id: string) => Promise<Partial<Permissao> | null>;
  salvarPermissao: (permissao: Partial<Permissao>) => Promise<void>;
  buscarPermissaoPorSlug: (slug: string) => Promise<Partial<Permissao> | null>;
  deletarPermissao: (id: string) => Promise<void>;
}

export default function usePermissao(): UsePermissaoResponse {
  const [isLoading, startTransition] = useTransition();
  const [permissoes, setPermissoes] = useState<Partial<Permissao>[]>([]);
  const { usuario } = useSessao();
  const { httpGet, httpPost, httpDelete } = useAPI();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const possuiPermissao = (permissao: string): boolean => {
    return usuario?.permissoes?.some((p) => p.nome === permissao) || false;
  };

  const buscarTodasPermissoes = useCallback(async () => {
    startTransition(async () => {
      try {
        const response = await httpGet("/permissao/todas");
        const { permissoes, status } = response;

        if (status === 200) {
          setPermissoes(permissoes);
        }
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    });
  }, [httpGet]);

  const buscarPermissaoPorId = useCallback(
    async (id: string): Promise<Partial<Permissao> | null> => {
      try {
        const response = await httpGet(`/permissao/${id}`);
        const { status, permissao } = response;

        if (status === 200) {
          return permissao;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Erro ao buscar permissão por ID:", error);
        return null;
      }
    },
    [httpGet]
  );

  const buscarPermissaoPorSlug = useCallback(
    async (slug: string) => {
      try {
        const response = await httpGet(`/permissao/slug/${slug}`);
        const { status, permissao } = response;

        if (status !== 200) {
          return null;
        }

        return permissao;
      } catch (error) {
        console.error("Erro ao buscar permissão por slug:", error);
        return null;
      }
    },
    [httpGet]
  );

  const salvarPermissao = async (permissao: Partial<Permissao>) => {
    startTransition(async () => {
      try {
        const response = await httpPost("/permissao/salvar", permissao);
        const { status, message } = response;

        if (status !== 201) {
          return adicionarErro(message);
        }

        adicionarSucesso("Permissão salva com sucesso!");
        buscarTodasPermissoes();
      } catch (error) {
        console.error("Erro ao salvar permissão:", error);
        adicionarErro("Falha ao salvar permissão.");
      }
    });
  };

  const deletarPermissao = async (id: string) => {
    startTransition(async () => {
      try {
        const response = await httpDelete(`/permissao/${id}`);
        const { status, message } = response;

        if (status !== 200) {
          return adicionarErro(message); 
        }

        adicionarSucesso("Permissão deletada com sucesso!");
        buscarTodasPermissoes();
      } catch (error) {
        console.error("Erro ao deletar permissão:", error);
        adicionarErro("Falha ao deletar permissão.");
      }
    });
  };

  useEffect(() => {
    buscarTodasPermissoes();
  }, [buscarTodasPermissoes]);

  return {
    isLoading,
    permissoes,
    possuiPermissao,
    buscarPermissaoPorId,
    salvarPermissao,
    buscarPermissaoPorSlug,
    deletarPermissao,
  };
}
