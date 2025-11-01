import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/user/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error(err);
        navigate("/home");
      }
    };
    fetchNews();
  }, [id, navigate]);

  if (!news) {
    return (
      <div className="flex justify-center newss-center min-h-screen bg-[#FFF2EF] text-black text-xl">
        Loading news...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-gradient-to-b from-[#FFF2EF] to-[#FFDBB6] text-black">
      <div className="max-w-3xl mx-auto bg-[#F7A5A5] p-8 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-5 py-2 bg-[#1A2A4F] text-white font-medium rounded-full hover:bg-[#2C3E7A] transition-colors duration-300"
        >
          ← Back
        </button>

      
        <h1 className="text-3xl font-bold mb-4 text-black">{news.title}</h1>

        
         {news.media && (
                <div className="overflow-hidden">
                  {news.mediaType === "video" ? (
                    <video
                      src={
                        news.media.startsWith("http")
                          ? news.media
                          : `http://localhost:5000${news.media}`
                      }
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        news.media ? news.media.startsWith("http") 
                          ? news.media
                          : `http://localhost:5000${news.media}`
                          : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt={news.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              )}

     
        {news.category && (
          <span className="inline-block bg-[#1A2A4F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-sm">
            {news.category}
          </span>
        )}

      
        <p className="text-black text-lg leading-relaxed mb-6">
          {news.description}
        </p>

       
        <div className="text-sm italic text-black">
          By{" "}
          <span className="font-semibold text-black">
            {news.author || "Anonymous"}
          </span>{" "}
          • {new Date(news.date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
