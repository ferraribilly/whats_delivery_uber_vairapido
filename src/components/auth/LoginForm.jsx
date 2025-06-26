import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/userSlice";
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

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (values) => {
    let res = await dispatch(loginUser({ ...values }));
    console.log(res);
    if (res?.payload?.user) {
      navigate("/");
    }
  };

  // Injeta o CSS da animação uma vez
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
      {/* Container com scroll */}
      <div className="w-full max-w-md max-h-screen overflow-y-auto space-y-8 p-10 rounded-xl">
        {/* Heading */}
        <div className="text-center dark:text-dark_text_1">
          {/* ✅ LOGO DA EMPRESA COM ANIMAÇÃO */}
          <img
            src="/assets/img/vairapido.png"
            alt="Logo Vai Rápido"
            className="w-48 h-32 mx-auto mb-0 blinking-logo"
          />
          <h1 className="mt-1 text-1xl font-bold">Empresa Inovadora Franca-SP</h1>
          <p className="mt-2 text-sm">Sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />

          {/* if we have an error */}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}

          {/* Submit button */}
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
              font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300"
            type="submit"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign in"
            )}
          </button>

          {/* Sign in link + imagens */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>you do not have an account ?</span>
            <Link
              to="/escolherperfil"
              className="blinking-link hover:underline cursor-pointer transition ease-in duration-300"
            >
              Click Aqui
            </Link>

            {/* ✅ IMAGEM DO CERTIFICADO SSL */}
            <img
              src="/assets/img/ssl.png"
              alt="Certificado SSL"
              className="w-24 h-auto mt-4"
            />

            {/* ✅ 3 ÍCONES: ANDROID / IOS / WEB */}
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <img
                src="/assets/img/mercado-pago-seeklogo.png"
                alt="Android"
                className="w-12 h-12"
              />
              <img
                src="/assets/img/ios.png"
                alt="iOS"
                className="w-12 h-12"
              />
              <img
                src="/assets/img/web.png"
                alt="Web React/Next"
                className="w-12 h-12"
              />
            </div>
          </p>
        </form>
      </div>
    </div>
  );
}
