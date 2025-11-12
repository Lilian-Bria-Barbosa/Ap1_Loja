"use client";

import { useState } from "react";

export default function Cadastro() {
  const [produto, setProduto] = useState({
    nome: "",
    tamanho: "",
    quantidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto cadastrado:", produto);

    // Aqui futuramente você vai integrar com o backend Flask:
    // await axios.post("http://localhost:5000/api/produtos", produto);

    alert("Peça cadastrada com sucesso!");
    setProduto({ nome: "", tamanho: "", quantidade: "" });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-pink-300 text-white py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Cadastro de Roupas</h1>
          <nav className="flex gap-4">
            <a href="/" className="hover:underline">Estoque</a>
            <a href="/cadastro" className="hover:underline font-semibold">Cadastro</a>
            <a href="/relatorios" className="hover:underline">Relatórios</a>
          </nav>
        </div>
      </header>

      {/* Formulário */}
      <section className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Adicionar Nova Peça
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Nome da Peça:
            </label>
            <input
              type="text"
              name="nome"
              value={produto.nome}
              onChange={handleChange}
              required
              placeholder="Ex: Camiseta Branca"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Tamanho */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Tamanho:
            </label>
            <select
              name="tamanho"
              value={produto.tamanho}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Selecione...</option>
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Quantidade:
            </label>
            <input
              type="number"
              name="quantidade"
              value={produto.quantidade}
              onChange={handleChange}
              required
              min="1"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg transition font-semibold"
          >
            Cadastrar Peça
          </button>
        </form>
      </section>
    </main>
  );
}
