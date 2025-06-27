import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Tailwind custom style injection para animação
const style = `
@keyframes blinkColor {
  0% { color: #10b981; }
  50% { color: #3b82f6; }
  100% { color: #10b981; }
}
.blinking-link {
  animation: blinkColor 1s infinite;
}

@keyframes blinkLogo {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
.blinking-logo {
  animation: blinkLogo 1.5s infinite;
}
`;

export default function EscolherPerfil() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md max-h-screen overflow-y-auto space-y-8 p-10 rounded-xl">
        {/* LOGO */}
        <div className="text-center dark:text-dark_text_1">
          <img
            src="/assets/img/vairapido.png"
            alt="Logo Vai Rápido"
            className="w-48 h-32 mx-auto mb-0 blinking-logo"
          />
          <h1 className="mt-1 text-1xl font-bold">Empresa Inovadora Franca-SP</h1>
          <p className="mt-2 text-sm">Escolha seu perfil</p>
        </div>

        {/* LINKS DE PERFIL COM BACKGROUNDS DIFERENTES */}
        <div className="flex flex-col items-center justify-center gap-4 mt-4 text-center w-full">
          <Link
            to="/registerempresas"
            className="blinking-link w-full text-white text-lg font-semibold bg-green-500 rounded-lg py-2 hover:brightness-110 transition"
          >
            Acessar como Empresa
          </Link>
          <Link
            to="/registeruber"
            className="blinking-link w-full text-white text-lg font-semibold bg-yellow-400 rounded-lg py-2 hover:brightness-110 transition"
          >
            Acessar como Uber
          </Link>
          <Link
            to="/registercomercios"
            className="blinking-link w-full text-white text-lg font-semibold bg-blue-500 rounded-lg py-2 hover:brightness-110 transition"
          >
            Acessar como Comércio
          </Link>
          <Link
            to="/register"
            className="blinking-link w-full text-white text-lg font-semibold bg-purple-500 rounded-lg py-2 hover:brightness-110 transition"
          >
            Acessar como Cliente
          </Link>
          <Link
            to="/registerchatprivado"
            className="blinking-link w-full text-white text-lg font-semibold bg-pink-500 rounded-lg py-2 hover:brightness-110 transition"
          >
            Acessar Chat Privado
          </Link>
        </div>

          {/* Sign in link */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>have an account ?</span>
            <Link
              to="/login"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign in
            </Link>
          </p>

        
        <div className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
         
          </div>
        </div>
      </div>
    </div>
  );
}
