import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { sendMessage } from "../../../features/chatSlice";
import MicIcon from "../../../svg/MicIcon";
import StopIcon from "../../../svg/StopIcon";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import SocketContext from "../../../context/SocketContext";
import axios from "axios"

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [message, setMessage] = useState("");
  const textRef = useRef();

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        setRecording(false);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "vaiturbo");

        try {
          const data = await axios(formData);
          const url = data.secure_url;

          let newMsg = await dispatch(
            sendMessage({
              message: "",
              convo_id: activeConversation._id,
              files: [],
              token,
              type: "audio",
              audio: url,
            })
          );

          socket.emit("send message", newMsg.payload);
        } catch (err) {
          console.error("Erro ao enviar áudio:", err);
        }

        setLoading(false);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || recording) return;

    setLoading(true);
    let values = {
      message,
      convo_id: activeConversation._id,
      files: [],
      token,
    };
    let newMsg = await dispatch(sendMessage(values));
    socket.emit("send message", newMsg.payload);
    setMessage("");
    setLoading(false);
  };

  return (
    <form
      onSubmit={SendMessageHandler}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      <div className="w-full flex items-center gap-x-2">
        <ul className="flex gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          />
        </ul>

        <Input message={message} setMessage={setMessage} textRef={textRef} />

        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            className="btn btn-green"
            title="Gravar áudio"
          >
            <MicIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="btn btn-red animate-pulse"
            title="Parar gravação"
          >
            <StopIcon />
          </button>
        )}

        <button type="submit" className="btn" disabled={recording}>
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatActionsWithSocket;
