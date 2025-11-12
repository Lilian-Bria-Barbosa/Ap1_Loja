"use client";
import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage";

interface Produto {
  id: number;
  nome: string;
  preco_unit: number;
  qtd_estoque: number;
}

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:5000/api/produtos";

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
      setAlert({ message: "Falha ao carregar produtos 😢", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="p-8">
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📦 Lista de Produtos</h1>
        <button
          onClick={fetchProdutos}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Atualizar Lista
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-gray-500 italic">Nenhum produto encontrado.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Nome</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Preço (R$)</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{p.id}</td>
                  <td className="px-6 py-3">{p.nome}</td>
                  <td className="px-6 py-3">{p.preco_unit.toFixed(2)}</td>
                  <td className="px-6 py-3">{p.qtd_estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
