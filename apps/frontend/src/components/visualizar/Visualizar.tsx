'use client'

import { IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function Visualizar() {
    const [searchValue, setSearchValue] = useState("");

    const handleClearInput = () => {
        setSearchValue("");
    };

    interface User {
        id: number;
        name: string;
        profile: string;
        active: boolean;
        workHours: string;
        workDays: string[];
    }

    const users: User[] = [
        { id: 1, name: "João Silva", profile: "Administrador", active: true, workHours: "09:00 - 18:00", workDays: ["Seg", "Ter", "Qua", "Qui", "Sex"] },
        { id: 2, name: "Maria Oliveira", profile: "Usuário", active: false, workHours: "10:00 - 19:00", workDays: ["Ter", "Qua", "Sex"] },
        { id: 3, name: "Pedro Santos", profile: "Gerente", active: true, workHours: "08:00 - 17:00", workDays: ["Seg", "Qua", "Sex"] },
    ];

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 justify-center items-center w-full">
            <div className="flex gap-2 bg-zinc-900 py-2 px-4 rounded-md items-center justify-center max-w-lg">
                <span className="text-center text-sm text-zinc-300">
                    Pesquisar Usuários
                </span>

                <div className="relative">
                    <IconSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                        size={18}
                    />

                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="
                            w-full bg-zinc-950 rounded-md py-1 pl-10 pr-10 
                            text-sm text-zinc-400 border border-zinc-800 
                            focus:outline-none focus:ring-1 focus:ring-zinc-700
                        "
                    />

                    {searchValue && (
                        <IconX
                            onClick={handleClearInput}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 cursor-pointer"
                            size={18}
                        />
                    )}
                </div>
            </div>

            <div className="w-full max-w-4xl flex-1">
                <table className="w-full border border-zinc-300 rounded-md overflow-hidden">
                    <thead className="bg-zinc-700 text-zinc-200"> 
                        <tr>
                            <th className="py-2 text-center font-medium text-sm border border-zinc-800">Nome</th>
                            <th className="py-2 text-center font-medium text-sm border border-zinc-800">Perfil</th>
                            <th className="py-2 text-center font-medium text-sm border border-zinc-800">Ativo</th>
                            <th className="py-2 text-center font-medium text-sm border border-zinc-800">Horário de Trabalho</th>
                            <th className="py-2 text-center font-medium text-sm border border-zinc-800">Dias de Trabalho</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="bg-zinc-900 text-zinc-400 hover:bg-zinc-600"
                            >
                                <td className="py-4 text-center font-light text-sm border border-zinc-800">{user.name}</td>
                                <td className="py-4 text-center font-light text-sm border border-zinc-800">{user.profile}</td>
                                <td className="py-4 text-center font-light text-sm border border-zinc-800">
                                    {user.active ? "Sim" : "Não"}
                                </td>
                                <td className="py-4 text-center font-light text-sm border border-zinc-800">{user.workHours}</td>
                                <td className="py-4 text-center font-light text-sm border border-zinc-800">{user.workDays.join(", ")}</td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-4 text-center text-zinc-500"
                                >
                                    Nenhum usuário encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
