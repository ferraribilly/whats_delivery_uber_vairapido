import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

function Contact({
  contact,
  setSheetResults,
  socket,
  setSidebarOpen,
  distancia,
  duracao,
  origem,
  destino,
}) {
  const [tempoRestante, setTempoRestante] = useState(null);
  const [mostrarReacao, setMostrarReacao] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const values = {
    receiver_id: contact._id,
    token,
  };

   const openConversation = async () => {
    const newConvo = await dispatch(open_create_conversation(values));
    if (newConvo?.payload?._id) {
      socket.emit("join conversation", newConvo.payload._id);
      setSheetResults([]);
      setSidebarOpen(false);
    }
  };

  const calcularPrecoDinamico = () => {
    if (!contact || distancia === null || duracao === null) return "-";
    const {
      precoPorKm = 2.0,
      precoPorMinuto = 0,
      taxaFixa = 0.2,
      descontoHorario = 0,
    } = contact.taxas || {};

    const agora = new Date();
    const minutos = agora.getMinutes();
    const desconto =
      minutos < 30 || (minutos >= 30 && minutos < 60) ? descontoHorario : 0;

    let preco = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;
    if (desconto > 0) preco = preco * (1 - desconto);

    return `R$ ${preco.toFixed(2)}`;
  };

   

  const iniciarContagemRegressiva = () => {
    setTempoRestante(120);
    setMostrarReacao(false);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setMostrarReacao(true);
          audioRef.current?.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  

  const handleEscolherMotorista = async (tipo, contact) => {
    if (!formaPagamento) {
      alert("Selecione uma forma de pagamento.");
      return;
    }

    let valorFinal = "-";
    if (tipo === "carro" || tipo === "moto") {
      valorFinal = calcularPrecoDinamico(contact);
    } else if (tipo === "entregador") {
      valorFinal = "R$ 0.00";
    }

    const ENDPOINT =
      process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/v1";

    const userStorage = JSON.parse(localStorage.getItem("user")) || {};
    const userFinal = {
      _id: user._id || userStorage?._id || "usuario-desconhecido",
      name:
        user.name || user.nome || userStorage?.name || userStorage?.nome || "Usuário Desconhecido",
      email:
        user.email || userStorage?.email || "email@desconhecido.com",
    };

    const dadosViagem = {
      origem,
      destino,
      distancia,
      duracao,
      formaPagamento,
      tipo,
      valor: valorFinal,
      userId: userFinal._id,
      name: userFinal.name,
      email: userFinal.email,
      tipoVeiculo: tipo,
      valorCorrida:
        parseFloat(valorFinal.replace("R$ ", "").replace(",", ".")) || 0,
    };

    try {
      await axios.post(`${ENDPOINT}/orders`, dadosViagem);
      localStorage.setItem("viagem_atual", JSON.stringify(dadosViagem));
      alert("✅ Pedido criado. Pode escolher o seu motorista e boa viagem.");
      iniciarContagemRegressiva();
    } catch (error) {
      console.error("Erro ao salvar viagem na backend", error);
      alert("Erro ao salvar a viagem. Tente novamente.");
    }
  };

  const formatarTempo = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <li className="list-none h-auto cursor-pointer px-[10px]">
   <div className="relative flex flex-col items-center py-10 gap-2 backdropFilter-blur(1px) boxShadow-gold-600 WebkitBackdropFilter-blur(1px) border-[5px] text-black rounded-md shadow-md mt-10" style={{ boxShadow: '0 4px 6px -1px rgba(1, 1, 0, 0.95), 0 2px 4px -2px rgba(0, 0, 0, 1)' }}>

        <div className="absolute -top-0 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
          <img
            src={contact.picture}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* NOME E ESTRELAS */}
        <div className="flex flex-col items-center mt-12 gap-1 w-full">
          <h1 className="font-bold text-lg dark:text-black">{contact.name}</h1>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  i < (contact.rating || 5) ? "text-yellow-500 fill-current" : "text-gray-400"
                }`}
                viewBox="0 0 20 20"
                fill={i < (contact.rating || 5) ? "currentColor" : "none"}
                stroke={i < (contact.rating || 5) ? "none" : "currentColor"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 15l-5.878 3.09L5.5 12.545 1 8.91l6.061-.877L10 2l2.939 6.033L19 8.91l-4.5 3.636 1.378 5.545z" />
              </svg>
            ))}
          </div>

          <p className="text-sm dark:text-blue-700">{contact.status}</p>
          <p className="text-sm dark:text-blue-700">{contact.tipoVeiculo}</p>
          <h1 className="font-bold text-lg dark:text-black">{contact.marca}</h1>
          <h1 className="font-bold text-lg dark:text-black">{contact.placa}</h1>
          <h1 className="font-bold text-lg text-green-500">
            Valor Corrida: {calcularPrecoDinamico()}
          </h1>

          {/* === FORMA DE PAGAMENTO AQUI === */}
          <div className="w-full mt-4 px-4">
            <strong className="block text-green-800 text-md text-center mb-2">
              Escolha a forma de pagamento
            </strong>
            <div className="flex justify-between bg-white p-4 rounded-xl shadow-md">
              {[
                { valor: "pix", img: "pix.svg", label: "Pix" },
                { valor: "cartao", img: "cartao-de-credito-mercado-pago.webp", label: "Cartão" },
                { valor: "dinheiro", img: "financa.png", label: "Dinheiro" },
                { valor: "maquininha", img: "maquina-de-cartao.png", label: "Maquininha" },
              ].map(({ valor, img, label }) => (
                <label key={valor} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`formaPagamento_${contact._id}`}
                    value={valor}
                    checked={formaPagamento === valor}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="mb-2 accent-blue-600"
                  />
                  <img
                    src={`/assets/img/${img}`}
                    alt={label}
                    className="w-10 h-10 object-contain"
                  />
                  <span className="mt-1 text-xs text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {tempoRestante !== null && !mostrarReacao && (
            <div className="w-full px-4 mt-2">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-3"
                  style={{
                    width: `${((120 - tempoRestante) / 120) * 100}%`,
                    transition: "width 1s linear",
                  }}
                />
              </div>
              <p className="text-sm text-white mt-1 text-center">
                Tempo restante: {formatarTempo(tempoRestante)}
              </p>
            </div>
          )}

          {mostrarReacao && (
            <div className="flex flex-col items-center mt-4 gap-2">
              <span className="text-white font-semibold text-sm">Deseja tentar novamente?</span>
              <div className="flex gap-4">
                <button
                  // onClick={handleSim}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Sim
                </button>
                <button
                  // onClick={handleNao}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Não
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleEscolherMotorista("carro", contact)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow"
            >
              Solicitação
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow">
              Cancelar
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow"
              onClick={openConversation}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src="../../../../audio/car-warning-sound-189734.mp3" />
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
