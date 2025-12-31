# 🚀 Two-Repository Deployment System

Automated deployment system that maintains two GitHub repositories:
1. **Private Repository** - Original source code
2. **Public Repository** - Obfuscated production code

## 📦 What Gets Built

The build process:
- ✅ Obfuscates JavaScript files (tracking.js, config.js, main.js, etc.)
- ✅ Minifies CSS files (style.css, admore.css)
- ✅ Minifies HTML files (index.html, 404.html)
- ✅ Creates optimized production build in `dist/` folder

## 🎯 Quick Start

### Option 1: First-Time Setup

1. **Run setup wizard:**
   ```powershell
   .\setup-repos.ps1
   ```

2. **Enter your repository URLs when prompted:**
   - Private repo: `https://github.com/username/website-source.git`
   - Public repo: `https://github.com/username/website-production.git`

3. **Deploy to both repositories:**
   ```powershell
   .\deploy-both-repos.ps1
   ```

### Option 2: Manual Configuration

1. **Edit `deploy-both-repos.ps1`** and update these lines:
   ```powershell
   $PRIVATE_REPO = "https://github.com/username/website-source.git"
   $PUBLIC_REPO = "https://github.com/username/website-production.git"
   ```

2. **Run deployment:**
   ```powershell
   .\deploy-both-repos.ps1
   ```

## 📋 What Happens During Deployment

### Step 1: Deploy Source Code (Private Repo)
- Adds all files EXCEPT `dist/` (excluded by `.gitignore`)
- Commits with your custom message
- Pushes to private repository

### Step 2: Build Production Code
- Runs `npm run build`
- Creates obfuscated JavaScript files
- Minifies CSS and HTML
- Generates `dist/` folder

### Step 3: Deploy Production Code (Public Repo)
- Navigates to `dist/` folder
- Initializes separate git repository
- Commits all production files
- Pushes to public repository

## 🔧 Available Scripts

| Script | Purpose |
|--------|---------|
| `setup-repos.ps1` | One-time setup wizard to configure repository URLs |
| `deploy-both-repos.ps1` | Main deployment script for both repositories |
| `build.js` | Build script (auto-run by deploy script) |

## 📁 Repository Structure

### Private Repository (Source)
```
website-source/
├── index.html
├── 404.html
├── assets/
│   ├── css/ (original CSS)
│   ├── js/ (original JavaScript)
│   └── img/
├── package.json
├── build.js
└── .gitignore (excludes dist/)
```

### Public Repository (Production)
```
website-production/
├── index.html (minified)
├── 404.html (minified)
└── assets/
    ├── css/ (minified CSS)
    ├── js/ (obfuscated JavaScript)
    └── img/
```

## 🛡️ Security Features

- **JavaScript Obfuscation**: Protects code logic
- **Config File Obfuscation**: Hides API endpoints and configuration
- **Separate Repositories**: Source code stays private
- **`.gitignore` Protection**: Prevents accidental exposure of sensitive files

## 🔄 Daily Workflow

1. **Make changes** to your source code
2. **Run deployment:**
   ```powershell
   .\deploy-both-repos.ps1
   ```
3. **Enter commit message** when prompted
4. **Done!** Both repositories are updated automatically

## ⚠️ Important Notes

- The `dist/` folder is **intentionally excluded** from the main repository
- Never manually commit `dist/` to the private repository
- Always use the deployment script to push production code
- The public repository should only contain the `dist/` folder contents

## 🆘 Troubleshooting

### "Authentication failed"
Make sure you're logged in to GitHub:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### "Permission denied"
Check that you have write access to both repositories.

### "Build failed"
Ensure dependencies are installed:
```powershell
npm install
npm install -g javascript-obfuscator
```

### "Repository URLs not configured"
Run the setup wizard:
```powershell
.\setup-repos.ps1
```

## 📝 Manual Build (Without Deployment)

If you only want to build without deploying:
```powershell
npm run build
```

This creates the `dist/` folder without pushing to any repository.

## 🎨 Customization

### Change Obfuscation Settings
Edit `build.js` and modify the obfuscation configuration:
```javascript
const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  // ... other options
};
```

### Add More Files to Obfuscate
Edit `build.js` and add files to the array:
```javascript
const jsFilesToObfuscate = [
  "assets/js/tracking.js",
  "assets/js/your-new-file.js", // Add here
];
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `DEPLOYMENT-GUIDE.md` for detailed information
3. Verify your repository URLs are correct in `deploy-both-repos.ps1`

---

**Made with ❤️ for secure deployments**
