import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige o ícone padrão dos markers do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const socket = io("http://localhost:3005"); // altere a URL se o backend estiver em outro host

export default function RealTimeMap() {
  const [myPosition, setMyPosition] = useState(null);
  const [others, setOthers] = useState([]);
  const mapRef = useRef();

  // Atualiza o mapa para a nova posição
  function SetViewOnClick({ coords }) {
    const map = useMap();
    useEffect(() => {
      if (coords) {
        map.setView(coords, 15);
      }
    }, [coords]);
    return null;
  }

  useEffect(() => {
    // Envia localização para o servidor
    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      const currentCoords = [latitude, longitude];
      setMyPosition(currentCoords);
      socket.emit("sendLocation", { latitude, longitude });
    });

    // Escuta localização de outros usuários
    socket.on("updateLocation", (data) => {
      setOthers((prev) => [...prev, [data.latitude, data.longitude]]);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, []);

  return (
    <MapContainer
      center={[-23.55052, -46.633308]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {myPosition && (
        <>
          <Marker position={myPosition} />
          <SetViewOnClick coords={myPosition} />
        </>
      )}

      {others.map((pos, index) => (
        <Marker key={index} position={pos} />
      ))}
    </MapContainer>
  );
}
