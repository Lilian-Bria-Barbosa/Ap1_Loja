"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertMessage from "../components/AlertMessage";

interface Produto {
  id: number;
  nome: string;
  tamanho: string;
  preco_unit: number;
  qtd_estoque: number;
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [estoqueCritico, setEstoqueCritico] = useState<number>(0); // 🆕 contador de produtos críticos

  const [formData, setFormData] = useState({
    nome: "",
    tamanho: "",
    preco_unit: "",
    qtd_estoque: "",
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      const res = await axios.get("http://localhost:5000/api/produtos");
      setProdutos(res.data);

      // 🧮 Conta os produtos com estoque baixo
      const produtosBaixoEstoque = res.data.filter(
        (p: Produto) => p.qtd_estoque <= 5
      );
      setEstoqueCritico(produtosBaixoEstoque.length);

      if (produtosBaixoEstoque.length > 0) {
        setAlert({
          message: "⚠️ Existem produtos com estoque abaixo de 5 unidades.",
          type: "info",
        });
      }
    } catch {
      setAlert({ message: "Erro ao buscar produtos.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/api/produtos/${editing.id}`,
          formData
        );
        setAlert({
          message: "Produto atualizado com sucesso!",
          type: "success",
        });
      } else {
        await axios.post("http://localhost:5000/api/produtos", formData);
        setAlert({
          message: "Produto cadastrado com sucesso!",
          type: "success",
        });
      }

      setFormData({ nome: "", tamanho: "", preco_unit: "", qtd_estoque: "" });
      setEditing(null);
      setShowForm(false);
      fetchProdutos(); // Atualiza e recalcula estoque crítico
    } catch {
      setAlert({ message: "Erro ao salvar produto.", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        await axios.delete(`http://localhost:5000/api/produtos/${id}`);
        setProdutos(produtos.filter((p) => p.id !== id));
        setAlert({
          message: "Produto excluído com sucesso!",
          type: "success",
        });
        fetchProdutos(); // Atualiza contagem crítica
      } catch {
        setAlert({ message: "Erro ao excluir produto.", type: "error" });
      }
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditing(produto);
    setFormData({
      nome: produto.nome,
      tamanho: produto.tamanho,
      preco_unit: produto.preco_unit.toString(),
      qtd_estoque: produto.qtd_estoque.toString(),
    });
    setShowForm(true);
  };

  return (
    <div className="p-8">
      {/* 🧭 Título com badge de estoque crítico */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Estoque Atual</h1>
        {estoqueCritico > 0 && (
          <span
            className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md animate-pulse"
            title="Produtos com estoque crítico"
          >
            ⚠️ {estoqueCritico} produto
            {estoqueCritico > 1 ? "s" : ""} crítico
          </span>
        )}
      </div>

      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {loading ? (
        <p className="text-center">Carregando produtos...</p>
      ) : (
        <div className="overflow-x-auto transition-all">
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Nome</th>
                <th className="p-3 border">Tamanho</th>
                <th className="p-3 border">Preço (R$)</th>
                <th className="p-3 border">Qtd. em Estoque</th>
                <th className="p-3 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length > 0 ? (
                produtos.map((produto) => (
                  <tr
                    key={produto.id}
                    className={`text-center border-b transition-colors duration-200 ${
                      produto.qtd_estoque <= 5
                        ? "bg-red-50 animate-pulse shadow-inner"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3 border">{produto.id}</td>
                    <td className="p-3 border font-medium text-gray-700">
                      {produto.nome}
                    </td>
                    <td className="p-3 border">{produto.tamanho || "-"}</td>
                    <td className="p-3 border">
                      {produto.preco_unit.toFixed(2)}
                    </td>
                    <td className="p-3 border">
                      {produto.qtd_estoque <= 5 ? (
                        <span
                          className="text-red-600 font-semibold flex items-center justify-center gap-1 cursor-help"
                          title="Estoque abaixo do mínimo recomendado"
                        >
                          ⚠️ {produto.qtd_estoque}
                          <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                            Baixo
                          </span>
                        </span>
                      ) : (
                        produto.qtd_estoque
                      )}
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEdit(produto)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition-all shadow-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all shadow-sm"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({
              nome: "",
              tamanho: "",
              preco_unit: "",
              qtd_estoque: "",
            });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
        >
          {showForm ? "Cancelar" : "Novo Produto"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editing ? "Editar Produto" : "Cadastrar Produto"}
          </h2>
          <input
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            name="tamanho"
            placeholder="Tamanho"
            value={formData.tamanho}
            onChange={handleChange}
            className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="preco_unit"
            placeholder="Preço"
            type="number"
            step="0.01"
            value={formData.preco_unit}
            onChange={handleChange}
            className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            name="qtd_estoque"
            placeholder="Quantidade em Estoque"
            type="number"
            value={formData.qtd_estoque}
            onChange={handleChange}
            className="block w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md shadow-md transition-all"
          >
            {editing ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>
      )}
    </div>
  );
}
