import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import api from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [globalCategoriesOpen, setGlobalCategoriesOpen] = useState(false);
  const [localMenuOpen, setLocalMenuOpen] = useState(false);

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
    <nav className="flex justify-between items-center py-4 px-6 bg-[#FFF2EF]/90 backdrop-blur-md shadow-md fixed top-0 w-full z-50 border-b border-[#FFDBB6] transition-all text-black">

      <div className="flex items-center gap-3 relative">
   
        <div className="relative">
          <button
            onClick={() => setLocalMenuOpen(!localMenuOpen)}
            className="p-2 rounded-lg border border-[#FFDBB6] bg-[#FFF2EF] hover:bg-[#FFDBB6] transition duration-200"
          >
            {localMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {localMenuOpen && (
            <div className="absolute left-0 mt-2 bg-[#FFF2EF] border border-[#FFDBB6] rounded-xl shadow-lg w-48 overflow-hidden animate-fade-in">
              {["Politics", "Sports", "Technology", "Entertainment", "Business"].map(
                (cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat}`}
                    className="block px-4 py-2 text-black hover:bg-[#F7A5A5] transition"
                    onClick={() => setLocalMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                )
              )}
            </div>
          )}
        </div>

       
        <Link to="/home">
          <h1 className="text-2xl font-bold text-[#1A2A4F] hover:scale-105 transition-transform cursor-pointer">
            Local<span className="text-black">News</span>
          </h1>
        </Link>
      </div>

      
      <div className="hidden md:flex items-center space-x-5 relative">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-[#1A2A4F] text-black hover:bg-[#FFDBB6] transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-full bg-[#1A2A4F] text-white font-semibold hover:bg-[#F7A5A5] hover:text-black transition-all duration-300 shadow-sm"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/nearby-news"
              className="font-semibold text-black hover:text-[#1A2A4F] transition-all duration-200"
            >
              Nearby News
            </Link>

         
            <div
              className="relative"
              onMouseEnter={() => setGlobalCategoriesOpen(true)}
              onMouseLeave={() => setGlobalCategoriesOpen(false)}
            >
              <Link
                to="/globalNews"
                className="px-3 py-2 text-black hover:text-[#1A2A4F] transition"
              >
                Global News 🌍
              </Link>

              {globalCategoriesOpen && (
                <div className="absolute left-0 mt-2 bg-[#FFF2EF] border border-[#FFDBB6] rounded-xl shadow-lg w-48 overflow-hidden animate-fade-in">
                  {[
                    "General",
                    "Business",
                    "Entertainment",
                    "Health",
                    "Science",
                    "Sports",
                    "Technology",
                  ].map((cat) => (
                    <Link
                      key={cat}
                      to={`/${cat.toLowerCase()}`}
                      className="block px-4 py-2 text-black hover:bg-[#F7A5A5] transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/addNews"
              className="px-5 py-2 rounded-full bg-[#1A2A4F] text-white font-semibold hover:bg-[#F7A5A5] hover:text-black transition-all duration-300 shadow-sm"
            >
              Add News
            </Link>

            <Link
              to={`/news/myposts/${user._id}`}
              className="text-black hover:text-[#1A2A4F] font-medium transition"
            >
              My Posts
            </Link>

            <Link
              to={`/profile/${user._id}`}
              className="flex items-center gap-2 hover:text-[#1A2A4F] transition"
            >
              {user.profilePic ? (
                <img
                  src={`http://localhost:5000${user.profilePic}`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-[#FFDBB6] hover:scale-105 transition-transform"
                />
              ) : (
                <FaUserCircle className="text-3xl text-[#1A2A4F]" />
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-[#F7A5A5] text-black hover:bg-[#FFDBB6] transition-all duration-300 shadow-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
