import { useState, useEffect, useCallback, useTransition } from "react";
import useAPI from "./useApi";
import { Perfil } from "@s3curity/core";
import useMensagem from "./useMensagem";

interface UsePerfilResponse {
  isLoading: boolean;
  perfis: Partial<Perfil>[];
  buscarPerfilPorNome: (slug: string) => Promise<Partial<Perfil> | null>;
  salvarPerfil: (perfil: Partial<Perfil>) => Promise<void>;
  deletarPerfil: (id: string) => Promise<void>;
  relacionarPerfilComPermissao: (
    perfilId: string,
    permissoesIds: string[]
  ) => Promise<void>;
}

export default function usePerfil(): UsePerfilResponse {
  const [isLoading, startTransition] = useTransition();
  const [perfis, setPerfis] = useState<Partial<Perfil>[]>([]);
  const { httpGet, httpPost, httpDelete } = useAPI();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const buscarPerfilPorNome = useCallback(
    async (nome: string) => {
      try {
        const response = await httpGet(`/perfil/nome/${nome}`);
        const { status, perfil } = response;

        if (status !== 200) {
          return null;
        }

        return perfil;
      } catch (error) {
        console.error("Erro ao buscar perfil por nome:", error);
        return null;
      }
    },
    [httpGet]
  );

  const relacionarPerfilComPermissao = async (
    perfilId: string,
    permissoesIds: string[]
  ) => {
    try {
      console.log(perfilId, permissoesIds);
      if (!perfilId || permissoesIds.length === 0) {
        return adicionarErro("O perfil precisa ter ao menos uma permissão.");
      }

      const response = await httpPost("/perfil/relacionar", {
        perfilId,
        permissoesIds,
      });

      const { status, message } = response;

      if (status !== 200) {
        return adicionarErro(message || "Erro ao relacionar perfil.");
      }

    } catch (error) {
      console.error("Erro ao relacionar perfil com permissões:", error);
      adicionarErro("Falha ao relacionar perfil com permissões.");
    }
  };

  const salvarPerfil = async (perfil: Partial<Perfil>) => {
    startTransition(async () => {
      try {
        const response = await httpPost("/perfil/salvar", perfil);
        const { status, message } = response;

        if (status !== 201) {
          return adicionarErro(message);
        }

        adicionarSucesso("Perfil salvo com sucesso!");
        buscarTodosPerfis();
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        adicionarErro("Falha ao salvar perfil.");
      }
    });
  };

  const deletarPerfil = async (id: string) => {
    startTransition(async () => {
      try {
        const response = await httpDelete(`/perfil/${id}`);
        const { status, message } = response;

        if (status !== 200) {
          return adicionarErro(message);
        }

        adicionarSucesso("Perfil deletado com sucesso!");
        buscarTodosPerfis();
      } catch (error) {
        console.error("Erro ao deletar perfil:", error);
        adicionarErro("Falha ao deletar perfil.");
      }
    });
  };

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

  return {
    perfis,
    isLoading,
    buscarPerfilPorNome,
    salvarPerfil,
    deletarPerfil,
    relacionarPerfilComPermissao,
  };
}
