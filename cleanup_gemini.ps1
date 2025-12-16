# Cleanup Script for Antigravity (.gemini)
# This script cleans up temporary browser data to free up space and improve performance.

$GeminiPath = "C:\Users\codebyfaisal\.gemini"
$BrowserProfilePath = Join-Path $GeminiPath "antigravity-browser-profile"

Write-Host "Starting cleanup for: $GeminiPath" -ForegroundColor Cyan

# 1. Clean Browser Cache and Temporary Files
if (Test-Path $BrowserProfilePath) {
    Write-Host "Cleaning Browser Profile Cache..." -ForegroundColor Yellow
    
    $ItemsToRemove = @(
        "Default\Cache",
        "Default\Code Cache",
        "Default\GPUCache",
        "Default\Service Worker",
        "ShaderCache",
        "GrShaderCache"
    )

    foreach ($Item in $ItemsToRemove) {
        $PathToRemove = Join-Path $BrowserProfilePath $Item
        if (Test-Path $PathToRemove) {
            try {
                Remove-Item -Path $PathToRemove -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "  Removed: $Item" -ForegroundColor Green
            } catch {
                Write-Host "  Could not remove (might be in use): $Item" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "Browser profile not found (skippping)." -ForegroundColor Gray
}

# 2. Check Size
$CurrentSize = Get-ChildItem -Path $GeminiPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
$SizeMB = [math]::Round($CurrentSize.Sum / 1MB, 2)

Write-Host "`nCleanup Complete!" -ForegroundColor Green
Write-Host "Current .gemini folder size: $SizeMB MB" -ForegroundColor White
Write-Host "Note: If 'assets' are still large, it might be due to Conversation History."
Write-Host "Recommendation: Start a NEW chat session frequently to keep performance high." -ForegroundColor Cyan

Pause
