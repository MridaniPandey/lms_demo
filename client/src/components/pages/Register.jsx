import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // 🔥 added

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!role) {
      return setError("Please select a role");
    }

    try {
      const res = await axios.post('http://localhost:3001/auth/register', {
        name,
        email,
        password,
        role,
      });
      
      console.log(res.data);
      setSuccess(true);
      setError(null);

      localStorage.setItem("user", JSON.stringify(res.data));

      // 🔥 redirect to login
      navigate("/login");

    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
      setSuccess(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-green-50 font-sans p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-black-700 mb-6">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-2 text-center font-medium">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-2 text-center font-medium">
            Registration Successful!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-gray-800 font-medium">Full Name</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-yellow-300 bg-gray-50">
              <User size={20} className="text-yellow-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-800 font-medium">Email Address</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-yellow-300 bg-gray-50">
              <Mail size={20} className="text-yellow-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-800 font-medium">Password</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-yellow-300 bg-gray-50">
              <Lock size={20} className="text-yellow-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-800 font-medium">Confirm Password</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-yellow-300 bg-gray-50">
              <Lock size={20} className="text-yellow-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="flex gap-4 mb-4">Set role:</label>
            <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-4 py-2 rounded-lg border 
                ${role === "student" 
                  ? "bg-indigo-600 text-black border-indigo-900 " 
                  : "bg-gray-200 text-gray-700 border-indigo-300"} 
                transition`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`px-4 py-2 rounded-lg border 
                ${role === "instructor" 
                  ? "bg-indigo-600 text-white border-indigo-900" 
                  : "bg-gray-200 text-gray-700 border-indigo-300"} 
                transition`}
            >
              Instructor
            </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 dark:bg-yellow-300 text-white py-3 rounded-2xl shadow-md hover:bg-indigo-600 transition active:scale-95"
          >
            Register
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-medium ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
