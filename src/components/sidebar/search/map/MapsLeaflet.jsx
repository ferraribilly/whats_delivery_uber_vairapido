
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";





const pulseStyle = `
.leaflet-user-icon {
  animation: pulse 2s infinite;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(226, 0, 0, 1);
}
@keyframes pulse {
  5% { transform: scale(1); box-shadow: 0 0 0 0 rgba(125, 249, 1, 0.35); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(149, 255, 0, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 55, 0, 0.29); }
}
`;
const markerIcon = "/assets/markers/marker.png";
const selectedMarkerIcon = "/assets/markers/selected-marker.png";
const startIcon = "/assets/markers/start.png";


export default function SearchResults({ searchResults, setSidebar, Sidebar, externalMapRef, externalRotaLayerRef, externalMarkerOrigemRef, externalMarkerDestinoRef   }) {
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";
    const [markers, setMarkers] = useState([]);
    const mapRef = externalMapRef;
    const userMarkerRef = useRef(null);
    const { user } = useSelector((state) => state.user);
    const [statusApiHtml, setStatusApiHtml] = useState("");
    

      useEffect(() => {
    axios
      .get(`${apiURL}`)
      .then((res) => setStatusApiHtml(res.data))
      .catch(() =>
        setStatusApiHtml("")
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
  
      searchResults?.forEach((contact) => {
        const temUber = contact.tipoVeiculo || contact.tipoVeiculo;
  
        if (temUber && contact.location?.coordinates) {
          const [lng, lat] = contact.location.coordinates;
          const marker = L.marker([lat, lng])
            .addTo(mapRef.current)
            .bindPopup(
              `<b>${contact.name || "Contact"}</b><br/>Tipo: ${
                contact.tipoVeiculo ? "carro" : contact.tipoVeiculo ? "moto" : "entregador"
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
    }, [Sidebar]);
  
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
              .bindPopup();
          }
          if (!mapRef.current._userCentered) {
            mapRef.current.setView([latitude, longitude], 16);
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

  return (
    <div className="w-full convos scrollbar">
     
      <div>
         {/* <div id="map" className="absolute top-0 left-0 w-full h-full z-[9999]"></div> */}
        {/*Heading*/}
        <div className="flex flex-col px-8 pt-8 ">
            
          <h1 className="font-extralight text-md text-green_2">Orders Notifications</h1>
          <div
        className="absolute top-58 left-4 z-[0] bg-black/80 px-4 py-2 rounded shadow-md max-w-xs z-[9999]"
        dangerouslySetInnerHTML={{ __html: statusApiHtml }}
      />
          <span className="w-full mt-4 ml-10 border-b "></span>
        </div>

        
      
         
      </div>
    </div>
  );
}
