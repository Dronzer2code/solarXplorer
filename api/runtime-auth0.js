// Vercel serverless function for Auth0 token exchange
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Health check endpoint
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      auth0Domain: process.env.AUTH0_DOMAIN || 'dev-j244xylfomnfbzn8.us.auth0.com'
    });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { action, ...data } = req.body;

      switch (action) {
        case 'validateToken':
          // Validate Auth0 token
          const { token } = data;
          if (!token) {
            return res.status(400).json({ error: 'Token required' });
          }

          // Here you would validate the token with Auth0
          // For now, we'll return a simple response
          res.status(200).json({ 
            valid: true, 
            user: { id: 'user123', name: 'Test User' } 
          });
          break;

        case 'getUserInfo':
          // Get user information
          const { userId } = data;
          if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
          }

          res.status(200).json({ 
            user: { 
              id: userId, 
              name: 'Test User', 
              email: 'test@example.com' 
            } 
          });
          break;

        default:
          res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Runtime Auth0 Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}