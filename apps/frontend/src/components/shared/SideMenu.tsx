'use client';

import useSessao from "@/data/hooks/useSessao";
import { IconClipboardList, IconCube, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenu() {
    const { usuario } = useSessao();

    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex flex-col items-center gap-6">
            <select
                name="select"
                id="select"
                className="w-36 bg-zinc-800 rounded-md text-sm text-zinc-400 py-1 px-2 cursor-pointer"
            >
                <option value="">Perfil De Acesso</option>
                {usuario?.perfis?.map((perfil, index) => (
                    <option key={index} value={typeof perfil === "string" ? perfil : perfil.nome}>
                        {typeof perfil === "string" ? perfil : perfil.nome}
                    </option>
                ))}
            </select>

            <div className="flex flex-col gap-2 w-full justify-center items-center">
                <Link
                    href="/gerenciar"
                    className={`
                        flex items-center py-1 px-2 gap-4 w-full rounded-sm cursor-pointer 
                        ${isActive("/gerenciar")
                            ? "bg-zinc-800 text-zinc-100"
                            : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                        }
                    `}
                >
                    <IconUser className="text-zinc-100" />
                    <span>Gerenciar</span>
                </Link>

                <Link
                    href="/visualizar"
                    className={`flex items-center py-1 px-2 gap-4 w-full rounded-sm cursor-pointer 
                        ${isActive("/visualizar")
                            ? "bg-zinc-800 text-zinc-100"
                            : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                        }
                    `}
                >
                    <IconCube className="text-zinc-100" />
                    <span>Visualizar</span>
                </Link>

                <Link
                    href="/relatorio"
                    className={`flex items-center py-1 px-2 gap-4 w-full rounded-sm cursor-pointer 
                        ${isActive("/relatorio")
                            ? "bg-zinc-800 text-zinc-100"
                            : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                        }
                    `}
                >
                    <IconClipboardList className="text-zinc-100" />
                    <span>Relatório</span>
                </Link>
            </div>
        </div>
    );
}
