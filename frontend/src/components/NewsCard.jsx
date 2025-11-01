import React from "react";

function NewsCard({ article }) {
  return (
    <div className="max-w-sm rounded-2xl shadow-md overflow-hidden bg-[#FFDBB6] hover:bg-[#FFF2EF] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-black">
      
   
      <img
        className="w-full h-48 object-cover"
        src={
          article.urlToImage ||
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60"
        }
        alt={article.title}
      />

      <div className="p-5">
     
        <h2 className="text-xl font-semibold text-[#1A2A4F] mb-2">
          {article.title?.length > 60
            ? article.title.slice(0, 60) + "..."
            : article.title}
        </h2>

        
        <p className="text-sm text-black mb-1">
          By{" "}
          <span className="font-medium text-[#1A2A4F]">
            {article.author || "Unknown Author"}
          </span>{" "}
          | Source:{" "}
          <span className="text-[#1A2A4F]">
            {article.source?.name || "Unknown Source"}
          </span>
        </p>

       
        <p className="text-xs text-gray-700 mb-3">
          {new Date(article.publishedAt).toLocaleString()}
        </p>

        {/* 🧩 Description */}
        <p className="text-black text-sm mb-4">
          {article.description
            ? article.description.slice(0, 100) + "..."
            : "No description available."}
        </p>

      
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 text-sm font-semibold text-white rounded-full bg-[#1A2A4F] hover:bg-[#2E4272] transition-colors duration-300"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
