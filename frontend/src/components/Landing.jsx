import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFDBB6] via-[#FFF2EF] to-[#F7A5A5]/40 overflow-hidden text-black">
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581093588401-22d5b90f3c7b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 text-center p-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A2A4F] mb-6">
          Stay Updated with{" "}
          <span className="text-[#F7A5A5]">Local Voices</span>
        </h1>

        <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover and share news happening around your city. Empower your
          community with real-time updates from people near you.
        </p>


        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-[#FFDBB6] text-black rounded-lg text-lg font-semibold border border-[#1A2A4F]/20 hover:bg-[#F7A5A5]/80 hover:scale-105 transition-all duration-300 shadow-sm"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border-2 border-[#1A2A4F]/30 text-black rounded-lg text-lg font-semibold hover:bg-[#FFF2EF] hover:border-[#F7A5A5] hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="absolute top-16 left-12 w-24 h-24 bg-[#FFDBB6] rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-12 right-16 w-32 h-32 bg-[#F7A5A5]/70 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
};

export default Landing;
