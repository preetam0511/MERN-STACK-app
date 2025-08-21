const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userroutes');
const connectDB = require("../config/db.js");
const app = express();
const dotenv = require('dotenv');
const rateLimit = require("../middlewares/rateLimiter");
const path = require("path");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Enable CORS with specific origin
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true 
    })
  );
}

// Parse JSON bodies
app.use(express.json());

// Apply rate limiting
app.use(rateLimit);

// Connect to database
connectDB();

// API routes should come before the catch-all route
app.use('/api/notes', userRoutes);

// Serve static files and handle SPA routing in production
// Serve static files and handle SPA routing in production
if (process.env.NODE_ENV === "production") {
  // Get the absolute path to the frontend build directory
  const frontendPath = path.join(process.cwd(), 'frontend', 'dist');
  console.log('Serving static files from:', frontendPath);
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Handle SPA routing - should be the last route
  app.get('*', (req, res) => {
    console.log('Serving index.html from:', path.join(frontendPath, 'index.html'));
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error loading the application');
      }
    });
  });
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});