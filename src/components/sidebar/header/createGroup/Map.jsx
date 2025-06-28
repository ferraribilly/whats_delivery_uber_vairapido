import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ReturnIcon } from "../../../../svg";
import { useSelector } from "react-redux";

export default function Map({ setShowMap, setShowLocal }) {
  const mapaRef = useRef(null);
  const rotaLayerRef = useRef(null);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");

  const { user } = useSelector((state) => state.user);
  const token = user?.token;

  // Controle do height do sheet e se origem está visível
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

  const calcularRota = async () => {
    if (!origem || !destino) {
      return alert("Preencha origem e destino!");
    }

    try {
      const { data } = await axios.get("http://localhost:5000/route/request", {
        params: {
          api_key: process.env.REACT_APP_API_PUBLIC,
          origem,
          destino,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.rota) throw new Error("Erro ao calcular rota");

      const coords = data.rota.coordinates.map(([lon, lat]) => [lat, lon]);

      if (rotaLayerRef.current) {
        rotaLayerRef.current.remove();
      }

      rotaLayerRef.current = L.polyline(coords, {
        color: "blue",
        weight: 5,
        opacity: 0.8,
      }).addTo(mapaRef.current);

      mapaRef.current.fitBounds(rotaLayerRef.current.getBounds());

      // Após calcular, recolhe o sheet e oculta origem
      setSheetHeight(window.innerHeight / 2);
      setShowOrigem(false);
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
      alert("Erro ao calcular rota.");
    }
  };

  // Eventos para drag do sheet
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
    if (newHeight < 120) newHeight = 120; // mínima altura
    if (newHeight > window.innerHeight * 0.8) newHeight = window.innerHeight * 0.8; // máxima altura reduzida pra 80%
    setSheetHeight(newHeight);
  };

  const onDragEnd = () => {
    draggingRef.current = false;
    document.body.style.userSelect = "";
  };

  // Quando clica no input destino, sobe o sheet e mostra origem (até metade da tela)
  const handleDestinoFocus = () => {
    setSheetHeight(window.innerHeight / 2); // 50% da tela
    setShowOrigem(true);
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

      {/* BOTTOM SHEET com fundo mais clarinho */}
      <div
        ref={sheetRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetHeight,
          backgroundColor: "rgba(255, 255, 255, 0.33)", // branco com transparência
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          boxShadow:
            "0 -2px 10px rgba(0,0,0,0.1), 0 0 15px rgba(0,0,0,0.05)", // sombra mais suave
          padding: "16px",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "height 0.3s ease",
          backdropFilter: "blur(8px)", // efeito de desfoque do fundo atrás
          WebkitBackdropFilter: "blur(8px)", // para Safari
        }}
      >
        {/* Barra para arrastar */}
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

        <h2 className="text-xl font-bold mb-4">Muito bom ver vc novamente para onde deseja ir hoje !</h2>

       {/* input origem só aparece se showOrigem true */}
{showOrigem && (
  <input
    type="text"
    value={origem}
    onChange={(e) => setOrigem(e.target.value)}
    placeholder="Meu Local"
     className="border border-gray-300 rounded-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
)}

{/* input destino sempre visível */}
<input
  type="text"
  value={destino}
  onChange={(e) => setDestino(e.target.value)}
  onFocus={handleDestinoFocus}
  placeholder="Para Onde Vai"
  className="border border-gray-300 rounded-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
/>

{/* botão só aparece se showOrigem true */}
{showOrigem && (
  <button
    onClick={calcularRota}
    className="bg-blue-500 text-white py-2 rounded-md hover:bg-green-600 transition"
  >
    Calcular Valor
  </button>
)}

      </div>
    </div>
  );
}
