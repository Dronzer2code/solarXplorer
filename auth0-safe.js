// Auth0 Configuration - Production Safe Version
// Fetches configuration from server API for security

let auth0Client = null;
let auth0Config = null;

// Load Auth0 configuration from server
async function loadAuth0Config() {
  try {
    console.log('🔄 Loading Auth0 configuration...');
    const response = await fetch('/api/auth-config');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    auth0Config = await response.json();
    console.log('✅ Auth0 config loaded successfully');
    console.log('📍 Domain:', auth0Config.domain);
    console.log('📍 Redirect URI:', auth0Config.redirectUri);
    
    return auth0Config;
  } catch (error) {
    console.error('❌ Failed to load Auth0 config from server:', error);
    console.log('🔄 Using fallback configuration...');
    
    // Fallback configuration for development
    auth0Config = {
      domain: 'dev-j244xylfomnfbzn8.us.auth0.com',
      clientId: 'NxbhETO5YcloNEZUyx5GUCpK0zfOZnnD',
      redirectUri: window.location.origin + '/callback'
    };
    
    return auth0Config;
  }
}

// Initialize Auth0 client
async function initializeAuth0() {
  try {
    await loadAuth0Config();
    
    // Create Auth0 client with loaded configuration
    auth0Client = await auth0.createAuth0Client({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: auth0Config.redirectUri
      }
    });
    
    console.log('🚀 Auth0 client initialized successfully');
    
    // Handle authentication callback
    await handleAuthCallback();
    
    // Update UI based on authentication state
    await updateAuthenticationUI();
    
    // Set up event listeners
    setupEventListeners();
    
    return auth0Client;
  } catch (error) {
    console.error('❌ Failed to initialize Auth0:', error);
    showAuthError('Authentication system failed to initialize');
    throw error;
  }
}

// Handle authentication callback
async function handleAuthCallback() {
  try {
    const query = window.location.search;
    
    if (query.includes('code=') || query.includes('error=')) {
      console.log('🔄 Processing authentication callback...');
      
      await auth0Client.handleRedirectCallback();
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('✅ Authentication callback processed');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Authentication callback error:', error);
    showAuthError('Authentication callback failed');
    return false;
  }
}

// Update UI based on authentication state
async function updateAuthenticationUI() {
  try {
    const isAuthenticated = await auth0Client.isAuthenticated();
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    
    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      console.log('✅ User authenticated:', user.email || user.name);
      
      // Show logout button, hide login button
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      
      // Update user profile display
      if (userProfile) {
        userProfile.innerHTML = `
          <div class="user-info">
            <img src="${user.picture}" alt="User Avatar" class="user-avatar">
            <span class="user-name">${user.name || user.email}</span>
          </div>
        `;
        userProfile.style.display = 'block';
      }
    } else {
      console.log('ℹ️ User not authenticated');
      
      // Show login button, hide logout button
      if (loginBtn) loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userProfile) userProfile.style.display = 'none';
    }
  } catch (error) {
    console.error('❌ Failed to update authentication UI:', error);
  }
}

// Set up event listeners for login/logout buttons
function setupEventListeners() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    console.log('✅ Login button event listener added');
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
    console.log('✅ Logout button event listener added');
  }
}

// Handle login
async function handleLogin() {
  try {
    console.log('� Initiating login...');
    await auth0Client.loginWithRedirect();
  } catch (error) {
    console.error('❌ Login failed:', error);
    showAuthError('Login failed. Please try again.');
  }
}

// Handle logout
async function handleLogout() {
  try {
    console.log('� Logging out...');
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.error('❌ Logout failed:', error);
    showAuthError('Logout failed. Please try again.');
  }
}

// Show authentication error to user
function showAuthError(message) {
  console.error('Auth Error:', message);
  
  // Create or update error display
  let errorDiv = document.getElementById('auth-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'auth-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
    `;
    document.body.appendChild(errorDiv);
  }
  
  errorDiv.innerHTML = `
    <strong>Authentication Error</strong><br>
    ${message}
    <button onclick="this.parentElement.remove()" style="
      float: right;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
    ">×</button>
  `;
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuth0);
} else {
  initializeAuth0();
}

// Also initialize when Auth0 SDK is loaded (if it loads after this script)
window.addEventListener('load', () => {
  if (typeof auth0 !== 'undefined' && !auth0Client) {
    initializeAuth0();
  }
});