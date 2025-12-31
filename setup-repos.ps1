# Quick Setup for Two-Repository Deployment
# Run this once to configure your repository URLs

Write-Host "`n=== Two-Repository Setup Wizard ===" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "This wizard will help you set up deployment to two repositories:" -ForegroundColor White
Write-Host "  1. PRIVATE repository - for original source code" -ForegroundColor Gray
Write-Host "  2. PUBLIC repository - for obfuscated production code`n" -ForegroundColor Gray

# Get repository URLs
Write-Host "Please provide your GitHub repository URLs:`n" -ForegroundColor Yellow

$privateRepo = Read-Host "Enter PRIVATE repository URL (e.g., https://github.com/username/website-source.git)"
$publicRepo = Read-Host "Enter PUBLIC repository URL (e.g., https://github.com/username/website-production.git)"

Write-Host "`nConfiguration captured!" -ForegroundColor Green

# Update deploy-both-repos.ps1
$scriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "deploy-both-repos.ps1"

if (Test-Path $scriptPath) {
    Write-Host "Updating deploy-both-repos.ps1 with your repository URLs..." -ForegroundColor Green
    
    $content = Get-Content $scriptPath -Raw
    $content = $content -replace 'PRIVATE_REPO = ".*?"', "PRIVATE_REPO = `"$privateRepo`""
    $content = $content -replace 'PUBLIC_REPO = ".*?"', "PUBLIC_REPO = `"$publicRepo`""
    Set-Content $scriptPath -Value $content
    
    Write-Host "Configuration saved!`n" -ForegroundColor Green
} else {
    Write-Host "Error: deploy-both-repos.ps1 not found!`n" -ForegroundColor Red
    exit 1
}

# Display next steps
Write-Host "=== SETUP COMPLETE! ===`n" -ForegroundColor Cyan

Write-Host "Your Configuration:" -ForegroundColor White
Write-Host "  Private Repo: $privateRepo" -ForegroundColor Gray
Write-Host "  Public Repo:  $publicRepo`n" -ForegroundColor Gray

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Run: .\deploy-both-repos.ps1" -ForegroundColor White
Write-Host "  2. Enter your commit message when prompted" -ForegroundColor White
Write-Host "  3. The script will automatically:" -ForegroundColor White
Write-Host "     - Push source code to private repo" -ForegroundColor Gray
Write-Host "     - Build obfuscated version" -ForegroundColor Gray
Write-Host "     - Push production code to public repo`n" -ForegroundColor Gray

Write-Host "Tip: You can edit deploy-both-repos.ps1 anytime to change repository URLs.`n" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
