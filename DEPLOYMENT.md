# 🚀 Vercel Deployment Guide for Astral 3D

## Prerequisites
- Vercel account
- Auth0 account with configured application
- Git repository

## 1. Prepare for Deployment

### Update Environment Variables
1. Copy `.env.example` to `.env.local`
2. Update the values with your actual Auth0 credentials
3. Set your Vercel domain URL

### Auth0 Configuration
In your Auth0 dashboard:
1. Go to Applications > Your App > Settings
2. Add your Vercel domain to:
   - Allowed Callback URLs: `https://your-domain.vercel.app`
   - Allowed Logout URLs: `https://your-domain.vercel.app`
   - Allowed Web Origins: `https://your-domain.vercel.app`

## 2. Deploy to Vercel

### Option A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Vercel Dashboard
1. Import your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy

## 3. Post-Deployment Setup

### Set Environment Variables in Vercel
1. Go to your project in Vercel dashboard
2. Settings > Environment Variables
3. Add:
   - `AUTH0_DOMAIN`
   - `AUTH0_CLIENT_ID`
   - `AUTH0_CLIENT_SECRET`
   - `VERCEL_URL`

### Update Auth0 Settings
1. Replace all localhost URLs with your Vercel domain
2. Test the authentication flow

## 4. Testing

### Test Authentication
1. Visit your deployed site
2. Click the fingerprint login button
3. Complete Auth0 authentication
4. Verify user profile displays
5. Test logout functionality

### Test Navigation
1. Verify all CSS and JS loads properly
2. Test responsive design
3. Check all internal links work
4. Verify external links to Solar System app

## 5. Troubleshooting

### Common Issues

**Auth0 Login Fails**
- Check callback URLs in Auth0
- Verify environment variables
- Check browser console for errors

**CSS/JS Not Loading**
- Ensure all file paths are relative
- Check Vercel build logs
- Verify static assets are deployed

**404 Errors**
- Check vercel.json routing configuration
- Verify file structure matches routes

### Debugging Tools
- Vercel Function Logs
- Browser Developer Tools
- Auth0 Logs Dashboard

## 6. Performance Optimization

### Recommendations
- Enable Vercel Edge Network
- Compress images and videos
- Minify CSS/JS (if not already done)
- Use CDN for external resources

### Monitoring
- Set up Vercel Analytics
- Monitor Auth0 usage
- Track user engagement metrics