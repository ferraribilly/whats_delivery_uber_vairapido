// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import Sidebar from "../sidebar/Sidebar";
// import Contact from "../sidebar/search/Contact";
// import Search from "../sidebar/search/Search";
// import { MapPin, Clock, Map as MapIcon, History } from "lucide-react";

// const pulseStyle = `
// .leaflet-user-icon {
//   animation: pulse 2s infinite;
//   border-radius: 50%;
//   border: 2px solid white;
//   box-shadow: 0 0 0 rgba(226, 0, 0, 1);
// }
// @keyframes pulse {
//   5% { transform: scale(1); box-shadow: 0 0 0 0 rgba(125, 249, 1, 0.35); }
//   70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(149, 255, 0, 1); }
//   100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 55, 0, 1); }
// }
// `;
// const markerIcon = "/assets/markers/marker.png";
// const selectedMarkerIcon = "/assets/markers/selected-marker.png";
// const startIcon = "/assets/markers/start.png";

// export default function SearchResults({ searchResults, setSearchResults, setShowSidebar, setShowMap }) {
//   const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight / 2);
//   const [showOrigem, setShowOrigem] = useState(false);
//   const sheetRef = useRef(null);
//   const startYRef = useRef(0);
//   const startHeightRef = useRef(0);
//   const draggingRef = useRef(false);
//   const [statusApiHtml, setStatusApiHtml] = useState("");
//   const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";
//   const [origem, setOrigem] = useState("");
//   const [destino, setDestino] = useState("");
//   const { user } = useSelector((state) => state.user);
//   const [markers, setMarkers] = useState([]);
//   const mapRef = useRef(null);
//   const userMarkerRef = useRef(null);

//   const onDragStart = (e) => {
//     draggingRef.current = true;
//     startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
//     startHeightRef.current = sheetHeight;
//   };

//   const onDragMove = (e) => {
//     if (!draggingRef.current) return;
//     const currentY = e.touches ? e.touches[0].clientY : e.clientY;
//     const deltaY = startYRef.current - currentY;
//     const newHeight = Math.min(window.innerHeight, Math.max(200, startHeightRef.current + deltaY));
//     setSheetHeight(newHeight);
//   };

//   const onDragEnd = () => {
//     draggingRef.current = false;
//   };

//   useEffect(() => {
//     axios
//       .get(`${apiURL}`)
//       .then((res) => setStatusApiHtml(res.data))
//       .catch(() =>
//         setStatusApiHtml("<h1 style='color:red;text-align:center;'>VAI RÁPIDO UBER FECHADO ❌</h1>")
//       );
//   }, [apiURL]);

//   useEffect(() => {
//     const styleEl = document.createElement("style");
//     styleEl.innerHTML = pulseStyle;
//     document.head.appendChild(styleEl);
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) {
//       mapRef.current = L.map("mapmonitoramento", {
//         zoomControl: true,
//         attributionControl: false,
//       }).setView([-15.78, -47.92], 13);

//       L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
//         subdomains: "abcd",
//         maxZoom: 13,
//       }).addTo(mapRef.current);
//     }
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     markers.forEach((m) => mapRef.current.removeLayer(m));
//     const novos = [];

//     searchResults?.forEach((pessoa) => {
//       const temUber = pessoa.tipoVeiculo || pessoa.tipoVeiculo;

//       if (temUber && pessoa.location?.coordinates) {
//         const [lng, lat] = pessoa.location.coordinates;
//         const marker = L.marker([lat, lng])
//           .addTo(mapRef.current)
//           .bindPopup(
//             `<b>${pessoa.name || "Motorista"}</b><br/>Tipo: ${
//               pessoa.tipoVeiculo ? "Carro" : pessoa.tipoVeiculo ? "Moto" : "Entregador"
//             }`
//           );
//         novos.push(marker);
//       } else if (pessoa.location?.coordinates && pessoa.online === true) {
//         const [lng, lat] = pessoa.location.coordinates;
//         const icon = L.divIcon({
//           html: `<img src="${
//             pessoa.picture ||
//             "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"
//           }" class="leaflet-user-icon" width="40" height="40"/>`,
//           iconSize: [40, 40],
//           className: "",
//         });
//         const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current).bindPopup(`<b>${pessoa.name || "Usuário"}</b>`);
//         novos.push(marker);
//       }
//     });

//     setMarkers(novos);
//   }, [searchResults]);

//   useEffect(() => {
//     if (!mapRef.current) return;
//     if (!navigator.geolocation) {
//       alert("Geolocalização não suportada pelo navegador.");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         if (userMarkerRef.current) {
//           userMarkerRef.current.setLatLng([latitude, longitude]);
//         } else {
//           const icon = L.divIcon({
//             html: `<div style="width:40px; height:40px; border-radius:50%; overflow:hidden; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
//               <img src="${
//                 user?.picture ||
//                 "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"
//               }" style="width:40px; height:40px; object-fit:cover;" />
//             </div>`,
//             iconSize: [40, 40],
//             className: "",
//           });
//           userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(mapRef.current).bindPopup("Você");
//         }
//         if (!mapRef.current._userCentered) {
//           mapRef.current.setView([latitude, longitude], 19);
//           mapRef.current._userCentered = true;
//         }
//       },
//       (error) => {
//         console.error("Erro ao obter localização:", error);
//         alert("Não foi possível obter localização.");
//       },
//       { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
//     );

//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//     };
//   }, [user?.picture]);


//   return (
//     <div className="relative w-full h-full">
//         <div
//           id="mapmonitoramento"
//           style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 0 }}
//         ></div>

//         <div
//           className="absolute top-4 left-4 z-[999] bg-black/80 px-4 py-2 rounded shadow-md max-w-xs"
//           dangerouslySetInnerHTML={{ __html: statusApiHtml }}
//         />

//         <div className="relative z-[1] w-full h-full overflow-auto scrollbar bg-opacity-70"></div>
//       <div
//         ref={sheetRef}
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: sheetHeight,
//           backgroundColor: "rgb(255, 255, 255)",
//           borderTopLeftRadius: "30px",
//           borderTopRightRadius: "30px",
//           boxShadow: "0 -2px 10px rgb(0, 0, 0), 0 0 15px rgba(0,0,0,0.05)",
//           padding: "16px",
//           zIndex: 60,
//           display: "flex",
//           flexDirection: "column",
//           overflowY: "auto",
//           transition: "height 0.3s ease",
//           backdropFilter: "blur(8px)",
//           WebkitBackdropFilter: "blur(8px)",
//         }}
//         onMouseDown={onDragStart}
//         onTouchStart={onDragStart}
//         onMouseMove={onDragMove}
//         onTouchMove={onDragMove}
//         onMouseUp={onDragEnd}
//         onTouchEnd={onDragEnd}
//         onMouseLeave={onDragEnd}
//       >
//         <div
//           style={{
//             width: "40px",
//             height: "5px",
//             backgroundColor: "#ccc",
//             borderRadius: "3px",
//             alignSelf: "center",
//             marginBottom: "10px",
//             cursor: "grab",
//           }}
//         ></div>
        
//         <ul>

//            {/*Results*/}
//         <ul>
//           {searchResults &&
//             searchResults.map((user) => (
//               <Contact
//                 contact={user}
//                 key={user._id}
//                 setSearchResults={setSearchResults}
//               />
//             ))}
//         </ul>
//           <Contact
//             contact={user}
//             key={user._id}
//             searchResults={searchResults}
//             setSearchResults={setSearchResults}
//             setShowSidebar={setShowSidebar}
//             dadosPedido={JSON.parse(localStorage.getItem("viagem_atual"))}
//             user={user}
//             onConfirm={() => console.log("Aceitou")}
//             onCancel={() => console.log("Cancelou")}
//           />
//           <Search
//             contact={user}
//             key={user._id}
//             searchResults={searchResults}
//             setSearchResults={setSearchResults}
//             setShowSidebar={setShowSidebar}
//           />
//         </ul>

      
//       </div>
//     </div>
//   );
// }
