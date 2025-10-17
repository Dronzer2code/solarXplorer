const express = require('express');
const path = require('path');
const cors = require('cors');

// Load environment variables (development only)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Debug environment variables
console.log('🔧 Environment Check:');
console.log('📍 AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN ? 'Set ✅' : 'Missing ❌');
console.log('📍 AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'development');

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

// API endpoint to serve Auth0 configuration
app.get('/api/auth-config', (req, res) => {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  
  console.log('🔧 Auth config requested');
  console.log('📍 Domain:', domain ? 'Set ✅' : 'Missing ❌');
  console.log('📍 ClientId:', clientId ? 'Set ✅' : 'Missing ❌');
  console.log('📍 Host:', req.get('host'));
  
  // Ensure environment variables are set
  if (!domain || !clientId) {
    console.error('❌ Missing Auth0 configuration');
    return res.status(500).json({
      error: 'Auth0 configuration not found',
      message: 'Please set AUTH0_DOMAIN and AUTH0_CLIENT_ID environment variables',
      details: {
        domain: !domain ? 'AUTH0_DOMAIN not set' : 'OK',
        clientId: !clientId ? 'AUTH0_CLIENT_ID not set' : 'OK'
      }
    });
  }

  const config = {
    domain: domain,
    clientId: clientId,
    redirectUri: `${req.protocol}://${req.get('host')}/callback`
  };
  
  console.log('✅ Sending Auth0 config:', {
    domain: config.domain,
    clientId: config.clientId.substring(0, 8) + '...',
    redirectUri: config.redirectUri
  });

  res.json(config);
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