import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReturnIcon } from "../../../../svg";

export default function MinhaConta({ setShowMinhaConta }) {
  const userData = useSelector((state) => state.user.user); // ✅ AQUI O AJUSTE

  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userData) {
      setStatus(userData.status || "");
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPassword("");
    }
  }, [userData]);

  return (
    <div className="createGroupAnimation relative h-full z-40 p-6">
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
          />
        </div>

        {/* <div className="flex flex-col">
          <label htmlFor="password" className="text-sm text-gray-300 mb-1">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite nova senha"
          />
        </div>

        <button
          type="button"
          className="w-full mt-4 bg-green_1 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          onClick={() => alert("Implementar lógica para mudar senha")}
        >
          Mudar Senha
        </button>

        <button
          type="button"
          className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          onClick={() => alert("Implementar lógica para excluir conta")}
        >
          Excluir Conta
        </button> */}
      </form>
    </div>
  );
}
