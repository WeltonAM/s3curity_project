'use client';

import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import MenuUsuario from "./MenuUsuario";
import useSessao from "@/data/hooks/useSessao";

export default function Header() {
    const { usuario } = useSessao();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;

        setIsMenuOpen(false);
        setTimeout(() => {
            setMenuPosition({ top: clientY, left: clientX });
            setIsMenuOpen(true);
        }, 0);
    };

    const closeMenu = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener("click", closeMenu);
        } else {
            document.removeEventListener("click", closeMenu);
        }

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, [isMenuOpen]);

    return (
        <div className="relative flex w-full items-center justify-between pt-4 px-10 select-none">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Image src="/image.png" alt="Logo" width={100} height={100} />
                </Link>

                <span>
                    {usuario?.perfis && usuario.perfis.length > 0
                        ? typeof usuario.perfis[0] === "string"
                            ? usuario.perfis[0]
                            : usuario.perfis[0]?.nome
                        : "Perfil Usuário"}
                </span>
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
                <span className="bg-zinc-800 rounded-full p-2">
                    <IconSearch size={16} />
                </span>

                <div className="border-r border-zinc-500 h-6 w-[1px]"></div>

                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <div className="border border-zinc-600 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                        <Image src={usuario?.url_imagem_perfil ?? "/user-icon.png"} alt="Perfil" width={100} height={100} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-black">{usuario?.nome_completo ?? "Nome Usuário"}</span>
                        <span className="text-xs text-zinc-400">{usuario?.email ?? "Email Usuário"}</span>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute bg-zinc-800 rounded-md shadow-lg"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left - 65}px`,
                        transform: "translate(-50%, 10px)",
                    }}
                >
                    <MenuUsuario closeMenu={() => setIsMenuOpen(false)} />
                </div>
            )}
        </div>
    );
}
