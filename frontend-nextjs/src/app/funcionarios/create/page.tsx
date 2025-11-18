"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFuncionario() {
    const router = useRouter();
    const [form, setForm] = useState({ nome: "", cargo: "", cpf: "" });

    const salvar = async (e: any) => {
        e.preventDefault();

        try {

            const res = await fetch("http://localhost:5000/api/funcionarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            
            
            if (!res.ok) {
                throw new Error(`Falha ao cadastrar: Status ${res.status}`);
            }

            console.log('Funcionário salvo com sucesso');
            
           
            router.push("/funcionarios"); 
            
        } catch(error) {
            console.error('Erro ao tentar salvar funcionário: ', error);
        }
    };

    return (
        
        <div className="p-8 max-w-lg mx-auto mt-10">
            
           
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
                
                <h2 className="text-3xl font-extrabold text-green-700 mb-6 border-b pb-2">
                    ➕ Cadastrar Novo Funcionário
                </h2>

                <form onSubmit={salvar} className="flex flex-col gap-5">

                    
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                        placeholder="Nome Completo"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />

                   
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                        placeholder="Cargo"
                        value={form.cargo}
                        onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    />

                    
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                        placeholder="CPF"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    />

                    
                    <button 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 shadow-lg transform hover:scale-[1.01] transition duration-200" 
                        type="submit"
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
}