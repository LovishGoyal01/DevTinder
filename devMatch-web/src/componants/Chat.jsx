import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";

const Chat = ({
  targetUserId: propTargetUserId,
  chatUser: propChatUser = null,
  embedded = false,
}) => {
  const navigate = useNavigate();
  const Base_URL = import.meta.env.VITE_BASE_URL;

  const { targetUserId: paramTargetUserId } = useParams();
  const targetUserId = propTargetUserId || paramTargetUserId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(propChatUser);
  const user = useSelector((store) => store.user?.data);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setChatUser(propChatUser || null);
  }, [targetUserId, propChatUser]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      userId: String(userId),
      targetUserId: String(targetUserId),
    });

    const handleMessageReceived = (msg) => {
      const msgSenderId = String(msg.senderId?._id || msg.senderId);
      const msgTargetId = String(msg.targetUserId?._id || msg.targetUserId || "");

      const currentUserIdStr = String(userId);
      const currentTargetIdStr = String(targetUserId);

      // Strictly verify message belongs to current chat conversation pair
      const isFromCurrentPartner =
        msgSenderId === currentTargetIdStr &&
        (msgTargetId === currentUserIdStr || !msgTargetId);
      const isFromMeToCurrentPartner =
        msgSenderId === currentUserIdStr &&
        (msgTargetId === currentTargetIdStr || !msgTargetId);

      if (!isFromCurrentPartner && !isFromMeToCurrentPartner) return;

      setMessages((prev) => {
        if (
          msg._id &&
          prev.some((m) => m._id && String(m._id) === String(msg._id))
        ) {
          return prev;
        }

        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          String(lastMessage.senderId) === msgSenderId &&
          lastMessage.text === msg.text
        ) {
          return prev;
        }

        return [
          ...prev,
          {
            ...msg,
            senderId: msgSenderId,
          },
        ];
      });
    };

    socket.off("messageReceived");
    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!targetUserId || !userId) return;

      try {
        const { data } = await axios.get(Base_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });

        if (!isMounted) return;

        if (!data.success) {
          toast.error(data.message);
          navigate("/connections");
          return;
        }

        if (!propChatUser && data.partner) {
          setChatUser(data.partner);
        }

        const chatMessages = (data.chat?.messages || []).map((msg) => {
          const senderIdObj = msg.senderId;
          return {
            _id: msg._id,
            senderId: String(senderIdObj?._id || senderIdObj),
            firstName: senderIdObj?.firstName,
            lastName: senderIdObj?.lastName,
            text: msg.text,
            createdAt: msg.createdAt,
          };
        });

        setMessages(chatMessages);
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
          navigate("/connections");
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [targetUserId, propChatUser, userId, Base_URL, navigate]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    const message = newMessage.trim();
    if (!message || !socketRef.current || !targetUserId || !userId) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: String(userId),
      targetUserId: String(targetUserId),
      text: message,
    });

    setNewMessage("");
  };

  const containerClass = embedded
    ? "flex flex-col h-full"
    : "pt-4 flex justify-center w-full max-w-4xl mx-auto";
  const cardClass = embedded
    ? "flex-1 glass-card border-none bg-transparent"
    : "w-full h-[75vh] glass-card rounded-3xl border border-slate-800 shadow-2xl";

  if (!targetUserId) {
    return (
      <div className={containerClass}>
        <div className={`${cardClass} flex flex-col items-center justify-center p-8 text-center`}>
          <h2 className="text-xl font-bold text-white mb-1">Select a conversation</h2>
          <p className="text-xs text-slate-400">Choose someone from your connections to start messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={`${cardClass} flex flex-col h-full overflow-hidden`}>
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {chatUser?.photoURL ? (
              <div className="relative">
                <img
                  src={chatUser.photoURL}
                  alt={chatUser.firstName + " " + chatUser.lastName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                {chatUser?.firstName?.[0] || "C"}
              </div>
            )}
            <h1 className="text-sm font-bold text-white tracking-tight">
              {chatUser ? `${chatUser.firstName} ${chatUser.lastName}` : "Chat"}
            </h1>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-4 space-y-3 bg-slate-950/30">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="text-slate-400 text-xs">
                No messages yet. Say hello 👋
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isMe = String(msg.senderId?._id || msg.senderId) === String(userId);
            return (
              <div
                key={msg._id || index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-xs sm:text-sm font-medium leading-relaxed shadow-md ${
                    isMe
                      ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none shadow-pink-500/10"
                      : "bg-slate-800/90 text-slate-100 border border-slate-700/70 rounded-2xl rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-3 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center gap-2 shrink-0">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900/90 border border-slate-800 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl placeholder-slate-500 focus:border-pink-500 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-pink-500/20 transition disabled:opacity-40 shrink-0"
            title="Send message"
          >
            <FiSend className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
