import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import NewsList from "./components/NewsList";
import AddNews from "./components/AddNews";
import NewsDetail from "./components/NewsDetail";
import MyPosts from "./components/Myposts";
import EditNews from "./components/EditNews";
import CategoryNews from "./components/CategoryNews";
import ProfilePage from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";
import LocalNews from "./components/LocalNews";
import NearbyNews from "./components/NearbyNews";
import GlobalHome from "./components/GlobalHome";

function App() {
  return (
    <div className="min-h-screen text-black bg-white">
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>  
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/addNews" element={<AddNews />} />
          <Route path="/news/:id" element={<NewsDetail />}/>
          <Route path="/news/myposts/:id" element={<MyPosts />} />
          <Route path="/editnews/:id" element={<EditNews />}/>
          <Route path="/category/:category" element={<CategoryNews />} />
          <Route path="/profile/:id" element={<ProfilePage />}/>
          <Route path="editProfile" element={<EditProfile />}/>
          <Route path="/local-news" element={<LocalNews />}/>
          <Route path="/nearby-news" element={<NearbyNews />} />
          <Route path="/globalNews" element={<GlobalHome category = "general"/>}/>
          <Route exact path='/:category' element = {<GlobalHome />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
