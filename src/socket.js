import { io } from "socket.io-client";

// Replace with your backend's socket URL
const socket = io("http://localhost:5000", {
  transports: ["websocket"], 
  reconnection: true
});

export default socket;
