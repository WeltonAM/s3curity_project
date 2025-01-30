/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
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
    usuario: Partial<Usuario>,
    perfisIds: string[]
  ) => Promise<void>;
  deletarUsuario: (usuarioEmail: string) => void;
  atualizarUsuario: (
    usuario: Partial<Usuario>
  ) => Promise<Partial<Usuario> | null>;
}

export default function useUsuario(): UseUsuarioResponse {
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<Partial<Usuario>[]>([]);
  const { httpGet, httpPost, httpDelete, httpPut } = useAPI();
  const { adicionarErro, adicionarSucesso } = useMensagem();

  const buscarUsuarioPorEmail = useCallback(
    async (email: string): Promise<Partial<Usuario> | null> => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    },
    [httpGet]
  );

  const buscarTodosUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await httpGet("/usuario/todos");
      const { status, usuarios } = response;

      if (status === 200) {
        setUsuarios(usuarios);
      }
    } catch (error) {
      adicionarErro("Falha ao buscar usuários.");
    } finally {
      setIsLoading(false);
    }
  }, [httpGet, adicionarErro]);

  const relacionarUsuarioComPerfis = useCallback(
    async (usuario: Partial<Usuario>, perfisIds: string[]) => {
      setIsLoading(true);
      try {
        const response = await httpPost(`/usuario/relacionar-perfis`, {
          usuario,
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
      } finally {
        setIsLoading(false);
      }
    },
    [httpPost, adicionarErro]
  );

  const atualizarUsuario = useCallback(
    async (usuario: Partial<Usuario>): Promise<Partial<Usuario> | null> => {
      setIsLoading(true);
      try {
        const response = await httpPut(
          `/usuario/atualizar/${usuario.email}`,
          usuario
        );

        const { status, message, usuarioAtualizado } = response;
        console.log("RESPONSE: ", response);

        if (status === 200) {
          buscarTodosUsuarios();
          adicionarSucesso("Usuário atualizado com sucesso.");
          return usuarioAtualizado;
        } else {
          adicionarErro("Erro ao atualizar usuário.");
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        adicionarErro("Falha ao atualizar usuário.");
      } finally {
        setIsLoading(false);
      }

      return null;
    },
    [httpPut, adicionarErro, adicionarSucesso, buscarTodosUsuarios]
  );

  const deletarUsuario = useCallback(
    async (usuarioEmail: string) => {
      setIsLoading(true);
      try {
        const response = await httpDelete(`/usuario/deletar/${usuarioEmail}`);
        const { status, message } = response;

        if (status === 200) {
          buscarTodosUsuarios();
          adicionarSucesso("Usuário deletado com sucesso.");
        } else {
          adicionarErro("Erro ao deletar usuário.");
        }
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        adicionarErro("Falha ao deletar usuário.");
      } finally {
        setIsLoading(false);
      }
    },
    [httpDelete, adicionarErro, adicionarSucesso, buscarTodosUsuarios]
  );

  const salvarUsuario = useCallback(
    async (usuario: Partial<Usuario>): Promise<Partial<Usuario> | null> => {
      setIsLoading(true);
      try {
        const response = await httpPost("/usuario/registrar", usuario);
        const { status, message, novoUsuario } = response;

        if (status === 201) {
          buscarTodosUsuarios();
          adicionarSucesso("Usuário salvo com sucesso.");
          return novoUsuario;
        } else {
          adicionarErro("Erro ao salvar usuário.");
        }
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        adicionarErro("Falha ao salvar usuário.");
      } finally {
        setIsLoading(false);
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
    atualizarUsuario
  };
}
