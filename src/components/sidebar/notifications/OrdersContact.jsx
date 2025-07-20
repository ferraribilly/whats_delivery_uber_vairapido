import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

function OrdersContact({ pedidoSalvo, setSheetResults, socket, setSidebarOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const openConversation = async () => {
    const values = {
      receiver_id: pedidoSalvo.motorista?._id || pedidoSalvo.userId, 
      token,
    };
    const newConvo = await dispatch(open_create_conversation(values));
    if (newConvo?.payload?._id) {
      socket.emit("join conversation", newConvo.payload._id);
      setSheetResults([]);
      setSidebarOpen?.(false);
    }
  };

  return (
    <li className="list-none h-auto cursor-pointer px-[10px]">
      <div className="relative flex flex-col items-center py-10 gap-2 bg-dark_bg_1 border-[10px] text-black rounded-md shadow-md mt-10">
        <div className="absolute -top-0 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
          <img
            src={pedidoSalvo.motorista?.picture || "/default-profile.png"}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center mt-12 gap-1">
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.userId}</h1>
          <p className="text-sm dark:text-blue-700">{pedidoSalvo.name || pedidoSalvo.nomePassageiro}</p>
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.origem}</h1>
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.destino}</h1>
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.distancia} km</h1>
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.duracao} min</h1>
          <h1 className="font-bold text-lg dark:text-white">{pedidoSalvo.formaPagamento}</h1>
          <h1 className="font-bold text-lg dark:text-white">R$ {pedidoSalvo.valorCorrida}</h1>
          <h1 className="font-bold text-lg dark:text-white">Taxa: R$ {pedidoSalvo.taxa}</h1>
          <h1 className="font-bold text-lg dark:text-white">Gasto Combustível: R$ {pedidoSalvo.gastoCombustivel}</h1>
          <h1 className="font-bold text-lg dark:text-white">Gasto Óleo: R$ {pedidoSalvo.gastoOleo}</h1>
          <h1 className="font-bold text-lg dark:text-white">Lucro: R$ {pedidoSalvo.lucro}</h1>

          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow"
              // lógica para aceitar pedido aqui
            >
              Aceitar
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow"
              // lógica para cancelar pedido aqui
            >
              Cancelar
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow"
              onClick={openConversation}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <OrdersContact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
