"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CampoNome from "@/components/shared/CampoNome";
import CampoTelefone from "@/components/shared/CampoTelefone";
import useSessao from "@/data/hooks/useSessao";
import useUsuario from "@/data/hooks/useUsuario";
import { IconPhoto } from "@tabler/icons-react";
import Image from "next/image";
import useMensagem from "@/data/hooks/useMensagem";
import Link from "next/link";

export default function UsuarioPage() {
    const { usuario, atualizarUsuarioSessao } = useSessao();
    const { atualizarUsuario } = useUsuario();
    const router = useRouter();
    const { adicionarErro } = useMensagem();

    const [nome_completo, setNome] = useState(usuario?.nome_completo || "");
    const [telefone, setTelefone] = useState(usuario?.telefone || "");
    const [urlImagemPerfil, setUrlImagemPerfil] = useState(usuario?.url_imagem_perfil || "");

    const validarUrlImagem = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            const dominiosPermitidos = ["i.pravatar.cc", "example.com", "cdn.pixabay.com", "cdn.discordapp.com"];
            return dominiosPermitidos.includes(parsedUrl.hostname);
        } catch (error) {
            console.error("Erro ao validar URL da imagem:", error);
            return false;
        }
    };

    const Avatar = ({ src }: { src: string }) => (
        <Image
            src={src || "/default-avatar.png"}
            alt="Avatar"
            width={100}
            height={100}
        />
    );

    const handleSalvar = async () => {
        if (urlImagemPerfil && !validarUrlImagem(urlImagemPerfil)) {
            adicionarErro("URL da imagem inválida! Use um link confiável.");
            return;
        }

        const usuarioAtualizado: Partial<typeof usuario> = {
            email: usuario?.email,
            nome_completo: nome_completo || undefined,
            telefone: telefone || undefined,
            url_imagem_perfil: urlImagemPerfil || undefined,
        };

        const novoUsuarioAtualizado = await atualizarUsuario(usuarioAtualizado);

        if (novoUsuarioAtualizado) {
            atualizarUsuarioSessao(novoUsuarioAtualizado);
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-xl font-bold">Editar Perfil</h1>

            <div className="flex flex-col gap-4 p-6 bg-zinc-900 rounded-md w-full">
                <CampoNome
                    ladoIcone="esquerda"
                    value={nome_completo}
                    onChange={(e) => setNome(e.target.value)}
                />

                <CampoTelefone
                    lable="Telefone"
                    telefoneValue={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />

                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="nome" className="text-xs text-zinc-300">Solicitar Nova Senha</label>
                    <Link
                        href="/novaSenha"
                        className="bg-black rounded-md border border-white/10 text-sm text-white px-4 py-2"
                    >
                        Solicitar
                    </Link>
                </div>

                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="urlImagemPerfil" className="text-xs text-zinc-300">
                        Imagem de Perfil
                    </label>

                    <div className="flex items-center bg-black rounded-md border border-white/10 text-white">
                        <IconPhoto size={20} className="absolute left-3" />
                        <input
                            type="text"
                            id="urlImagemPerfil"
                            name="urlImagemPerfil"
                            className="p-2 flex-1 bg-transparent text-white text-md pl-10"
                            placeholder="url..."
                            value={urlImagemPerfil}
                            onChange={(e) => setUrlImagemPerfil(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <Avatar src={urlImagemPerfil || "/user-icon.png"} />
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-500 text-zinc-200 hover:text-zinc-100 px-4 py-2 rounded-md">
                    Salvar
                </button>
            </div>
        </div>
    );
}
