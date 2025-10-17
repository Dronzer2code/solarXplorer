// Development environment loader
// This file helps load environment variables for local development
// DO NOT include sensitive credentials in this file

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.warn('⚠️  No .env file found. Please create one with your Auth0 credentials:');
  console.warn('   AUTH0_DOMAIN=your-auth0-domain.auth0.com');
  console.warn('   AUTH0_CLIENT_ID=your-auth0-client-id');
  console.warn('');
  console.warn('   For production, set these as environment variables in your hosting platform.');
} else {
  console.log('✅ Environment variables loaded successfully');
  console.log('📍 AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN ? 'Set ✅' : 'Missing ❌');
  console.log('📍 AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
}

// Validate required environment variables
function validateEnvironment() {
  const required = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('   Please check your .env file or environment configuration');
    return false;
  }
  
  return true;
}

module.exports = {
  validateEnvironment,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production'
};