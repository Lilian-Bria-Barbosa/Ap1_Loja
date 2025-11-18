"use client";


export default function Sidebar() {
    
    const navItems = [
        { name: 'Início', href: '/' },
        { name: 'Produtos', href: '/produtos' }, 
        { name: 'Estoque', href: '/estoque' },   
        { name: 'Relatórios', href: '/relatorios' },
        { name: 'Funcionários', href: '/funcionarios' },
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-8">Painel do Sistema</h1>
            <nav className="flex-1">
                {navItems.map((item) => (
                    <a 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center p-3 my-2 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        {item.name}
                    </a>
                ))}
            </nav>
        </div>
    );
}