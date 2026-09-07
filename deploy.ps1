param(
    [switch]$DryRun,
    [switch]$NoBuild,
    [switch]$Scp,
    [string]$Destination = "pmeenan@plex:/var/www/blog.patrickmeenan.com/"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Step 1: Build the site unless -NoBuild is passed
if (-not $NoBuild) {
    Write-Host "Building site (npm run build)..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed with exit code $LASTEXITCODE. Aborting deployment."
        exit $LASTEXITCODE
    }
}

$distPath = Join-Path $scriptDir "dist"
if (-not (Test-Path $distPath)) {
    Write-Error "Build directory '$distPath' does not exist. Run build first."
    exit 1
}

# Step 2: Deploy to server
$hasWsl = Get-Command wsl -ErrorAction SilentlyContinue

if (-not $Scp -and $hasWsl) {
    Write-Host "Deploying to $Destination via WSL rsync..." -ForegroundColor Cyan
    $normalizedDist = ($distPath -replace '\\', '/')
    $wslDist = (wsl wslpath -u $normalizedDist).Trim()
    if (-not $wslDist.EndsWith('/')) {
        $wslDist += '/'
    }

    $rsyncArgs = @("-avz", "--delete")
    if ($DryRun) {
        Write-Host "[DRY RUN MODE]" -ForegroundColor Yellow
        $rsyncArgs += "--dry-run"
    }
    $rsyncArgs += @($wslDist, $Destination)

    wsl rsync @rsyncArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "rsync failed with exit code $LASTEXITCODE."
        exit $LASTEXITCODE
    }
} else {
    Write-Host "Deploying to $Destination via native SCP..." -ForegroundColor Cyan
    if ($DryRun) {
        Write-Host "Note: scp does not support --dry-run. Aborting." -ForegroundColor Yellow
        exit 0
    }
    # Note: scp -r copies contents but does not delete stale files on destination
    scp -r "$distPath/*" $Destination
    if ($LASTEXITCODE -ne 0) {
        Write-Error "scp failed with exit code $LASTEXITCODE."
        exit $LASTEXITCODE
    }
}

Write-Host "Deployment complete!" -ForegroundColor Green
