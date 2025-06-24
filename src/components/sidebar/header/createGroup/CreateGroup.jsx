import React, { useState } from "react";

export default function CreateGroup() {
  return (
    <div className="createGroupAnimation relative h-full z-40 p-6">
      <form className="space-y-6 bg-dark_bg_2 p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Criar Grupo</h2>

        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-300 mb-1">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder="Digite o nome do grupo"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email1" className="text-sm text-gray-300 mb-1">
            Email 1:
          </label>
          <input
            type="text"
            id="email1"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder="Digite o e-mail do membro"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email2" className="text-sm text-gray-300 mb-1">
            Email 2:
          </label>
          <input
            type="text"
            id="email2"
            className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2 focus:outline-none focus:ring-2 focus:ring-green_1"
            placeholder="Digite outro e-mail"
          />
        </div>
      </form>
    </div>
  );
}
