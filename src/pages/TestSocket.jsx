import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend URL

function TestSocket() {
  useEffect(() => {
    // Listen for connection
    socket.on("connect", () => {
      console.log("🟢 Connected to server:", socket.id);

      // Send a test ping
      socket.emit("ping", { msg: "Hello from client!" });
    });

    // Listen for pong
    socket.on("pong", (data) => {
      console.log("✅ Pong from server:", data);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  return <h1>Socket.IO Test</h1>;
}

export default TestSocket;
