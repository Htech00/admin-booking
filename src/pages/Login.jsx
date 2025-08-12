import { useState } from "react";
import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const [isRedirect, setIsRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(username, password);

    if (success) {
        setIsRedirect(true)
        setTimeout(() => {
            navigate("/", { replace: true }); 
        }, 1000);
      
    } else {
      toast.error("Invalid username or password!!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#4299e1] p-4 rounded-full">
              <FaUserAlt className="text-white text-2xl" />
            </div>
          </div>

          <h2 className="text-center text-2xl font-semibold mb-6">
            Sign in to Dashboard
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4299e1]"
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4299e1]"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="w-full bg-[#4299e1] text-white py-2 rounded hover:bg-[#4299e1]/90 transition cursor-pointer">
            {isRedirect ? 'Redirection to dashboard...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;