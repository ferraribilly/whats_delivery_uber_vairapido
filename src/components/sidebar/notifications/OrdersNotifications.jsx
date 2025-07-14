import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";
import axios from "axios";

export default function OrdersNotifications({
  contact,
  setSearchResults,
  setShowSidebar,
  user,
  onConfirm,
  onCancel,
}) {
  const [visible, setVisible] = useState(false); // começa como false
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  const socket = useContext(SocketContext);
  const [dadosPedido, setDadosPedido] = useState(null);

  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:3005";

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        const res = await axios.get(`${apiURL}/viagem`);
        setDadosPedido(res.data);
      } catch {
        setDadosPedido(null);
      }
    };
    fetchViagem();
    
  }, [apiURL]);

  if (!dadosPedido) return null;

  // Só mostrar se o tipoVeiculo do usuário for igual ao tipo da viagem
  if (user?.tipoVeiculo !== dadosPedido.tipo) return null;

  const openConversation = async () => {
    const newConvo = await dispatch(
      open_create_conversation({
        receiver_id: contact._id,
        token: reduxUser.token,
      })
    );
    socket.emit("join conversation", newConvo.payload._id);
    setSearchResults([]);
    if (setShowSidebar) setShowSidebar(false);
  };

  return (
    <div className="mx-8 mt-6 bg-white bg-opacity-90 rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-blue">Resumo do Pedido</h2>
      <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-black font-bold">
        {contact.picture && (
          <div className="flex justify-center mb-3">
            <img
              src={contact.picture}
              alt="Foto"
              className="w-20 h-20 rounded-full border object-cover"
            />
          </div>
        )}
        <div><span className="font-medium">Nome:</span> {contact.name}</div>
        <div><span className="font-medium">Email:</span>{contact.email}</div>
        <div>
          <span className="font-medium">Origem:</span>
          <br />
          {contact.origem}
        </div>
        <div>
          <span className="font-medium">Destino:</span>
          <br />
          {contact.destino}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Distância:</span>{" "}
            {contact.distancia?.toFixed(2)} km
          </div>
          <div>
            <span className="font-medium">Duração:</span>{" "}
            {Math.round(contact.duracao)} min
          </div>
        </div>
        <div>
          <span className="font-medium">Tipo de Veículo:</span> {contact.tipo}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium">Forma de Pagamento:</span>
          <div className="flex items-center gap-2">
            <img
              src={`/assets/img/${
               contact.formaPagamento === "pix"
                  ? "pix.svg"
                  : contact.formaPagamento === "cartao"
                  ? "cartao-de-credito-mercado-pago.webp"
                  : contact.formaPagamento === "dinheiro"
                  ? "financa.png"
                  : "maquina-de-cartao.png"
              }`}
              alt={contact.formaPagamento}
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm capitalize">{contact.formaPagamento}</span>
          </div>
        </div>
        <div>
          <span className="font-medium">Valor Total:</span>{" "}
          {contact.valor || "R$ --"}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onConfirm}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Aceitar Corrida
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={onCancel}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Cancelar Pedido
        </button>
      </div>

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
