import React from "react";
import api from "../api/axios";

const LikeButton = ({ newsId, likes = [], user, onLikeUpdate }) => {
  const liked = user && likes.includes(user._id);
  const likesCount = likes.length;

  const handleLike = async () => {
    if (!user) return alert("Please login to like posts");

    try {
      const res = await api.post(`/user/${newsId}/like`, { userId: user._id });
      const liked = res.data.liked;
      onLikeUpdate(newsId, liked);
    } catch (err) {
      console.error("Error liking news:", err);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
        liked
          ? "bg-[#F7A5A5] text-black hover:bg-[#FFDBB6]"
          : "bg-[#FFF2EF] text-black border border-[#FFDBB6] hover:bg-[#FFDBB6]/70"
      }`}
    >
      <span
        className={`text-lg transform transition-transform duration-300 ${
          liked ? "scale-110 animate-pulse" : "scale-100"
        }`}
      >
        ❤️
      </span>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
