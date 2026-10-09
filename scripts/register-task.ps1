# Sri Sri HealthCare - Register Windows Task Scheduler for 11-10-2026 10:51 AM IST

$ErrorActionPreference = "Stop"

$taskName = "SriSri_ShubhMuhurat_SEO_Live"
$projectRoot = Split-Path -Parent $PSScriptRoot
$batPath = Join-Path $projectRoot "LAUNCH_SHUBH_MUHURAT_SEO.bat"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "SRI SRI HEALTHCARE - SCHEDULING AUTO-LIVE TASK" -ForegroundColor Yellow
Write-Host "Target Date: 11-10-2026 (Sunday)" -ForegroundColor Green
Write-Host "Target Time: 10:51:00 AM IST" -ForegroundColor Green
Write-Host "Target Script: $batPath" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan

# Remove old task if exists
try {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "[*] Cleared existing task registration if any." -ForegroundColor DarkGray
} catch {}

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$batPath`" --auto" -WorkingDirectory $projectRoot
$triggerDate = Get-Date -Year 2026 -Month 10 -Day 11 -Hour 10 -Minute 51 -Second 0
$trigger = New-ScheduledTaskTrigger -Once -At $triggerDate
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description 'Automatic Shubh Muhurat SEO and Live Deploy on 11-10-2026 10:51 AM IST' -Force

Write-Host "SUCCESS: Task '$taskName' registered successfully in Windows Task Scheduler!" -ForegroundColor Green

$registered = Get-ScheduledTask -TaskName $taskName
$taskInfo = Get-ScheduledTaskInfo -TaskName $taskName

Write-Host "`n--- Scheduled Task Details ---" -ForegroundColor Yellow
Write-Host "Task Name:     $($registered.TaskName)"
Write-Host "State:         $($registered.State)"
Write-Host "Next Run Time: $($taskInfo.NextRunTime)"
Write-Host "Action:        $($action.Execute) $($action.Argument)"
Write-Host "------------------------------`n"
