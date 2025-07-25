import { useSelector } from "react-redux";
import { checkOnlineStatus, getConversationId } from "../../../utils/chat";
import Conversation from "./Conversation";

export default function Conversations({ onlineUsers, typing, onSelectConversation, onConversationClick }) {
  const { conversations, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup === true
            )
            .map((convo) => {
              let check = checkOnlineStatus(onlineUsers, user, convo.users);
              const otherUserId = getConversationId(user, convo.users);
              const isOnline = onlineUsers.some((u) => u.userId === otherUserId);
              return (
                <Conversation
                  key={convo._id}
                  convo={convo}
                  online={!convo.isGroup && check ? true : false}
                  typing={typing}
                  onClick={onSelectConversation}
                  onConversationClick={onConversationClick}
                />
              );
            })}
      </ul>
    </div>
  );
}
