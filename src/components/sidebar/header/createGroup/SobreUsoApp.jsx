import React from "react";
import { ReturnIcon } from "../../../../svg";

export default function SobreUsoApp({ setShowSobreUsoApp }) {
  return (
    <div className="createGroupAnimation relative h-full z-40 p-6 overflow-y-auto">
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8">Sobre Nós</h1>

          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            O <strong>Vai Rápido</strong> é muito mais que um aplicativo. É uma plataforma completa que integra tudo o que você precisa para conversar, trabalhar, vender, entregar e aumentar sua renda — direto do celular, sem complicações!
          </p>

          <p className="text-lg md:text-xl mb-6 leading-relaxed">
            Rápido, moderno e diferente de tudo no mercado. Em poucos cliques, você acessa comunicação, corridas, delivery, loja virtual, RH e gestão de equipe — com segurança, API integrada e suporte real.
          </p>

          {/* FUNCIONALIDADES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
            
            {/* Chat */}
            <div>
              <h2 className="text-2xl font-bold mb-2">💬 Chat Privado</h2>
              <p className="text-white mb-4">
                Converse em tempo real com criptografia de ponta a ponta. Seguro, direto e fácil.
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="Chat" className="w-20 h-20 mx-auto md:mx-0" />
            </div>

            {/* Transporte */}
            <div>
              <h2 className="text-2xl font-bold mb-2">🚗 Corridas e Transporte</h2>
              <p className="text-white mb-4">
                Seja um motorista parceiro com as <strong>menores taxas do mercado</strong> e defina seus próprios valores por km ou por corrida. Ao contrário das grandes empresas, você faz seu salário com liberdade e justiça.
              </p>
              <p className="text-white mb-4">
                Envie seu currículo para estabelecimentos e aumente sua renda com oportunidades reais em Franca e região. Vamos crescer juntos!
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Transporte" className="w-20 h-20 mx-auto md:mx-0" />
            </div>

            {/* Delivery */}
            <div>
              <h2 className="text-2xl font-bold mb-2">🍔 Delivery de Produtos</h2>
              <p className="text-white mb-4">
                Entregue refeições, mercado ou documentos. Sistema com rastreamento e pagamento direto. Seja entregador e trabalhe com liberdade.
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="Delivery" className="w-20 h-20 mx-auto md:mx-0" />
            </div>

            {/* Lojas */}
            <div>
              <h2 className="text-2xl font-bold mb-2">🛒 Lojas e Vendas</h2>
              <p className="text-white mb-4">
                Tenha sua loja digital com controle de estoque, integração Mercado Pago, entregas automáticas e painel exclusivo — tudo no app, sem computador.
              </p>
              <p className="text-white mb-4">
                Relatórios em PDF ou por e-mail, com taxa fixa de <strong>R$ 49,00/mês</strong> e suporte online 24h.
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/711/711261.png" alt="Loja" className="w-20 h-20 mx-auto md:mx-0" />
            </div>

            {/* RH & API */}
            <div>
              <h2 className="text-2xl font-bold mb-2">📊 RH, Ponto e API Python</h2>
              <p className="text-white mb-4">
                Sistema completo com folha de pagamento, controle de ponto digital, relatórios via API com Python e Pandas, além de compartilhamento de atividades.
              </p>
              <p className="text-white mb-4">
                Tudo online, rápido e automatizado. Ideal para empresas que querem economizar e controlar tudo de qualquer lugar. Plano: <strong>R$ 99,00/mês</strong>.
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/857/857681.png" alt="RH e API" className="w-20 h-20 mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
