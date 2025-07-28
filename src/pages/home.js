// importações mantidas
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import SocketContext from "../context/SocketContext";
import {
  getConversations,
  updateMessagesAndConversations,
} from "../features/chatSlice";
import Call from "../components/Chat/call/Call";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";

// dados da chamada
const callData = {
  socketId: "",
  receiveingCall: false,
  callEnded: false,
  name: "",
  picture: "",
  signal: "",
};

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // chamada
  const [call, setCall] = useState(callData);
  const [stream, setStream] = useState();
  const [show, setShow] = useState(false);
  const { receiveingCall, callEnded, socketId } = call;
  const [callAccepted, setCallAccepted] = useState(false);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // typing
  const [typing, setTyping] = useState(false);

  // ao conectar
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("get-online-users");
    };
  }, [user, socket]);

  // chamada recebida e setup socket
  useEffect(() => {
    setupMedia();

    socket.on("setup socket", (id) => {
      setCall((prev) => ({ ...prev, socketId: id }));
    });

    socket.on("call user", (data) => {
      setCall((prev) => ({
        ...prev,
        socketId: data.from,
        name: data.name,
        picture: data.picture,
        signal: data.signal,
        receiveingCall: true,
      }));
    });

    socket.on("end call", () => {
      setShow(false);
      setCall((prev) => ({ ...prev, callEnded: true, receiveingCall: false }));

      if (callAccepted) {
        connectionRef.current?.destroy();
      }
    });

    return () => {
      socket.off("setup socket");
      socket.off("call user");
      socket.off("end call");
    };
  }, [callAccepted, socket]);



  // ouvir nova ordem recebida
  useEffect(() => {
    if (!socket) return;

    const handleNovaOrder = ({ order }) => {
      console.log("🚨 Nova ordem recebida:", order);
      alert(`Novo pedido de corrida de ${order.name} recebido!`);
    };

    socket.on("nova-order-recebida", handleNovaOrder);

    return () => {
      socket.off("nova-order-recebida", handleNovaOrder);
    };
  }, [socket]);


  

  // chamar usuário
  const callUser = () => {
    enableMedia();
    setCall((prev) => ({
      ...prev,
      name: getConversationName(user, activeConversation.users),
      picture: getConversationPicture(user, activeConversation.users),
    }));

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(user, activeConversation.users),
        signal: data,
        from: socket.id, // usa socket.id direto aqui, não call.socketId
        name: user.name,
        picture: user.picture,
      });
    });

    peer.on("stream", (stream) => {
      // vídeo desativado
    });

    socket.on("call accepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // atender chamada
  const answerCall = () => {
    enableMedia();
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", { signal: data, to: call.socketId });
    });

    peer.on("stream", (stream) => {
      // vídeo desativado
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  // encerrar chamada
  const endCall = () => {
    setShow(false);
    setCall((prev) => ({ ...prev, callEnded: true, receiveingCall: false }));

    // vídeo desativado
    // if (myVideo.current) myVideo.current.srcObject = null;

    socket.emit("end call", call.socketId);
    connectionRef.current?.destroy();
  };

  // acesso à mídia: só áudio
  const setupMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        setStream(stream);
      })
      .catch((err) => {
        console.error("Erro ao acessar o microfone:", err);
      });
  };

  const enableMedia = () => {
    // vídeo desativado
    // if (myVideo.current) myVideo.current.srcObject = stream;
    setShow(true);
  };

  // buscar conversas
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user, dispatch]);

  // escuta de mensagens e digitação
  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversations(message));
    });

    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop typing", () => setTyping(false));

    return () => {
      socket.off("receive message");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, dispatch]);

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/* container */}
        <div className="container h-screen flex py-[19px]">
          {/* Sidebar */}
          <Sidebar
            onlineUsers={onlineUsers}
            typing={typing}
            onCloseSidebar={() => setShowSidebar(false)}
          />

          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              callUser={callUser}
              typing={typing}
            />
          ) : (
            <WhatsappHome setShowSidebar={setShowSidebar} />
          )}
        </div>
      </div>

      {/* Componente de chamada */}
      <div className={(show || call.signal) && !call.callEnded ? "" : "hidden"}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
