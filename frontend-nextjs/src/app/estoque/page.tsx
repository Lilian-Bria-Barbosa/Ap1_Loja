"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Trash2, Pencil, X, Save } from 'lucide-react'; 

interface EstoqueItem {
    id: number;
    nome: string;
    tamanho: string;
    preco: number; 
    quantidade_estoque: number; 
}

const LOW_STOCK_THRESHOLD = 5; 
const API_BASE_URL = "http://localhost:5000/api/produtos";
const CRITICAL_STOCK_TEXT = 'ESTOQUE CRÍTICO!'; 


const AlertMessage = ({ message, type, onRetry }: { message: string, type: 'error' | 'info', onRetry?: () => void }) => (
    <div className={`text-center p-6 mx-auto mt-8 w-full max-w-2xl ${type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'} rounded-md shadow-lg border-2`}>
        <p className="font-semibold mb-2">Atenção:</p>
        <p>{message}</p>
        {onRetry && (
            <button 
                onClick={onRetry} 
                className="mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
            >
                Tentar Novamente
            </button>
        )}
    </div>
);



interface EditFormProps {
    item: EstoqueItem;
    onClose: () => void;
    onSave: (item: EstoqueItem) => Promise<void>;
}

const InlineEditForm: React.FC<EditFormProps> = ({ item, onClose, onSave }) => {
    const cleanName = item.nome.replace(CRITICAL_STOCK_TEXT, '').trim(); 
    
    const [formData, setFormData] = useState({
        nome: cleanName,
        quantidade_estoque: String(item.quantidade_estoque),
        preco: String(item.preco)
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaveError(null);
        setIsSaving(true);
        
        const updatedItem: EstoqueItem = {
            ...item,
            nome: formData.nome.trim(), 
            quantidade_estoque: Number(formData.quantidade_estoque) || 0,
            preco: Number(formData.preco) || 0
        };

        try {
            await onSave(updatedItem);
            onClose(); 
        } catch (e: any) {
            setSaveError(e.message || "Erro desconhecido ao salvar as alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-10 mb-12 p-8 bg-gray-50 rounded-xl shadow-2xl border-t-4 border-blue-600 transition-all duration-300">
            <div className="flex justify-between items-start border-b pb-4 mb-6">
                <h3 className="text-3xl font-bold text-blue-700 flex items-center">
                    <Pencil size={28} className="mr-3"/> Editando Produto: {cleanName} ({item.tamanho})
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-red-100 border">
                    <X size={24} />
                </button>
            </div>

            {saveError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                    <p className="font-semibold">Erro ao Salvar:</p>
                    <p>{saveError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block">
                    <span className="text-gray-700 font-semibold">Nome do Produto</span>
                    <input 
                        type="text" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 border"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 font-semibold">Quantidade em Estoque</span>
                    <input 
                        type="number" 
                        name="quantidade_estoque" 
                        value={formData.quantidade_estoque} 
                        onChange={handleChange} 
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 border"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 font-semibold">Preço (R$)</span>
                    <input 
                        type="number" 
                        name="preco" 
                        value={formData.preco} 
                        onChange={handleChange} 
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-3 border"
                    />
                </label>
            </div>

            <div className="flex justify-end space-x-3 mt-8 border-t pt-6">
                <button 
                    onClick={onClose} 
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-md"
                    disabled={isSaving}
                >
                    Cancelar Edição
                </button>
                <button 
                    onClick={handleSave} 
                    className={`px-6 py-3 text-white font-bold rounded-lg transition shadow-xl flex items-center ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={isSaving}
                >
                    <Save size={20} className="mr-2"/>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    );
};


export default function EstoquePage() {
    const [estoqueItems, setEstoqueItems] = useState<EstoqueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [editingItem, setEditingItem] = useState<EstoqueItem | null>(null);

    const fetchEstoque = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BASE_URL); 
            
            if (!res.ok) {
                throw new Error(`Falha ao carregar estoque: Status ${res.status}`);
            }
            
            const data = await res.json();
            
            if (Array.isArray(data)) {
                const safeData: EstoqueItem[] = data.map(item => {
                    const safeQuantity = Number(item.quantidade_estoque) || 0; 
                    const safePrice = Number(item.preco) || 0; 
                    return {
                        ...item,
                        quantidade_estoque: safeQuantity,
                        preco: safePrice,
                    };
                });

                setEstoqueItems(safeData);
            } else {
                setEstoqueItems([]); 
                throw new Error("Formato de dados inválido recebido da API.");
            }
        } catch (err: any) {
            console.error("ERRO CRÍTICO AO BUSCAR ESTOQUE:", err);
            setError("Erro de conexão. Verifique se o servidor Flask está rodando na porta 5000 e se a rota /api/produtos está correta.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEstoque();
    }, [fetchEstoque]);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleEdit = (item: EstoqueItem) => {
        setDeletingItemId(null); 
        setEditingItem(item);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const cancelEdit = () => {
        setEditingItem(null);
    };
    
    const saveEdit = async (updatedItem: EstoqueItem) => {
        const payload = {
            nome: updatedItem.nome.trim(),
            tamanho: updatedItem.tamanho,
            preco: parseFloat(updatedItem.preco.toFixed(2)), 
            quantidade_estoque: Math.floor(updatedItem.quantidade_estoque), 
        };

        try {
            const res = await fetch(`${API_BASE_URL}/${updatedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), 
            });

            if (!res.ok) {
                let errorMsg = 'Erro desconhecido ao atualizar.';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.error || errorData.message || `Falha no Servidor (Status ${res.status})`;
                } catch {
                    errorMsg = `Falha na Rede ou Servidor. (Status ${res.status})`;
                }
                throw new Error(errorMsg);
            }
            
            await fetchEstoque(); 
        } catch (e: any) {
            console.error("ERRO ao salvar edição:", e);
            throw e; 
        }
    };


    const handleDelete = (id: number) => {
        setEditingItem(null); 
        setDeletingItemId(id);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const cancelDelete = () => {
        setDeletingItemId(null);
    };

    const confirmDelete = async () => {
        if (deletingItemId === null) return;
        
        setDeleting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/${deletingItemId}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                fetchEstoque();
            } else {
                const errorData = await res.json();
                console.error("Falha ao deletar produto:", errorData.error || 'Erro desconhecido');
            }
        } catch (e) {
            console.error("Erro de rede durante a exclusão:", e);
        } finally {
            setDeleting(false);
            cancelDelete();
        }
    };


    const produtoToDelete = useMemo(() => estoqueItems.find(p => p.id === deletingItemId), [estoqueItems, deletingItemId]);


    const InlineDeleteConfirmation = () => {
        const cleanName = produtoToDelete?.nome.replace(CRITICAL_STOCK_TEXT, '').trim() || 'este produto';
        return (
            <div className="mt-10 mb-12 p-8 bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto border-t-4 border-red-600">
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <h3 className="text-2xl font-bold text-red-700 flex items-center">
                        <Trash2 size={24} className="mr-3"/> Confirmar Exclusão
                    </h3>
                    <button onClick={cancelDelete} className="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-red-100 border">
                        <X size={24} />
                    </button>
                </div>

                <p className="text-lg text-gray-700 mb-6">
                    Você tem certeza que deseja **excluir permanentemente** o produto **{cleanName}**? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={cancelDelete} 
                        className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-md"
                        disabled={deleting}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmDelete} 
                        className={`px-6 py-3 text-white font-bold rounded-lg transition shadow-xl ${deleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
                        disabled={deleting}
                    >
                        {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto"> 
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-2">Controle de Estoque e Inventário</h1>
            
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="ml-3 text-lg text-blue-600">Carregando dados de estoque...</p>
                </div>
            )}
            
            {error && (
                <AlertMessage 
                    message={error} 
                    type="error" 
                    onRetry={fetchEstoque} 
                />
            )}

            {!loading && !error && estoqueItems.length === 0 && (
                <AlertMessage 
                    message="Nenhum item de estoque encontrado. Cadastre produtos primeiro." 
                    type="info" 
                />
            )}

            {!loading && !error && estoqueItems.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-2xl rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-purple-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Produto
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Tamanho
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Qtd. em Estoque
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Preço Unitário
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {estoqueItems.map((item) => {
                                const isLowStock = item.quantidade_estoque <= LOW_STOCK_THRESHOLD;
                                const cleanProductName = item.nome.replace(CRITICAL_STOCK_TEXT, '').trim();

                                return (
                                    <tr 
                                        key={item.id} 
                                        className={`hover:bg-gray-50 transition duration-100 ${isLowStock ? 'bg-red-50 border-l-4 border-red-500' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {cleanProductName}
                                            {isLowStock && (
                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white shadow-sm">
                                                    {CRITICAL_STOCK_TEXT}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.tamanho}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                                            <span className={isLowStock ? 'text-red-600' : 'text-green-600'}>
                                                {item.quantidade_estoque}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-extrabold text-gray-900">
                                            {formatCurrency(item.preco)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 bg-blue-100 rounded-full transition duration-150 shadow-md hover:shadow-lg"
                                                    title="Editar Produto"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:text-red-800 bg-red-100 rounded-full transition duration-150 shadow-md hover:shadow-lg"
                                                    title="Excluir Produto"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            

            {produtoToDelete && <InlineDeleteConfirmation />}

            {editingItem && (
                <InlineEditForm 
                    key={`edit-${editingItem.id}`} 
                    item={editingItem} 
                    onClose={cancelEdit} 
                    onSave={saveEdit} 
                />
            )}
        </div>
    );
}