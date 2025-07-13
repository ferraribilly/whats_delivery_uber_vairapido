import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { changeStatus, registerUser } from "../../features/userSlice";
import { useState } from "react";
import Picture from "./Picture"; // ⬅️ Componente de upload
import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");

  const [showVehicleFields, setShowVehicleFields] = useState(false);

  // ⬇️ Novos estados de imagem
  const [cnhPicture, setCnhPicture] = useState();
  const [cnhReadable, setCnhReadable] = useState("");

  const [docVeiculoPicture, setDocVeiculoPicture] = useState();
  const [docReadable, setDocReadable] = useState("");

  const [qrCodePicture, setQrCodePicture] = useState();
  const [qrReadable, setQrReadable] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));

    try {
      const uploads = [];

      if (picture) uploads.push(uploadImage(picture));
      if (cnhPicture) uploads.push(uploadImage(cnhPicture));
      if (docVeiculoPicture) uploads.push(uploadImage(docVeiculoPicture));
      if (qrCodePicture) uploads.push(uploadImage(qrCodePicture));

      const [profileRes, cnhRes, docRes, qrRes] = await Promise.all(uploads);

      const fullData = {
        ...data,
        picture: profileRes?.secure_url || "",
        fotoCNH: cnhRes?.secure_url || "",
        fotoDocumentoVeiculo: docRes?.secure_url || "",
        fotoQrCode: qrRes?.secure_url || "",
      };

      const res = await dispatch(registerUser(fullData));
      if (res?.payload?.user) navigate("/");
    } catch (err) {
      console.error("Erro ao enviar imagens:", err);
    }
  };

  const uploadImage = async (imgFile) => {
    const formData = new FormData();
    formData.append("file", imgFile);
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
        {/* ✅ LOGO */}
        <img
          src="/assets/img/logovaiRapidoUber.png"
          alt="Logo Vai Rápido"
          className="w-60 h-48 mx-auto mb-0 blinking-logo"
        />

        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Bem-vindo(a)</h2>
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
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="status"
            type="text"
            placeholder="Status (Optional nome sera usado dentro do app motorista chamar vc )"
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

          {/* ✅ Upload foto de perfil */}
          <Picture
            label="Foto de Perfil"
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
          />

         

          {/* ✅ Campos adicionais se visíveis */}
          {showVehicleFields && (
            <div className="space-y-4">
              <AuthInput
                name="tipoVeiculo"
                type="text"
                placeholder="Tipo de Veículo"
                register={register}
                error={errors?.tipoVeiculo?.message}
              />
              <AuthInput
                name="marca"
                type="text"
                placeholder="Marca do Veículo"
                register={register}
                error={errors?.marca?.message}
              />
              <AuthInput
                name="cor"
                type="text"
                placeholder="Cor do Veículo"
                register={register}
                error={errors?.cor?.message}
              />
              <AuthInput
                name="placa"
                type="text"
                placeholder="Placa do Veículo"
                register={register}
                error={errors?.placa?.message}
              />
               <AuthInput
                name="precoPorKm"
                type="text"
                placeholder="Seu preço por Km rodados(exemplo: 2.5 vale 2,50)"
                register={register}
                error={errors?.precoPorKm?.message}
              />
               <AuthInput
                name="precoPorMinuto"
                type="text"
                placeholder="Seu preço por Minutos da Viagem (opcional exemplo: 0.1 vale 0.01 cent )"
                register={register}
                error={errors?.precoPorMinuto?.message}
              />
               <AuthInput
                name="taxaFixa"
                type="text"
                placeholder="Valor aplicado na taxa final(exemplo: 0.3 vale a 0.30 cent somado no final do valor)"
                register={register}
                error={errors?.taxaFixa?.message}
              />
               <AuthInput
                name="descontoHorario"
                type="text"
                placeholder="% desconto que vc gostaria de 30 a 30 min(exemplo: 0.3 e o valor 3%)"
                register={register}
                error={errors?.descontoHorario?.message}
              />
              <AuthInput
                name="chavePix"
                type="text"
                placeholder="Chave Pix(vai ate seu aplicativo e gere uma chave e cole aqui crie um sem data de expiracao vai poder receber noapp diretamente vc e cliente pelo app e vc mesmo confirma o pagamento depois paga sua taxa vc mesmo ao app)"
                register={register}
                error={errors?.chavePix?.message}
              />

              {/* ✅ Uploads adicionais */}
               <Picture
                label="Foto QrCode PIX(voce vai usar a imagem gerada pelo chave que vc fez edita ela e deixe so QrCode pra enviar se nao aparecer entre contato com suporte dntro do app e ajudaremos vc  ok"
                readablePicture={qrReadable}
                setReadablePicture={setQrReadable}
                setPicture={setQrCodePicture}
              />
              <Picture
                label="Foto CNH (Frente)"
                readablePicture={cnhReadable}
                setReadablePicture={setCnhReadable}
                setPicture={setCnhPicture}
              />
              <Picture
                label="Foto Documento do Veículo"
                readablePicture={docReadable}
                setReadablePicture={setDocReadable}
                setPicture={setDocVeiculoPicture}
              />
             
            </div>
          )}

          {/* Erro geral */}
          {error && <p className="text-red-400">{error}</p>}

          {/* Submit */}
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

           {/* ✅ Botão para mostrar campos de veículo */}
          <button
            type="button"
            onClick={() => setShowVehicleFields(!showVehicleFields)}
            className="w-full flex justify-center bg-gold text-dark p-4 rounded-full tracking-
             font-semibold focus:outline-none hover:bg-gold shadow-lg cursor-pointer transition ease-in duration-300
            "
          >
            {showVehicleFields ? "Ocultar dados do veículo" : "Quero ser um Motorista "}
          </button>
        </form>
      </div>
    </div>
  );
}
