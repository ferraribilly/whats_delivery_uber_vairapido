import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/userSlice";
import { StoryIcon } from "../../../svg";
import LogoutIcon from "../../../svg/Logout";
import SobreAppIcon from "../../../svg/SobreApp"
import MinhaContaIcon from "../../../svg/MinhaConta";
import LanchonetesIcon from "../../../svg/Lanchonetes";
import ExecelIcon from "../../../svg/Execel";
export default function Menu({ setShowMinhaConta,setShowMap, setShowSobreUsoApp, setShowCardapioOnlines }) {
  const dispatch = useDispatch();

  // Pega o usuário do Redux
  const user = useSelector((state) => state.user.user);
  const status = user?.status;

  return (
    <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
      <ul>

        {/** Acesso ao Map.jsx */}
          <li
         className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
         onClick={() => setShowMap(true)}
        >
        <StoryIcon className="dark:fill-dark_svg_1 w-6 h-6" />
         <span>Uber Vai Rápido</span>
        </li>

        {/** Acesso as Lanchonetes.jsx */}
          <li
         className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
         onClick={() => setShowCardapioOnlines(true)}
        >
        <LanchonetesIcon className="dark:fill-dark_svg_1 w-6 h-6" />
         <span>Lanchonetes</span>
        </li>

         {/** Acesso as Ferramentas Execel */}
            <li
         className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
         onClick={() => setShowCardapioOnlines(true)}
        >
        <ExecelIcon className="dark:fill-dark_svg_1 w-6 h-6" />
         <span>Execel</span>
        </li>







          {/** Acesso aos dados da minha conta */}












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
        

       
        <li
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
          onClick={() => dispatch(logout())}
        >
        <LogoutIcon className="dark:fill-dark_svg_1 w-6 h-6" />
          <span>Logout</span>
        </li>

        {/**aqui sera visivel somente status uber aqui user nao tem acesso */}
          {/* Mostra só se status for "uber" */}
        {status === "uber" && (
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowMap(true)}
          >
            <span>Notificações Corridas</span>
          </li>
        )}



      </ul>
    </div>
  );
}
