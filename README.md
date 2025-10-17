# Astral 3D - Solar System Explorer 🌌

A stunning 3D solar system visualization with authentication powered by Auth0 and optimized for Vercel deployment.

## 🚀 Features

- **3D Solar System**: Interactive planetary visualization
- **Auth0 Authentication**: Secure login/logout with fingerprint animation
- **Responsive Design**: Works seamlessly across all devices
- **Optimized Performance**: Production-ready static site deployment
- **Security Headers**: Enterprise-grade security configuration

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), CSS3, HTML5
- **Authentication**: Auth0 Universal Login
- **Deployment**: Vercel (Static Site + Serverless Functions)
- **3D Graphics**: Three.js (for planetary visualization)

## 📦 Project Structure

```
Astral_3D/
├── index.html              # Main landing page
├── style.css               # Global styles
├── script.js               # Main application logic
├── auth0-config.js         # Authentication logic
├── auth-manager.js         # Auth0 client management
├── blackhole.webm          # Background video
├── api/
│   └── runtime-auth0.js    # Serverless Auth0 API endpoint
├── vercel.json             # Vercel deployment configuration
├── package.json            # Project metadata
└── README.md               # This file
```

## 🔧 Vercel Deployment Setup

### 1. Pre-deployment Checklist ✅

- [x] Static site optimized (no Express server)
- [x] Auth0 configuration complete
- [x] Security headers configured
- [x] Cache policies optimized
- [x] ES6 modules properly configured
- [x] Serverless function for Auth0 ready

### 2. Environment Variables Required

Set these in your Vercel dashboard under **Settings > Environment Variables**:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Production URLs (update after deployment)
AUTH0_CALLBACK_URL=https://your-app.vercel.app/callback
AUTH0_LOGOUT_URL=https://your-app.vercel.app
```

### 3. Auth0 Dashboard Configuration

Update your Auth0 application settings:

1. **Allowed Callback URLs**:
   ```
   https://your-app.vercel.app,
   https://your-app.vercel.app/callback,
   http://localhost:3000 (for local development)
   ```

2. **Allowed Logout URLs**:
   ```
   https://your-app.vercel.app,
   http://localhost:3000
   ```

3. **Allowed Web Origins**:
   ```
   https://your-app.vercel.app,
   http://localhost:3000
   ```

### 4. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration
1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

### 5. Post-Deployment Steps

1. **Update Auth0 URLs**: Replace `localhost:3000` with your Vercel domain
2. **Test Authentication**: Verify login/logout functionality
3. **Check Security Headers**: Use tools like securityheaders.com
4. **Performance Audit**: Run Lighthouse audit

## 🔒 Security Features

- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Enforcement**: Strict Transport Security enabled
- **Frame Protection**: Clickjacking prevention
- **CORS Configuration**: Properly configured for Auth0
- **Cache Control**: Optimized for performance and security

## 🎯 Performance Optimizations

- **Static Site Generation**: No server-side rendering overhead
- **CDN Distribution**: Vercel's global edge network
- **Asset Optimization**: Proper cache headers for static assets
- **Minimal Dependencies**: Lightweight vanilla JavaScript

## 🔧 Local Development

```bash
# Serve locally (Python)
python -m http.server 3000

# OR serve locally (Node.js)
npx serve . -p 3000

# OR use Live Server extension in VS Code
```

## 📝 Environment Setup

1. **Create `.env.local`** (for local development):
   ```env
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   ```

2. **Update Auth0 configuration** in `auth0-config.js` if needed

## 🐛 Troubleshooting

### Common Issues:

1. **Auth0 Login Not Working**:
   - Check callback URLs in Auth0 dashboard
   - Verify environment variables in Vercel
   - Ensure CORS settings are correct

2. **Static Assets Not Loading**:
   - Check file paths are relative
   - Verify cache headers in `vercel.json`

3. **Deployment Failures**:
   - Ensure `vercel.json` has no conflicting properties
   - Check Node.js version compatibility
   - Verify all environment variables are set

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Auth0 Documentation](https://auth0.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)

## 👥 Authors

- **Subarna (Dronzer2code)** - Lead Developer
- **SOUMYA (SoumyaEXE)** - Co-Developer

## 📄 License

ISC License - See project for details.

---

**🌟 Ready for production deployment on Vercel!**
