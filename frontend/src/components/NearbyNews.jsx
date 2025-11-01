import React, { useEffect, useState } from "react";
import api from "../api/axios";

function NearbyNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchNearby(latitude, longitude);
        },
        (err) => {
          console.error("Location permission denied:", err);
          setError("Location permission denied. Please allow location to see nearby news.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchNearby = async (lat, lon) => {
    try {
      const res = await api.get(`/user/nearby?lat=${lat}&lon=${lon}&radius=20`);
      setNews(res.data);
    } catch (err) {
      console.error("Error fetching nearby news:", err);
      setError("Could not fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

 
  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF2EF] text-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1A2A4F] border-solid"></div>
      <p className="mt-4 text-lg font-medium">Loading nearby news...</p>
    </div>
  );
}


  if (error) {
    return (
      <p className="text-center mt-10 text-black bg-[#F7A5A5] py-6 rounded-lg mx-4 font-semibold">
        {error}
      </p>
    );
  }

  
  if (!news.length) {
    return (
      <p className="text-center mt-10 text-black bg-[#FFDBB6] py-6 rounded-lg mx-4">
        No nearby news found
      </p>
    );
  }

  
  return (
    <div className="min-h-screen bg-[#FFF2EF] p-6 text-black">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#1A2A4F]">
          News Near You 🌍
        </h2>

        <div className="space-y-6">
          {news.map((n) => (
            <div
              key={n._id}
              className="bg-[#FFDBB6] shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
               {n.media && (
                <div className="overflow-hidden">
                  {n.mediaType === "video" ? (
                    <video
                      src={
                        n.media.startsWith("http")
                          ? n.media
                          : `http://localhost:5000${n.media}`
                      }
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        n.media ? n.media.startsWith("http") 
                          ? n.media
                          : `http://localhost:5000${n.media}`
                          : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt={n.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#1A2A4F]">{n.title}</h3>
                <p className="mt-2 text-black">{n.shortdesc}</p>
                <p className="text-sm italic mt-2 text-[#1A2A4F]">
                  {n.location?.place}
                </p>
                <div className="text-xs mt-2">
                  Posted by{" "}
                  <span className="font-semibold text-[#1A2A4F]">{n.author}</span> •{" "}
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NearbyNews;
