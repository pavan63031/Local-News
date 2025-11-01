import React, { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const detectLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.state ||
              "Unknown";
            resolve(city);
          },
          () => resolve("Unknown")
        );
      } else {
        resolve("Unknown");
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must include uppercase, lowercase, number & special character";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      const userLocation = await detectLocation();
      const res = await api.post(
        "/auth/register",
        { ...formData, location: userLocation },
        { withCredentials: true }
      );

      const { _id, name, email, token, location } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, name, email, location })
      );

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF2EF] to-[#FFDBB6] text-black">
      <div className="bg-[#F7A5A5] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#1A2A4F]/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">
          Create Account
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1A2A4F]/30 rounded-xl bg-[#FFF2EF] text-black placeholder-black/60"
          />
          {formErrors.name && (
            <p className="text-red-600 text-sm">{formErrors.name}</p>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1A2A4F]/30 rounded-xl bg-[#FFF2EF] text-black placeholder-black/60"
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm">{formErrors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1A2A4F]/30 rounded-xl bg-[#FFF2EF] text-black placeholder-black/60"
          />
          {formErrors.password && (
            <p className="text-red-600 text-sm">{formErrors.password}</p>
          )}

         
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#1A2A4F]/30 rounded-xl bg-[#FFF2EF] text-black placeholder-black/60"
          />
          {formErrors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {formErrors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#1A2A4F] text-white py-3 rounded-xl font-semibold hover:bg-[#13203A] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-black">
          Already a user?{" "}
          <Link
            to="/login"
            className="text-[#1A2A4F] font-semibold hover:text-black"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
