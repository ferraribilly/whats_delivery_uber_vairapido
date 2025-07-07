import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Contact from "./Contact"; // ajuste se necessário
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pulseStyle = `
.leaflet-user-icon {
  animation: pulse 2s infinite;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.01);
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
`;

export default function SearchResults({ searchResults, setSearchResults, setShowSidebar }) {
  const [dadosPedido, setDadosPedido] = useState(null);
  const [filtrarPorStatus, setFiltrarPorStatus] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [markers, setMarkers] = useState([]);
  const [pedidoVisivel, setPedidoVisivel] = useState(true);

  // Guarda instância do mapa e do marcador do usuário
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = pulseStyle;
    document.head.appendChild(styleEl);
  }, []);

  useEffect(() => {
    // Carregar pedido atual do localStorage
    const loadPedido = () => {
      const stored = localStorage.getItem("viagem_atual");
      if (stored) {
        try {
          const json = JSON.parse(stored);
          setDadosPedido((prev) =>
            !prev || JSON.stringify(json) !== JSON.stringify(prev) ? json : prev
          );
        } catch (e) {
          console.error("Erro ao ler viagem_atual do localStorage", e);
        }
      } else {
        setDadosPedido(null);
      }
    };

    loadPedido();
    const intervalo = setInterval(loadPedido, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const filtrarPorTipoVeiculo = (user) => {
    if (!filtrarPorStatus || !dadosPedido) return true;
    const tipo = dadosPedido.tipo?.toLowerCase();
    if (tipo === "carro") return user.statusUberCarro === true;
    if (tipo === "moto") return user.statusUberMoto === true;
    if (tipo === "entregador") return user.statusUberEntregador === true;
    return false;
  };

  useEffect(() => {
    if (!mapRef.current) {
      // Inicializa o mapa
      mapRef.current = L.map("mapmonitoramento", {
        zoomControl: true,
        attributionControl: false,
      }).setView([-15.78, -47.92], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Atualiza marcadores do searchResults
    markers.forEach((m) => mapRef.current.removeLayer(m));
    const novos = [];

    searchResults?.forEach((pessoa) => {
      const temUber = pessoa.statusUberCarro || pessoa.statusUberMoto || pessoa.statusUberEntregador;

      if (temUber && pessoa.location?.coordinates) {
        const [lng, lat] = pessoa.location.coordinates;

        const marker = L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(`
            <b>${pessoa.name || "Motorista"}</b><br/>
            Tipo: ${pessoa.statusUberCarro ? "Carro" : pessoa.statusUberMoto ? "Moto" : "Entregador"}
          `);

        novos.push(marker);
      } else if (pessoa.location?.coordinates && pessoa.online === true) {
        const [lng, lat] = pessoa.location.coordinates;

        const icon = L.divIcon({
          html: `<img src="${pessoa.picture || "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"}" class="leaflet-user-icon" width="40" height="40"/>`,
          iconSize: [40, 40],
          className: "",
        });

        const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current).bindPopup(`<b>${pessoa.name || "Usuário"}</b>`);

        novos.push(marker);
      }
    });

    setMarkers(novos);
  }, [searchResults]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Atualiza dadosPedido, se precisar pode reposicionar mapa aqui
    if (dadosPedido?.origem && dadosPedido?.destino) {
      // Aqui você pode fazer rotas ou centrar mapa, se quiser
    }
  }, [dadosPedido]);

  // ** NOVO: Pega a localização em tempo real **
  useEffect(() => {
    if (!mapRef.current) return;

    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo navegador.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Atualiza ou cria marcador do usuário
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const icon = L.divIcon({
            html: `
              <div style="width:40px; height:40px; border-radius:50%; overflow:hidden; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
                <img src="${user?.picture || "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"}" style="width:40px; height:40px; object-fit:cover; display:block;" />
              </div>
            `,
            iconSize: [40, 40],
            className: "",
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(mapRef.current).bindPopup("Você");
        }

        // Centraliza mapa na posição do usuário (só na primeira vez)
        if (!mapRef.current._userCentered) {
          mapRef.current.setView([latitude, longitude], 15);
          mapRef.current._userCentered = true;
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter localização.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user?.picture]);

  return (
    <div className="relative w-full h-full">
      {/* Mostrar mapa SEMPRE, independente do pedido */}
      <div
        id="mapmonitoramento"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
      ></div>

      {/* Conteúdo por cima */}
      <div className="relative z-10 w-full h-full overflow-auto scrollbar bg-opacity-70 ">
        <div className="flex flex-col px-8 pt-8">
          <h1 className="font-extralight text-md text-green_2">Orders</h1>
          <span className="w-full mt-4 ml-10 border-b dark:border-b-dark_border_1"></span>
        </div>

        <ul>
          {searchResults &&
            searchResults.filter(filtrarPorTipoVeiculo).map((user) => (
              <Contact
                contact={user}
                key={user._id}
                setSearchResults={setSearchResults}
                setShowSidebar={setShowSidebar}
              />
            ))}
        </ul>

        {dadosPedido && (
          <div className="mx-8 mt-6 bg-white dark_bg_1 bg-opacity-90 rounded-xl shadow-md p-6 space-y-4">
            <button
              onClick={() => setPedidoVisivel(!pedidoVisivel)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {pedidoVisivel ? "Ocultar Pedido" : "Mostrar Pedido"}
            </button>

            {pedidoVisivel && (
              <>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-blue">Resumo do Pedido</h2>

               <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-black font-bold">

                  {user?.picture && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={user.picture}
                        alt="Foto de perfil"
                        className="w-20 h-20 rounded-full border object-cover"
                      />
                    </div>
                  )}

                  <div><span className="font-medium">Nome:</span> {user?.name || "Usuário"}</div>
                  <div><span className="font-medium">Email:</span> {user?.email || "Não disponível"}</div>
                  <div><span className="font-medium">Origem:</span><br />{dadosPedido.origem}</div>
                  <div><span className="font-medium">Destino:</span><br />{dadosPedido.destino}</div>
                  <div className="flex items-center justify-between">
                    <div><span className="font-medium">Distância:</span> {dadosPedido.distancia?.toFixed(2)} km</div>
                    <div><span className="font-medium">Duração:</span> {Math.round(dadosPedido.duracao)} min</div>
                  </div>
                  <div><span className="font-medium">Tipo de Veículo:</span> {dadosPedido.tipo}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-medium">Forma de Pagamento:</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={`/assets/img/${dadosPedido.formaPagamento === 'pix'
                          ? 'pix.svg'
                          : dadosPedido.formaPagamento === 'cartao'
                            ? 'cartao-de-credito-mercado-pago.webp'
                            : dadosPedido.formaPagamento === 'dinheiro'
                              ? 'financa.png'
                              : 'maquina-de-cartao.png'
                        }`}
                        alt={dadosPedido.formaPagamento}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-sm capitalize">{dadosPedido.formaPagamento}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Valor Total:</span> {dadosPedido.valor || "R$ --"}
                  </div>
                </div>

                {/**/}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFiltrarPorStatus(true);
                      alert("Pedido confirmado! Filtrando motoristas disponíveis...");
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Confirmar pedido
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      localStorage.removeItem("viagem_atual");
                      setDadosPedido(null);
                      setFiltrarPorStatus(false);
                      alert("Pedido cancelado");
                    }}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancelar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
