import { useSelector } from "react-redux";
import { getConversationId } from "../../../utils/chat";
import Conversation from "./Conversation";

export default function Conversations({ onlineUsers, typing, onConversationClick }) {
  const { conversations } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <ul>
      {conversations.map((convo) => {
        const otherUserId = getConversationId(user, convo.users);
        const isOnline = onlineUsers.some((u) => u.userId === otherUserId);

        return (
          <Conversation
            key={convo._id}
            convo={convo}
            online={isOnline}
            typing={typing}
            onConversationClick={onConversationClick}
          />
        );
      })}
    </ul>
  );
}
