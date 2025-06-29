import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ReturnIcon } from "../../../../svg";
import { useSelector } from "react-redux";
import { MapPin, Clock, Map as MapIcon, History } from "lucide-react"; // ⬅️ Adiciona o ícone de histórico

export default function Map({ setShowMap, setShowLocal }) {
  const mapaRef = useRef(null);
  const rotaLayerRef = useRef(null);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [duracao, setDuracao] = useState(null);
  const [ultimoDestino, setUltimoDestino] = useState(""); // ⬅️ Guarda último destino salvo

  const { user } = useSelector((state) => state.user);
  const token = user?.token;

  const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight / 2);
  const [showOrigem, setShowOrigem] = useState(false);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const draggingRef = useRef(false);

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

    return () => mapa.remove();
  }, []);

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
              params: { lat: latitude, lon: longitude, format: "json" },
            });

            if (data?.display_name) {
              setOrigem(data.display_name);
              setShowOrigem(true);
            } else {
              setOrigem(`${latitude},${longitude}`);
              setShowOrigem(true);
            }
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

    // ⬅️ Carrega o último destino salvo no localStorage
    const saved = localStorage.getItem("ultimo_destino");
    if (saved) setUltimoDestino(saved);
  }, []);

  const geocodeEndereco = async (endereco) => {
    try {
      const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: endereco, format: "json", limit: 1 },
      });

      if (data.length === 0) throw new Error("Endereço não encontrado");
      const { lat, lon } = data[0];
      return `${lon},${lat}`;
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

      const { data } = await axios.get("https://ferraribback-end-clone-whatsapp.onrender.com/api/v1/route/request", {
        params: {
          api_key: process.env.REACT_APP_API_PUBLIC,
          origem: coordOrigem,
          destino: coordDestino,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.rota) throw new Error("Erro ao calcular rota");

      const coords = data.rota.coordinates.map(([lon, lat]) => [lat, lon]);

      if (rotaLayerRef.current) rotaLayerRef.current.remove();

      rotaLayerRef.current = L.polyline(coords, {
        color: "blue",
        weight: 5,
        opacity: 0.8,
      }).addTo(mapaRef.current);

      mapaRef.current.fitBounds(rotaLayerRef.current.getBounds());

      setDistancia(typeof data.distancia === "number" ? data.distancia : 0);
      setDuracao(typeof data.duracao === "number" ? data.duracao : 0);
      setSheetHeight(window.innerHeight / 2);

      // ⬅️ Salva o destino no localStorage
      localStorage.setItem("ultimo_destino", destino);
      setUltimoDestino(destino);
    } catch (err) {
      alert("Erro ao calcular rota.");
    }
  };

  const onDragStart = (e) => {
    draggingRef.current = true;
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeightRef.current = sheetHeight;
    document.body.style.userSelect = "none";
  };

  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = startYRef.current - currentY;
    let newHeight = startHeightRef.current + diff;
    if (newHeight < 120) newHeight = 120;
    if (newHeight > window.innerHeight * 0.8) newHeight = window.innerHeight * 0.8;
    setSheetHeight(newHeight);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
    document.body.style.userSelect = "";
  };

  const handleDestinoFocus = () => {
    setSheetHeight(window.innerHeight / 2);
    setShowOrigem(true);
  };

  const formatarDuracao = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  const preencherUltimoDestino = () => {
    if (ultimoDestino) {
      setDestino(ultimoDestino);
    }
  };

  return (
    <div className="relative h-screen w-full z-40 overflow-hidden">
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>

      <div className="relative z-10 p-2">
        <button
          onClick={() => setShowMap(false)}
          className="absolute top-0 right-10 text-gray-600 hover:text-gray-900 transition p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <ReturnIcon className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={sheetRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetHeight,
          backgroundColor: "rgba(255, 255, 255, 0.33)",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1), 0 0 15px rgba(0,0,0,0.05)",
          padding: "16px",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "height 0.3s ease",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          onMouseMove={onDragMove}
          onTouchMove={onDragMove}
          onMouseUp={onDragEnd}
          onTouchEnd={onDragEnd}
          onMouseLeave={onDragEnd}
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

        <h2 className="text-xl font-bold mb-4 text-center">
          Pra onde vamos hoje!
        </h2>

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
          <button
            onClick={preencherUltimoDestino}
            className="flex items-center justify-center gap-2 bg-yellow-300 text-gray-900 py-2 px-4 rounded-full mb-3 hover:bg-yellow-400 transition"
          >
            <History className="w-5 h-5" />
            <span>Repetir último destino</span>
          </button>
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
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>
                    <strong>Duração:</strong> {formatarDuracao(duracao)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
