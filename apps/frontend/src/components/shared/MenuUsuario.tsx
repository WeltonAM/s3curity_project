import useAuth from "@/data/hooks/useAuth";
import { IconLogout, IconUserEdit } from "@tabler/icons-react";
import Link from "next/link";

export default function MenuUsuario() {

    const { logout } = useAuth();

    return (
        <div 
            className="
                flex flex-col py-2
                min-w-40 gap-2 bg-zinc-900 rounded-md

            "
        >
            <Link href="/usuario" className="flex items-center cursor-pointer gap-2 hover:bg-zinc-800 hover:text-zinc-100 py-1 px-4 w-full">
                <IconUserEdit />
                <span className="text-sm text-zinc-500">Minha Conta</span>
            </Link>
            
            <button
                className="flex items-center cursor-pointer gap-2 hover:bg-zinc-800 hover:text-zinc-100 py-1 px-4 w-full"
                onClick={logout}
            >
                <IconLogout />
                <span className="text-sm text-zinc-500">Sair</span>
            </button>
        </div>
    );
}
