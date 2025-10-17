// Auth0 Configuration for Production
class Auth0Manager {
    constructor() {
        this.domain = 'dev-j244xylfomnfbzn8.us.auth0.com';
        this.clientId = '5VZQZVh4RCyJBqZmrzDAFT12YHjXIvUy';
        this.redirectUri = this.getRedirectUri();
        this.auth0Client = null;
        this.isInitialized = false;
    }

    getRedirectUri() {
        // Handle different environments
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return 'https://your-vercel-domain.vercel.app';
    }

    async initialize() {
        if (this.isInitialized) return this.auth0Client;

        try {
            // Load Auth0 SDK if not already loaded
            if (typeof auth0 === 'undefined') {
                await this.loadAuth0SDK();
            }

            this.auth0Client = await auth0.createAuth0Client({
                domain: this.domain,
                clientId: this.clientId,
                authorizationParams: {
                    redirect_uri: this.redirectUri
                },
                cacheLocation: 'localstorage',
                useRefreshTokens: true
            });

            this.isInitialized = true;
            console.log('✅ Auth0 initialized successfully');
            return this.auth0Client;
        } catch (error) {
            console.error('❌ Auth0 initialization failed:', error);
            throw error;
        }
    }

    async loadAuth0SDK() {
        return new Promise((resolve, reject) => {
            if (typeof auth0 !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async handleRedirectCallback() {
        if (!this.auth0Client) {
            throw new Error('Auth0 client not initialized');
        }

        try {
            await this.auth0Client.handleRedirectCallback();
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        } catch (error) {
            console.error('Redirect callback error:', error);
            throw error;
        }
    }

    async login() {
        if (!this.auth0Client) {
            await this.initialize();
        }
        
        try {
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: this.redirectUri
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        if (!this.auth0Client) return;

        try {
            await this.auth0Client.logout({
                logoutParams: {
                    returnTo: this.redirectUri
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async isAuthenticated() {
        if (!this.auth0Client) return false;
        
        try {
            return await this.auth0Client.isAuthenticated();
        } catch (error) {
            console.error('Authentication check error:', error);
            return false;
        }
    }

    async getUser() {
        if (!this.auth0Client) return null;
        
        try {
            return await this.auth0Client.getUser();
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    async getAccessToken() {
        if (!this.auth0Client) return null;
        
        try {
            return await this.auth0Client.getTokenSilently();
        } catch (error) {
            console.error('Get access token error:', error);
            return null;
        }
    }
}

// Create global instance
const authManager = new Auth0Manager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Auth0Manager, authManager };
}