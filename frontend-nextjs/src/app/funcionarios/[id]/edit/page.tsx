"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 

export default function EditFuncionario() { 
    const router = useRouter();
    
    const params = useParams();
    const id = params.id; 

    const [form, setForm] = useState({ nome: "", cargo: "", cpf: "" });

    
    const carregar = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/funcionarios/${id}`);
            if (!res.ok) {
                
                throw new Error(`Falha ao carregar: Status ${res.status}`);
            }
            const data = await res.json();
            setForm(data);
        } catch (error) {
            console.error('Erro ao carregar funcionário:', error);
            
        }
    };

    const salvar = async (e: any) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:5000/api/funcionarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error(`Falha ao atualizar: Status ${res.status}`);
            }

            
            router.push("/funcionarios"); 
            
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            
        }
    };


    useEffect(() => {
        if (id) {
            carregar();
        }
    }, [id]); 

    return (
        // Container principal estilizado (centralizado, fundo suave e margem superior)
        <div className="p-8 max-w-lg mx-auto mt-10">
            
            {/* Card para o formulário com sombra e borda arredondada */}
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
                
           
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">
                    ✏️ Editar Funcionário
                </h2>

                <form onSubmit={salvar} className="flex flex-col gap-5">

                    
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="Nome Completo"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />

                    
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="Cargo"
                        value={form.cargo}
                        onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    />

                    
                    <input
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                        placeholder="CPF"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    />

                    {/* Botão Atualizar Estilizado */}
                    <button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-4 shadow-lg transform hover:scale-[1.01] transition duration-200" 
                        type="submit"
                    >
                        Atualizar Dados
                    </button>
                </form>
            </div>
        </div>
    );
}