# NumeriX Production Deployment Guide

## Overview

NumeriX is now a **frontend-only React application** built with Vite. It no longer requires a backend server or database.

## Prerequisites

- Node.js 18+ with npm
- Git (for deployment to platforms like Netlify/Vercel)
- A platform account (Netlify, Vercel, Cloudflare Pages, or traditional web hosting)

## Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Production Build

The production build outputs to the `dist/` folder:

```bash
npm run build
```

This creates:
- `dist/index.html` — Entry point
- `dist/assets/` — Static assets (JS, CSS, fonts, images)

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect Git Repository**
   ```bash
   # Install Netlify CLI (optional)
   npm install -g netlify-cli
   
   # Or use the web UI at https://app.netlify.com
   ```

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 (or higher)

3. **Deploy**
   ```bash
   # Using Netlify CLI
   netlify deploy --prod --dir=dist
   ```

4. **Environment Variables** (if needed in future)
   - None required currently (pure frontend app)

### Option 2: Vercel

1. **Import Project**
   - Go to https://vercel.com
   - Import from GitHub/GitLab/Bitbucket

2. **Configure Build**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**
   - Automatic deploys on git push
   - Preview deployments for pull requests

### Option 3: Cloudflare Pages

1. **Connect Repository**
   - Go to https://dash.cloudflare.com
   - Pages > Create a project > Connect to Git

2. **Build Configuration**
   - Build command: `npm run build`
   - Build output directory: `/dist`
   - Root directory: `/`

3. **Node Version**
   - Set via environment variable: `NODE_VERSION=18`

### Option 4: Traditional Web Hosting

1. **Build locally**
   ```bash
   npm ci
   npm run build
   ```

2. **Upload `dist/` contents**
   - Upload all files in `dist/` to your web server
   - Ensure the server serves `index.html` for all routes (SPA configuration)

3. **Nginx Configuration Example**
   ```nginx
   server {
       listen 80;
       server_name numerix.example.com;
       root /var/www/numerix/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

## Performance Optimization

### Pre-built Optimizations

The app already includes:
- **Code splitting**: Vendor chunks separated (react, framer-motion, math libraries)
- **Asset optimization**: Images and fonts processed automatically
- **Tree shaking**: Unused code eliminated
- **Gzip compression**: Enabled by default on most platforms

### Manual Optimizations

1. **Enable Brotli compression** (if your platform supports it)
2. **Use a CDN** for faster global delivery
3. **Enable HTTP/2** on your server
4. **Add service worker** for offline support (optional future enhancement)

## SEO & Meta Tags

The app includes basic SEO in `index.html`:
- Title: "NumeriX — Numerical Analysis Virtual Lab"
- Description and Open Graph tags
- Update these in `index.html` for your deployment

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Refresh (SPA Issue)

Ensure your hosting platform is configured for Single Page Applications:
- All routes should serve `index.html`
- Let React Router handle client-side routing

### Chunk Load Errors

If users see "Failed to load chunk" errors:
- Ensure proper cache headers (don't cache HTML, cache assets long-term)
- Consider adding a `Cache-Control: no-cache` header for `index.html`

## Environment Variables

Currently **no environment variables** are required. The app is fully client-side.

If you add API integrations in the future:
1. Create `.env` file locally (don't commit secrets)
2. Add to your hosting platform's environment variables
3. Access in code via `import.meta.env.VITE_VAR_NAME`

## Monitoring

### Free Options

1. **Google Analytics** — Add tracking ID to `index.html`
2. **Sentry** — Error tracking (optional)
3. **Cloudflare Analytics** — If using Cloudflare

### Build Verification

```bash
# Check build output size
du -sh dist/

# List all chunks
ls -la dist/assets/
```

## Security Considerations

- No server-side code = reduced attack surface
- No database = no SQL injection risk
- No user authentication = no session management needed
- Still follow React security best practices (XSS prevention, etc.)

## Custom Domain Setup

1. Purchase domain from your preferred registrar
2. Add custom domain in your hosting platform
3. Update DNS records as instructed by platform
4. Enable HTTPS (usually automatic)

## Rollback Strategy

1. Keep previous build artifacts (most platforms do this automatically)
2. Use git tags for releases: `git tag -a v1.0.0 -m "First production release"`
3. Most platforms allow instant rollbacks to previous deploys

## Support

For issues:
1. Check browser console for errors
2. Verify build succeeds locally: `npm run build && npm run preview`
3. Test in incognito mode (rules out extension conflicts)
4. Check platform status pages for outages

---

**Last Updated**: April 2026
**App Version**: 1.0.0 (Frontend-only)
**Node Version**: 18+
