import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentSection";

function NewsList() {
  const [news, setNews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/user/news");
        setNews(res.data);
      } catch (err) {
        console.log("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  const updateLikes = (newsId, liked) => {
    setNews((prev) =>
      prev.map((item) =>
        item._id === newsId
          ? {
              ...item,
              likes: liked
                ? [...item.likes, user._id]
                : item.likes.filter((id) => id !== user._id),
            }
          : item
      )
    );
  };

  const addComment = (newsId, newComment) => {
    setNews((prev) =>
      prev.map((item) =>
        item._id === newsId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );
  };

  return (
    <section className="min-h-screen flex flex-col font-poppins text-black bg-gradient-to-br from-[#FFDBB6] via-[#FFF2EF] to-[#F7A5A5]/40">
      <h1 className="text-3xl font-bold text-center mb-10">🗞️ All News</h1>

      {news.length === 0 ? (
        <p className="text-center text-lg">No news available.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {news.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between bg-[#FFF2EF]/30 rounded-3xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-[#1A2A4F]/20 text-black"
            >
              {item.media && (
                <div className="overflow-hidden">
                  {item.mediaType === "video" ? (
                    <video
                      src={
                        item.media.startsWith("http")
                          ? item.media
                          : `http://localhost:5000${item.media}`
                      }
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        item.media ? item.media.startsWith("http") 
                          ? item.media
                          : `http://localhost:5000${item.media}`
                          : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt={item.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              )}

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold mb-1">{item.title}</h2>
                  <p className="text-sm mb-3 line-clamp-3">{item.shortdesc}</p>

                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="bg-[#FFDBB6] text-black text-[10px] px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span>
                      {item.author || "Anonymous"} •{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 border-t border-[#1A2A4F]/20 pt-3">
                  <LikeButton
                    newsId={item._id}
                    likes={item.likes}
                    user={user}
                    onLikeUpdate={updateLikes}
                  />

                  <button
                    onClick={() =>
                      document
                        .getElementById(`comments-${item._id}`)
                        .classList.toggle("hidden")
                    }
                    className="text-sm hover:text-[#1A2A4F] transition"
                  >
                    💭 {item.comments.length}
                  </button>

                  <Link
                    to={`/news/${item._id}`}
                    className="hover:text-[#1A2A4F] font-semibold text-sm transition"
                  >
                    Read More →
                  </Link>
                </div>

                <div id={`comments-${item._id}`} className="hidden mt-3">
                  <CommentsSection
                    newsId={item._id}
                    comments={item.comments}
                    user={user}
                    onCommentAdded={addComment}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NewsList;

