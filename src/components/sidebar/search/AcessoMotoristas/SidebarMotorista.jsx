import { useState,  useRef, } from "react";
import { Conversations } from "../../conversations";
import { SidebarHeader } from "../../header";
import Notifications from "../../notifications/Notifications";
import {OrdersNotificationsPassageiro, SearchResults } from "..";
import { useSelector } from "react-redux";

export default function SidebarMotorista({ onlineUsers, typing, onCloseSidebarMotorista }) {
  const [sheetResults, setSheetResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [showSidebarMotorista, setShowSidebarMotorista] = useState(true);
  const mapRef = useRef(null);
  const rotaLayerRef = useRef(null);
  const markerOrigemRef = useRef(null);
  const markerDestinoRef = useRef(null);
  
  const { user } = useSelector((state) => state.user);
  

 

  if (!isOpen) return null;
  if (!showSidebarMotorista) return null;

  const handleCloseSidebar = () => {
    setShowSidebarMotorista(false);
    if (typeof onCloseSidebar === "function") onCloseSidebarMotorista();
  };

  return (
    <div className="w-full h-full select-none bg-black fixed top-0 left-0 z-[999] scrollbar overflow-hidden">
      
      <SidebarHeader
      
      />
      <Notifications />

        {/*ContactOrdersEnviadaMotorista*/}
      <OrdersNotificationsPassageiro
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
        setShowSidebar={setShowSidebarMotorista}
        
      />
      
      

      {searchResults.length > -1 ? (
        <>
          {/*Search results*/}
           <SearchResults
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        setSidebarMotoristaOpen={setIsOpen}
        setShowSidebarMotorista={setShowSidebarMotorista}
        externalMapRef={mapRef}
        externalRotaLayerRef={rotaLayerRef}
        externalMarkerOrigemRef={markerOrigemRef}
        externalMarkerDestinoRef={markerDestinoRef}
        
      />
        </>
      ) : (
        <>
          {/*Conversations*/}
          <Conversations 
          onlineUsers={onlineUsers}
          typing={typing}
          setSidebarOpen={setIsOpen}
          onSelectConversation={handleCloseSidebar}
          
          />
        </>
      )}

    </div>
  );
}
