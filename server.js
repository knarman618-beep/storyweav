// Simple Express.js proxy server for API key management
// Deploy this to Render.com
// Set environment variable: OPENROUTER_API_KEY in Render.com dashboard

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - restrict to your app's domain if needed
const corsOptions = {
  origin: '*', // In production, restrict this to your app's domain
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get API key endpoint
// This endpoint returns the API key stored in environment variable
app.get('/api/key', (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured on server',
        message: 'Please set OPENROUTER_API_KEY environment variable'
      });
    }

    // For security, you might want to add basic authentication or API tokens here
    // Example: Check if request includes a valid auth token
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !isValidToken(authHeader)) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    res.json({
      key: apiKey,
      provider: 'openrouter',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Version endpoint (useful for monitoring)
app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', service: 'StorySpark-API-Proxy' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`StorySpark API Proxy running on port ${PORT}`);
  console.log(`Health check: GET /health`);
  console.log(`Get API Key: GET /api/key`);
});
