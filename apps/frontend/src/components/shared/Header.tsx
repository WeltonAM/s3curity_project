'use client';

import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import MenuUsuario from "./MenuUsuario";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        setMenuPosition({ top: clientY, left: clientX });
        setIsMenuOpen((prev) => !prev);
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
        <div className="relative flex w-full items-center justify-between pt-6 px-10">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Image src="/image.png" alt="Logo" width={100} height={100} />
                </Link>

                <span>User Role</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="bg-zinc-800 rounded-full p-2">
                    <IconSearch size={16} />
                </span>

                <div className="border-r border-zinc-500 h-6 w-[1px]"></div>

                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <div className="border border-zinc-600 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                        Photo
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-black">User Name</span>
                        <span className="text-xs text-zinc-400">useremail@email.com</span>
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
                    <MenuUsuario />
                </div>
            )}
        </div>
    );
}
