# Sri Sri HealthCare - Auto Live Shubh Muhurat Scheduler & Countdown Engine
# Target: 11-10-2026 10:51:00 AM to 11:30:00 AM IST

$Host.UI.RawUI.WindowTitle = "Sri Sri HealthCare - Shubh Muhurat 11-10-2026 Auto-Scheduler"
$targetStart = Get-Date -Year 2026 -Month 10 -Day 11 -Hour 10 -Minute 51 -Second 0
$targetEnd   = Get-Date -Year 2026 -Month 10 -Day 11 -Hour 11 -Minute 30 -Second 0

$projectRoot = Split-Path -Parent $PSScriptRoot
$batPath = Join-Path $projectRoot "LAUNCH_SHUBH_MUHURAT_SEO.bat"

function Execute-LiveLaunch {
    Write-Host "`n====================================================================" -ForegroundColor Green
    Write-Host "🚀 SHUBH MUHURAT WINDOW ACTIVATED! COMMENCING AUTOMATIC LIVE LAUNCH!" -ForegroundColor Yellow
    Write-Host "⏰ Execution Time: $((Get-Date).ToString('dd-MM-yyyy HH:mm:ss'))" -ForegroundColor White
    Write-Host "====================================================================`n" -ForegroundColor Green

    Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$batPath`" --auto" -WorkingDirectory $projectRoot -Wait
    
    Write-Host "`n🎉 AUTOMATIC LIVE LAUNCH COMPLETED SUCCESSFULLY!" -ForegroundColor Cyan
    Write-Host "Website: https://srisrihealthcare.netlify.app" -ForegroundColor White
}

Clear-Host
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "🕉️ SRI SRI HEALTHCARE - AUTOMATIC SHUBH MUHURAT LAUNCH MONITOR" -ForegroundColor Yellow
Write-Host "📅 Auspicious Date: 11-10-2026 (Sunday)" -ForegroundColor Green
Write-Host "⏰ Auspicious Window: 10:51 AM to 11:30 AM IST" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan

$now = Get-Date

# Check if we are currently inside the Shubh Muhurat window
if ($now -ge $targetStart -and $now -le $targetEnd) {
    Write-Host "`n✨ Current time is within the Shubh Muhurat Window (10:51 AM - 11:30 AM)!" -ForegroundColor Green
    Execute-LiveLaunch
    exit 0
}

if ($now -gt $targetEnd) {
    Write-Host "`n⚠️ Notice: 11-10-2026 11:30 AM window has already elapsed." -ForegroundColor Yellow
    Write-Host "Would you like to trigger Live Launch now anyway? (Y/N)" -ForegroundColor White
    $ans = Read-Host
    if ($ans -eq "Y" -or $ans -eq "y") {
        Execute-LiveLaunch
    }
    exit 0
}

Write-Host "`n⏳ Auto-Scheduler is ACTIVE in background." -ForegroundColor White
Write-Host "Will automatically deploy & activate SEO at 10:51:00 AM on 11-10-2026." -ForegroundColor Cyan
Write-Host "Press [T] to Test Run Immediately, or [Ctrl+C] to exit.`n" -ForegroundColor DarkGray

while ($true) {
    $current = Get-Date
    if ($current -ge $targetStart) {
        Execute-LiveLaunch
        break
    }

    $diff = $targetStart - $current
    $timeStr = "{0:D2}d {1:D2}h {2:D2}m {3:D2}s" -f $diff.Days, $diff.Hours, $diff.Minutes, $diff.Seconds
    
    Write-Host -NoNewline "`r⏰ Current Time: $($current.ToString('dd-MM-yyyy HH:mm:ss')) | Countdown to Live: $timeStr  "
    
    if ([Console]::KeyAvailable) {
        $key = [Console]::ReadKey($true)
        if ($key.Key -eq 'T') {
            Write-Host "`n`n[*] Test mode triggered by user..." -ForegroundColor Yellow
            Execute-LiveLaunch
            break
        }
    }

    Start-Sleep -Seconds 1
}
