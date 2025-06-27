import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { changeStatus, registerUser } from "../../features/userSlice";
import { useState } from "react";
import Picture from "./PictureCnh";
import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

export default function RegisterUber() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");

  const [cnh, setCnh] = useState();
  const [readableCnh, setReadableCnh] = useState("");

  const [cnhBack, setCnhBack] = useState();
  const [readableCnhBack, setReadableCnhBack] = useState("");

  const [docVeiculo, setDocVeiculo] = useState();
  const [readableDocVeiculo, setReadableDocVeiculo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    try {
      const uploads = [];

      uploads.push(picture ? uploadImage(picture) : Promise.resolve({ secure_url: "" }));
      uploads.push(cnh ? uploadImage(cnh) : Promise.resolve({ secure_url: "" }));
      uploads.push(cnhBack ? uploadImage(cnhBack) : Promise.resolve({ secure_url: "" }));
      uploads.push(docVeiculo ? uploadImage(docVeiculo) : Promise.resolve({ secure_url: "" }));

      const [pictureRes, cnhRes, cnhBackRes, docVeiculoRes] = await Promise.all(uploads);

      const res = await dispatch(
        registerUser({
          ...data,
          picture: pictureRes.secure_url,
          cnh: cnhRes.secure_url,
          cnhBack: cnhBackRes.secure_url,
          docVeiculo: docVeiculoRes.secure_url,
        })
      );

      if (res?.payload?.user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Erro no envio de imagens:", err);
      dispatch(changeStatus("failed"));
    }
  };

  const uploadImage = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vaiturbo");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      formData
    );
    return data;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 rounded-xl">
        <div className="text-center dark:text-dark_text_1">
            {/* ✅ LOGO DA EMPRESA COM ANIMAÇÃO */}
          <img
            src="/assets/img/logovaiRapidoUber.png"
            alt="Logo Vai Rápido"
            className="w-60 h-48 mx-auto mb-0 blinking-logo"
          />
          <h2 className="mt-6 text-3xl font-bold"> </h2>
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
            placeholder="Cpf"
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
            name="veiculo"
            type="text"
            placeholder="Tipo Veiculo (Carro, Moto)"
            register={register}
            error={errors?.veiculo?.message}
          />
          <AuthInput
            name="marca"
            type="text"
            placeholder="Marca (Carro, Moto)"
            register={register}
            error={errors?.marca?.message}
          />
          <AuthInput
            name="placa"
            type="text"
            placeholder="Placa do Veículo"
            register={register}
            error={errors?.placa?.message}
          />
          <AuthInput
            name="corVeiculo"
            type="text"
            placeholder="Cor do Veículo"
            register={register}
            error={errors?.corVeiculo?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />
          <AuthInput
            name="valorKm"
            type="number"
            step="0.01"
            placeholder="Valor por Km (ex: 2.00)"
            register={register}
            error={errors?.valorKm?.message}
         />
           <AuthInput
            name="valorFixo"
            type="number"
            step="0.01"
            placeholder="Valor fixo final (ex: 0.30)"
            register={register}
            error={errors?.valorFixo?.message}
          />


          <Picture
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
            readableCnh={readableCnh}
            setReadableCnh={setReadableCnh}
            setCnh={setCnh}
            readableCnhBack={readableCnhBack}
            setReadableCnhBack={setReadableCnhBack}
            setCnhBack={setCnhBack}
            readableDocCarro={readableDocVeiculo}
            setReadableDocCarro={setReadableDocVeiculo}
            setDocCarro={setDocVeiculo}
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
              to="/loginuber"
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
