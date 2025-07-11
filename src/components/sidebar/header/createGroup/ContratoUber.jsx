// ✅ Arquivo completo ajustado — ContratoUber.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReturnIcon } from "../../../../svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";
import PulseLoader from "react-spinners/PulseLoader";
import Picture from "../../../auth/Picture";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser, changeStatus } from "../../../../features/userSlice";

initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);

const signUpSchema = yup.object().shape({
  tipoVeiculo: yup.string().required("Campo obrigatório"),
  placa: yup.string().required("Campo obrigatório"),
  marca: yup.string().required("Campo obrigatório"),
});

export default function ContratoUber({ setShowMinhaConta }) {
  const userData = useSelector((state) => state.user.user);
  const { status, error } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const apiURL = process.env.REACT_APP_API_ENDPOINT;
  const cloud_name = process.env.REACT_APP_CLOUD_NAME;

  const [pictureFrente, setPictureFrente] = useState(null);
  const [previewFrente, setPreviewFrente] = useState("");
  const [pictureVerso, setPictureVerso] = useState(null);
  const [previewVerso, setPreviewVerso] = useState("");
  const [pictureDocumento, setPictureDocumento] = useState(null);
  const [previewDocumento, setPreviewDocumento] = useState("");

  const [aceitaContrato, setAceitaContrato] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
    }
  }, [userData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vaiturbo");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      formData
    );
    return data.secure_url;
  };

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    try {
      const urlFrente = pictureFrente ? await uploadImage(pictureFrente) : "";
      const urlVerso = pictureVerso ? await uploadImage(pictureVerso) : "";
      const urlDocumento = pictureDocumento ? await uploadImage(pictureDocumento) : "";

      const res = await dispatch(
        registerUser({
          ...data,
          name,
          email,
          pictureFrente: urlFrente,
          pictureVerso: urlVerso,
          pictureDocumento: urlDocumento,
        })
      );

      if (res?.payload?.msg) {
        alert("✅ Cadastro concluído com sucesso.");
        setShowMinhaConta(false);
      }
    } catch (error) {
      alert("Erro ao enviar cadastro.");
    }
  };

  return (
    <div className="createGroupAnimation relative z-40 h-screen bg-gray-50 dark:bg-gray-900">
      <button
        onClick={() => setShowMinhaConta(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Fechar"
      >
        <ReturnIcon className="w-6 h-6" />
      </button>

      <div className="h-full overflow-y-auto p-6">
        <div className="w-full max-w-3xl mx-auto space-y-8 p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-gray-200">
          <div className="text-center">
            <img
              src="/assets/img/logovaiRapidoUber.png"
              alt="Logo Vai Rápido"
              className="w-60 h-48 mx-auto mb-4 blinking-logo"
            />
            <h1 className="text-4xl font-bold mb-4">Contrato e Informações para Motoristas</h1>
            <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-10">
              Leia com atenção as condições para usar o app e se tornar nosso parceiro.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Dados do cadastro */}
            <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4">Dados do Cadastro</h3>
              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-300 mb-1">Nome:</label>
                <input
                  type="text"
                  className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-300 mb-1">Email:</label>
                <input
                  type="text"
                  className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Uploads */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Foto da CNH (FRENTE)</label>
              <Picture setPicture={setPictureFrente} setReadablePicture={setPreviewFrente} readablePicture={previewFrente} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Foto da CNH (VERSO)</label>
              <Picture setPicture={setPictureVerso} setReadablePicture={setPreviewVerso} readablePicture={previewVerso} />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Foto do Documento do Veículo</label>
              <Picture setPicture={setPictureDocumento} setReadablePicture={setPreviewDocumento} readablePicture={previewDocumento} />
            </div>

            {/* Campos adicionais */}
            <div className="flex flex-col mt-4">
              <label className="text-sm text-gray-300 mb-1">Tipo de Veículo:</label>
              <input
                type="text"
                placeholder="Ex: carro, moto..."
                {...register("tipoVeiculo")}
                className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
              />
              {errors?.tipoVeiculo && <p className="text-red-400 text-sm">{errors.tipoVeiculo.message}</p>}
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-sm text-gray-300 mb-1">Cor do Veículo:</label>
              <input
                type="text"
                placeholder="Ex: Preto, Vermelho"
                className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-sm text-gray-300 mb-1">Placa:</label>
              <input
                type="text"
                placeholder="Ex: ABC-1234"
                {...register("placa")}
                className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
              />
              {errors?.placa && <p className="text-red-400 text-sm">{errors.placa.message}</p>}
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-sm text-gray-300 mb-1">Marca:</label>
              <input
                type="text"
                placeholder="Ex: Honda, Toyota"
                {...register("marca")}
                className="bg-dark_bg_3 text-white p-2 rounded-md border border-dark_border_2"
              />
              {errors?.marca && <p className="text-red-400 text-sm">{errors.marca.message}</p>}
            </div>

            {/* Termos */}
            <div className="space-y-6 mt-6">
              <h1 className="text-2xl font-bold text-yellow-500">📌 Taxas da Plataforma</h1>
              <p>Nossas taxas são de <span className="text-red-500 font-bold">14%</span> por corrida...</p>
            </div>

            <div className="flex items-start space-x-2 mt-6">
              <input
                type="checkbox"
                id="aceitaContrato"
                checked={aceitaContrato}
                onChange={(e) => setAceitaContrato(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="aceitaContrato" className="text-sm">
                Eu li e aceito os termos do contrato para seguir com o cadastro.
              </label>
            </div>

            {error && <p className="text-red-400 mt-2">{error}</p>}

            <button
              className="w-full mt-6 flex justify-center bg-green_1 text-gray-100 p-4 rounded-full font-semibold hover:bg-green_2 shadow-lg transition"
              type="submit"
            >
              {status === "loading" ? <PulseLoader color="#fff" size={16} /> : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
