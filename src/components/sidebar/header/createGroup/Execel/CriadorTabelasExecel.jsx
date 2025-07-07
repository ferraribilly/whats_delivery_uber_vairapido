import React, { useState } from "react";
import { ReturnIcon } from "../../../../svg";

export default function CriadorTabelas({ setShowMinhaConta }) {
  const [nomePasta, setNomePasta] = useState("");
  const [tabelas, setTabelas] = useState([{ nome: "", email: "", senha: "" }]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const adicionarTabela = () => {
    setTabelas([...tabelas, { nome: "", email: "", senha: "" }]);
    setMostrarFormulario(false);
  };

  const removerTabela = (index) => {
    const novasTabelas = tabelas.filter((_, i) => i !== index);
    setTabelas(novasTabelas);
  };

  const atualizarCampo = (index, campo, valor) => {
    const novasTabelas = [...tabelas];
    novasTabelas[index][campo] = valor;
    setTabelas(novasTabelas);
  };

  const handleEnviar = () => {
    const payload = {
      pasta: nomePasta,
      tabelas,
    };

    console.log("Enviando planilha para API:", payload);

    // Integre com sua API aqui
  };

  return (
    <div className="createGroupAnimation relative h-full z-40 p-6">
      <button
        onClick={() => setShowMinhaConta(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>

      <div className="space-y-6 bg-dark_bg_2 p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Criador de Planilhas Excel
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-white text-lg">📁</span>
          <input
            type="text"
            id="nomePasta"
            value={nomePasta}
            onChange={(e) => setNomePasta(e.target.value)}
            className="flex-1 bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder="Nome da Pasta"
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Tabelas</h3>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="text-green-400 hover:text-green-600 text-xl"
            title="Adicionar nova tabela"
          >
            ➕
          </button>
        </div>

        {mostrarFormulario && (
          <div className="bg-dark_bg_3 p-4 rounded-md border border-dark_border_2 mb-4 space-y-2">
            <input
              type="text"
              placeholder="Nome da Tabela"
              value={""}
              onChange={() => {}}
              disabled
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2 opacity-50"
            />
            <input
              type="email"
              placeholder="Email"
              value={""}
              onChange={() => {}}
              disabled
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2 opacity-50"
            />
            <input
              type="text"
              placeholder="Senha"
              value={""}
              onChange={() => {}}
              disabled
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2 opacity-50"
            />

            <button
              onClick={adicionarTabela}
              className="w-full mt-2 bg-green_1 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Confirmar nova tabela
            </button>
          </div>
        )}

        {tabelas.map((tabela, index) => (
          <div
            key={index}
            className="bg-dark_bg_3 p-4 rounded-md border border-dark_border_2 mb-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">Tabela {index + 1}</h3>
              {tabelas.length > 1 && (
                <button
                  onClick={() => removerTabela(index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Nome da Tabela"
              value={tabela.nome}
              onChange={(e) => atualizarCampo(index, "nome", e.target.value)}
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2"
            />
            <input
              type="email"
              placeholder="Email"
              value={tabela.email}
              onChange={(e) => atualizarCampo(index, "email", e.target.value)}
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2"
            />
            <input
              type="text"
              placeholder="Senha"
              value={tabela.senha}
              onChange={(e) => atualizarCampo(index, "senha", e.target.value)}
              className="w-full bg-dark_bg_2 text-white p-2 rounded-md border border-dark_border_2"
            />
          </div>
        ))}

        <button
          onClick={handleEnviar}
          className="w-full mt-4 bg-green_1 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Criar e Enviar por Email
        </button>
      </div>
    </div>
  );
}
