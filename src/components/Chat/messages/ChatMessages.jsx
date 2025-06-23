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
            body: lastMessage.message || "Áudio recebido",
            icon: lastMessage.sender.picture,
          });
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')]
      bg-cover bg-no-repeat"
    >
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[12%]">
        {messages &&
          messages.map((message) => (
            <div key={message._id}>
              {message.files.length > 0 &&
                message.files.map((file) => (
                  <FileMessage
                    FileMessage={file}
                    message={message}
                    key={message._id + file.url}
                    me={user._id === message.sender._id}
                  />
                ))}

              {/* Mostra texto ou áudio */}
              {(message.message.length > 0 || message.type === "audio") && (
                <Message
                  message={message}
                  key={message._id + "_text"}
                  me={user._id === message.sender._id}
                />
              )}
            </div>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}
