import CategoriaChart from "./components/CategoriaChart";

export default function HomePage() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-pink-700">
       
      </h1>
      <p className="mt-4 text-gray-600">
        Selecione uma opção no menu lateral para começar.
      </p>

      <h2>
        <p className="mt-4 txt-gray-600">
          Bem vindo ao Gerenciador de Estoque Brizart!
        </p>
      </h2>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md h-80">
      <CategoriaChart />
    </div>

    </div>

    

  );
}
