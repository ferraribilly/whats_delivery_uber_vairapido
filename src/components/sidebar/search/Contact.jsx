import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
import { open_create_conversation } from "../../../features/chatSlice";

function Contact({ contact, setSearchResults, socket, setShowSidebar }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

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
    <li className="list-none h-auto cursor-pointer px-[10px]">
      <div className="flex flex-col items-center py-[10px] gap-2 bg-white text-black rounded-md shadow-md">

        {/* IMAGEM */}
        <div className="w-20 h-20 rounded-full overflow-hidden border">
          <img
            src={contact.picture}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ESTRELAS */}
        <div className="flex items-center gap-1">
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

        {/* DADOS */}
        <div className="flex flex-col gap-1 items-center text-center">
          {contact.name && (
            <div>
              <span className="font-bold">Name:</span> {contact.name}
            </div>
          )}
          {contact.tipoVeiculo && (
            <div>
              <span className="font-bold">Tipo de veículo:</span> {contact.tipoVeiculo}
            </div>
          )}
          {contact.marca && (
            <div>
              <span className="font-bold">Veículo:</span> {contact.marca}
            </div>
          )}
          {contact.cor && (
            <div>
              <span className="font-bold text-indigo-500">Cor do veículo:</span> {contact.cor}
            </div>
          )}
          {contact.placa && (
            <div>
              <span className="font-bold">Placa:</span> {contact.placa}
            </div>
          )}

          {contact.distancia && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">Distância:</span> {contact.distancia}
            </div>
          )}

          {contact.tempoChegada && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-600">TempoChegada:</span> {contact.tempoChegada}
            </div>
          )}

          {contact.localizacao && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">Localização:</span> {contact.localizacao}
            </div>
          )}
        </div>

        {/* QR CODE PIX */}
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

        {/* VALOR DA CORRIDA */}
        {contact.valorCorrida && (
          <div className="flex items-center gap-2 text-align-center">
            <span className="font-bold text-red-600">Valor Corrida:</span> {contact.valorCorrida}
          </div>
        )}

        {/* CHAVE PIX */}
        {contact.chavePix && (
          <div className="flex items-center">
            <input
              type="text"
              value={contact.chavePix}
              readOnly
              className="bg-black text-white border border-gray-600 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="bg-blue-600 text-white rounded-r px-4 py-3 hover:bg-blue-700 transition"
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

        {/* BOTÃO CANCELAR */}
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => {
            // função de cancelamento
          }}
        >
          Cancelar
        </button>

        {/* BOTÃO CONVERSA */}
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

      <div className="ml-16 border-b border-gray-300"></div>
    </li>
  );
}

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
