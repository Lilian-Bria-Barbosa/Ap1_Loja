"use client";

import { useEffect, useState } from "react";

interface FuncionarioData {
    id: number;
    nome: string;
    cargo: string;
    cpf: string;
}

interface ProdutoData {
    id: number;
    nome: string;
    preco: number;
    quantidade_estoque: number;
}

export default function RelatorioPage() {
    const [dadosFuncionarios, setDadosFuncionarios] = useState<FuncionarioData[]>([]);
    const [dadosProdutos, setDadosProdutos] = useState<ProdutoData[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    const carregarDados = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [resFuncionarios, resProdutos] = await Promise.all([
                fetch("http://localhost:5000/api/funcionarios"),
                fetch("http://localhost:5000/api/produtos"),
            ]);

            if (!resFuncionarios.ok || !resProdutos.ok) {
                let errorMessage = "";
                if (!resFuncionarios.ok) errorMessage += `Falha ao carregar Funcionários (Status ${resFuncionarios.status}). `;
                if (!resProdutos.ok) errorMessage += `Falha ao carregar Produtos (Status ${resProdutos.status}). `;
                throw new Error(errorMessage.trim());
            }
            
            const dataFuncionarios: FuncionarioData[] = await resFuncionarios.json();
            const dataProdutos: ProdutoData[] = await resProdutos.json();

            setDadosFuncionarios(dataFuncionarios);
            setDadosProdutos(dataProdutos);

        } catch (err: any) {
            console.error('Erro ao buscar dados para o relatório:', err);
            if (err.message.includes('Failed to fetch')) {
                 setError("Erro de conexão. Verifique se o servidor Flask está rodando em http://localhost:5000 e se as rotas /api/funcionarios e /api/produtos estão ativas.");
            } else {
                 setError(err.message || "Ocorreu um erro desconhecido ao carregar os dados.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    
    return (
        <div className="p-8 max-w-7xl mx-auto mt-10">
            
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-blue-800">📋 Relatório Geral da Loja</h1>
                    <p className="text-gray-600 mt-2">Visão consolidada de Funcionários e Produtos em Estoque.</p>
                </div>
                
                <a 
                    href="http://localhost:5000/api/relatorio/csv" 
                    download="relatorio_geral.csv"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-[1.02]"
                >
                    Exportar Funcionários (CSV)
                </a>
            </header>

            {isLoading && (
                <div className="text-center p-10 text-xl text-indigo-500">
                    Carregando dados...
                </div>
            )}

            {error && !isLoading && (
                <div className="p-4 mb-6 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg text-lg">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="space-y-12">
                    
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-200">👥 Funcionários Cadastrados</h2>
                        
                        {dadosFuncionarios.length > 0 ? (
                            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-indigo-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Cargo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">CPF</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {dadosFuncionarios.map((f) => (
                                            <tr key={f.id} className="hover:bg-indigo-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.nome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.cargo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.cpf}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-center bg-white rounded-xl shadow-md text-gray-500">Nenhum funcionário encontrado.</div>
                        )}
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">📦 Produtos em Estoque</h2>
                        
                        {dadosProdutos.length > 0 ? (
                            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-green-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nome do Produto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Preço (R$)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Estoque Atual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {dadosProdutos.map((p) => (
                                            <tr key={p.id} className="hover:bg-green-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.nome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">R$ {(p.preco ?? 0).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className={`font-semibold ${p.quantidade_estoque < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {p.quantidade_estoque}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-center bg-white rounded-xl shadow-md text-gray-500">Nenhum produto encontrado. Verifique a rota /api/produtos.</div>
                        )}
                    </section>

                </div>
            )}
        </div>
    );
}