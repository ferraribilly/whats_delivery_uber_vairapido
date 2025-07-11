import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ReturnIcon } from "../../../../svg";
import { useSelector } from "react-redux";
import { MapPin, Clock, Map as MapIcon, History } from "lucide-react";

export default function Map({ setShowMap, setShowLocal }) {
  const mapaRef = useRef(null);
  const rotaLayerRef = useRef(null);
  const markerOrigemRef = useRef(null);
  const markerDestinoRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [duracao, setDuracao] = useState(null);
  const [ultimoDestino, setUltimoDestino] = useState("");
  const [statusApiHtml, setStatusApiHtml] = useState("");
  const [modoToqueAtivo, setModoToqueAtivo] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");

  const { user } = useSelector((state) => state.user);

  const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight / 2);
  const [showOrigem, setShowOrigem] = useState(false);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const draggingRef = useRef(false);

  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";

  useEffect(() => {
    axios
      .get(`${apiURL}`)
      .then((res) => setStatusApiHtml(res.data))
      .catch(() =>
        setStatusApiHtml(
          "<h1 style='color:red;text-align:center;'>API OFFLINE ❌</h1>"
        )
      );
  }, [apiURL]);

  useEffect(() => {
    const mapa = L.map("map", {
      center: [-20.536479, -47.405637],
      zoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapa);

    mapaRef.current = mapa;

    mapa.on("click", (e) => {
      if (!modoToqueAtivo) return;

      const { lat, lng } = e.latlng;
      setPoints((prev) => {
        const novos = [...prev, [lat, lng]];

        if (novos.length === 2) {
          addMarkers(novos[0], novos[1]);
          calcularRotaCoordenadas(novos);
          return novos;
        } else if (novos.length > 2) {
          if (rotaLayerRef.current) rotaLayerRef.current.remove();
          if (markerOrigemRef.current) markerOrigemRef.current.remove();
          if (markerDestinoRef.current) markerDestinoRef.current.remove();
          setDistancia(null);
          setDuracao(null);
          return [[lat, lng]];
        } else {
          if (markerOrigemRef.current) markerOrigemRef.current.remove();
          markerOrigemRef.current = L.marker([lat, lng]).addTo(mapaRef.current);
          return novos;
        }
      });
    });

    return () => mapa.remove();
  }, [modoToqueAtivo]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const { data } = await axios.get(
              "https://nominatim.openstreetmap.org/reverse",
              {
                params: { lat: latitude, lon: longitude, format: "json" },
              }
            );

            setOrigem(data?.display_name || `${latitude},${longitude}`);
            setShowOrigem(true);
          } catch {
            setOrigem(`${latitude},${longitude}`);
            setShowOrigem(true);
          }
        },
        (err) => console.error("Erro geolocalização", err),
        { enableHighAccuracy: true }
      );
    };

    getCurrentLocation();
    const saved = localStorage.getItem("ultimo_destino");
    if (saved) setUltimoDestino(saved);
  }, []);

  useEffect(() => {
    if (distancia !== null && duracao !== null) {
      setSheetHeight(window.innerHeight * 0.65);
    }
  }, [distancia, duracao]);

  const geocodeEndereco = async (endereco) => {
    try {
      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: endereco, format: "json", limit: 1 },
        }
      );

      if (data.length === 0) throw new Error("Endereço não encontrado");
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (err) {
      alert("Erro ao localizar o endereço.");
      throw err;
    }
  };

  const calcularRota = async () => {
    if (!origem || !destino) return alert("Preencha origem e destino!");

    try {
      setDistancia(null);
      setDuracao(null);

      const coordOrigem = await geocodeEndereco(origem);
      const coordDestino = await geocodeEndereco(destino);

      addMarkers(coordOrigem, coordDestino);

      const coords = `${coordOrigem[1]},${coordOrigem[0]};${coordDestino[1]},${coordDestino[0]}`;
      const res = await axios.get(`${apiURL}/route/v1/driving/${coords}`, {
        params: { overview: "full", geometries: "geojson" },
      });

      const rota = res.data.routes[0];
      const linha = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      if (rotaLayerRef.current) rotaLayerRef.current.remove();

      rotaLayerRef.current = L.polyline(linha, {
        color: "blue",
        weight: 5,
        opacity: 0.8,
      }).addTo(mapaRef.current);

      mapaRef.current.fitBounds(rotaLayerRef.current.getBounds());

      setDistancia(rota.distance / 1000);
      setDuracao(rota.duration / 60);

      if (destino !== ultimoDestino) {
        localStorage.setItem("ultimo_destino", destino);
        setUltimoDestino(destino);
      }
    } catch (err) {
      alert("Erro ao calcular rota.");
    }
  };

  const calcularRotaCoordenadas = async ([origem, destino]) => {
    try {
      const coords = `${origem[1]},${origem[0]};${destino[1]},${destino[0]}`;
      const res = await axios.get(`${apiURL}/route/v1/driving/${coords}`, {
        params: { overview: "full", geometries: "geojson" },
      });

      const rota = res.data.routes[0];
      const linha = rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      if (rotaLayerRef.current) rotaLayerRef.current.remove();

      rotaLayerRef.current = L.polyline(linha, {
        color: "blue",
        weight: 5,
        opacity: 0.8,
      }).addTo(mapaRef.current);

      mapaRef.current.fitBounds(rotaLayerRef.current.getBounds());

      setDistancia(rota.distance / 1000);
      setDuracao(rota.duration / 60);
    } catch (err) {
      alert("Erro ao calcular rota.");
    }
  };

  const addMarkers = (origem, destino) => {
    if (markerOrigemRef.current) markerOrigemRef.current.remove();
    if (markerDestinoRef.current) markerDestinoRef.current.remove();

    markerOrigemRef.current = L.marker(origem).addTo(mapaRef.current);
    markerDestinoRef.current = L.marker(destino).addTo(mapaRef.current);
  };

  const formatarDuracao = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  const handleDestinoFocus = () => {
    setSheetHeight(window.innerHeight / 2);
    setShowOrigem(true);
  };

  const preencherUltimoDestino = () => {
    if (ultimoDestino) setDestino(ultimoDestino);
  };

  const onDragStart = (e) => {
    draggingRef.current = true;
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeightRef.current = sheetHeight;
  };

  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - currentY;
    let newHeight = startHeightRef.current + deltaY;

    const maxHeight = window.innerHeight * 1.5;
    const minHeight = window.innerHeight * 0.5;

    if (newHeight > maxHeight) newHeight = maxHeight;
    if (newHeight < minHeight) newHeight = minHeight;

    setSheetHeight(newHeight);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
  };

  const calcularDescontoHorario = (percentual) => {
    const agora = new Date();
    const minutos = agora.getMinutes();
    return minutos < 30 || (minutos >= 30 && minutos < 60) ? percentual : 0;
  };

  const calcularPrecoCarro = () => {
    if (distancia === null || duracao === null) return "-";
    const precoPorKm = 2.0;
    const precoPorMinuto = 0;
    const taxaFixa = 0.20;

    let preco = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;

    const desconto = calcularDescontoHorario(0.05);
    if (desconto > 0) preco = preco * (1 - desconto);

    return `R$ ${preco.toFixed(2)}`;
  };

  const calcularPrecoMoto = () => {
    if (distancia === null || duracao === null) return "-";
    const precoPorKm = 2.0;
    const precoPorMinuto = 0;
    const taxaFixa = 0.20;

    let preco = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;

    const desconto = calcularDescontoHorario(0.10);
    if (desconto > 0) preco = preco * (1 - desconto);

    return `R$ ${preco.toFixed(2)}`;
  };

  const calcularPrecoEntrega = () => {
    if (distancia === null || duracao === null) return "-";
    const precoPorKm = 2.0;
    const precoPorMinuto = 0.08;
    const taxaFixa = 0.20;

    const preco = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;

    return `R$ ${preco.toFixed(2)}`;
  };
// 🔁 Função handleEscolherMotorista completa e corrigida
const handleEscolherMotorista = async (tipo) => {
  if (!formaPagamento) {
    alert("Selecione uma forma de pagamento.");
    return;
  }

  let valorFinal = "-";
  if (tipo === "carro") valorFinal = calcularPrecoCarro();
  else if (tipo === "moto") valorFinal = calcularPrecoMoto();
  else if (tipo === "entregador") valorFinal = calcularPrecoEntrega();

  const ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/v1";

  // 🔍 garante que temos o _id correto
  const userRedux = user; // vindo do useSelector
  const userStorage = JSON.parse(localStorage.getItem("user")) || {};
  const userFinal = {
    _id: userRedux?._id || userStorage?._id || "usuario-desconhecido",
    name:
      userRedux?.name ||
      userRedux?.nome ||
      userStorage?.name ||
      userStorage?.nome ||
      "Usuário Desconhecido",
    email:
      userRedux?.email ||
      userStorage?.email ||
      "email@desconhecido.com",
  };

  console.log("🧪 DEBUG - userFinal:", userFinal);

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
  } catch (error) {
    console.error("Erro ao salvar viagem na backend", error);
    alert("Erro ao salvar a viagem. Tente novamente.");
    return;
  }

  localStorage.setItem("viagem_atual", JSON.stringify(dadosViagem));
  setShowMap(false);
};


  return (
    <div className="relative h-screen w-full z-40 overflow-hidden">
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>

      <div className="relative z-10 p-2">
        <button
          onClick={() => setShowMap(false)}
          className="absolute top-0 right-10 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Fechar mapa"
        >
          <ReturnIcon className="w-6 h-6" />
        </button>
      </div>

      <div
        className="absolute top-4 left-4 z-[999] bg-white/80 px-4 py-2 rounded shadow-md max-w-xs"
        dangerouslySetInnerHTML={{ __html: statusApiHtml }}
      />

      <button
        className="absolute top-5 right-400 z-[0] px-4 py-2 bg-transparent text-white rounded shadow"
        onClick={() => setModoToqueAtivo(!modoToqueAtivo)}
      >
        {modoToqueAtivo ? "Desativar toque" : "Ativar toque"}
      </button>

      <div
        ref={sheetRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetHeight,
          backgroundColor: "rgb(255, 238, 1)",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          boxShadow: "0 -2px 10px rgb(0, 0, 0), 0 0 15px rgba(0,0,0,0.05)",
          padding: "16px",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "height 0.3s ease",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onMouseMove={onDragMove}
        onTouchMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        <div
          style={{
            width: "40px",
            height: "5px",
            backgroundColor: "#ccc",
            borderRadius: "3px",
            alignSelf: "center",
            marginBottom: "10px",
            cursor: "grab",
          }}
        ></div>

        <h2 className="text-xl font-bold mb-4 text-center">Pra onde vamos hoje!</h2>
        <div><span className="font-medium ">Nome:</span > {user?.name}</div>
        <div><span className="font-medium">Email:</span> {user?.email}</div>

        {showOrigem && (
          <div className="relative mb-3">
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Meu Local"
              className="border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <MapIcon className="absolute left-3 top-2.5 text-green-500 animate-bounce" size={20} />
          </div>
        )}

        <div className="relative mb-3">
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            onFocus={handleDestinoFocus}
            placeholder="Para Onde Vai"
            className="border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <MapPin className="absolute left-3 top-2.5 text-blue-500 animate-bounce" size={20} />
        </div>

        {ultimoDestino && (
          <div className="mb-3">
            <label className="block mb-1 text-gray-700 font-semibold">Último destino visitado:</label>
            <button
              onClick={preencherUltimoDestino}
              className="flex flex-col items-start justify-center gap-1 bg-yellow-300 text-gray-900 py-2 px-4 rounded-xl w-full hover:bg-yellow-400 transition text-left"
              type="button"
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <span className="font-semibold">Repetir último destino</span>
              </div>
              <span className="text-sm text-gray-800 truncate">{ultimoDestino}</span>
            </button>
          </div>
        )}

        {showOrigem && (
          <>
            <button
              onClick={calcularRota}
              className="bg-blue-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Calcular Valor
            </button>
           

            

            {distancia !== null && duracao !== null && (
              <div className="mt-6 flex flex-col items-center justify-center gap-3 text-gray-800">
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>Distância:</strong> {distancia.toFixed(2)} km
                  </span>
                  <div className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span>
                      <strong>Duração:</strong> {formatarDuracao(duracao)}
                    </span>
                  </div>
                </div>
                

                {/* ==== ESCOLHA DE PAGAMENTO ==== */}
                <div className="w-full mt-6 space-y-4">
                  <strong className="block text-gray-800 text-lg">
                    Escolha a forma de pagamento
                  </strong>
                  <div className="flex justify-between bg-white p-4 rounded-xl shadow-md">
                    {[
                      { valor: "pix", img: "pix.svg", label: "Pix" },
                      {
                        valor: "cartao",
                        img: "cartao-de-credito-mercado-pago.webp",
                        label: "Cartão Todas Bandeiras",
                      },
                      { valor: "dinheiro", img: "financa.png", label: "Dinheiro" },
                      { valor: "maquininha", img: "maquina-de-cartao.png", label: "Maquininha" },
                    ].map(({ valor, img, label }) => (
                      <label
                        key={valor}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="formaPagamento"
                          value={valor}
                          checked={formaPagamento === valor}
                          onChange={(e) => setFormaPagamento(e.target.value)}
                          className="mb-2 accent-blue-600"
                        />
                        <img
                          src={`/assets/img/${img}`}
                          alt={label}
                          className="w-16 h-16 object-contain"
                        />
                        <span className="mt-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ==== CARDS ESCOLHER VEÍCULO ==== */}
                <div className="w-full mt-6 space-y-4">
                  {/* Carros */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                      <img
                        src="/assets/img/UberX.png"
                        alt="Carro"
                        className="w-12 h-12"
                      />
                      <div>
                        <strong className="block text-gray-800 text-lg">
                          Pop
                        </strong>
                        <p className="text-green-700 font-semibold mt-2">
                          Valor estimado: {calcularPrecoCarro()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEscolherMotorista("carro")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Selecionar
                    </button>
                  </div>

                  {/* Motos */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                      <img
                        src="/assets/img/moto.png"
                        alt="Moto"
                        className="w-12 h-12"
                      />
                      <div>
                        <strong className="block text-gray-800 text-lg">Motos</strong>
                        <p className="text-green-700 font-semibold mt-2">
                          Valor estimado: {calcularPrecoMoto()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEscolherMotorista("moto")}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Selecionar
                    </button>
                  </div>

                  {/* Entregadores */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                      <img
                        src="/assets/img/entregadores.png"
                        alt="Entregadores"
                        className="w-12 h-12"
                      />
                      <div>
                        <strong className="block text-gray-800 text-lg">
                          Entregas
                        </strong>
                        <p className="text-green-700 font-semibold mt-2">
                          Valor estimado: {calcularPrecoEntrega()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEscolherMotorista("entregador")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
