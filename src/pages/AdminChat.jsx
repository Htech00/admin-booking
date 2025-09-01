import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { IoClose } from "react-icons/io5";


const socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5000");

export default function AdminChat({ userName, chatBoxOpen }) {
  const userId = userName; // grab userId from route
  const { username } = useAuth();
  const adminUsername = username?.username || "super_admin";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!adminUsername || !userId) return;

    // Join admin room
    socket.emit("join", adminUsername);

    // Load chat history between admin and this user
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE
        }/chat/history/${adminUsername}/${userId}`  
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("❌ Failed to load history:", err));

    // Listen for new messages
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.senderId === userId && msg.receiverId === adminUsername) ||
        (msg.senderId === adminUsername && msg.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [adminUsername, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: adminUsername,
      senderType: "admin",
      receiverId: userId, // now taken from URL
      receiverType: "user",
      message: input,
    };

    socket.emit("sendMessage", msg);
    setInput("");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-auto ${
        chatBoxOpen ? "" : "hidden"
      }`}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="p-4 z-10 max-w-md mx-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold mb-2">Chat with {userId}</h2>
            <button
                className="cursor-pointer text-[20px]"
                onClick={() => chatBoxOpen(false)}
            >
                <IoClose />
            </button>
        </div>
        
        <div className="h-64 overflow-y-auto border border-[#ede8e8] rounded p-2 mb-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded-lg max-w-[75%] ${
                m.senderId === adminUsername
                  ? "bg-[#fa6328] text-white ml-auto break-words"
                  : "bg-[#ede8e8] text-[#525050] mr-auto break-words"
              }`}
            >
              <p className="text-sm">{m.message}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded p-2 outline-none border border-[#ede8e8]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a reply..."
          />
          <button
            onClick={sendMessage}
            className="bg-[#fa6328] text-white px-4 py-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
