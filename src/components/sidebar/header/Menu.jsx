import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/userSlice";
import MinhaContaIcon from "../../../svg/MinhaConta";
import SobreAppIcon from "../../../svg/SobreApp"
import ExecelIcon from "../../../svg/Execel";
import LogoutIcon from "../../../svg/Logout";
import { useState } from "react";

export default function Menu({ setShowCreateGroup, setShowMinhaConta, setShowSobreUsoApp }) {
  const dispatch = useDispatch();
  // Pega o usuário do Redux
  const user = useSelector((state) => state.user.user);
  const status = user?.status;
  return (
    <>
     <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
        <ul>
          {/* <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>New group</span>
          </li> */}

           <li
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
          onClick={() => setShowMinhaConta(true)}
        >
          <MinhaContaIcon className="dark:fill-dark_svg_1 w-6 h-6" />
          <span>Minha Conta</span>
        </li>
         <li
           className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
          onClick={() => setShowSobreUsoApp(true)}
        >
          <SobreAppIcon className="dark:fill-dark_svg_1 w-6 h-6" />
          <span>Sobre aplicativo</span>
        </li>

          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>Starred messaged</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3">
            <span>Settings</span>
          </li>

            <li
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
          onClick={() => dispatch(logout())}
        >
        <LogoutIcon className="dark:fill-dark_svg_1 w-6 h-6" />
          <span>Logout</span>
        </li>
        </ul>
      </div>
    </>
  );
}
