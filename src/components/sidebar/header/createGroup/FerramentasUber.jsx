import React from "react";
import { ReturnIcon } from "../../../../svg";

export default function FerramentasUber({setShowFerramentasUber}) {
  return (
    <div className="createGroupAnimation relative h-full z-40 p-6">
        {/* Botão Fechar no topo direito */}
      <button
        onClick={() => setShowFerramentasUber(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>
      <form className="space-y-6 bg-dark_bg_2 p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Minhas Ferramentas</h2>
        


      </form>
    </div>
  );
}
