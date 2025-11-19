
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sistema Loja",
  description: "Sistema Fullstack Next.js + Flask",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex bg-gray-100 min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Painel do Sistema</h2>

          <nav className="flex flex-col gap-3">
            <Link href="/" className="hover:bg-gray-700 p-2 rounded">🏠 Início</Link>
            <Link href="/produtos" className="hover:bg-gray-700 p-2 rounded">📦 Produtos</Link>
            <Link href="/estoque" className="hover:bg-gray-700 p-2 rounded">📊 Estoque</Link>
            <Link href="/relatorios" className="hover:bg-gray-700 p-2 rounded">📑 Relatórios</Link>
            <Link href="/funcionarios" className="hover:bg-gray-700 p-2 rounded">👥 Funcionários</Link>
          </nav>

         
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-8 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
