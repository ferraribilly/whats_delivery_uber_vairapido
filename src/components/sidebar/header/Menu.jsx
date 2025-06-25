import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/userSlice";

export default function Menu({ setShowMinhaConta, setShowFerramentasUber, setShowFerramentasComercio, setShowSobreUsoApp }) {
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
          <span>Sobre Nós</span>
        </li>

      

        {/* Mostra só se status for "Comercio" */}
        {status === "Comercio" && (
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowFerramentasComercio(true)}
          >
            <span>Ferramentas Comercio</span>
          </li>
        )}

        {/* Mostra só se status for "Uber" */}
        {status === "uber" && (
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowFerramentasUber(true)}
          >
            <span>Ferramentas Uber</span>
          </li>
        )}

        <li
          className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
          onClick={() => dispatch(logout())}
        >
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
