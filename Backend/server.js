// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index.routes'); // Importing index routes
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the frontend folder
const frontendPath = path.join(__dirname, '../Frontend');
app.use(express.static(frontendPath));

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', routes);

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 8002;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Dynamically import the 'open' package to open the browser
  const open = (await import('open')).default;
  await open(`http://localhost:${PORT}`);
});
