import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AddNews() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortdesc: "",
    description: "",
    media: null, 
    author: user?.name || "Anonymous",
    category: "Other",
    latitude: null,
    longitude: null,
    place: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            const place = `${data.city || data.locality || "Unknown"}, ${data.countryName}`;
            setFormData((prev) => ({ ...prev, latitude, longitude, place }));
          } catch {
            setFormData((prev) => ({ ...prev, latitude, longitude, place: "Unknown" }));
          }
        });
      } catch (err) {
        console.error("Location error:", err);
      }
    };

    fetchLocation();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await api.post("/user/addNews", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add news");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: e.target.files[0] });
  };

  const getFilePreview = () => {
    if (!formData.media) return null;
    const isVideo = formData.media.type.startsWith("video");
    const url = URL.createObjectURL(formData.media);

    return isVideo ? (
      <video src={url} controls className="w-64 h-40 object-cover rounded-xl border border-gray-300 mt-2" />
    ) : (
      <img src={url} alt="Preview" className="w-64 h-40 object-cover rounded-xl border border-gray-300 mt-2" />
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A2A4F] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#FFDBB6]/90 p-8 rounded-3xl shadow-lg w-full max-w-lg border border-[#FFF2EF]/70"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-6">🗞️ Add Local News</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input name="title" type="text" placeholder="News Title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90" required />
          <motion.input name="shortdesc" type="text" placeholder="Short Description" value={formData.shortdesc} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90" required />

          <motion.input name="media" type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90" required />

          {formData.media && <div className="flex justify-center">{getFilePreview()}</div>}

          <motion.textarea name="description" placeholder="Full Description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90" required />

          <motion.select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90">
            {["Politics", "Sports", "Entertainment", "Technology", "Health", "Other"].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </motion.select>

          <motion.button type="submit" disabled={loading} className="w-full bg-[#F7A5A5] py-3 rounded-xl font-semibold shadow-md hover:bg-[#FFDBB6]">
            {loading ? "Publishing..." : "Publish News"}
          </motion.button>
        </form>

        {formData.place && (
          <p className="mt-3 text-sm text-black text-center">📍 Detected Location: {formData.place}</p>
        )}
      </motion.div>
    </div>
  );
}

export default AddNews;
