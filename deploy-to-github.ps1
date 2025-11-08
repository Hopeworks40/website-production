# Quick Deployment Script for GitHub
# This script will help you push to both private and public repositories

Write-Host "🚀 GitHub Deployment Helper" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Initialize Git for Original Code (if needed)
Write-Host "Step 1: Setting up PRIVATE repository (original code)" -ForegroundColor Yellow
Write-Host "-----------------------------------------------`n" -ForegroundColor Yellow

$privateRepo = Read-Host "Enter your PRIVATE GitHub repo URL (e.g., https://github.com/yourusername/website-source.git)"

if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "Git already initialized" -ForegroundColor Green
}

# Add remote for private repo
Write-Host "Adding private repository remote..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $privateRepo

# Add files (excluding dist and node_modules via .gitignore)
Write-Host "Adding files to git..." -ForegroundColor Green
git add .

# Commit
$commitMessage = Read-Host "Enter commit message for private repo (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit - original source code"
}
git commit -m $commitMessage

# Push to private repo
Write-Host "`nPushing to PRIVATE repository..." -ForegroundColor Green
git push -u origin main

Write-Host "`n✅ Successfully pushed to PRIVATE repository!`n" -ForegroundColor Green

# Step 2: Build and Push to Public Repository
Write-Host "Step 2: Setting up PUBLIC repository (obfuscated code)" -ForegroundColor Yellow
Write-Host "-----------------------------------------------`n" -ForegroundColor Yellow

$publicRepo = Read-Host "Enter your PUBLIC GitHub repo URL (e.g., https://github.com/yourusername/website-production.git)"

# Build the project
Write-Host "`nBuilding obfuscated version..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

# Navigate to dist folder
Set-Location dist

# Initialize git in dist folder
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git in dist folder..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "Git already initialized in dist" -ForegroundColor Green
}

# Add remote for public repo
Write-Host "Adding public repository remote..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $publicRepo

# Add all files
Write-Host "Adding built files to git..." -ForegroundColor Green
git add .

# Commit
$buildDate = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Production build - $buildDate"

# Push to public repo
Write-Host "`nPushing to PUBLIC repository..." -ForegroundColor Green
git push -f origin main

Write-Host "`n✅ Successfully pushed to PUBLIC repository!`n" -ForegroundColor Green

# Return to root
Set-Location ..

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan
Write-Host "PRIVATE Repo: $privateRepo" -ForegroundColor White
Write-Host "PUBLIC Repo:  $publicRepo" -ForegroundColor White
Write-Host "`nYour original code is in the PRIVATE repo" -ForegroundColor Gray
Write-Host "Your obfuscated/minified code is in the PUBLIC repo`n" -ForegroundColor Gray
