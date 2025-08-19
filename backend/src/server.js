const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userroutes');
const connectDB = require("../config/db.js");
const app = express();
const dotenv = require('dotenv');
const rateLimit = require("../middlewares/rateLimiter");
dotenv.config();

const PORT = process.env.PORT || 3000;

// Enable CORS with specific origin
if (process.env.NODE_ENV !== "production"){
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
}

// Parse JSON bodies
app.use(express.json());

// Apply rate limiting
app.use(rateLimit);

// Connect to database
connectDB();
app.use('/api/notes',userRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT,()=>{
    console.log("App listening at port http://localhost:3000");
})
