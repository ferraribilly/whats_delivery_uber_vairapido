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
  const [statusApiHtml, setStatusApiHtml] = useState("");

  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";

  useEffect(() => {
    axios
      .get(`${apiURL}`)
      .then((res) => setStatusApiHtml(res.data))
      .catch(() => setStatusApiHtml("<h1 style='color:red;text-align:center;'>API OFFLINE ❌</h1>"));
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
      const { lat, lng } = e.latlng;

      setPoints((prev) => {
        const novos = [...prev, [lat, lng]];

        if (novos.length === 2) {
          addMarkers(novos[0], novos[1]);
          calcularRota(novos);
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
  }, []);

  const addMarkers = (origem, destino) => {
    if (markerOrigemRef.current) markerOrigemRef.current.remove();
    if (markerDestinoRef.current) markerDestinoRef.current.remove();

    markerOrigemRef.current = L.marker(origem).addTo(mapaRef.current);
    markerDestinoRef.current = L.marker(destino).addTo(mapaRef.current);
  };

  const calcularRota = async ([origem, destino]) => {
    try {
      const coords = `${origem[1]},${origem[0]};${destino[1]},${destino[0]}`;
      const res = await axios.get(`${apiURL}/route/v1/driving/${coords}`, {
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
    } catch (err) {
      alert("Erro ao calcular rota.");
    }
  };

  const formatarDuracao = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  return (
    <div className="relative h-screen w-full z-40 overflow-hidden">
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>
      <div
        className="absolute top-4 left-4 z-[999] bg-white/80 px-4 py-2 rounded shadow-md max-w-xs"
        dangerouslySetInnerHTML={{ __html: statusApiHtml }}
      />
      {/* O resto do seu JSX */}
      {distancia !== null && duracao !== null && (
        <div className="absolute bottom-20 left-4 z-[999] bg-white p-3 rounded shadow-md max-w-xs">
          <div>
            <strong>Distância:</strong> {distancia.toFixed(2)} km
          </div>
          <div>
            <strong>Duração:</strong> {formatarDuracao(duracao)}
          </div>
        </div>
      )}
    </div>
  );
}
