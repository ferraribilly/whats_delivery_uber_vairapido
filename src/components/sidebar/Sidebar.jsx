import { useState, useEffect } from "react";
import Conversations from "./conversations/Conversations";
import SidebarHeader from "./header/SidebarHeader";
import Notifications from "./notifications/Notifications";
import Search from "./search/Search";
import SearchResults from "./search/SearchResults";





export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const hasContent =
    searchResults.length > 0 || (onlineUsers && onlineUsers.length > 0);

  useEffect(() => {
    if (hasContent) {
      setIsOpen(true);
    }
  }, [hasContent]);

  const handleConversationClick = () => {
    setIsOpen(false); // fecha menu ao clicar na conversa (mobile)
  };

  return (
    <>
      {/* Botão abrir/fechar menu (mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-dark_bg_1 p-2 rounded shadow text-black dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        style={{ color: "inherit" }}
      >
        {/* Ícone X fixo SEMPRE */}
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Backdrop escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-dark_bg_1 shadow-md select-none overflow-y-auto
          p-4 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-full max-w-full" : "-translate-x-full w-64 max-w-none"}
          md:relative md:translate-x-0 md:w-auto md:flex md:max-w-[30%] flex-col
          z-50
        `}
      >
        <SidebarHeader />
        <Notifications />
        <Search
          searchLength={searchResults.length}
          setSearchResults={setSearchResults}
        />
        {searchResults.length > 0 ? (
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        ) : (
          <Conversations
            onlineUsers={onlineUsers}
            typing={typing}
            onConversationClick={handleConversationClick}
          />
        )}
      </div>
    </>
  );
}
