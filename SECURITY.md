# 🔒 Security Configuration

This document explains how authentication credentials are handled securely in this project.

## 🚫 What's NOT in the Repository

- ❌ **No hardcoded Auth0 credentials** in any source files
- ❌ **No sensitive API keys** committed to Git
- ❌ **No fallback credentials** in production code

## ✅ Secure Implementation

### Environment Variables Required

The following environment variables must be set:

```bash
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
```

### Local Development Setup

1. **Create `.env` file** (already gitignored):
```bash
AUTH0_DOMAIN=dev-j244xylfomnfbzn8.us.auth0.com
AUTH0_CLIENT_ID=NxbhETO5YcloNEZUyx5GUCpK0zfOZnnD
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

### Production Deployment

#### Vercel Setup
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the following variables:
   - `AUTH0_DOMAIN` = `dev-j244xylfomnfbzn8.us.auth0.com`
   - `AUTH0_CLIENT_ID` = `NxbhETO5YcloNEZUyx5GUCpK0zfOZnnD`

#### Other Hosting Platforms
Set these environment variables in your hosting platform's configuration:
- **Netlify**: Site settings → Environment variables
- **Heroku**: Settings → Config Vars
- **Railway**: Variables tab
- **AWS/Azure**: Application settings

## 🛡️ Security Features

### 1. **Server-Side Configuration**
- Auth0 config served via `/api/auth-config` endpoint
- Server validates environment variables exist
- Returns error if credentials not configured

### 2. **No Client-Side Credentials**
- Frontend fetches config from server API
- No hardcoded values in JavaScript
- Graceful error handling if server unavailable

### 3. **Development Safety**
- `.env` file in `.gitignore`
- `env-loader.js` provides setup guidance
- Clear error messages for missing configuration

### 4. **Production Security**
- No fallback credentials in production builds
- Environment variables required for deployment
- Auth0 callback URLs restricted to approved domains

## 🚨 Security Checklist

Before deployment, verify:

- [ ] ✅ `.env` file is in `.gitignore`
- [ ] ✅ No hardcoded credentials in any `.js` or `.html` files
- [ ] ✅ Environment variables set in hosting platform
- [ ] ✅ Auth0 dashboard has correct callback URLs
- [ ] ✅ Production domain added to Auth0 allowed origins

## 🔧 Troubleshooting

### "Auth0 configuration not found" Error
- **Cause**: Environment variables not set
- **Solution**: Add `AUTH0_DOMAIN` and `AUTH0_CLIENT_ID` to hosting platform

### "Login button isn't working"
- **Cause**: JavaScript can't load Auth0 config from server
- **Solution**: Check browser console and verify `/api/auth-config` endpoint returns valid JSON

### Local Development Issues
- **Cause**: Missing `.env` file or wrong format
- **Solution**: Create `.env` file with exact variable names (no quotes around values)

## 📞 Support

If you encounter security-related issues:
1. Check environment variables are set correctly
2. Verify Auth0 dashboard configuration
3. Check browser console for error messages
4. Ensure `.env` file format is correct (no quotes around values)