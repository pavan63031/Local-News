import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function LocalNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.get(`/user/nearby?lat=${latitude}&lon=${longitude}`);
          setNews(res.data);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch local news.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Location permission denied.");
        setLoading(false);
      }
    );
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF2EF]">
        <div className="w-10 h-10 border-4 border-[#F7A5A5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-black mt-6 bg-[#FFDBB6] p-4 rounded-xl mx-auto w-fit shadow-md border border-[#F7A5A5]">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF2EF] via-[#FFDBB6] to-[#F7A5A5] p-6 text-black">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1A2A4F] drop-shadow-sm">
        📰 News Near You
      </h2>

      {news.length === 0 ? (
        <p className="text-center text-black text-lg font-medium">
          No local news found near your area.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {news.map((n) => (
            <div
              key={n._id}
              className="bg-[#FFF2EF] border border-[#FFDBB6] rounded-2xl p-5 shadow-md hover:shadow-2xl hover:bg-[#FFDBB6] transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="font-semibold text-xl text-[#1A2A4F] mb-2">
                {n.title}
              </h3>
              <p className="text-sm text-black mb-3">
                {n.description?.slice(0, 100)}...
              </p>
              <p className="text-xs italic text-[#1A2A4F]">
                📍 {n.city}, {n.state}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
