"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/estoque", label: "Estoque" },
    { href: "/produtos", label: "Produtos" },
    { href: "/relatorios", label: "Relatórios" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md hover:bg-gray-700 transition ${
              pathname === link.href ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
