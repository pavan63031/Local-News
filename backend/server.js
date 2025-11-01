const express = require('express');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const globalRoutes = require('./routes/globalRoutes');  
const cors = require('cors');
const path = require('path');
const app = express();
require("dotenv").config();



app.use(cors({
  origin: ["http://localhost:5173","https://local-news-frontend.onrender.com"],
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/auth',authRoutes);
app.use('/user',newsRoutes);
app.use('/category',categoryRoutes);
app.use('/me',userRoutes);
app.use('/api/news',globalRoutes);


connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log("http://localhost:5000");
})