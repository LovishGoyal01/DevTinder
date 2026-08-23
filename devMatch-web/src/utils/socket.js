import { io } from "socket.io-client";

const Base_URL = import.meta.env.VITE_BASE_URL;

let socket = null;

export const createSocketConnection = () => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(Base_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
