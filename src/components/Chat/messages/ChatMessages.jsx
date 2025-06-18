import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";

export default function ChatMessages({ typing }) {
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const endRef = useRef();

  const [lastMessageId, setLastMessageId] = useState(null);

  useEffect(() => {
    scrollToBottom();

    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];

      const notificationPermission = localStorage.getItem("notificationsAllowed");

      if (
        lastMessage._id !== lastMessageId &&
        lastMessage.sender._id !== user._id &&
        lastMessage.conversation._id === activeConversation._id
      ) {
        setLastMessageId(lastMessage._id);

        const audio = new Audio("/audio/message-sound-on-android-whistle-on-samsung.mp3");
        audio.play().catch((err) => {
          console.error("Erro ao tocar áudio:", err);
        });

        if (notificationPermission === "true" && Notification.permission === "granted") {
          new Notification("Nova mensagem", {
            body: lastMessage.message,
            icon: lastMessage.sender.picture,
          });
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Contador simples: contar mensagens enviadas por outros que ainda não foram lidas
  // Aqui simulo que mensagem tem `read` boolean para simplificar
  const unreadCount = messages?.filter(
    (m) => !m.read && m.sender._id !== user._id
  ).length;

  return (
    <div
      className="mb-[60px] bg-[url('https://res.cloudinary.com/dptprh0xk/image/upload/v1750033614/ltjurhryru0gmwfjnugw.jpg')]
      bg-cover bg-no-repeat"
    >
      <div className="px-4 py-1 sticky top-0 z-10 bg-gray-800 text-white flex justify-end">
        {unreadCount > 0 && (
          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
            {unreadCount}
          </div>
        )}
      </div>

      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[15%]">
        {messages &&
          messages.map((message) => (
            <div key={message._id}>
              {message.files.length > 0
                ? message.files.map((file) => (
                    <FileMessage
                      FileMessage={file}
                      message={message}
                      key={message._id + file.url}
                      me={user._id === message.sender._id}
                    />
                  ))
                : null}
              {message.message.length > 0 ? (
                <Message
                  message={message}
                  key={message._id + "_text"}
                  me={user._id === message.sender._id}
                />
              ) : null}
            </div>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}
