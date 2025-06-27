import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { changeStatus, registerUser } from "../../features/userSlice";
import { useState } from "react";
import PictureRg from "./PictureRg";
import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const upload_preset = "vaiturbo";

export default function RegisterComercios() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const [pictureRg, setPictureRg] = useState();
  const [readablePictureRg, setReadablePictureRg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));

    let pictureUrl = "";
    if (pictureRg) {
      try {
        const response = await uploadImage();
        pictureUrl = response.secure_url;
      } catch (err) {
        console.error("Erro ao subir imagem:", err);
      }
    }

    const res = await dispatch(
      registerUser({ ...data, pictureRg: pictureUrl })
    );

    if (res?.payload?.user) {
      navigate("/");
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", pictureRg);
    formData.append("upload_preset", upload_preset);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      formData
    );
    return data;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10  rounded-xl">
        <img
          src="/assets/img/logovaiRapidoCardapioOnlines.png"
          alt="Logo Ferramenta Pandas"
          className="w-60 h-48 mx-auto mb-0 blinking-logo"
        />
        <div className="text-center dark:text-dark_text_1">
          <p className="mt-2 text-sm">Sign up</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="name"
            type="text"
            placeholder="Full Name"
            register={register}
            error={errors?.name?.message}
          />
          <AuthInput
            name="cpf"
            type="text"
            placeholder="Cpf ou cnpj"
            register={register}
            error={errors?.cpf?.message}
          />
          <AuthInput
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="nomeEstabelecimento"
            type="text"
            placeholder="Nome Estabelecimento (Slogan)"
            register={register}
            error={errors?.nomeEstabelecimento?.message}
          />
          <AuthInput
            name="enderecoEstabelecimento"
            type="text"
            placeholder="Endereço Estabelecimento"
            register={register}
            error={errors?.enderecoEstabelecimento?.message}
          />
          <AuthInput
            name="status"
            type="text"
            placeholder="Tipo (Restaurantes,Lanchonetes,Pizzarias)"
            register={register}
            error={errors?.status?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />

          {/* Upload do RG */}
          <PictureRg
            readablePicture={readablePictureRg}
            setReadablePicture={setReadablePictureRg}
            setPicture={setPictureRg}
          />

          {error && (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          )}

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

          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>have an account ?</span>
            <Link
              to="/login"
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
