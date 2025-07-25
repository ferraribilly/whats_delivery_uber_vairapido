import React, { useState, useRef, useEffect } from "react";
import Contact from "./Contact";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { MapPin, Clock, Map as MapIcon, History } from "lucide-react";
// import SocketContext from "../../../context/SocketContext";



const pulseStyle = `
.leaflet-user-icon {
  animation: pulse 2s infinite;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.01);
}
@keyframes pulse {
  5% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 72, 197, 0.68); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(0, 8, 255, 1); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 55, 0, 1); }
}
`;

const markerIcon = "/assets/markers/marker.png";
const selectedMarkerIcon = "/assets/markers/selected-marker.png";
const startIcon = "/assets/markers/start.png";

function calcularDescontoHorario(percentual) {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 12 && hora < 18 ? percentual : 0;
}


export default function SheetResults({
  sheetResults,
  setSheetResults,
  setSidebarOpen,
  setResultados,
  Search,
  termo,
}) {
  const [statusApiHtml, setStatusApiHtml] = useState("");

  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const rotaLayerRef = useRef(null);
  const markerOrigemRef = useRef(null);
  const markerDestinoRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [duracao, setDuracao] = useState(null);
  const [ultimoDestino, setUltimoDestino] = useState("");
  const [modoToqueAtivo, setModoToqueAtivo] = useState(false);
  const [showOrigem, setShowOrigem] = useState(false);
  const [show, setShow] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight / 2);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const draggingRef = useRef(false);
  const [formaPagamento, setFormaPagamento] = useState("");

//   const socket = SocketContext(process.env.REACT_APP_API_URL || "http://localhost:3005");

// useEffect(() => {
//   socket.on("LOCATION_UPDATED", ({ email, location }) => {
//     console.log("Localização atualizada recebida:", email, location); // 👈 aqui o console.log

//     setSheetResults((prev) => {
//       return prev.map((user) =>
//         user.email === email ? { ...user, location } : user
//       );
//     });
//   });

//   return () => {
//     socket.off("LOCATION_UPDATED");
//   };
// }, []);

 useEffect(() => {
    axios
      .get(`${apiURL}`)
      .then((res) => setStatusApiHtml(res.data))
      .catch(() =>
        setStatusApiHtml(
          ""
        )
      );
  }, [apiURL]);



  

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = pulseStyle;
    document.head.appendChild(styleEl);
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        zoomControl: true,
        attributionControl: false,
      }).setView([-15.78, -47.92], 19);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markers.forEach((m) => mapRef.current.removeLayer(m));
    const novos = [];

    sheetResults?.forEach((contact) => {
      const temUber = contact.tipoVeiculo || contact.tipoVeiculo;

      if (temUber && contact.location?.coordinates) {
        const [lng, lat] = contact.location.coordinates;
        const marker = L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(
            `<b>${contact.name || "Motorista"}</b><br/>Tipo: ${
              contact.tipoVeiculo ? "Carro" : contact.tipoVeiculo ? "Moto" : "Entregador"
            }`
          );
        novos.push(marker);
      } else if (contact.location?.coordinates && contact.online === true) {
        const [lng, lat] = contact.location.coordinates;
        const icon = L.divIcon({
          html: `<img src="${
            contact.picture ||
            "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"
          }" class="leaflet-user-icon" width="40" height="40"/>`,
          iconSize: [40, 40],
          className: "",
        });
        const marker = L.marker([lat, lng], { icon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${contact.name || "Usuário"}</b>`);
        novos.push(marker);
      }
    });

    setMarkers(novos);
  }, [sheetResults]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo navegador.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const icon = L.divIcon({
            html: `<div style="width:40px; height:40px; border-radius:50%; overflow:hidden; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
              <img src="${
                user?.picture ||
                "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"
              }" style="width:40px; height:40px; object-fit:cover;" />
            </div>`,
            iconSize: [40, 40],
            className: "",
          });
          userMarkerRef.current = L.marker([latitude, longitude], { icon })
            .addTo(mapRef.current)
            .bindPopup("Você");
        }
        if (!mapRef.current._userCentered) {
          mapRef.current.setView([latitude, longitude], 19);
          mapRef.current._userCentered = true;
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter localização.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user?.picture]);

  const onDragStart = (e) => {
    draggingRef.current = true;
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startHeightRef.current = sheetHeight;

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("touchmove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchend", onDragEnd);
  };

  const onDragMove = (e) => {
    if (!draggingRef.current) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - currentY;
    const newHeight = Math.min(window.innerHeight, Math.max(100, startHeightRef.current + deltaY));
    setSheetHeight(newHeight);
  };

  const onDragEnd = () => {
    draggingRef.current = false;

    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchend", onDragEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onDragMove);
      document.removeEventListener("touchmove", onDragMove);
      document.removeEventListener("mouseup", onDragEnd);
      document.removeEventListener("touchend", onDragEnd);
    };
  }, []);

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
      const { data } = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: endereco, format: "json", limit: 1 },
      });

      if (data.length === 0) throw new Error("Endereço não encontrado");
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (err) {
      alert("Erro ao localizar o endereço.");
      throw err;
    }
  };

  const salvarRotaNoBackend = async (rota) => {
  try {
    await axios.post(`${apiURL}/rotas/salvar`, {
      userId: user._id,
      name: user.name,
      email: user.email,
      origem,
      destino,
      distancia,
      duracao,
      geometry: rota.geometry,
    });
    setStatusApiHtml("Rota salva!");
  } catch (err) {
    setStatusApiHtml("Erro ao salvar rota.");
    console.error("Erro ao salvar rota no backend:", err);
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
      weight: 10,
      opacity: 0.8,
    }).addTo(mapRef.current);

    mapRef.current.fitBounds(rotaLayerRef.current.getBounds());

    setDistancia(rota.distance / 1000);
    setDuracao(rota.duration / 60);

    if (destino !== ultimoDestino) {
      localStorage.setItem("ultimo_destino", destino);
      setUltimoDestino(destino);
    }

    await salvarRotaNoBackend(rota);

  } catch (err) {
    alert("Erro ao calcular rota.");
  }
};


  const addMarkers = (origem, destino) => {
    if (markerOrigemRef.current) markerOrigemRef.current.remove();
    if (markerDestinoRef.current) markerDestinoRef.current.remove();

    markerOrigemRef.current = L.marker(origem).addTo(mapRef.current);
    markerDestinoRef.current = L.marker(destino).addTo(mapRef.current);
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

  // Função para calcular preço dinâmico de cada motorista
  const calcularPrecoDinamico = (motorista) => {
    if (!motorista || distancia == null || duracao == null) return "R$ 0,00";

    const precoPorKm = motorista.precoPorKm || 0;
    const precoPorMinuto = motorista.precoPorMinuto || 0;
    const taxaFixa = motorista.taxaFixa || 0;
    const descontoHorario = motorista.descontoHorario || 0;

    let valor = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;
    const desconto = calcularDescontoHorario(descontoHorario);
    if (desconto > 0) valor *= 1 - desconto;

    return `R$ ${valor.toFixed(2)}`;
};


  return (

    <div className="relative h-screen w-full z-0 overflow-hidden">
    <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>
      <div
        className="absolute top-4 left-4 z-[999] bg-black/80 px-4 py-2 rounded shadow-md max-w-xs"
        dangerouslySetInnerHTML={{ __html: statusApiHtml }}
      />
      <button
        className="absolute top-5 right-400 z-[0] px-4 py-2 bg- text-white rounded shadow"
        // onClick={() => setModoToqueAtivo(!modoToqueAtivo)}
      >
        {modoToqueAtivo ? "" : ""}
      </button>

      <div
        ref={sheetRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetHeight,
          backgroundColor: "bg-dark_bg_1 ",
          borderTopLeftRadius: "60px",
          borderTopRightRadius: "60px",
          boxShadow: "0 -2px 10px rgba(39, 0, 191, 1), 0 0 15px rgba(1, 14, 137, 1)",
          padding: "16px",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "height 0.3s ease",
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
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
        
        <h2 className="text-xl font-bold mb-4 text-green-500 text-center">Pra onde vamos hoje!</h2>
        <h2 className="text-x font-bold mb-4 text-blue-500 text-center">{user.name}</h2>
        

        {showOrigem && (
          <div className="relative mb-3">
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Meu Local"
              className="border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 "
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
            <label className="block mb-1 text-black font-semibold">Usar ultimo destino:</label>
            <button
              onClick={preencherUltimoDestino}
              className="flex flex-col items-start justify-center gap-1 bg-yellow-300 text-gray-900 py-2 px-4 rounded-xl w-full hover:bg-yellow-400 transition text-left"
              type="button"
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <span className="font-semibold">Repetir último destino</span>
              </div>
              <span className="text-sm text-black truncate">{ultimoDestino}</span>
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
              <div className="mt-6 flex flex-col items-center justify-center gap-3 text-blue-600">
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
                

              
                  
                  
<ul>
        {sheetResults && sheetResults.length > 0 ? (
          sheetResults.map((user) => (
            <Contact
              key={user._id}
              contact={user}
              tipoVeiculo={user.tipoVeiculo}
              search={Search}
              resultados={setResultados}
              formaPagamento={formaPagamento}
              setSheetResults={setSheetResults}
              setSidebarOpen={setSidebarOpen}
              distancia={distancia}
              duracao={duracao}
              origem={origem}
              destino={destino}
              valorCorridaCalculado={calcularPrecoDinamico(user)} 
            />
          ))
        ) : (
          <li
            style={{
              padding: "10px",
              color: "#666",
              textAlign: "center",
            }}
          >
            Nenhum resultado para mostrar
          </li>
        )}
      </ul>
      

                </div>
      
            )}
          </>
        )}
      </div>
    </div>
  );
}