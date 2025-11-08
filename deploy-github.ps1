# GitHub Deployment Script
# Deploys to two repositories: Private (original) and Public (obfuscated)

Write-Host "🚀 GitHub Deployment Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Configuration
$PRIVATE_REPO = "https://github.com/Hopeworks40/website-source.git"
$PUBLIC_REPO = "https://github.com/Hopeworks40/website-production.git"
$PROJECT_DIR = "c:\Users\fadom\OneDrive\Desktop\home websiteapp"
$DIST_DIR = "$PROJECT_DIR\dist"

# Function to check if repository exists on GitHub
function Test-GitHubRepo {
    param($repoUrl)
    try {
        $response = git ls-remote $repoUrl 2>&1
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

Write-Host "📝 Repository Configuration:" -ForegroundColor Yellow
Write-Host "   Private Repo: $PRIVATE_REPO"
Write-Host "   Public Repo:  $PUBLIC_REPO`n"

# Ask user to confirm repository names
Write-Host "⚠️  IMPORTANT: You need to create these repositories on GitHub first!" -ForegroundColor Red
Write-Host "`n1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Create a PRIVATE repository named: website-source" -ForegroundColor Green
Write-Host "3. Create a PUBLIC repository named: website-production" -ForegroundColor Green
Write-Host "`nPress Enter when repositories are created, or Ctrl+C to cancel..." -ForegroundColor Yellow
Read-Host

# Step 1: Setup Private Repository (Original Code)
Write-Host "`n📦 Step 1: Setting up Private Repository (Original Code)" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

Set-Location $PROJECT_DIR

# Initialize git if not already done
if (-Not (Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized`n" -ForegroundColor Green
}

# Configure git user if not set
$gitUser = git config user.name 2>$null
if (-Not $gitUser) {
    Write-Host "⚙️  Git user not configured. Please enter your details:" -ForegroundColor Yellow
    $userName = Read-Host "Enter your name"
    $userEmail = Read-Host "Enter your email"
    git config user.name "$userName"
    git config user.email "$userEmail"
    Write-Host "✅ Git user configured`n" -ForegroundColor Green
}

# Add .gitignore if not exists
if (-Not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    @"
node_modules/
dist/
.env
.env.local
assets/js/config.js
*.log
.DS_Store
Thumbs.db
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host "✅ .gitignore created`n" -ForegroundColor Green
}

# Add remote for private repo
Write-Host "🔗 Adding remote: origin-private" -ForegroundColor Yellow
git remote remove origin-private 2>$null
git remote add origin-private $PRIVATE_REPO
Write-Host "✅ Remote added`n" -ForegroundColor Green

# Add all files and commit
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged`n" -ForegroundColor Green

Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Original source code with obfuscation build system"
Write-Host "✅ Commit created`n" -ForegroundColor Green

# Push to private repo
Write-Host "🚀 Pushing to private repository..." -ForegroundColor Yellow
Write-Host "   Repository: $PRIVATE_REPO" -ForegroundColor Cyan
git branch -M main
git push -u origin-private main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to private repository!`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to private repository" -ForegroundColor Red
    Write-Host "Please check if the repository exists and you have access`n" -ForegroundColor Yellow
    exit 1
}

# Step 2: Build Production Version
Write-Host "`n📦 Step 2: Building Production Version (Obfuscated + Minified)" -ForegroundColor Cyan
Write-Host "===============================================================`n" -ForegroundColor Cyan

Write-Host "🔨 Running build script..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build completed successfully!`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Setup Public Repository (Production Code)
Write-Host "`n📦 Step 3: Setting up Public Repository (Production Code)" -ForegroundColor Cyan
Write-Host "=========================================================`n" -ForegroundColor Cyan

Set-Location $DIST_DIR

# Initialize git in dist folder
if (-Not (Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository in dist..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized`n" -ForegroundColor Green
}

# Configure git user in dist folder
git config user.name "$(git config --global user.name)"
git config user.email "$(git config --global user.email)"

# Add remote for public repo
Write-Host "🔗 Adding remote: origin" -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $PUBLIC_REPO
Write-Host "✅ Remote added`n" -ForegroundColor Green

# Add all files and commit
Write-Host "📝 Staging production files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged`n" -ForegroundColor Green

$buildDate = Get-Date -Format "yyyy-MM-dd HH:mm"
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "Production build - Obfuscated and minified code - $buildDate"
Write-Host "✅ Commit created`n" -ForegroundColor Green

# Push to public repo
Write-Host "🚀 Pushing to public repository..." -ForegroundColor Yellow
Write-Host "   Repository: $PUBLIC_REPO" -ForegroundColor Cyan
git branch -M main
git push -f origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to public repository!`n" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to public repository" -ForegroundColor Red
    Write-Host "Please check if the repository exists and you have access`n" -ForegroundColor Yellow
    exit 1
}

# Return to project directory
Set-Location $PROJECT_DIR

# Summary
Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "========================`n" -ForegroundColor Green

Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Private Repository (Original Code):" -ForegroundColor White
Write-Host "      https://github.com/Hopeworks40/website-source" -ForegroundColor Gray
Write-Host "`n   ✅ Public Repository (Production Code):" -ForegroundColor White
Write-Host "      https://github.com/Hopeworks40/website-production" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Visit your repositories on GitHub to verify" -ForegroundColor White
Write-Host "   2. Set website-source repository to PRIVATE in GitHub settings" -ForegroundColor White
Write-Host "   3. Set website-production repository to PUBLIC in GitHub settings" -ForegroundColor White
Write-Host "   4. Enable GitHub Pages on website-production if needed`n" -ForegroundColor White

Write-Host "🔄 For future updates, run: .\deploy-github.ps1`n" -ForegroundColor Cyan
