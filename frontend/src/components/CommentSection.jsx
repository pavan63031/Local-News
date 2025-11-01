
import React, { useState } from "react";
import api from "../api/axios";

const CommentsSection = ({ newsId, comments = [], user, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleAddComment = async () => {
    if (!user) return alert("Please login to comment");
    if (!text.trim()) return alert("Comment cannot be empty");

    const tempComment = {
      _id: Date.now(), 
      text,
      user: { name: user.name, _id: user._id },
      userName: user.name,
      createdAt: new Date(),
      isTemp: true,
    };

    // ✅ Show comment immediately
    onCommentAdded(newsId, tempComment);
    setText("");
    setIsPosting(true);

    try {
      const res = await api.post(`/user/${newsId}/comment`, {
        userId: user._id,
        text,
      });

      // If backend returns new comment, replace temp one
      const finalComment = res.data.comment || 
        (res.data.news && res.data.news.comments?.slice(-1)[0]);

      if (finalComment) {
        onCommentAdded(newsId, finalComment, tempComment._id);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment. Try again.");
      // ❌ remove temp comment on failure
      onCommentAdded(newsId, null, tempComment._id, true);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-xl">
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, idx) => (
            <p
              key={c._id || idx}
              className={`text-sm text-gray-800 border-b border-gray-100 pb-1 ${
                c.isTemp ? "opacity-50 italic" : ""
              }`}
            >
              <strong>{c.userName || c.user?.name || "User"}:</strong> {c.text}
            </p>
          ))
        )}
      </div>

      <div className="mt-2 flex">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          disabled={isPosting}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow text-sm text-black border border-gray-300 rounded-l-lg px-2 py-1 focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          disabled={isPosting}
          className={`px-3 rounded-r-lg text-sm ${
            isPosting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
