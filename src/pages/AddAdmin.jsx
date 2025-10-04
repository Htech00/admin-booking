import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AddAdmin = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  //Password strength regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate password in real-time
    if (name === 'password') {
      if (!strongPasswordRegex.test(value)) {
        setPasswordError(
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        );
      } else {
        setPasswordError('');
      }
    }

    setForm({ ...form, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final password validation before submission
    if (!strongPasswordRegex.test(form.password)) {
      toast.error(
        'Weak password. It must include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://admin-backend-rrt2.onrender.com/api/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to add admin');
      } else {
        toast.success('Admin added successfully');
        setForm({ username: '', password: '', role: 'admin' });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-6 rounded shadow-md grid gap-4 bg-[#ffffff]"
    >
      <h2 className="text-xl font-semibold text-center mb-2 text-[#1f2937]">
        Add Admin
      </h2>

      {/* Username */}
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-1 font-medium text-[#374151]">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          required
          className="p-2 border border-[#d1d5db] text-[#111827] bg-[#ffffff] rounded"
        />
      </div>

      {/* Password with toggle */}
      <div className="flex flex-col relative">
        <label htmlFor="password" className="mb-1 font-medium text-[#374151]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter strong password"
          value={form.password}
          onChange={handleChange}
          required
          className="p-2 border border-[#d1d5db] text-[#111827] bg-[#ffffff] rounded pr-10"
        />
        <div
          className="absolute right-3 top-[42px] cursor-pointer text-[#6b7280]"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </div>

        {/* Password error message */}
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col">
        <label htmlFor="role" className="mb-1 font-medium text-[#374151]">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="p-2 border border-[#d1d5db] text-[#111827] bg-[#ffffff] rounded"
        >
          <option value="" disabled>
            -- Select Admin Role --
          </option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer py-2 rounded transition disabled:opacity-50 bg-[#2563eb] text-[#ffffff] hover:bg-[#1d4ed8]"
      >
        {loading ? 'Adding...' : 'Add Admin'}
      </button>
    </form>
  );
};

export default AddAdmin;
