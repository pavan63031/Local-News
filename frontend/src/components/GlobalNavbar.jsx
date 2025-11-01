import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function GlobalNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#FFF2EF] shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-bold text-black hover:text-[#1A2A4F] transition duration-200"
        >
          Global<span className="text-[#F7A5A5]">News</span>
        </Link>

        <div className="hidden md:flex gap-6 text-black font-medium">
          {[
            "entertainment",
            "business",
            "general",
            "health",
            "science",
            "sports",
            "technology",
          ].map((item) => (
            <Link
              key={item}
              to={`/${item}`}
              className="hover:text-[#F7A5A5] transition duration-200"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#FFF2EF] border-t border-[#FFDBB6] shadow-md transition-all duration-300">
          <div className="flex flex-col items-center py-3 space-y-3 text-black font-medium">
            {[
              "entertainment",
              "business",
              "general",
              "health",
              "science",
              "sports",
              "technology",
            ].map((item) => (
              <Link
                key={item}
                onClick={() => setMenuOpen(false)}
                to={`/${item}`}
                className="hover:text-[#F7A5A5] transition duration-200"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default GlobalNavbar;
