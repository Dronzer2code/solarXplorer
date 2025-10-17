const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (needed for Auth0)
app.use(cors({
  origin: true,
  credentials: true
}));

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));
app.use(express.static('.'));

// Set proper MIME types for static files
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.type('text/css');
  } else if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.path.endsWith('.mp4')) {
    res.type('video/mp4');
  } else if (req.path.endsWith('.webm')) {
    res.type('video/webm');
  }
  next();
});

// Handle routing for single page application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle auth callback route
app.get('/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Test auth route
app.get('/test-auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-auth.html'));
});

// Export the Express API for Vercel
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('🚀 Astral 3D Server is running!');
    console.log(`📡 Local: http://localhost:${PORT}`);
    console.log(`🌌 Network: http://127.0.0.1:${PORT}`);
    console.log('');
    console.log('✅ Auth0 Callback URLs to add in dashboard:');
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://localhost:${PORT}/callback`);
    console.log(`   http://127.0.0.1:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}/callback`);
    console.log('');
    console.log('🔧 Test Auth0: http://localhost:' + PORT + '/test-auth');
    console.log('🏠 Main Site: http://localhost:' + PORT);
  });
}