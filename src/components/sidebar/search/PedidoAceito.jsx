import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

export default function SearchMotorista({
  ContactWithContext,
  contact,
  setSearchResults,
  setShowSidebar,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const socket = useContext(SocketContext);

  const openConversation = async () => {
    const newConvo = await dispatch(
      open_create_conversation({
        receiver_id: contact._id,
        token,
      })
    );
    socket.emit("join conversation", newConvo.payload._id);
    setSearchResults([]);
    if (setShowSidebar) setShowSidebar(false);
  };

  return (
    <div className=" hidden  mx-8 mt-6 bg-white bg-opacity-90 rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-lg text-center font-bold text-black">Motorista aceitou 🎉</h2>

      <div className="flex flex-col gap-2 text-sm font-bold text-black">
        <div className="flex justify-center mb-3">
          <img
            src={contact.picture}
            alt="Foto"
            className="w-20 h-20 rounded-full border object-cover"
          />
        </div>

        <div className="flex items-center gap-1 mt-1 mb-3 justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09L5.5 12.545 1 8.91l6.061-.877L10 2l2.939 6.033L19 8.91l-4.5 3.636 1.378 5.545z" />
          </svg>
          {[...Array(4)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.909c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.974-2.89a1 1 0 00-1.176 0l-3.974 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.974-2.89c-.783-.57-.38-1.81.588-1.81h4.909a1 1 0 00.95-.69l1.518-4.674z"
              />
            </svg>
          ))}
        </div>

        <div>
          <span className="font-bold">Name:</span> {contact.name}
        </div>
        <div>
          <span className="font-bold">Tipo de veículo:</span>{" "}
          {contact.tipoVeiculo || "Não informado"}
        </div>
        <div>
          <span className="font-bold">Veículo:</span>{" "}
          {contact.marca || "Não informado"}
        </div>
        <div>
          <span className="font-bold">Cor do veículo:</span>{" "}
          {contact.cor || "Não informado"}
        </div>
        <div>
          <span className="font-bold">Placa:</span> {contact.placa || "Não informado"}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-600">Distância:</span>{" "}
          {/* valor aqui */}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600">TempoChegada:</span>{" "}
          TEMPO_CHEGADA_AQUI
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">Localização:</span>{" "}
          LOCALIZACAO_AQUI
        </div>

        {/* Mostrar QR Code PIX só se existir */}
        {contact.fotoQrCode && (
          <>
            <h2 className="text-lg text-center font-bold text-black">Qr-Code PIX</h2>
            <div className="flex justify-center mb-3">
              <img
                src={contact.fotoQrCode}
                alt="Qr-Code"
                className="w-40 h-40 object-cover"
              />
            </div>
          </>
        )}


         <div className="flex items-center gap-2 text-align-center">
          <span className="font-bold text-red-600">Valor Corrida:</span>{" "}
          {contact.valorCorrida || "Não informado"}
        </div>

        {/* Mostrar Chave PIX só se existir */}
        {contact.chavePix && (
          <div className="flex items-center">
            <input
              type="text"
              value={contact.chavePix}
              readOnly
              className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="bg-blue-600 text-white rounded-r px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => {
                navigator.clipboard.writeText(contact.chavePix);
                alert("Chave PIX copiada para a área de transferência!");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12v4m0 0v4m0-4H8m8 0h4m-4 0H8"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={() => {
          // função de cancelamento
        }}
      >
        Cancelar
      </button>

      <div className="flex justify-center gap-8 mt-4">
        <button
          type="button"
          aria-label="Conversa"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          onClick={openConversation}
        >
          <img src="logo192.png" alt="UberX" className="h-12 w-12" />
          Conversa 
        </button>
      </div>
    </div>
  );
}
