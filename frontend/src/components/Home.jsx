import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import NewsList from "./NewsList";
import Weather from "./weather";

const Home = () => {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/user/news");
        setNews(res.data.slice(0, 3));
      } catch (err) {
        console.log("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins text-black bg-gradient-to-br from-[#FFDBB6] via-[#FFF2EF] to-[#F7A5A5]/40">

      <main className="flex-1 px-6 py-10">
        <section className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-[#1A2A4F]">
            Welcome back,{" "}
            <span className="text-[#F7A5A5]">{user?.name || "User"}</span> 👋
          </h2>
          <p className="text-lg">
            Stay updated with the latest headlines from your local area.
          </p>

          <h1 className="text-3xl font-bold text-center text-[#1A2A4F] mb-10 mt-6">
            📰 Latest News
          </h1>
        </section>

        
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-5">
          
          <div className="bg-[#FFF2EF] border border-[#FFDBB6] p-5 rounded-2xl shadow-md hover:scale-105 hover:bg-[#FFDBB6]/30 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2 text-[#1A2A4F]">
              Current Location's Weather 🌤️
            </h3>
            <p className="text-sm">
              <Weather />
            </p>
          </div>

         
          {news.length > 0 ? (
            news.map((list) => (
              <div
                key={list._id}
                className="bg-[#FFF2EF] border border-[#FFDBB6] p-5 rounded-2xl shadow-md hover:scale-105 hover:bg-[#FFDBB6]/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#1A2A4F]">
                  {list.title}
                </h3>
                <p className="text-sm">{list.shortdesc}</p>
              </div>
            ))
          ) : (
            <div className="bg-[#FFF2EF] border border-[#FFDBB6] p-5 rounded-2xl shadow-md">
              <p className="text-center">Loading news...</p>
            </div>
          )}
        </section>

        <NewsList className="mt-10" />
      </main>

  
      <footer className="text-center py-4 bg-[#FFDBB6] text-sm text-black">
        © 2025 Global News | Built with Love and News
      </footer>
    </div>
  );
};

export default Home;
