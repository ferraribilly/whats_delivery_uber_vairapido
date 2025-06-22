import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { changeStatus, registerUser } from "../../features/userSlice";
import { useState } from "react";
import Picture from "./Picture";
import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // MANTENDO registerUber, mas pegando do useForm corretamente
  const {
    register: registerUber,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    try {
      let imageUrl = "";
      if (picture) {
        const response = await uploadImage();
        imageUrl = response.secure_url;
      }

      const result = await dispatch(registerUser({ ...data, picture: imageUrl }));

      if (result?.payload?.uber) {
        setSuccessMsg("Cadastro realizado com sucesso!");
        setTimeout(() => navigate("/"), 2000); // redireciona depois de 2s
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", picture);
    formData.append("upload_preset", "vaiturbo");

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );
    return data;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">
            Estamos Felizes com sua escolha
          </h2>
          <p className="mt-2 text-sm">Registre-se</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="status"
            type="text"
            placeholder="Status (Moto ou Carro)"
            registerUber={registerUber}
            error={errors?.status?.message}
          />
          <AuthInput
            name="cpf"
            type="text"
            placeholder="CPF"
            registerUber={registerUber}
            error={errors?.cpf?.message}
          />
          <AuthInput
            name="endereco"
            type="text"
            placeholder="Endereço"
            registerUber={registerUber}
            error={errors?.endereco?.message}
          />
          <AuthInput
            name="tipoVeiculo"
            type="text"
            placeholder="Modelo (Moto ou Carro)"
            registerUber={registerUber}
            error={errors?.tipoVeiculo?.message}
          />
          <AuthInput
            name="placa"
            type="text"
            placeholder="Placa"
            registerUber={registerUber}
            error={errors?.placa?.message}
          />
          <AuthInput
            name="cor"
            type="text"
            placeholder="Cor"
            registerUber={registerUber}
            error={errors?.cor?.message}
          />

          <Picture
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
          />

          {error && <p className="text-red-500">{error}</p>}
          {successMsg && <p className="text-green-500">{successMsg}</p>}

          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide
              font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300"
            type="submit"
          >
            {status === "loading" ? <PulseLoader color="#fff" size={16} /> : "Sign up"}
          </button>

          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Sair</span>
            <Link
              to="#"
              className="hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
