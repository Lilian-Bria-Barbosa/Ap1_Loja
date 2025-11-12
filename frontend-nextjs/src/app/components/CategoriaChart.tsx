"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Roupas", value: 15 },
  { name: "Acessórios", value: 7 },
  { name: "Calçados", value: 10 },
];

const COLORS = ["#f472b6", "#86efac", "#93c5fd"];

export default function CategoriaChart() {
  return (
    <div className="w-full h-64 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Distribuição por Categoria
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={80}
            fill="#f472b6"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
