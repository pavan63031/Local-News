import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      const { _id, name, email, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ _id, name, email }));
      navigate("/home");
    } catch (err) {
      console.log(err);
       if (err.response?.status === 404) {
      setError("User does not exist");
    } else if (err.response?.status === 401) {
      setError("Wrong password");
    } else {
      setError(err.response?.data?.message || "Login failed");
    }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF2EF] via-[#FFDBB6] to-[#F7A5A5] text-black">
      <div className="bg-[#FFF2EF] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#FFDBB6]">
        <h2 className="text-4xl font-bold text-[#1A2A4F] text-center mb-6">
          Welcome Back ✨
        </h2>

        {error && (
          <p className="text-black text-center mb-4 bg-[#F7A5A5] py-2 rounded-lg border border-[#FFDBB6]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#FFDBB6] rounded-xl bg-white text-black focus:ring-2 focus:ring-[#F7A5A5] outline-none placeholder-gray-500 transition duration-300"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#FFDBB6] rounded-xl bg-white text-black focus:ring-2 focus:ring-[#F7A5A5] outline-none placeholder-gray-500 transition duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F7A5A5] text-black py-3 rounded-xl font-semibold hover:bg-[#FFDBB6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-black mt-6">
          New to the app?{" "}
          <Link
            to="/register"
            className="text-[#1A2A4F] font-semibold hover:underline hover:text-[#F7A5A5] transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
