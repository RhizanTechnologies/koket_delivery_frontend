# Deployment Guide

## cPanel Deployment (Static Export)

### Prerequisites
1. Backend API should be running at `http://backend.koket-bakery.com`
2. Backend must have CORS configured to allow your frontend domain

### Backend CORS Configuration
Your backend needs to allow requests from your frontend domain. Add this to your backend:

```javascript
// In your Express.js backend
const cors = require('cors');

app.use(cors({
  origin: [
    'http://koket-bakery.com',
    'https://koket-bakery.com',
    'http://www.koket-bakery.com',
    'https://www.koket-bakery.com',
    'http://localhost:3000', // For local development
  ],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
```

### Build Steps

1. **Update Environment Variables**
   ```bash
   # .env.local or .env.production
   NEXT_PUBLIC_API_BASE_URL=http://backend.koket-bakery.com/api/v1
   NEXT_PUBLIC_IMAGE_BASE_URL=http://backend.koket-bakery.com
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```
   This creates an `out` folder with static files.

3. **Upload to cPanel**
   - Upload all files from the `out` folder to your `public_html` directory
   - Or upload to a subdirectory like `public_html/frontend`

4. **Configure .htaccess (Important!)**
   Create or update `.htaccess` in your public_html folder:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     
     # Don't rewrite files or directories
     RewriteCond %{REQUEST_FILENAME} -f [OR]
     RewriteCond %{REQUEST_FILENAME} -d
     RewriteRule ^ - [L]
     
     # Rewrite all other requests to index.html
     RewriteRule ^ index.html [L]
   </IfModule>

   # Enable CORS for API requests
   <IfModule mod_headers.c>
     Header set Access-Control-Allow-Origin "*"
   </IfModule>

   # Cache static assets
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/gif "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType image/svg+xml "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

### GitHub Actions Deployment

Update your `.github/workflows/deploy.yml`:

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        env:
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
          NEXT_PUBLIC_IMAGE_BASE_URL: ${{ secrets.NEXT_PUBLIC_IMAGE_BASE_URL }}
        run: npm run build
      
      - name: Deploy to cPanel via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./out/
          server-dir: /public_html/
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
```

### Troubleshooting

#### Issue: CORS Errors
**Solution**: 
1. Check if backend has proper CORS configuration
2. Verify the API URL in `.env.local` is correct
3. Check browser console for the exact error
4. Ensure backend allows your domain

#### Issue: Only HTML showing (blank page)
**Causes**:
1. JavaScript files not loaded (check browser console)
2. Wrong path configuration
3. `.htaccess` not configured properly

**Solutions**:
1. Check browser console for 404 errors on JS/CSS files
2. Ensure all files from `out` folder are uploaded
3. Verify `.htaccess` is present and configured
4. Clear browser cache and cPanel cache

#### Issue: API calls failing
**Solutions**:
1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Check if backend server is running
3. Test API endpoints directly using Postman/curl
4. Check network tab in browser DevTools

### Alternative: Node.js Hosting on cPanel

If your cPanel supports Node.js:

1. **Update next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: "standalone",
     // ... rest of config
   };
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Upload**
   - Upload entire project to cPanel
   - Or just the `.next` folder, `public`, `node_modules`, `package.json`, and `server.js`

4. **Setup Node.js App in cPanel**
   - Application Root: `/home/username/frontend`
   - Application URL: Your domain
   - Application Startup File: `server.js`
   - Run: `npm install` then start the app

### Verification

After deployment:
1. Visit your site
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Network tab to verify API calls
5. Test all features

### Common Environment Variables

```env
# Production
NEXT_PUBLIC_API_BASE_URL=http://backend.koket-bakery.com/api/v1
NEXT_PUBLIC_IMAGE_BASE_URL=http://backend.koket-bakery.com

# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:5001
```

