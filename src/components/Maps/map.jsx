import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige o ícone padrão do marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Componente para atualizar o centro do mapa quando position mudar
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

export default function Maps() {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [position, setPosition] = useState([-23.55052, -46.633308]);
  const [hasLocation, setHasLocation] = useState(false);

  const handleCalcular = () => {
    console.log('Origem:', origem);
    console.log('Destino:', destino);
  };

  const pegarLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setHasLocation(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}`
          );
          const data = await response.json();

          // -------- INÍCIO DO AJUSTE NO PREENCHIMENTO --------
          const rua = data.address.road || '';
          const bairro =
            data.address.neighbourhood ||
            data.address.suburb ||
            data.address.district ||
            '';

          if (rua || bairro) {
            const enderecoFormatado = `${rua}${bairro ? ', ' + bairro : ''}`;
            setOrigem(enderecoFormatado);
          } else {
            setOrigem('Endereço não encontrado');
          }
          // -------- FIM DO AJUSTE --------

        } catch {
          setOrigem('Endereço não encontrado');
        }
      },
      (err) => {
        alert('Erro ao obter localização: ' + err.message);
      }
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div
        style={{
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          width: 'calc(100% - 40px)',
          height: 'calc(100% - 40px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <input
          type="text"
          placeholder="Origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          style={{
            marginBottom: '10px',
            display: 'block',
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          style={{
            marginBottom: '10px',
            display: 'block',
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleCalcular}
          style={{
            marginBottom: '10px',
            padding: '10px',
            width: '100%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Calcular
        </button>

        <div style={{ width: '100%', height: 'calc(100% - 140px)' }}>
          <MapContainer
            center={position}
            zoom={19}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-23.55052, -46.633308]}>
              <Popup>Aqui é São Paulo! 🍔</Popup>
            </Marker>
            {hasLocation && (
              <Marker position={position}>
                <Popup>Você está aqui!</Popup>
              </Marker>
            )}
            <RecenterMap position={position} />
          </MapContainer>
        </div>
      </div>

      {/* Botão ícone fixo no canto superior direito */}
      <button
        onClick={pegarLocalizacaoAtual}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1100,
          backgroundColor: '#28a745',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
        title="Pegar minha localização atual"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 4z" />
          <path d="M8 0a.5.5 0 0 1 .5.5v1.2a6.498 6.498 0 0 1 6 6h1.2a.5.5 0 0 1 0 1h-1.2a6.498 6.498 0 0 1-6 6v1.2a.5.5 0 0 1-1 0v-1.2a6.498 6.498 0 0 1-6-6H.5a.5.5 0 0 1 0-1h1.2a6.498 6.498 0 0 1 6-6V.5A.5.5 0 0 1 8 0z" />
        </svg>
      </button>
    </div>
  );
}
