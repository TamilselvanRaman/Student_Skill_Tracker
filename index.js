// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files

// Routes
app.use("/admin", require("./Routes/Admin"));
app.use("/student", require("./Routes/Student"));

// Start Server
app.listen(PORT, '0.0.0.0',() => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;