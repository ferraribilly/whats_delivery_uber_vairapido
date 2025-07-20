import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import Notifications from "../sidebar/notifications/Notifications";
import { Search, SheetResults } from "./search";
import OrdersRequest from "./search/OrdersRequest";
import OrdersScreen from "./search/OrdersScreen";

export default function Sidebar({ onlineUsers, typing, onCloseSidebar }) {
  const [sheetResults, setSheetResults] = useState([]);
  const [ordersRequest, setOrdersRequests] = useState([]);
  const [ordersScreen, setOrdersScreen] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  if (!isOpen) return null;
  if (!showSidebar) return null;

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    if (typeof onCloseSidebar === "function") onCloseSidebar();
  };

  return (
    <div className="w-full h-full select-none bg-black fixed top-0 left-0 z-[1] scrollbar overflow-hidden">
      <SidebarHeader />
      <Notifications />
      <Search
        searchLength={sheetResults.length}
        setSheetResults={setSheetResults}
        onSelectConversation={handleCloseSidebar}
      />
      <OrdersRequest />
      <OrdersScreen />
      {sheetResults.length > 0 ? (
        <SheetResults
          sheetResults={sheetResults}
          setSheetResults={setSheetResults}
          setSidebarOpen={setIsOpen}
        />
      ) : (
        <Conversations
          onlineUsers={onlineUsers}
          typing={typing}
          setSidebarOpen={setIsOpen}
          onSelectConversation={handleCloseSidebar}
        />
      )}
    </div>
  );
}
