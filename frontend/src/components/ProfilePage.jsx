import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/me/profile/${id || currentUser._id}`);
        setUser(res.data);
        setIsFollowing(res.data.followers.includes(currentUser._id));

        const postsRes = await api.get(`/user/news/myposts/${res.data._id}`);
        setPostCount(postsRes.data.length);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.post(`/me/unfollow/${user._id}`, { userId: currentUser._id });
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((f) => f !== currentUser._id),
        }));
      } else {
        await api.post(`/me/follow/${user._id}`, { userId: currentUser._id });
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, currentUser._id],
        }));
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading Profile...
      </div>
    );

  return (
    <div className="pt-24 px-6 md:px-12 min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-200">
      
        <div className="flex flex-col items-center text-center mb-8">
          <img
  src={
    user.profilePic
      ? user.profilePic.startsWith("http")
        ? user.profilePic
        : `http://localhost:5000${user.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  }
  alt="Profile"
  className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-md mb-4 object-cover"
/>
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 text-sm">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>

         
          {user._id === currentUser._id && (
            <Link
              to="/editProfile"
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              <FaUserEdit />
              Edit Profile
            </Link>
          )}

        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              👤 Personal Info
            </h3>
            <p>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {user.location || "N/A"}
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              📊 Account Info
            </h3>
            <p>
              <strong>Posts:</strong> {postCount}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </div>


        <div className="mt-8 bg-blue-50 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">💬 Bio</h3>
          <p className="text-gray-700">{user.bio || "No bio added yet."}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
