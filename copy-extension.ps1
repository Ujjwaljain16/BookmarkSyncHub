# PowerShell script to copy extension zip to public folder

# Create public folder if it doesn't exist
if (-not (Test-Path "public")) {
    New-Item -ItemType Directory -Path "public"
}

# Copy the zip file
Copy-Item "../Hello/BookmarkSyncHub.zip" -Destination "public/BookmarkSyncHub.zip" -Force

Write-Host "Extension zip file copied to public folder successfully" 