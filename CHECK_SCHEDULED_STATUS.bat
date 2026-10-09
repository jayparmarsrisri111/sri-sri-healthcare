@echo off
title Sri Sri HealthCare - Task Scheduler Status Check
color 0B
echo ====================================================================
echo  SRI SRI HEALTHCARE - WINDOWS SCHEDULED TASK STATUS CHECK
echo ====================================================================
echo.
powershell -Command "$task = Get-ScheduledTask -TaskName 'SriSri_ShubhMuhurat_SEO_Live' -ErrorAction SilentlyContinue; if ($task) { $info = Get-ScheduledTaskInfo -TaskName 'SriSri_ShubhMuhurat_SEO_Live'; Write-Host 'Task Name:      ' $task.TaskName -ForegroundColor Green; Write-Host 'Current State:  ' $task.State -ForegroundColor Green; Write-Host 'Next Run Time:  ' $info.NextRunTime -ForegroundColor Yellow; Write-Host 'Target Time:    11-10-2026 10:51:00 AM IST' -ForegroundColor Cyan; } else { Write-Host 'Task not found! Run SETUP_AUTO_LIVE_TASK.bat to schedule it.' -ForegroundColor Red; }"
echo.
echo ====================================================================
pause
