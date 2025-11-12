import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../app/components/Sidebar";
import Header from "../app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP1 Loja - Sistema de Estoque",
  description: "Sistema de gerenciamento de estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-pink-50 text-gray-800`}
      >
        {/* Barra lateral fixa */}
        <Sidebar />

        {/* Conteúdo principal */}
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
