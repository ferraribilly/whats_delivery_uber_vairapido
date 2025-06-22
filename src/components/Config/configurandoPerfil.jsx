import React from "react";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        
        {/* Logo + Nome da empresa */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-xl font-semibold dark:text-dark_text_1">
            Welcome
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center dark:text-dark_text_1 text-3xl font-bold mb-6">
          Whatsapp Ferrari
        </h1>

        {/* Botão Uber como Link */}
        <Link
          to="/formuber"
          className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300 mb-4 text-center block"
        >
          Registre-se Uber
        </Link>

        {/* Botão Estabelecimento como Link */}
        <Link
          to="/formestabelecimento"
          className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300 mb-4 text-center block"
        >
          Registre seu Estabelecimento
        </Link>

        {/* Botão Usuário como Link */}
        <Link
          to="/formuser"
          className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300 text-center block"
        >
          Registre-se Usuário
        </Link>

        {/* Link para login */}
        <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
          <span>have an account ?</span>
          <Link
            to="/"
            className="hover:underline cursor-pointer transition ease-in duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
