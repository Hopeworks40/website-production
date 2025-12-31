# Automated Production Deployment Script
# This script builds, obfuscates, minifies, and deploys to public GitHub repo

Write-Host "🚀 Starting Automated Production Deployment" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Step 1: Build the project
Write-Host "📦 Step 1: Building and obfuscating code..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ Build completed successfully`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
    exit 1
}

# Step 2: Remove deployment files from dist
Write-Host "🧹 Step 2: Cleaning deployment files from dist..." -ForegroundColor Yellow
$distPath = "./dist"
$filesToRemove = @(
    "$distPath/deploy-github.ps1",
    "$distPath/deploy-to-github.ps1",
    "$distPath/DEPLOYMENT-GUIDE.md"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $(Split-Path $file -Leaf)" -ForegroundColor Gray
    }
}
Write-Host "✅ Cleanup completed`n" -ForegroundColor Green

# Step 3: Navigate to dist folder
Set-Location $distPath

# Step 4: Initialize Git (if not already initialized)
Write-Host "🔧 Step 3: Setting up Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "✅ Git initialized`n" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized`n" -ForegroundColor Green
}

# Step 5: Add all files
Write-Host "📝 Step 4: Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged`n" -ForegroundColor Green

# Step 6: Commit with timestamp
Write-Host "💾 Step 5: Creating commit..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Production build - $timestamp"
git commit -m $commitMessage
Write-Host "✅ Commit created`n" -ForegroundColor Green

# Step 7: Setup remote (if not exists)
Write-Host "🔗 Step 6: Setting up remote repository..." -ForegroundColor Yellow
$publicRepo = "https://github.com/Hopeworks40/website-production.git"

# Remove existing remote if it exists
git remote remove origin 2>$null

# Add remote
git remote add origin $publicRepo
Write-Host "✅ Remote configured`n" -ForegroundColor Green

# Step 8: Push to public repository
Write-Host "🚀 Step 7: Pushing to public repository..." -ForegroundColor Yellow
Write-Host "Repository: $publicRepo`n" -ForegroundColor Cyan

try {
    git push -f origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Push failed"
    }
    Write-Host "`n✅ Successfully deployed to production!`n" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Push failed. Please check your credentials and network connection." -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 9: Return to root directory
Set-Location ..

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 Built: Obfuscated and minified" -ForegroundColor White
Write-Host "🚀 Deployed to: $publicRepo" -ForegroundColor White
Write-Host "⏰ Time: $timestamp" -ForegroundColor White
Write-Host "✅ Status: SUCCESS`n" -ForegroundColor Green

Write-Host "🌐 Your production website is now live!" -ForegroundColor Cyan
Write-Host "Visit: https://hopeworks40.github.io/website-production/`n" -ForegroundColor Cyan
