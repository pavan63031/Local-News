import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function MyPosts() {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.get(`/user/news/myposts/${id}`);
        setMyPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch your posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [id]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[#1A2A4F] bg-[#FFF2EF]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F7A5A5] border-solid"></div>
        <p className="mt-4 text-lg font-medium text-black">Loading your posts...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF2EF] text-black">
        <p className="text-[#F7A5A5] text-lg font-semibold">{error}</p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-5 py-2 bg-[#F7A5A5] text-black rounded-lg hover:bg-[#FFDBB6] transition-all duration-300 font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }


  return (
    <section className="pt-24 px-6 min-h-screen bg-gradient-to-br from-[#FFF2EF] via-[#FFDBB6] to-[#F7A5A5] text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#1A2A4F]">
          My News Posts
        </h1>

        {myPosts.length === 0 ? (
          <p className="text-center text-[#1A2A4F] text-lg">
            You haven't posted any news yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((item) => (
              <div
                key={item._id}
                className="bg-[#FFF2EF] p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#FFDBB6]"
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
                <h2 className="text-2xl font-semibold mb-2 text-black">
                  {item.title}
                </h2>
                <p className="text-sm text-black mb-4 leading-relaxed">
                  {item.shortdesc
                    ? item.shortdesc.substring(0, 100) + "..."
                    : item.description.substring(0, 100) + "..."}
                </p>
                {item.category && (
                  <span className="inline-block bg-[#F7A5A5] text-black text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {item.category}
                  </span>
                )}
                <div className="text-xs text-[#1A2A4F] mb-4">
                  {new Date(item.date).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Link
                    to={`/news/${item._id}`}
                    className="text-[#1A2A4F] font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                  <Link
                    to={`/editNews/${item._id}`}
                    className="px-4 py-1 bg-[#FFDBB6] text-black rounded-lg hover:bg-[#F7A5A5] transition-all duration-300 font-semibold"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (
                        window.confirm("Are you sure you want to delete this post?")
                      ) {
                        try {
                          await api.delete(`/user/news/${item._id}`);
                          setMyPosts(myPosts.filter((p) => p._id !== item._id));
                        } catch (err) {
                          console.error(err);
                          alert("Failed to delete post");
                        }
                      }
                    }}
                    className="px-4 py-1 bg-[#F7A5A5] text-black rounded-lg hover:bg-[#FFDBB6] transition-all duration-300 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyPosts;
