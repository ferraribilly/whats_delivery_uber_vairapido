import { useState, useEffect } from "react";
import { ReturnIcon, ValidIcon } from "../../../../svg";

// Importa todas as imagens da pasta assets/slogan
const images = [
  "./assets/slogan/image1.png",
  "./assets/slogan/image2.png",
  "./assets/slogan/image3.png",
  "./assets/slogan/image4.png",
  // Adicione aqui o resto das imagens que tiver
];

export default function CreateGroup({ setShowCreateGroup }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Troca a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="createGroupAnimation relative flex0030 h-full z-40">
      {/* Botão Fechar no topo direito */}
      <button
        onClick={() => setShowCreateGroup(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>

      {/* Container com rolagem */}
      <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-full">
        {/* Título Ferramentas */}
        <h1 className="text-2xl font-bold mb-2">Ferramentas</h1>

        {/* Imagem Animada - altura ajustada */}
        <div className="w-full h-72 overflow-hidden rounded-lg shadow-md">
          <img
            src={images[currentImageIndex]}
            alt="Slogan"
            className="w-full h-full object-cover transition duration-500 ease-in-out"
          />
        </div>

        {/* Título das opções */}
        <h2 className="text-xl font-semibold mt-4">Criar Novo Cadastro</h2>

        {/* Opções */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={() => {
            console.log("Criar Delivery");
          }}
        >
          Criar Delivery
        </button>

        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          onClick={() => {
            console.log("Criar Loja");
          }}
        >
          Criar Loja
        </button>

        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
          onClick={() => {
            console.log("Criar Empresa");
          }}
        >
          Criar Empresa
        </button>

        <button
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
          onClick={() => {
            console.log("Criar Pizzaria");
          }}
        >
          Criar Pizzaria
        </button>

        {/* Novas opções Uber */}
        <button
          className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          onClick={() => {
            console.log("Criar Uber Moto");
          }}
        >
          Criar Uber Moto
        </button>

        <button
          className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-black transition"
          onClick={() => {
            console.log("Criar Uber Carro");
          }}
        >
          Criar Uber Carro
        </button>

        {/* Nova opção: Vendas de Conteúdos Digitais */}
        <button
          className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition"
          onClick={() => {
            console.log("Vendas de Conteúdos Digitais");
          }}
        >
          Vendas de Conteúdos Digitais
        </button>
      </div>
    </div>
  );
}
