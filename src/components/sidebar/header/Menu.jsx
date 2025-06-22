import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
import { useState } from "react";

export default function Menu({ setShowCreateGroup, setShowDados }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
        <ul>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowDados(true)}
          >
            <span>Meus dados salvos</span>
          </li>

          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>Criar meu Comercio</span>
          </li>

          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>
              Ser Motorista Aplicativo</span>
          </li>
          
          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>
            Vender Conteudos
            </span>
          </li>

          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => dispatch(logout())}
          >
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}
