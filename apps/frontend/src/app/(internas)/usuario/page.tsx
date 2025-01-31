"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CampoNome from "@/components/shared/CampoNome";
import CampoTelefone from "@/components/shared/CampoTelefone";
import useSessao from "@/data/hooks/useSessao";
import useUsuario from "@/data/hooks/useUsuario";
import { IconLock, IconPhoto, IconQrcode, IconRotateClockwise } from "@tabler/icons-react";
import Image from "next/image";
import useMensagem from "@/data/hooks/useMensagem";
import Link from "next/link";
import useAuth from "@/data/hooks/useAuth";

export default function UsuarioPage() {
    const { usuario, atualizarUsuarioSessao } = useSessao();
    const { atualizarUsuario } = useUsuario();
    const router = useRouter();
    const { adicionarErro } = useMensagem();
    const { gerarQrCode, qrCodeUrl, isLoading } = useAuth();
    const isBase64 = qrCodeUrl?.startsWith("data:image");

    const [nome_completo, setNome] = useState(usuario?.nome_completo || "");
    const [telefone, setTelefone] = useState(usuario?.telefone || "");
    const [urlImagemPerfil, setUrlImagemPerfil] = useState(usuario?.url_imagem_perfil || "");
    const [doisFatoresAtivado, setDoisFatoresAtivado] = useState(usuario?.dois_fatores_ativado || false);

    const validarUrlImagem = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            const dominiosPermitidos = ["i.pravatar.cc", "example.com", "cdn.pixabay.com", "cdn.discordapp.com", "lh3.googleusercontent.com"];
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
            url_imagem_perfil: urlImagemPerfil || "",
            dois_fatores_ativado: doisFatoresAtivado || undefined,
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

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-300">Autenticação de Dois Fatores</label>
                    <select
                        className="p-2 bg-black rounded-md border border-white/10 text-white"
                        value={doisFatoresAtivado ? "true" : "false"}
                        onChange={(e) => setDoisFatoresAtivado(e.target.value === "true")}
                    >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nome" className="text-xs text-zinc-300">Solicitar Nova Senha</label>
                    <Link
                        href="/novaSenha"
                        className="
                            flex items-center justify-start gap-2
                            bg-black rounded-md border border-white/10 
                            text-sm text-white p-2 
                        "
                    >
                        <IconLock className="text-zinc-400" size={20} />
                        <span>Solicitar Senha</span>
                    </Link>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nome" className="text-xs text-zinc-300">Solicitar QRCode para Login</label>
                    <button
                        onClick={() => gerarQrCode(usuario?.email as string)}
                        className="
                            flex items-center justify-start gap-2
                            bg-black rounded-md border border-white/10 
                            text-sm text-white p-2
                        "
                    >
                        <span>
                            {isLoading ? (
                                <IconRotateClockwise className="animate-spin h-5 w-5 mr-2" />
                            ) : (
                                <IconQrcode className="text-zinc-400" size={20} />
                            )}
                        </span>
                        <span>Solicitar QRCode</span>
                    </button>

                    {qrCodeUrl &&
                        <div className="flex justify-center mt-2">
                            <Image
                                src={qrCodeUrl || ""}
                                alt="QRCode"
                                width={isBase64 ? 200 : 300}
                                height={isBase64 ? 200 : 300}
                            />
                        </div>
                    }
                </div>

                <div className="flex flex-col gap-1 relative">
                    <label htmlFor="urlImagemPerfil" className="text-xs text-zinc-300">
                        Imagem de Perfil
                    </label>

                    <div className="flex items-center bg-black rounded-md border border-white/10 text-white">
                        <IconPhoto size={20} className="absolute left-3 text-zinc-400" />
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
