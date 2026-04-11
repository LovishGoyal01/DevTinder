import { io } from "socket.io-client";

const Base_URL = import.meta.env.VITE_BASE_URL

export const createSocketConnection = () => {
  return io(Base_URL, {
    transports: ["websocket"],   
    withCredentials: true       
  });
};
