import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CommunityIcon } from "../../svg";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";

// ✅ Apenas SDK inicializado
initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);

export default function PagamentoTaxaContrato() {
  const location = useLocation();
  const dadosCadastro = location?.state?.formData || {};

  const cloud_name = process.env.REACT_APP_CLOUD_NAME;

  const [picture, setPicture] = useState(null);
  const [readablePicture, setReadablePicture] = useState("");
  const [aceitaContrato, setAceitaContrato] = useState(false);

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", picture);
      formData.append("upload_preset", "vaiturbo");

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
        formData
      );

      console.log("Upload concluído:", data.secure_url);
      alert("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao enviar imagem. Tente novamente.");
    }
  };

  const handleSubmit = async () => {
    if (!picture) {
      alert("Envie a imagem antes de prosseguir.");
      return;
    }
    await uploadImage();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setReadablePicture(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-auto p-6 bg-gray-50 dark:bg-gray-900" style={{ maxHeight: "100vh" }}>
      <div className="w-full max-w-3xl space-y-8 p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-gray-200">

        {/* Logo e título */}
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

        {/* Dados do cadastro */}
        <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4">Dados do Cadastro</h3>
          <p><strong>Nome:</strong> {dadosCadastro.name || "-"}</p>
          <p><strong>Email:</strong> {dadosCadastro.email || "-"}</p>
          <p><strong>CPF:</strong> {dadosCadastro.cpf || "-"}</p>
          <p><strong>Status Uber Carro:</strong> {dadosCadastro.statusUberCarro || "-"}</p>
          <p><strong>Status Uber Moto:</strong> {dadosCadastro.statusUberMoto || "-"}</p>
        </div>

        {/* Uploads */}
        <div>
          <label htmlFor="fotoCNHFRENTE" className="block mb-1 font-semibold">Foto da CNH (FRENTE)</label>
          <input
            type="file"
            id="fotoCNHFRENTE"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm bg-gray-50 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="fotoCNHVERSO" className="block mt-4 mb-1 font-semibold">Foto da CNH (VERSO)</label>
          <input
            type="file"
            id="fotoCNHVERSO"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm bg-gray-50 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="fotoDocumento" className="block mt-4 mb-1 font-semibold">Foto do Documento do Veículo</label>
          <input
            type="file"
            id="fotoDocumento"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm bg-gray-50 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Preview */}
        {readablePicture && (
          <div className="mt-4 flex items-center space-x-4">
            <img src={readablePicture} alt="Preview" className="max-h-48 object-contain rounded shadow-md" />
            <button
              onClick={() => {
                setPicture(null);
                setReadablePicture("");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              type="button"
            >
              Remover imagem
            </button>
          </div>
        )}

        {/* Termos com destaque */}
        <div className="space-y-6 mt-6">
          <h1 className="text-2xl font-bold text-yellow-500">📌 Taxas da Plataforma</h1>
          <p>
            Nossas taxas são de <span className="text-red-500 font-bold">14%</span> por corrida. Caso contrate a API Mercado Pago, será adicionado <span className="text-red-500 font-bold">+5%</span>.
            Isso traz <span className="text-green-600 font-bold">mais conforto, agilidade e segurança</span> nos seus recebimentos.
          </p>
          <p>
            O serviço da API é <span className="text-blue-500 font-bold">opcional</span> e custa uma taxa única de <span className="text-green-600 font-bold">R$ 39,99</span>.
            Caso queira contratar, fale com o desenvolvedor no botão abaixo:
          </p>
          <div className="flex justify-center">
            <a href="https://wa.me/55279908031796" target="_blank" rel="noopener noreferrer" className="btn">
              <CommunityIcon className="dark:fill-dark_svg_1" />
            </a>
          </div>

          <h2 className="text-xl font-bold text-green-500 mt-6">✅ Benefícios do App</h2>
          <p>
            Você pode configurar <span className="font-bold">seus próprios valores</span> por km, minuto e taxa fixa.
            Utilizamos <span className="text-blue-600 font-bold">WAZE</span> como GPS com <span className="text-green-600 font-bold">liberdade de trajeto</span> e sem risco de multa.
          </p>
          <p>
            Temos monitoramento com <span className="text-purple-500 font-bold">OSRM</span>, acompanhando a rota em tempo real para <span className="font-bold">passageiros e motoristas</span>.
          </p>

          <h1 className="text-xl font-bold text-red-500 mt-6">🚫 Pagamento e Penalidades</h1>
          <p>
            As taxas são cobradas <span className="font-bold">após cada corrida finalizada</span>. O pagamento é <span className="text-green-600 font-bold">instantâneo</span>.
            Caso não pague, o acesso ao app é <span className="text-red-600 font-bold">bloqueado</span> até regularização.
          </p>
          <p>
            A inadimplência faz perder <span className="text-yellow-600 font-bold">1 estrela</span>. Após pagar, basta solicitar novo link e seguir trabalhando normalmente.
          </p>

          <h1 className="text-xl font-bold text-blue-500 mt-6">🎥 Publicidade e Clientes Fixos</h1>
          <p>
            Você pode fazer promoções, conquistar clientes e criar <span className="text-green-500 font-bold">vídeos no stories</span> com valor de <span className="text-green-600 font-bold">R$ 1,99 por semana</span>.
          </p>
          <p>
            Envie até <span className="text-purple-600 font-bold">2 vídeos de 15 segundos</span>, hospedando no YouTube e colando a URL.
            O vídeo aparecerá para todos usuários do app.
          </p>
        </div>

        {/* Aceite contrato */}
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

        {/* Botão Enviar */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!aceitaContrato || !picture}
            className={`mt-6 inline-block font-bold py-3 px-8 rounded-full transition duration-300 ${
              aceitaContrato && picture
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 text-gray-100 cursor-not-allowed"
            }`}
          >
            Enviar Documentos
          </button>
        </div>

        {/* Link para voltar */}
        <div className="text-center mt-10">
          <Link
            to="/registerUber"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          >
            Fazer Cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}
