// src/components/sidebar/Sidebar.jsx
import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import Notifications from "../sidebar/notifications/Notifications";
import { Search, SheetResults } from "./search";

export default function Sidebar({ onlineUsers, typing, onCloseSidebar }) {
  const [sheetResults, setSheetResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  if (!isOpen) return null;
  if (!showSidebar) return null;

  return (
    <div className="w-full h-full select-none bg-white fixed top-0 left-0 z-[1] scrollbar overflow-hidden">
      <SidebarHeader />
      <Notifications
      
      />
      <Search
        searchLength={sheetResults.length}
        setSheetResults={setSheetResults}
        onSelectConversation={onCloseSidebar}
      />

      {sheetResults.length > 1 ? (
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
          onSelectConversation={onCloseSidebar}
        />
      )}
    </div>
  );
}
