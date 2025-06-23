// ... seus imports
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
  const [call, setCall] = useState(callData);
  const [stream, setStream] = useState();
  const [show, setShow] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [typing, setTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("get-online-users");
    };
  }, [user, socket]);

  useEffect(() => {
    const setup = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (myVideo.current) {
          myVideo.current.srcObject = localStream;
        }
      } catch (err) {
        console.error("Erro ao acessar câmera/microfone:", err);
      }
    };
    setup();

    socket.on("setup socket", (id) => {
      setCall((prev) => ({ ...prev, socketId: id }));
    });

    socket.on("call user", (data) => {
      setCall({
        socketId: data.from,
        name: data.name,
        picture: data.picture,
        signal: data.signal,
        receiveingCall: true,
        callEnded: false,
      });
    });

    socket.on("call accepted", (signal) => {
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });

    socket.on("end call", () => {
      endCall(true); // chamada forçada
    });

    return () => {
      socket.off("setup socket");
      socket.off("call user");
      socket.off("call accepted");
      socket.off("end call");
    };
  }, [socket]);

  const callUser = () => {
    if (!stream) return;

    setCall((prev) => ({
      ...prev,
      name: getConversationName(user, activeConversation.users),
      picture: getConversationPicture(user, activeConversation.users),
    }));
    setShow(true);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(user, activeConversation.users),
        signal: data,
        from: call.socketId,
        name: user.name,
        picture: user.picture,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!stream) return;
    setCallAccepted(true);
    setShow(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", { signal: data, to: call.socketId });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const endCall = (external = false) => {
    setShow(false);
    setCall((prev) => ({ ...prev, callEnded: true, receiveingCall: false }));
    setCallAccepted(false);
    setTotalSecInCall(0);

    if (!external) {
      socket.emit("end call", call.socketId);
    }

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (myVideo.current?.srcObject) {
      myVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      myVideo.current.srcObject = null;
    }

    if (userVideo.current?.srcObject) {
      userVideo.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user, dispatch]);

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
  }, [dispatch, socket]);

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        <div className="container h-screen flex py-[5px]">
          {showSidebar && <Sidebar onlineUsers={onlineUsers} typing={typing} />}

          {!show ? (
            activeConversation._id ? (
              <ChatContainer
                onlineUsers={onlineUsers}
                callUser={callUser}
                typing={typing}
              />
            ) : (
              <WhatsappHome setShowSidebar={setShowSidebar} />
            )
          ) : (
            <div className="w-full h-full flex flex-col"></div>
          )}
        </div>
      </div>

      <div className={(show || call.receiveingCall) && !call.callEnded ? "" : "hidden"}>
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
