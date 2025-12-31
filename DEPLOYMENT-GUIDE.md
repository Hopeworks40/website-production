# Deployment Guide - Two Repository Strategy

This guide explains how to maintain two GitHub repositories: one for original source code (private) and one for obfuscated production code (public).

## Prerequisites

1. **Install Node.js** (if not already installed)

   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Install javascript-obfuscator globally**

   ```powershell
   npm install -g javascript-obfuscator
   ```

3. **Create two GitHub repositories**
   - **Repository 1**: `yourname/website-source` (Private) - for original code
   - **Repository 2**: `yourname/website-production` (Public) - for obfuscated code

## Initial Setup

### 1. Setup Original Code Repository (Private)

```powershell
# Navigate to your project folder
cd "c:\Users\fadom\OneDrive\Desktop\home websiteapp"

# Initialize git (if not already done)
git init

# Add private repository as remote
git remote add origin https://github.com/yourname/website-source.git

# Create .gitignore to exclude sensitive files
# (Already created - see .gitignore file)

# Add all files
git add .

# Commit
git commit -m "Initial commit - original source code"

# Push to private repository
git push -u origin main
```

### 2. Build Obfuscated Version

```powershell
# Run build script
npm run build

# This creates a 'dist' folder with obfuscated JavaScript files
```

### 3. Setup Production Repository (Public)

```powershell
# Navigate to dist folder
cd dist

# Initialize new git repository
git init

# Add production repository as remote
git remote add origin https://github.com/yourname/website-production.git

# Add all files
git add .

# Commit
git commit -m "Production build - obfuscated code"

# Push to public repository
git push -u origin main

# Return to project root
cd ..
```

## Workflow for Updates

### Option A: Manual Workflow

**Step 1: Update Original Code**

```powershell
# Make your changes to source files
# Then commit to private repo

git add .
git commit -m "Your update message"
git push origin main
```

**Step 2: Build and Deploy Production**

```powershell
# Build obfuscated version
npm run build

# Navigate to dist
cd dist

# If git not initialized, run: git init
# If remote not added, run: git remote add origin https://github.com/yourname/website-production.git

# Add changes
git add .

# Commit
git commit -m "Production build - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# Push to production repo
git push -f origin main

# Return to root
cd ..
```

### Option B: Automated Workflow (Recommended)

Create separate remotes for both repositories:

```powershell
# Add both remotes
git remote add origin-private https://github.com/yourname/website-source.git
git remote add production-public https://github.com/yourname/website-production.git

# Push original code
git push origin-private main

# Build and deploy production
npm run build
cd dist
git init
git add .
git commit -m "Production build"
git remote add origin https://github.com/yourname/website-production.git
git push -f origin main
cd ..
```

## Build Script Details

The `build.js` script does the following:

1. ✅ Creates a `dist` folder
2. ✅ Copies all files (excluding node_modules, .git, etc.)
3. ✅ Obfuscates JavaScript files with advanced protection:
   - Control flow flattening
   - Dead code injection
   - String array encoding (RC4)
   - Self-defending code
   - Identifier renaming
   - Console output disabling
4. ✅ Creates build-info.json with build metadata

## Obfuscation Features

The following files are obfuscated:

- `assets/js/tracking.js` - Tracking system logic
- `assets/js/exces.js` - Chatbot functionality
- `assets/js/cosent.js` - Cookie consent system
- `assets/js/protection.js` - Code protection
- `assets/js/config.js` - Supabase configuration
- `assets/js/main.js` - Main application logic

## Security Best Practices

### For Private Repository (Source Code)

- ✅ Keep config.js with real API keys (excluded by .gitignore)
- ✅ Never push sensitive credentials
- ✅ Use environment variables for production
- ✅ Restrict access to trusted team members only

### For Public Repository (Production)

- ✅ Use obfuscated code only
- ✅ Remove or sanitize config.js before deploying
- ✅ Use environment variables on server
- ✅ Enable GitHub Pages or deploy to hosting

## File Structure

```
Project Root/
├── assets/
│   ├── js/
│   │   ├── tracking.js          (Original - Private Repo)
│   │   ├── exces.js             (Original - Private Repo)
│   │   ├── config.js            (Original - Private Repo, NEVER COMMIT)
│   │   └── ...
│   └── ...
├── dist/                        (Production - Public Repo)
│   ├── assets/
│   │   ├── js/
│   │   │   ├── tracking.js      (Obfuscated)
│   │   │   ├── exces.js         (Obfuscated)
│   │   │   └── ...
│   │   └── ...
│   └── build-info.json
├── build.js                     (Build script)
├── package.json
├── .gitignore
└── DEPLOYMENT-GUIDE.md          (This file)
```

## Testing Before Deployment

1. **Build locally**

   ```powershell
   npm run build
   ```

2. **Test dist folder**

   - Open `dist/index.html` in browser
   - Test tracking functionality
   - Test chatbot
   - Verify obfuscated code works correctly

3. **Check obfuscation**
   - Open browser DevTools (F12)
   - Check that JavaScript is unreadable
   - Verify protection.js is working

## Troubleshooting

### Build fails with "javascript-obfuscator not found"

```powershell
npm install -g javascript-obfuscator
```

### Git push fails with authentication error

```powershell
# Use GitHub CLI or Personal Access Token
# Generate token at: https://github.com/settings/tokens
# Use token as password when pushing
```

### Obfuscated code doesn't work

- Check browser console for errors
- Some code may not obfuscate well (reduce obfuscation options)
- Test in dist folder before deploying

## Quick Commands Reference

```powershell
# Build production version
npm run build

# Push to private repo (original code)
git add .
git commit -m "Update"
git push origin main

# Deploy to public repo (obfuscated)
cd dist
git add .
git commit -m "Production build"
git push origin main
cd ..
```

## Support

For issues or questions:

1. Check build.js console output for errors
2. Verify Node.js and npm are installed
3. Ensure javascript-obfuscator is globally installed
4. Check GitHub repository permissions

---

**Remember**: Never commit sensitive API keys or credentials to any repository!
