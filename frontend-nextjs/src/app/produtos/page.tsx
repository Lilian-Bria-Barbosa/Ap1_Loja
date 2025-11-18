"use client";

import { useState } from "react";

interface AlertMessageProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
  let bgColor, borderColor, textColor;

  switch (type) {
    case "success":
      bgColor = "bg-green-100 border-green-400 text-green-700";
      borderColor = "border-l-4";
      textColor = "text-green-700";
      break;
    case "error":
      bgColor = "bg-red-100 border-red-400 text-red-700";
      borderColor = "border-l-4";
      textColor = "text-red-700";
      break;
    case "info":
    default:
      bgColor = "bg-blue-100 border-blue-400 text-blue-700";
      borderColor = "border-l-4";
      textColor = "text-blue-700";
      break;
  }

  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-md ${bgColor} ${borderColor} flex justify-between items-center transition-all duration-300`}
      role="alert"
    >
      <p className={`font-medium ${textColor}`}>{message}</p>
      <button onClick={onClose} className={`text-xl font-semibold p-1 ${textColor} hover:opacity-75 transition-opacity`}>
        &times;
      </button>
    </div>
  );
};

export default function CreateProduto() {
    const [formData, setFormData] = useState({
        nome: '',
        tamanho: '',
        preco_unit: '',
        qtd_estoque: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<{
        message: string;
        type: "success" | "error" | "info";
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const salvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAlert(null);

        const dataToSend = {
            ...formData,
            preco_unit: parseFloat(formData.preco_unit),
            qtd_estoque: parseInt(formData.qtd_estoque, 10),
        };

        try {
            const res = await fetch("http://localhost:5000/api/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend), 
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Falha ao cadastrar produto: Status ${res.status}`);
            }

            setFormData({ nome: '', tamanho: '', preco_unit: '', qtd_estoque: '' });
            setAlert({ message: "Produto cadastrado com sucesso! Redirecionando...", type: "success" });
            
            setTimeout(() => {
                window.location.href = "/estoque"; 
            }, 2000);
            
        } catch (err: any) {
            console.error('Erro ao tentar salvar produto:', err);
            
            if (err.message.includes('Failed to fetch')) {
                setAlert({ 
                    message: "Erro de conexão. Verifique se o servidor Flask está rodando em http://localhost:5000.", 
                    type: "error" 
                });
            } else {
                setAlert({ 
                    message: `Erro ao salvar: ${err.message || "Ocorreu um erro desconhecido."}`, 
                    type: "error" 
                });
            }
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto mt-10 bg-white shadow-2xl rounded-xl border border-purple-100">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">Novo Produto</h1>

            {alert && (
                <AlertMessage
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            
            <form onSubmit={salvar} className="space-y-4">
                
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>
                
                <div>
                    <label htmlFor="tamanho" className="block text-sm font-medium text-gray-700">Tamanho/Variante (Ex: P, M, G)</label>
                    <input
                        type="text"
                        id="tamanho"
                        name="tamanho"
                        value={formData.tamanho}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>
                
                <div>
                    <label htmlFor="preco_unit" className="block text-sm font-medium text-gray-700">Preço Unitário (R$)</label>
                    <input
                        type="number"
                        id="preco_unit"
                        name="preco_unit"
                        step="0.01"
                        value={formData.preco_unit}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>

                <div>
                    <label htmlFor="qtd_estoque" className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
                    <input
                        type="number"
                        id="qtd_estoque"
                        name="qtd_estoque"
                        value={formData.qtd_estoque}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <a
                        href="/estoque"
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                    >
                        Voltar para Estoque
                    </a>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium rounded-md text-white shadow-lg transition duration-150 ${
                            isSubmitting 
                                ? 'bg-purple-400 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02]'
                        }`}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                    </button>
                </div>
            </form>
        </div>
    );
}