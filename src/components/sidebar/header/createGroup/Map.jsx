import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ReturnIcon } from "../../../../svg";
import { useSelector } from "react-redux";
import { MapPin, Clock } from "lucide-react";

export default function Map({ setShowMap, setShowLocal }) {
  const mapaRef = useRef(null);
  const rotaLayerRef = useRef(null);
  const markerOrigemRef = useRef(null);
  const markerDestinoRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [distancia, setDistancia] = useState(null);
  const [duracao, setDuracao] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight / 2);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const draggingRef = useRef(false);
  const [ativo, setAtivo] = useState(false);

  const { user } = useSelector((state) => state.user);
  const token = user?.token;

  const osrmURL = "http://172.26.90.27:5001/route/v1/driving";

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
      const { lat, lng } = e.latlng;

      // Verifica se clicou em cima de um marcador já existente
      const clicouEmOrigem = markerOrigemRef.current?.getLatLng().equals([lat, lng]);
      const clicouEmDestino = markerDestinoRef.current?.getLatLng().equals([lat, lng]);

      if (clicouEmOrigem || clicouEmDestino) {
        limparTudo();
        return;
      }

      if (points.length === 0) {
        adicionarOrigem([lat, lng]);
        setPoints([[lat, lng]]);
      } else if (points.length === 1) {
        adicionarDestino([lat, lng]);
        setPoints((prev) => {
          const novos = [...prev, [lat, lng]];
          calcularRota(novos);
          return novos;
        });
      } else {
        limparTudo();
        adicionarOrigem([lat, lng]);
        setPoints([[lat, lng]]);
      }
    });

    return () => mapa.remove();
  }, [points]);

  const adicionarOrigem = (latlng) => {
    if (markerOrigemRef.current) markerOrigemRef.current.remove();
    markerOrigemRef.current = L.marker(latlng).addTo(mapaRef.current);
  };

  const adicionarDestino = (latlng) => {
    if (markerDestinoRef.current) markerDestinoRef.current.remove();
    markerDestinoRef.current = L.marker(latlng).addTo(mapaRef.current);
  };

  const limparTudo = () => {
    if (rotaLayerRef.current) rotaLayerRef.current.remove();
    if (markerOrigemRef.current) markerOrigemRef.current.remove();
    if (markerDestinoRef.current) markerDestinoRef.current.remove();
    setPoints([]);
    setDistancia(null);
    setDuracao(null);
  };

  const calcularRota = async ([origem, destino]) => {
    try {
      const coords = `${origem[1]},${origem[0]};${destino[1]},${destino[0]}`;
      const res = await axios.get(`${osrmURL}/${coords}`, {
        params: {
          overview: "full",
          geometries: "geojson",
        },
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
      setSheetHeight(window.innerHeight / 2);
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
    if (newHeight > window.innerHeight * 0.8)
      newHeight = window.innerHeight * 0.8;
    setSheetHeight(newHeight);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
    document.body.style.userSelect = "";
  };

  const formatarDuracao = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  return (
    <div className="relative h-screen w-full z-40 overflow-hidden">
      {ativo && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-[9999] text-sm">
          💡 Backend ativo: mensagem recebida!
        </div>
      )}

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

        <h2 className="text-xl font-bold mb-4 text-center">Clique em 2 pontos no mapa</h2>

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
      </div>
    </div>
  );
}
