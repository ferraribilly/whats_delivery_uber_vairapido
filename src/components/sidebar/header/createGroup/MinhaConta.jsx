import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ReturnIcon } from "../../../../svg";
import axios from "axios";


export default function MinhaConta({  setShowMinhaConta }) {
  const userData = useSelector((state) => state.user.user);

  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


 

  const apiURL = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    if (userData) {
      setStatus(userData.status || "");
      setName(userData.name || "");
      setEmail(userData.email || "");
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

      <form
        className="space-y-6 bg-dark_bg_2 p-6 rounded-xl shadow-lg max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold text-white mb-4">Uber</h2>

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
          />
        </div>

      </form>
    </div>
  );
}
