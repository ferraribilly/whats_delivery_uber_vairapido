import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { Search } from "./search";
import { SearchResults } from "./search";

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true); // NOVO

  if (!showSidebar) return null;

  return (
    <div className="w-full h-full select-none bg-dark_bg_2 fixed top-0 left-0 z-50">
      {/* Sidebar Header */}
      <SidebarHeader />

      {/* Notifications */}
      <Notifications />

      {/* Search */}
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {searchResults.length > 0 ? (
        <>
          {/* Search Results */}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setShowSidebar={setShowSidebar} // passa função pra fechar
          />
        </>
      ) : (
        <>
          {/* Conversations */}
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        </>
      )}
    </div>
  );
}
