import { useState, useEffect } from "react";
import { ReturnIcon } from "../../../../svg"; // ValidIcon não está sendo usado

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
    }, 5000); // Troca a cada 5 segundos

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
        {/* Título */}
        <h1 className="text-2xl font-bold mb-2">Modelo Cardápio</h1>

        {/* Imagem Animada - altura aumentada */}
        <div className="w-full h-[600px] overflow-hidden rounded-lg shadow-md">
          <img
            src={images[currentImageIndex]}
            alt="Slogan"
            className="w-full h-full object-cover transition duration-500 ease-in-out"
          />
        </div>

    {/* Link para Demonstração */}
<div className="mt-4 flex justify-center">
  <a
    href="/demostracao"
    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
  >
    Demonstração Estilo Cardápio Online
  </a>
</div>

      </div>
    </div>
  );
}
