import { useState } from "react";
import { ArrowIcon, CloseIcon, NotificationIcon } from "../../../svg";

export default function Notifications() {
  const [visible, setVisible] = useState(true);
  const [accepted, setAccepted] = useState(null); // null = sem resposta, true = aceitou, false = recusou

  if (!visible) return null;

  const handleAccept = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setAccepted(true);
      // Pode salvar em localStorage ou context para uso global
      localStorage.setItem("notifications_allowed", "true");
    } else {
      setAccepted(false);
      localStorage.setItem("notifications_allowed", "false");
    }
    setVisible(false);
  };

  const handleReject = () => {
    setAccepted(false);
    localStorage.setItem("notifications_allowed", "false");
    setVisible(false);
  };

  return (
    <div className="h-[auto] dark:bg-dark_bg_3 flex items-center p-[13px]">
      <div className="w-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer">
            <NotificationIcon className="dark:fill-blue_1" />
          </div>
          <div className="flex flex-col">
            <span className="textPrimary">Get notified of new messages</span>
            <span className="textSecondary mt-0.5 flex items-center gap-0.5">
              Turn on desktop notifications
              <ArrowIcon className="dark:fill-dark_svg_2 mt-1" />
            </span>
          </div>
        </div>

        {/* Right - Botões aceitar/recusar */}
        <div className="flex gap-2 items-center">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleAccept}
          >
            Sim
          </button>
          <button
            className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
            onClick={handleReject}
          >
            Não
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
