import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import Notifications from "./notifications/Notifications";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, SearchResults } from "./search";
import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";

const pulseStyle = `
.leaflet-user-icon {
  animation: pulse 2s infinite;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(226, 0, 0, 1);
}
@keyframes pulse {
  5% { transform: scale(1); box-shadow: 0 0 0 0 rgba(1, 96, 249, 0.35); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(21, 0, 255, 0.2); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 55, 0, 0.43); }
}
`;

export default function Sidebar({
  onlineUsers,
  typing,
  onCloseSidebar,
  externalMapRef,
  externalRotaLayerRef,
  externalMarkerOrigemRef,
  externalMarkerDestinoRef,
  contact,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebar, setSidebar] = useState([]);
  const rotaLayerRef = useRef(null);
  const markerOrigemRef = useRef(null);
  const markerDestinoRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [markers, setMarkers] = useState([]);
  const socket = useContext(SocketContext);

  const internalMapRef = useRef(null);
  const mapRef = externalMapRef || internalMapRef;
  const userMarkerRef = useRef(null);

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
      }).setView([-15.78, -47.92], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(mapRef.current);
    }
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    markers.forEach((m) => mapRef.current.removeLayer(m));
    const novos = [];

    searchResults?.forEach((contact) => {
      const contactLocation = contact.tipoVeiculo;

      if (contactLocation && contact.location?.coordinates) {
        const [lng, lat] = contact.location.coordinates;

        const marker = L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(
            `<b>${contact.name || "Contact"}</b><br/>Tipo: ${
              contact.tipoVeiculo ? "carro" : "moto"
            }`
          );
        novos.push(marker);
      } else if (contact.location?.coordinates && contact.users === true) {
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
  }, [searchResults, mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo navegador.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (user?._id && socket) {
          socket.emit("update location", {
            userId: user._id,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          });
        }

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
            .bindPopup(`<b>${user?.name || "Você"}</b>`);
        }

        if (!mapRef.current._userCentered) {
          mapRef.current.setView([latitude, longitude], 16);
          mapRef.current._userCentered = true;
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user?._id, user?.picture, user?.name, mapRef, socket]);

  if (!isOpen || !showSidebar) return null;

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    if (typeof onCloseSidebar === "function") onCloseSidebar();
  };

  return (
    <div className="w-full h-full select-none z-50 bg-dark_bg_2 fixed top-0 left-0 scrollbar overflow-hidden">
      <SidebarHeader />
      <Notifications />
      <div id="map" className="absolute top-0 left-0 w-full h-full z-[500]"></div>
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
        setSidebar={setSidebar}
      />
      {searchResults.length > 0 ? (
        <SearchResults
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setShowSidebar={setShowSidebar}
        />
      ) : (
        <Conversations
          onlineUsers={onlineUsers}
          typing={typing}
          onSelectConversation={onCloseSidebar}
        />
      )}
    </div>
  );
}
