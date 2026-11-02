# Hostinger Deployment Packaging Script
$ErrorActionPreference = "Stop"

Write-Host "--- Packaging Profitspatrol for Hostinger ---" -ForegroundColor Cyan

$root = (Get-Item $PSScriptRoot).Parent.FullName
$deployDir = Join-Path $root "deploy_hostinger"

if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Path $deployDir | Out-Null
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Compress-CleanArchive {
    param(
        [Parameter(Mandatory=$true)][string]$SourceDir,
        [Parameter(Mandatory=$true)][string]$ZipPath
    )

    if (Test-Path $ZipPath) {
        Remove-Item -Force $ZipPath
    }

    $sourcePath = (Resolve-Path $SourceDir).Path.TrimEnd('\', '/')
    $zipStream = [System.IO.File]::Create($ZipPath)
    $archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

    try {
        $files = Get-ChildItem -Path $sourcePath -Recurse -Force | Where-Object { -not $_.PSIsContainer }
        foreach ($file in $files) {
            # Relative path within source directory
            $relativePath = $file.FullName.Substring($sourcePath.Length + 1)
            # CRITICAL FIX FOR LINUX / HOSTINGER:
            # Zip entries MUST use '/' instead of '\' so Linux doesn't treat '\' as part of the filename!
            $entryName = $relativePath.Replace('\', '/')

            $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
            $entryStream = $entry.Open()
            $fileStream = [System.IO.File]::OpenRead($file.FullName)
            try {
                $fileStream.CopyTo($entryStream)
            } finally {
                $fileStream.Dispose()
                $entryStream.Dispose()
            }
        }
    } finally {
        $archive.Dispose()
        $zipStream.Dispose()
    }
}

# 1. Package Frontend (public_html)
$frontendZip = Join-Path $deployDir "1_frontend_public_html.zip"
Write-Host "Zipping Frontend (dist) with Unix path separators -> $frontendZip..." -ForegroundColor Yellow
Compress-CleanArchive -SourceDir "$root\dist" -ZipPath $frontendZip
Write-Host "Frontend package ready!" -ForegroundColor Green

# 2. Package Backend (api)
$backendZip = Join-Path $deployDir "2_backend_api.zip"
Write-Host "Staging Backend (Laravel)..." -ForegroundColor Yellow
$stagingDir = Join-Path $deployDir "backend_temp"
if (Test-Path $stagingDir) { Remove-Item -Recurse -Force $stagingDir }
New-Item -ItemType Directory -Path $stagingDir | Out-Null

$exclude = @('.git', 'tests', 'node_modules', '.phpunit.cache')
Get-ChildItem -Path "$root\backend" | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $stagingDir -Recurse -Force
}

# Prepare production .env template in staging
$prodEnvPath = Join-Path $stagingDir ".env.hostinger.example"
@"
APP_NAME=ProfitsPatrol
APP_ENV=production
APP_KEY=base64:9vo5dSK6thXyz25zUqY/knTEfp7x9crFxi5EJWYJTN4=
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

LOG_CHANNEL=daily
LOG_LEVEL=info

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u123456789_profitspatrol
DB_USERNAME=u123456789_user
DB_PASSWORD=YourStrongPasswordHere

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Google OAuth Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
"@ | Set-Content -Path $prodEnvPath -Encoding UTF8

Write-Host "Zipping Backend with Unix path separators -> $backendZip..." -ForegroundColor Yellow
Compress-CleanArchive -SourceDir $stagingDir -ZipPath $backendZip

# Cleanup temp folder
Remove-Item -Recurse -Force $stagingDir

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " SUCCESS! Files are ready in folder: deploy_hostinger\" -ForegroundColor Green
Write-Host " 1. 1_frontend_public_html.zip" -ForegroundColor Cyan
Write-Host " 2. 2_backend_api.zip" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
