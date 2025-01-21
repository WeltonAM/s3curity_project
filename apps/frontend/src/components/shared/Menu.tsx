import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Menu() {
    return (
        <div className="flex w-full items-center justify-between pt-6 px-10">
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

                <div className="flex items-center gap-2">
                    <div className="border border-zinc-600 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                        Photo
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-black">User Name</span>
                        <span className="text-xs text-zinc-400">useremail@email.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
