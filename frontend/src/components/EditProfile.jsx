import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const EditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    bio: storedUser?.bio || "",
    phone: storedUser?.phone || "",
    location: storedUser?.location || "",
    occupation: storedUser?.occupation || "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(
    storedUser?.profilePic
      ? `http://localhost:5000${storedUser.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/me/profile/${storedUser._id}`);
        setFormData({
          ...formData,
          name: res.data.name,
          email: res.data.email,
          bio: res.data.bio || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          occupation: res.data.occupation || "",
        });
        if (res.data.profilePic) {
          setPreview(`http://localhost:5000${res.data.profilePic}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await api.put(`/me/update/${storedUser._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
      navigate(`/profile/${storedUser._id}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF2EF] px-4 py-10">
      <div className="bg-[#FFDBB6] shadow-lg rounded-2xl p-8 w-full max-w-md transition-transform transform hover:scale-[1.01] border border-[#F7A5A5]">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Edit Your Profile
        </h2>

    
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#F7A5A5] shadow-md"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-1 right-1 bg-[#1A2A4F] p-2 rounded-full cursor-pointer text-[#FFDBB6] hover:bg-[#F7A5A5] hover:text-black transition-all"
            >
              <FaCamera size={16} />
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-[#F7A5A5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A2A4F] bg-[#FFF2EF] transition-all text-black"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full border border-[#F7A5A5] rounded-lg p-3 bg-gray-100 cursor-not-allowed text-gray-600"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border border-[#F7A5A5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A2A4F] bg-[#FFF2EF] transition-all text-black"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-[#F7A5A5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A2A4F] bg-[#FFF2EF] transition-all text-black"
          />

          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Occupation"
            className="w-full border border-[#F7A5A5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A2A4F] bg-[#FFF2EF] transition-all text-black"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a short bio about yourself..."
            rows="3"
            className="w-full border border-[#F7A5A5] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A2A4F] bg-[#FFF2EF] transition-all text-black"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A2A4F] text-[#FFF2EF] py-3 rounded-lg font-semibold hover:bg-[#F7A5A5] hover:text-black transition-all shadow-md"
          >
            {loading ? "Updating..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
