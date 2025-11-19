"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FuncionariosPage() {
    const [funcionarios, setFuncionarios] = useState([]);

    const carregar = async () => {
        const res = await fetch("http://localhost:5000/api/funcionarios");
        const data = await res.json();
        setFuncionarios(data);
    };

    const deletar = async (id: number) => {
        if (!confirm("Deseja deletar esse funcionário?")) return;

        await fetch(`http://localhost:5000/api/funcionarios/${id}`, {
            method: "DELETE",
        });

        carregar();
    };

    useEffect(() => {
        carregar();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">📋 Gestão de Funcionários</h1>
                
                <Link
                    href="/funcionarios/create"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300 transform hover:scale-[1.02]"
                >
                    + Novo Funcionário
                </Link>
            </header>

            <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {funcionarios.map((f: any) => (
                            <tr key={f.id} className="hover:bg-indigo-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.cargo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                                    
                                    <Link
                                        href={`/funcionarios/${f.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 border border-indigo-300 hover:bg-indigo-100 px-3 py-1 rounded-md transition duration-150"
                                    >
                                        Editar
                                    </Link>
                                    
                                    <button
                                        onClick={() => deletar(f.id)}
                                        className="text-red-600 hover:text-red-900 border border-red-300 hover:bg-red-100 px-3 py-1 rounded-md transition duration-150"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {funcionarios.length === 0 && (
                    <div className="p-10 text-center text-gray-500 text-lg">
                        Nenhum funcionário cadastrado. Clique em "+ Novo Funcionário" para começar.
                    </div>
                )}
            </div>
        </div>
    );
}