import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

function OrdersContact({ contact, setSheetResults, socket, setSidebarOpen, distancia, duracao }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    receiver_id: contact._id,
    token,
  };

  const calcularPrecoDinamico = () => {
    if (!contact || distancia === null || duracao === null) return "-";

    const {
      precoPorKm = 2.0,
      precoPorMinuto = 0,
      taxaFixa = 0.2,
      descontoHorario = 0,
    } = contact.taxas || {};

    const agora = new Date();
    const minutos = agora.getMinutes();
    const desconto =
      minutos < 30 || (minutos >= 30 && minutos < 60) ? descontoHorario : 0;

    let preco = precoPorKm * distancia + precoPorMinuto * duracao + taxaFixa;

    if (desconto > 0) preco = preco * (1 - desconto);

    return `R$ ${preco.toFixed(2)}`;
  };

  const openConversation = async () => {
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
            src={contact.picture}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center mt-12 gap-1">
          <h1 className="font-bold text-lg dark:text-white">{contact.name}</h1>

          <div className="flex items-center gap-1 mb-1">
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
          <p className="text-sm dark:text-blue-700">{contact.status}</p>
          <p className="text-sm dark:text-blue-700">{contact.tipoVeiculo}</p>
          <h1 className="font-bold text-lg dark:text-white">{contact.marca}</h1>
          <h1 className="font-bold text-lg dark:text-white">{contact.placa}</h1>
          <h1 className="font-bold text-lg dark:text-text-white">{contact.PrecoCarro}</h1>
          <h1 className="font-bold text-lg dark:text-white text-green-500">Valor Corrida: {calcularPrecoDinamico()} </h1>

          <div className="flex gap-2 mt-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow">
              Solicitacao
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm shadow">
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
    {/* {(socket) => <Contact {...props} socket={socket} />} */}
  </SocketContext.Consumer>
);

export default ContactWithContext;
