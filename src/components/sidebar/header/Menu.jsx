import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
import { useState } from "react";


export default function Menu({ setShowMinhaConta, setShowFavoritos }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
        <ul>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowMinhaConta(true)}
          >
            <span>Minha Conta</span>
          </li>
          
            <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowFavoritos(true)}
          >
            <span>Meus favoritos</span>
          </li>


          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>Favoritos</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>Settings</span>
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
