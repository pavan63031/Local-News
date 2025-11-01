import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";

function CategoryNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/category/${category}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching category news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A2A4F] text-[#FFDBB6]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F7A5A5] border-solid"></div>
        <p className="mt-4 text-lg font-semibold text-[#FFF2EF]">
          Loading your posts...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 md:px-12 bg-[#FFF2EF] min-h-screen transition-all duration-300">
      <h1 className="text-3xl font-bold text-black mb-8 capitalize tracking-wide text-center">
        {category} News
      </h1>

      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-[#FFDBB6] rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group border border-[#F7A5A5]/60"
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

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-black mb-2 group-hover:text-[#1A2A4F] transition">
                    {item.title}
                  </h2>
                  <p className="text-black/80 mb-3 line-clamp-3">
                    {item.shortdesc}
                  </p>
                </div>

                <Link
                  to={`/news/${item._id}`}
                  className="inline-block mt-2 text-[#1A2A4F] font-medium hover:text-[#F7A5A5] transition"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black text-lg mt-12 text-center">
          No news found in{" "}
          <span className="font-semibold text-[#F7A5A5]">{category}</span> category.
        </p>
      )}
    </div>
  );
}

export default CategoryNews;
