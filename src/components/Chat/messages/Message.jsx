import { useState } from "react";
import moment from "moment";
import TraingleIcon from "../../../svg/triangle";

export default function Message({ message, me }) {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={`w-full flex mt-2 space-x-3 max-w-xs ${me ? "ml-auto justify-end" : ""}`}>
      {!me && (
        <img
          src={message.sender.picture}
          alt=""
          className="w-8 h-8 rounded-full self-end"
        />
      )}
      <div className="relative">
        <div className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg
          ${me ? "bg-green_3" : "dark:bg-dark_bg_2"}
        `}>
          {/* ▼ Botão de opções */}
          <span
            className="absolute top-1 right-1 text-lg cursor-pointer select-none"
            onClick={toggleOptions}
          >
            &#94;
          </span>

          {/* Caixa de opções */}
          {showOptions && (
            <div className="absolute top-6 right-1 z-10 bg-dark_bg_3 text-sm text-white rounded-md shadow-md p-2 space-y-1 w-32">
              <button className="w-full text-left hover:bg-dark_bg_4 px-2 py-1 rounded">📋 Copiar</button>
              <button className="w-full text-left hover:bg-dark_bg_4 px-2 py-1 rounded">🗑️ Apagar</button>
              <button className="w-full text-left hover:bg-dark_bg_4 px-2 py-1 rounded">💬 Responder</button>
            </div>
          )}

          {/* Mensagem */}
          <p className="text-sm pb-4 pr-8">{message.message}</p>

          {/* Hora */}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-gold leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>

          {/* Triângulo da bolha */}
          {!me && (
            <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
          )}
        </div>
      </div>
    </div>
  );
}
