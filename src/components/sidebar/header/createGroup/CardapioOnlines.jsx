import React from "react";
import { ReturnIcon } from "../../../../svg";

export default function Cardapio({ setShowCardapioOnlines }) {
  const handleContato = () => {
    const numero = "5527998031796";
    const mensagem = "Quero abrir meu app com você, como funciona?";
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");
  };

  return (
    <div className="createGroupAnimation relative h-full z-40 p-6 overflow-y-auto">
      {/* Botão Fechar */}
      <button
        onClick={() => setShowCardapioOnlines(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>

      {/* Cards Links Direciona cada */}
      <section className="bg-gradient-to-br from-black-600 to-purple-700 text-white py-16 px-6 rounded-2xl shadow-2xl mt-14">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8">Seja bem-vindo</h1>
          <p>Escolha a Lanchonete de sua Preferencia Aqui</p>

          {/* NOVO CARD COM BACKGROUND */}
          <div
            className="mt-12 relative bg-center bg-cover bg-no-repeat rounded-xl shadow-lg w-full max-w-xl mx-auto h-44 flex items-center justify-center"
            style={{
              backgroundImage: "url('/cardapios_digital/img/burguer.png')",
            }}
          >
            <div className="bg-black bg-opacity-60 p-6 rounded-xl text-white text-center">
              <h1 className="text-3xl font-bold animate-pulse animated-title">
                Demostração
              </h1>
              <a
                href="/cardapios_digital/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2 bg-purple-700 text-white rounded-full cursor-pointer hover:bg-purple-800 transition inline-block"
              >
                Acessar Cardápio
              </a>
            </div>
          </div>
          {/* FIM DO CARD */}


          
          {/* NOVO CARD COM BACKGROUND */}
          <div
            className="mt-12 relative bg-center bg-cover bg-no-repeat rounded-xl shadow-lg w-full max-w-xl mx-auto h-64 flex items-center justify-center"
            style={{
              backgroundImage: "url('/assets/img/bg.png')",
            }}
          >
            <div className="bg-black bg-opacity-60 p-6 rounded-xl text-white text-center">
              <h1 className="text-3xl font-bold animate-pulse animated-title">
                Demostração
              </h1>
              <a
                href="/cardapios_digital/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2 bg-purple-700 text-white rounded-full cursor-pointer hover:bg-purple-800 transition inline-block"
              >
                Acessar Cardápio
              </a>
            </div>
          </div>
          {/* FIM DO CARD */}


          {/* FUNCIONALIDADES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
            {/* conteúdo adicional aqui */}
          </div>

          {/* CONTATO WHATSAPP */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-black text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Quer abrir seu próprio app?</h2>
            <p className="mb-6">Fale diretamente comigo e descubra como funciona:</p>
            <button
              onClick={handleContato}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg transition"
            >
              Falar no WhatsApp
            </button>
          </div>
          {/* FIM CONTATO */}
        </div>
      </section>

      {/* ESTILO PERSONALIZADO */}
      <style>
        {`
          .animated-title {
            animation: pulseColor 1.5s infinite;
          }

          @keyframes pulseColor {
            0% { color: #8e44ad; }
            25% { color: #3498db; }
            50% { color: #e74c3c; }
            75% { color: #2ecc71; }
            100% { color: #f1c40f; }
          }
        `}
      </style>
    </div>
  );
}
