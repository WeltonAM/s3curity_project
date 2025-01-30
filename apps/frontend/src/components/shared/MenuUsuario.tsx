import React from 'react';
import useAuth from "@/data/hooks/useAuth";
import { IconLogout, IconUserEdit } from "@tabler/icons-react";
import Link from "next/link";

export interface MenuUsuarioProps {
    closeMenu: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function MenuUsuario({ closeMenu }: MenuUsuarioProps) {

    const { logout } = useAuth();

    return (
        <div
            className="
                flex flex-col py-2
                min-w-40 gap-2 bg-zinc-900 rounded-md
            "
        >
            <Link
                href="/usuario"
                onClick={closeMenu}
                className="
                    flex items-center cursor-pointer gap-2 
                    py-1 px-4 w-full text-zinc-400
                    hover:bg-zinc-800 hover:text-zinc-100 
                "
            >
                <IconUserEdit color='white' />

                <span className="text-sm">Minha Conta</span>
            </Link>

            <button
                className="
                    flex items-center cursor-pointer gap-2 
                    py-1 px-4 w-full text-zinc-400
                    hover:bg-zinc-800 hover:text-zinc-100 
                "
                onClick={logout}
            >
                <IconLogout color='white' />

                <span className="text-sm">Sair</span>
            </button>
        </div>
    );
}
