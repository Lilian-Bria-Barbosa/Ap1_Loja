"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Roupas", value: 15 },
  { name: "Acessórios", value: 7 },
  { name: "Calçados", value: 10 },
];

const COLORS = ["#f472b6", "#86efac", "#93c5fd"];

export default function CategoriaChart() {
  const [mounted, setMounted] = useState(false);

  // garante que só renderiza o gráfico no client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-64 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Distribuição por Categoria
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={80} label>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
