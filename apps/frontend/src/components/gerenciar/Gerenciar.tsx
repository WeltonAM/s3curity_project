'use client';

import { useState } from "react";
import ListarPerfis from "./ListarPerfis";

export default function Gerenciar() {
    const [activeTab, setActiveTab] = useState("usuarios");

    const tabs = [
        { id: "usuarios", label: "Usuários" },
        { id: "perfis", label: "Perfis" },
        { id: "permissoes", label: "Permissões" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "usuarios":
                return <div>Conteúdo de Usuários</div>;
            case "perfis":
                return <ListarPerfis />;
            case "permissoes":
                return <div>Conteúdo de Permissões</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex gap-4 items-center bg-zinc-900 py-2 px-4 rounded-md w-full justify-around">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`flex cursor-pointer py-1 w-full justify-center items-center rounded-md ${
                            activeTab === tab.id
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 w-full p-4 rounded-md">
                {renderContent()}
            </div>
        </div>
    );
}
