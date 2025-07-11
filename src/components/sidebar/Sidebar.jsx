import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import { Notifications, NotificationsPassageiros } from "./notifications";
import { SearchMotorista, Search } from "./search";
import { SearchResults } from "./search";


export default function Sidebar({ onlineUsers, typing, onCloseSidebar }) {
  const [searchResults, setSearchResults] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  if (!showSidebar) return null;

  return (
   <div className="w-full h-full select-none bg-dark_bg_2 fixed top-0 left-0 z-50 scrollbar overflow-hidden">
      <SidebarHeader />

      <Notifications />

      <NotificationsPassageiros />

     
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
        onSelectConversation={onCloseSidebar}
      />
      
      
      {searchResults.length > -1 ? (
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
