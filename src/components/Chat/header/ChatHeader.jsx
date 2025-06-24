import { useSelector } from "react-redux";
import {
  CallIcon,
  DotsIcon,
  SearchLargeIcon,
  VideoCallIcon,
} from "../../../svg";
import { capitalize } from "../../../utils/string";
import BackIcon from "../../../svg/Back";
import SocketContext from "../../../context/SocketContext";
import {
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";

function ChatHeader({ online, callUser, onBack }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-[80px] dark:bg-dark flex items-center p16 select-none">
      {/*Container*/}
      <div className="w-full flex items-center justify-between">
        {/* Left - Foto e Nome */}
        <div className="flex items-center gap-x-8">
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : getConversationPicture(user, activeConversation.users)
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold">
              {activeConversation.isGroup
                ? activeConversation.name
                : capitalize(
                    getConversationName(user, activeConversation.users).split(
                      " "
                    )[0]
                  )}
            </h1>
            <span className="text-xs dark:text-dark_svg_2">
              {online ? "online" : ""}
            </span>
          </div>
        </div>

        {/* Right - Ações */}
        <ul className="flex items-center gap-x-2.5">
          {/* <li onClick={() => callUser()}>
            <button className="btn">
              <VideoCallIcon />
            </button>
          </li> */}
          {/* <li>
            <button className="btn">
              <CallIcon />
            </button>
          </li> */}
          {/* <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-dark_svg_1" />
            </button>
          </li> */}
          
           {/* Botão Voltar DO LADO dos ícones */}
          <li>
            <button
              className="btn"
              onClick={() => onBack && onBack()}
              title="Voltar"
            >
              <BackIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>

         
        </ul>
      </div>
    </div>
  );
}

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatHeaderWithSocket;
