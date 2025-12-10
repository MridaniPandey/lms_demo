import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
  console.log("full response user:", response.data);
      // Save user info to localStorage
      // localStorage.setItem("user", JSON.stringify(response.data.user));
localStorage.setItem("user", JSON.stringify(response.data));
      // Trigger custom event so Header can update immediately
      window.dispatchEvent(new Event("userChanged"));

      // Redirect to homepage
      navigate("/homepage");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-green-50 font-sans p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-black-700 mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-2 text-center font-medium">{error}</p>
        )}
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-800 font-medium">Email Address</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-green-300 bg-gray-50">
              <Mail size={20} className="text-green-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-800 font-medium">Password</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 mt-2 focus-within:ring-2 focus-within:ring-green-300 bg-gray-50">
              <Lock size={20} className="text-green-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 font-medium hover:underline"
            >
              Register Here
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-green-800 text-white py-3 rounded-2xl shadow-md hover:bg-green-700 transition active:scale-95 disabled:opacity-50"
          >
            <LogIn size={20} /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
