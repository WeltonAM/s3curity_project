import { useState, useEffect, useCallback, useTransition } from "react";
import { Usuario } from "@s3curity/core";
import useAPI from "./useApi";
import useMensagem from "./useMensagem";

interface UseUsuarioResponse {
  isLoading: boolean;
  usuarios: Partial<Usuario>[];
  buscarTodosUsuarios: () => Promise<void>;
  buscarUsuarioPorEmail: (email: string) => Promise<Partial<Usuario> | null>;
  salvarUsuario: (
    usuario: Partial<Usuario>
  ) => Promise<Partial<Usuario> | null>;
  relacionarUsuarioComPerfis: (
    usuarioId: string,
    perfisIds: string[]
  ) => Promise<void>;
  deletarUsuario: (usuarioId: string) => void;
}

export default function useUsuario(): UseUsuarioResponse {
  const [isLoading, startTransition] = useTransition();
  const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);
  const { httpGet, httpPost, httpDelete } = useAPI();
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

  const relacionarUsuarioComPerfis = useCallback(
    async (usuarioId: string, perfisIds: string[]) => {
      try {
        const response = await httpPost(`/usuario/relacionar-perfis`, {
          usuarioId,
          perfisIds,
        });

        const { status, message } = response;

        if (status !== 200) {
          adicionarErro("Erro ao relacionar perfis.");
        }

        return message;
      } catch (error) {
        console.error("Erro ao relacionar perfis:", error);
        adicionarErro("Falha ao relacionar perfis.");
      }
    },
    [httpPost, adicionarErro]
  );

  const deletarUsuario = useCallback(
    (usuarioId: string) => {
      startTransition(async () => {
        try {
          const response = await httpDelete(`/usuario/deletar/${usuarioId}`);
          const { status, message } = response;

          if (status === 200) {
            buscarTodosUsuarios();
            adicionarSucesso("Usuário deletado com sucesso.");
          } else {
            adicionarErro(message || "Erro ao deletar usuário.");
          }
        } catch (error) {
          console.error("Erro ao deletar usuário:", error);
          adicionarErro("Falha ao deletar usuário.");
        }
      });
    },
    [httpDelete, adicionarErro, adicionarSucesso, buscarTodosUsuarios]
  );

  const salvarUsuario = useCallback(
    async (usuario: Partial<Usuario>): Promise<Partial<Usuario> | null> => {
      try {
        const response = await httpPost("/usuario/registrar", usuario);
        const { status, message, novoUsuario } = response;

        if (status === 201) {
          buscarTodosUsuarios();
          adicionarSucesso("Usuário salvo com sucesso.");

          return novoUsuario;
        } else {
          adicionarErro(message || "Erro ao salvar usuário.");
        }
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        adicionarErro("Falha ao salvar usuário.");
      }

      return null;
    },
    [httpPost, adicionarErro, adicionarSucesso, buscarTodosUsuarios]
  );

  useEffect(() => {
    buscarTodosUsuarios();
  }, [buscarTodosUsuarios]);

  return {
    isLoading,
    usuarios,
    buscarTodosUsuarios,
    buscarUsuarioPorEmail,
    salvarUsuario,
    relacionarUsuarioComPerfis,
    deletarUsuario,
  };
}
