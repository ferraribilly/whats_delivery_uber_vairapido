import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/userSlice";
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
export default function Menu({ setShowMinhaConta,setShowMap, setShowSobreUsoApp }) {
  const dispatch = useDispatch();

  // Pega o usuário do Redux
  const user = useSelector((state) => state.user.user);
  const status = user?.status;

  return (
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
          onClick={() => setShowSobreUsoApp(true)}
        >
          <span>Sobre aplicativo</span>
        </li>
          <li
  className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3 flex items-center gap-2"
  onClick={() => setShowMap(true)}
>
  <StoryIcon className="dark:fill-dark_svg_1 w-6 h-6" />
  <span>Waze Navegação</span>
</li>

       
        <li
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
          onClick={() => dispatch(logout())}
        >
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
