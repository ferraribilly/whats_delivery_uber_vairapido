import { useEffect, useState } from "react";
import { ArrowIcon, CloseIcon, NotificationIcon } from "../../../svg";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

export default function NotificationsPassageiros({ contact, socket, setShowSidebar }) {
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;


  // Protege caso contact esteja undefined
  if (!contact || !contact._id) return null;

  const openConversation = async () => {
    const newConvo = await dispatch(
      open_create_conversation({
        receiver_id: contact._id,
        token,
      })
    );
    socket.emit("join conversation", newConvo.payload._id);
    if (setShowSidebar) setShowSidebar(false);
    setVisible(false); // Fecha após aceitar
  };

  const handleReject = () => {
    localStorage.setItem("notifications_allowed", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="h-[auto] dark:bg-dark_bg_3 flex items-center p-[13px]">
      <div className="w-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer">
            <NotificationIcon className="dark:fill-blue_1" />
          </div>
          <div className="flex flex-col">
            <span className="textPrimary">Solicitação Passageiro</span>
            <span className="textSecondary mt-0.5 flex items-center gap-0.5">
              <li
                onClick={openConversation}
                className="list-none h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]"
              >
                <div className="flex items-center gap-x-3 py-[10px]">
                  <div className="flex items-center gap-x-3">
                    <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
                      <img
                        src={contact.picture}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <h1 className="font-bold flex items-center gap-x-2">
                        {contact.name}
                      </h1>
                      <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                        <p>{contact.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
              </li>
              <ArrowIcon className="dark:fill-dark_svg_2 mt-1" />
            </span>
          </div>
        </div>

        {/* Right - Botões aceitar/recusar */}
        <div className="flex gap-2 items-center">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={openConversation}
          >
            Aceitar
          </button>
          <button
            className="bg-red-700 text-white px-3 py-1 rounded text-sm"
            onClick={handleReject}
          >
            Recusar
          </button>
          <div
            className="cursor-pointer"
            onClick={() => setVisible(false)}
            title="Fechar"
          >
            <CloseIcon className="dark:fill-dark_svg_2 w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
