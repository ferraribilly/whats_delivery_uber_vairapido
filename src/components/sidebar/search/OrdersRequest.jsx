import { useSelector,  useDispatch } from "react-redux";

import axios from "axios";
import { useState, useRef } from "react";


export default function OrdersRequest({ item, ordersRequests, setOrdersRequests }) {
const dispatch = useDispatch();
const { user } = useSelector((state) => state.user);

  const { _id: contact } = user || {};

  const acceptRequest = async (ordersRequestId) => {
    try {
      const response  = await fetch("/orders-request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: ordersRequestId,
          receiver_Id: contact,
        }),
      });

      if (response.ok) {
        setOrdersRequests(
          ordersRequests.filter((request) => request._id !== ordersRequestId)
        );
        // Você pode exibir uma notificação aqui, se quiser
        // Ex: toast.success("Solicitação aceita");
      }
    } catch (err) {
      console.log("Erro ao aceitar a solicitação:", err);
    }
  };

  return (
    <li className="flex items-center justify-between py-3 px-4 border rounded-md shadow mb-2 bg-dark_bg_2">
      <img
        src={contact.picture}
        alt="Foto do usuário"
        className="w-12 h-12 rounded-full object-cover"
      />

      <span className="ml-4 font-semibold text-white flex-1 text-center">
        {contact?.name} enviou uma solicitação!
      </span>

      


      <button
        onClick={() => acceptRequest(contact._id)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Aceitar
      </button>
    </li>
  );
}
