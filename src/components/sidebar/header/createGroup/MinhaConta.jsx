import React from "react";
import { ReturnIcon } from "../../../../svg";
export default function MinhaConta({setShowMinhaConta}) {
  return (
    <div className="createGroupAnimation relative h-full z-40 p-6">
        {/* Botão Fechar no topo direito */}
      <button
        onClick={() => setShowMinhaConta(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>
      <form className="space-y-6 bg-dark_bg_2 p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Minha Conta</h2>

        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm text-gray-300 mb-1">
            Status:
          </label>
          <input
            type="text"
            id="status"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder=""
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-300 mb-1">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder=""
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm text-gray-300 mb-1">
            Email:
          </label>
          <input
            type="text"
            id="email"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder=""
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm text-gray-300 mb-1">
            Senha:
          </label>
          <input
            type="text"
            id="password"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder=""
          />
        </div>

        <button
          type="button"
          className="w-full mt-4 bg-green_1 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Mudar Senha
        </button>

         <button
  type="button"
  className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
>
  Excluir Conta
</button>

        
      </form>
    </div>
  );
}
