// Import React hooks and other libraries
import { useEffect, useState } from "react";  // useState = store values, useEffect = run side effects
import io from "socket.io-client";            // lets us connect to a socket server
import axios from "axios";                    // used to make HTTP requests (fetch data)

// Connect to our socket server
// import.meta.env.VITE_API_BASE = your backend URL from environment variables
// If it doesn't exist, it falls back to localhost:5000
const socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5000");

// This is our main chat component
// username is passed in as a prop, if not given, it defaults to "user123"
export default function UserChat() {
  // React states:
  const [adminUsername, setAdminUsername] = useState(null);  // stores the admin we’re chatting with
  const [messages, setMessages] = useState([]);              // stores all chat messages
  const [input, setInput] = useState("");     
  const  username = "user12345"                // stores text the user is typing

  // ----------------------------
  // useEffect 1: Runs when the component mounts or when username/adminUsername changes
  // ----------------------------
  useEffect(() => {
    if (!username) return;  // if we don’t have a username, stop here

    // 1. Tell the server that this user has joined the chat room
    socket.emit("join", username);

    // 2. Ask the backend: "Who is the active admin I should chat with?"
    axios
      .get(`${import.meta.env.VITE_API_BASE}/chat/active-admin`)
      .then((res) => {
        const { username: fetchedAdminUsername } = res.data;  // extract admin name
        setAdminUsername(fetchedAdminUsername);               // save it in state
      })
      .catch((err) => {
        console.error("❌ Failed to fetch admin:", err);
      });

    // 3. Listen for new incoming messages from the socket server
    socket.on("receiveMessage", (msg) => {
      // Only add messages that belong to this chat (between user & admin)
      if (
        adminUsername &&
        ((msg.senderId === username && msg.receiverId === adminUsername) ||
          (msg.senderId === adminUsername && msg.receiverId === username))
      ) {
        // Add the new message to the list of previous messages
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Cleanup: remove the listener when component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  }, [username, adminUsername]); // runs again if username or adminUsername changes

  // ----------------------------
  // useEffect 2: Load old chat history once we know who the admin is
  // ----------------------------
  useEffect(() => {
    if (!adminUsername || !username) return;  // if either is missing, stop

    axios
      .get(`${import.meta.env.VITE_API_BASE}/chat/history/${adminUsername}/${username}`)
      .then((res) => setMessages(res.data))   // store old messages in state
      .catch((err) => console.error("❌ Failed to load history:", err));
  }, [adminUsername, username]);

  // ----------------------------
  // Function to send a message
  // ----------------------------
  const sendMessage = () => {
    // Don’t send if the input is empty OR we don’t have an admin
    if (!input.trim() || !adminUsername) return;

    // Create a message object to send
    const msg = {
      senderId: username,
      senderType: "user",
      receiverId: adminUsername,
      receiverType: "admin",
      message: input,
    };

    // Send message to server via socket
    socket.emit("sendMessage", msg);

    // Clear the input box
    setInput("");
  };

  // ----------------------------
  // UI (JSX part)
  // ----------------------------
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-2">User Chat</h2>

      {/* Messages box */}
      <div className="h-64 overflow-y-auto border rounded p-2 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg max-w-[75%] ${
              // Style messages: blue if sent by user, gray if sent by admin
              m.senderId === username
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            <p className="text-sm">{m.message}</p>
          </div>
        ))}
      </div>

      {/* Input and send button */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}                        // input state
          onChange={(e) => setInput(e.target.value)} // update input state
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}               // call sendMessage when clicked
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
