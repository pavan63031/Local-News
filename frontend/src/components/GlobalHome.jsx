import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import { useParams } from "react-router-dom";
import GlobalNavbar from "./GlobalNavbar";

function GlobalHome(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const newsCategory = category || props.category || "general";

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/news?category=${newsCategory}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, [newsCategory]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-[#FFDBB6]/60 z-50">
          <div className="h-1 bg-[#1A2A4F] animate-[loadingBar_1.8s_ease-in-out_infinite]" />
        </div>
      )}


      {loading ? (
        <div className="flex justify-center items-center h-screen bg-[#FFF2EF]">
          <div className="w-12 h-12 border-4 border-[#F7A5A5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-[#FFF2EF] min-h-screen py-10 px-4 sm:px-8 w-full transition-all duration-300 text-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold text-center text-black mb-8 capitalize">
              {newsCategory} News
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.articles?.length > 0 ? (
                data.articles.map((article, index) => (
                  <NewsCard key={article.url || index} article={article} />
                ))
              ) : (
                <h1 className="col-span-full text-center text-black text-lg">
                  No articles found.
                </h1>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
}

export default GlobalHome;
