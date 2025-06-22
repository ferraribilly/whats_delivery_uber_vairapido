import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus, registerUser } from "../../features/userSlice";
import { useState } from "react";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    registerVendaConteudo,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));

    let res = await dispatch(registerUser({ ...data, picture: "" }));
    if (res?.payload?.registerVendaConteudo) {
      setSuccessMessage("Registro realizado com sucesso!");
    }
  };

  const handleVoltar = () => {
    // Aqui você define depois o que o botão vai fazer
    console.log("Botão Voltar clicado");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* Heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Sign up</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="idade"
            type="text"
            placeholder="Idade (Maiores 18 anos)"
            registerVendaConteudo={registerVendaConteudo}
            error={errors?.idade?.message}
          />

          {/* Error */}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}

          {/* Success Message */}
          {successMessage && (
            <div>
              <p className="text-green-500 font-bold">{successMessage}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300"
            type="submit"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        {/* Botão Voltar */}
        <button
          onClick={handleVoltar}
          className="w-full flex justify-center bg-gray-500 text-white p-3 rounded-full mt-4
          hover:bg-gray-600 transition ease-in duration-300"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
