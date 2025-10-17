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