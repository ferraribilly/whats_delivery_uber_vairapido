import React from "react";
import { ReturnIcon } from "../../../../svg";

export default function SobreUsoApp({ setShowSobreUsoApp }) {
  return (
    <div className="createGroupAnimation relative h-full z-40 p-6 overflow-y-auto z-[999]">
      {/* Botão Fechar */}
      <button
        onClick={() => setShowSobreUsoApp(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>

      {/* CONTEÚDO SOBRE O USO DO APP */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16 px-6 rounded-2xl shadow-2xl mt-14">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8">Sobre Aplicativo</h1>
          <p>
            Compativel com o seguintes navegadores moveis e web: chrome,fireFox,Opera
          </p>
         
          

          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            O <strong>Vai Rápido</strong> 
            e uma plataforma de mobilidade facilitando para que suas corridas seja de forma facil e rapida e descomplicada
            assim vc desfruta de uma forma facil mais muito segura pois nosso monitoramento e totalmente em tempo real desde sua entrada no app
            garatindo uma viagem segura com motoristas Responsaveis e verificados.
          </p>

          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            Rápido, moderno e diferente de tudo no mercado. Em poucos cliques, você acessa corrida com comunicação em tempo real.
          </p>
           <h1 className="text-4xl md:text-5xl font-extrabold mb-8">Modo de uso</h1>
             <p className="text-lg md:text-xl mb-6 leading-relaxed">
            (1º): Coloque o local que você se encontra no "Ponto Partida" e depois para onde você vai no "Destino"
          </p>
          <p>Exemplo:</p>
          <p>
            PONTO PARTIDA: Rua.General Osório, Franca 
          </p>
           <p>
            DESTINO Rua.Valter Galvão City Petropolis, Franca 
          </p>
             <p className="text-lg md:text-xl mb-6 leading-relaxed">
            (2º): Após clique no botão "Calcular Valor"
          </p>
           


              <img src="/assets/img/logovaiRapidoUber.png" alt="Chat" className="w-100 h-100 mx-auto md:mx-0" />
            
        

          {/* FUNCIONALIDADES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
            
        
          
          </div>
        </div>
      </section>
    </div>
  );
}
