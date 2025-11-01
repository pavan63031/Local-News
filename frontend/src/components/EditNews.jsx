import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortdesc: "",
    description: "",
    media: null,
    mediaPreview: "",
    category: "Other",
    place: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/news/${id}`);
        setFormData({
          title: res.data.title,
          shortdesc: res.data.shortdesc,
          description: res.data.description,
          category: res.data.category || "Other",
          place: res.data.location?.place || "",
          media: null,
          mediaPreview:
            res.data.media && res.data.media.startsWith("http")
              ? res.data.media
              : `http://localhost:5000${res.data.media}`,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to fetch news data.");
      }
    };
    fetchData();
  }, [id]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      media: file,
      mediaPreview: file ? URL.createObjectURL(file) : formData.mediaPreview,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "mediaPreview" && value) data.append(key, value);
      });

      await api.put(`/user/editnews/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update news");
    } finally {
      setLoading(false);
    }
  };

  
  const renderPreview = () => {
    if (!formData.mediaPreview) return null;
    const isVideo = formData.mediaPreview.endsWith(".mp4") || formData.media?.type?.startsWith("video");
    return isVideo ? (
      <video
        src={formData.mediaPreview}
        controls
        className="w-64 h-40 object-cover rounded-xl border border-gray-300 mt-2"
      />
    ) : (
      <img
        src={formData.mediaPreview}
        alt="Preview"
        className="w-64 h-40 object-cover rounded-xl border border-gray-300 mt-2"
      />
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
        <h2 className="text-3xl font-bold text-center text-black mb-6">✏️ Edit News</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            name="title"
            type="text"
            placeholder="News Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90"
            required
          />

          <motion.input
            name="shortdesc"
            type="text"
            placeholder="Short Description"
            value={formData.shortdesc}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90"
            required
          />

          <motion.input
            name="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90"
          />

          {formData.mediaPreview && <div className="flex justify-center">{renderPreview()}</div>}

          <motion.textarea
            name="description"
            placeholder="Full Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90"
            required
          />

          <motion.select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl bg-[#FFF2EF]/90"
          >
            {["Politics", "Sports", "Entertainment", "Technology", "Health", "Other"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </motion.select>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F7A5A5] py-3 rounded-xl font-semibold shadow-md hover:bg-[#FFDBB6]"
          >
            {loading ? "Updating..." : "Update News"}
          </motion.button>
        </form>

        {formData.place && (
          <p className="mt-3 text-sm text-black text-center">📍 Location: {formData.place}</p>
        )}
      </motion.div>
    </div>
  );
}

export default EditNews;
