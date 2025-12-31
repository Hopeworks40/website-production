# Automated Deployment Script
# Deploys to both Private (source) and Public (production) repositories

Write-Host "`n=== Two-Repository Deployment Script ===" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration - UPDATE THESE URLs
$PRIVATE_REPO = "https://github.com/hopeworks40/website-source.git"  # Change this
$PUBLIC_REPO = "https://github.com/hopeworks40/website-production.git"  # Change this

# Change directory to project root
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $PROJECT_ROOT

Write-Host "Working Directory: $PROJECT_ROOT`n" -ForegroundColor Gray

# ========================================
# PART 1: Push Original Code to Private Repo
# ========================================

Write-Host "STEP 1: Deploying original source code to PRIVATE repository" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------`n" -ForegroundColor Yellow

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "Git repository already initialized" -ForegroundColor Green
}

# Add/update remote
Write-Host "Configuring remote 'origin' for private repo..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $PRIVATE_REPO

# Add files (dist is excluded via .gitignore)
Write-Host "Adding files to staging..." -ForegroundColor Green
git add .

# Get commit message
$commitMsg = Read-Host "`nEnter commit message for source code (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Update source code - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

# Commit
Write-Host "Committing changes..." -ForegroundColor Green
git commit -m $commitMsg

# Push to private repo
Write-Host "Pushing to PRIVATE repository..." -ForegroundColor Green
try {
    git push -u origin main -f
    Write-Host "`nSuccessfully pushed to PRIVATE repository!`n" -ForegroundColor Green
} catch {
    Write-Host "`nFailed to push to private repository. Please check your credentials and repository URL." -ForegroundColor Red
    Write-Host "Error: $_`n" -ForegroundColor Red
    exit 1
}

# ========================================
# PART 2: Build Production Code
# ========================================

Write-Host "`nSTEP 2: Building obfuscated production code" -ForegroundColor Yellow
Write-Host "---------------------------------------------`n" -ForegroundColor Yellow

# Run build script
Write-Host "Running build process..." -ForegroundColor Green
try {
    npm run build
    Write-Host "`nBuild completed successfully!`n" -ForegroundColor Green
} catch {
    Write-Host "`nBuild failed. Please check the error above." -ForegroundColor Red
    exit 1
}

# ========================================
# PART 3: Push Dist to Public Repo
# ========================================

Write-Host "`nSTEP 3: Deploying production code to PUBLIC repository" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------`n" -ForegroundColor Yellow

# Navigate to dist folder
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist folder not found. Build may have failed." -ForegroundColor Red
    exit 1
}

Set-Location "dist"

# Initialize git in dist folder
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git in dist folder..." -ForegroundColor Green
    git init
    git branch -M main
} else {
    Write-Host "Git already initialized in dist" -ForegroundColor Green
}

# Add remote for public repo
Write-Host "Configuring remote 'origin' for public repo..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $PUBLIC_REPO

# Add all files
Write-Host "Adding all production files..." -ForegroundColor Green
git add .

# Commit production build
$prodCommitMsg = "Production build - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Committing production files..." -ForegroundColor Green
git commit -m $prodCommitMsg

# Push to public repo
Write-Host "Pushing to PUBLIC repository..." -ForegroundColor Green
try {
    git push -u origin main -f
    Write-Host "`nSuccessfully pushed to PUBLIC repository!`n" -ForegroundColor Green
} catch {
    Write-Host "`nFailed to push to public repository. Please check your credentials and repository URL." -ForegroundColor Red
    Write-Host "Error: $_`n" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Return to project root
Set-Location ..

# ========================================
# Summary
# ========================================

Write-Host "`n=== DEPLOYMENT COMPLETED SUCCESSFULLY! ===`n" -ForegroundColor Cyan

Write-Host "Deployment Summary:" -ForegroundColor White
Write-Host "  Private Repo (Source):     $PRIVATE_REPO" -ForegroundColor Gray
Write-Host "  Public Repo (Production):  $PUBLIC_REPO" -ForegroundColor Gray
Write-Host "  Deployment Time:           $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor Gray

Write-Host "Both repositories have been updated successfully!" -ForegroundColor Green
Write-Host "Tip: Update the repository URLs at the top of this script for future deployments.`n" -ForegroundColor Yellow

Read-Host "Press Enter to exit"

