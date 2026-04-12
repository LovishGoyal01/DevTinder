import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

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
  const user = useSelector((store) => store.user.data);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    if (!propChatUser) {
      setChatUser(null);
    }
  }, [targetUserId, propChatUser]);

  useEffect(() => {
    if (propChatUser) {
      setChatUser(propChatUser);
    }
  }, [propChatUser]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      userId,
      targetUserId,
    });

    socketRef.current.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (
          msg.senderId === userId &&
          lastMessage?.senderId === userId &&
          lastMessage?.text === msg.text
        ) {
          return prev;
        }
        return [...prev, msg];
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!targetUserId) return;

      try {
        const { data } = await axios.get(Base_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });

        if (!data.success) {
          toast.error(data.message);
          navigate("/connections");
          return;
        }

        if (!propChatUser && data.partner) {
          setChatUser(data.partner);
        }

        const chatMessages = (data.chat?.messages || []).map((msg) => {
          const { senderId, text } = msg;
          return {
            senderId: senderId?._id || senderId,
            firstName: senderId?.firstName,
            lastName: senderId?.lastName,
            text,
          };
        });

        setMessages(chatMessages);
      } catch (error) {
        toast.error(error.message);
        navigate("/connections");
      }
    };

    fetchMessages();
  }, [targetUserId, propChatUser, userId, Base_URL, navigate]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    const message = newMessage.trim();
    if (!message || !socketRef.current || !targetUserId) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: message,
    });

    setNewMessage("");
  };

  const containerClass = embedded
    ? "flex flex-col h-full"
    : "pt-24 flex justify-center";
  const cardClass = embedded
    ? "flex-1 bg-white/0 max-h-[75vh]"
    : "w-[50vw] h-[75vh] max-h-[75vh] bg-white/80";

  if (!targetUserId) {
    return (
      <div className={containerClass}>
        <div
          className={`${cardClass} flex items-center justify-center rounded-2xl shadow-xl p-8`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Select a conversation
            </h2>
            <p className="text-slate-600">
              Choose someone from your connections to start chatting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div
        className={`${cardClass} ${embedded ? "h-full" : "h-[75vh]"} bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col overflow-hidden`}
      >
        <div className="px-6 py-4 border-b bg-white/70 flex items-center gap-4">
          {chatUser?.photoURL ? (
            <img
              src={chatUser.photoURL}
              alt={chatUser.firstName + " " + chatUser.lastName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
              {chatUser?.firstName?.[0] || "C"}
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {chatUser ? `${chatUser.firstName} ${chatUser.lastName}` : "Chat"}
            </h1>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                No messages yet. Say hello 👋
              </p>
            </div>
          )}
          {messages.map((msg, index) => {
            const isMe = msg.senderId === userId;
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-emerald-500 text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t bg-white/90">
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
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
