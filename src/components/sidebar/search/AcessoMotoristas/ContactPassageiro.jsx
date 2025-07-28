import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../../context/SocketContext";
import { open_create_conversation } from "../../../../features/chatSlice";
import { useEffect, useState } from "react";
import { CloseIcon, ValidIcon } from "../../../../svg";
import { capitalize } from "../../../../utils/string";
import CallTimes from "../../../Chat/call/CallTimes";


function ContactOrdersRecebidas({
  contact,
  socket,
  online,
  setSearchResults,
  setSidebarOpen,
  call,
  setCall,
  answerCall,
  endCall,
  callAccepted,
  setTotalSecInCall,
  totalSecInCall,


}) {
  const { receiveingCall, callEnded, name, picture } = call || {}; // 👈 correção aqui
  const [timer, setTimer] = useState(0);
  let interval;

  const handleTimer = () => {
    interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 30) {
      handleTimer();
    } else {
      setCall?.((prevCall) => ({ ...prevCall, receiveingCall: false }));
    }
    return () => clearInterval(interval);
  }, [timer]);

  const { activeConversation, files } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const values = {
    receiver_id: contact._id,
    convo_id: activeConversation?._id,
    token,
  };

  const openConversation = async () => {
    const newConvo = await dispatch(open_create_conversation(values));
    if (newConvo?.payload?._id) {
      socket.emit("join conversation", newConvo.payload._id);
      setSearchResults([]);
      setSidebarOpen?.(false);
    }
  };

  return (
    <li className="list-none w-[100%] h-auto px-[10px]">
      <div
        className="relative flex flex-col items-center py-10 gap-2 backdropFilter-blur(1px) boxShadow-gold-600 WebkitBackdropFilter-blur(1px) border-[5px] text-black rounded-md shadow-md mt-10"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(1, 1, 0, 0.95), 0 2px 4px -2px rgba(0, 0, 0, 1)",
        }}
      >
        <div className="absolute -top-0 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
          <img
            src={contact.picture}
            alt="Foto"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center mt-12 gap-1 w-full">
          <p className="text-sm dark:text-black">{contact._id}</p>
          <p className="text-sm dark:text-white">{online}</p>

          <h1 className="font-bold text-lg text-center dark:text-black">
            {contact.name}
          </h1>

          <p className="text-sm dark:text-blue-700">{contact.status}</p>
          <h1 className="font-bold text-lg dark:text-blue">{contact.origem}</h1>
          <h1 className="font-bold text-lg dark:text-green">{contact.destino}</h1>
          <h1 className="font-bold text-lg dark:text-gold">{contact.distancia}</h1>
          <h1 className="font-bold text-lg dark:text-gold">{contact.duracao}</h1>
          <h1 className="font-bold text-lg dark:text-white">
            {contact.formaPagamento}
          </h1>
          <h1 className="font-bold text-lg dark:text-blue">
            {contact.valorCorrida}
          </h1>
          <h1 className="font-bold text-lg dark:text-red">{contact.taxa}</h1>
          <h1 className="font-bold text-lg dark:text-gold">
            {contact.gastoCombustivel}
          </h1>
          <h1 className="font-bold text-lg dark:text-gold">
            {contact.gastoOleo}
          </h1>
            <h1 className="text-white text-lg">
            <b>{name ? capitalize(name) : ""}</b>
          </h1>
          {totalSecInCall === 0 ? (
            <span className="text-dark_text_1">Ringing...</span>
          ) : null}
            <CallTimes
                      totalSecInCall={totalSecInCall}
                      setTotalSecInCall={setTotalSecInCall}
                      callAccepted={callAccepted}
                    />

          {/*Call actions*/}
          <div className="flex gap-2 mt-2">
            <li onClick={endCall}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
                <CloseIcon className="fill-white w-5" />
              </button>
            </li>

            <li onClick={answerCall}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500">
                <ValidIcon className="fill-white w-6 mt-2" />
              </button>
            </li>
          </div>
        </div>
          <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-1 rounded text-sm shadow"
              onClick={openConversation}
            >
              Chat
            </button>
      </div>
          

      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
      {/*Ringtone*/}
      <audio src="../../../../audio/ringtone.mp3" autoPlay loop></audio>
    </li>
  );
}

const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ContactOrdersRecebidas {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContactWithContext;
