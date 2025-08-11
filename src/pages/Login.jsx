import { useState } from "react";
import { FaUserAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4299e1]"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4299e1]"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button className="w-full bg-[#4299e1] text-white py-2 rounded hover:bg-[#4299e1]/90 transition">
          Login
        </button>
        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-[#4299e1]" />
            Remember Me
          </label>
          <a href="#" className="text-[#4299e1] hover:underline">
            Forgot Password
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
