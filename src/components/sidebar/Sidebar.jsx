import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { Search, SheetResults } from "./search";

export default function Sidebar({ onlineUsers, typing }) {
  const [sheetResults, setSheetResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full select-none bg-dark_bg_2 fixed top-0 left-0 z-50 scrollbar overflow-hidden">
      <SidebarHeader />
      <Notifications />
      <Search
        searchLength={sheetResults.length}
        setSheetResults={setSheetResults}
      />
      

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
        />
      )}
    </div>
  );
}
