@echo off
title Sri Sri HealthCare - Register Windows Auto-Live Task
color 0E
echo ====================================================================
echo  🕉️ SRI SRI HEALTHCARE - SETUP WINDOWS TASK SCHEDULER
echo  📅 Scheduled Date: 11-10-2026 (Sunday)
echo  ⏰ Scheduled Time: 10:51:00 AM IST
echo ====================================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\register-task.ps1"
echo.
echo ====================================================================
echo  Your task is now permanently scheduled in Windows Task Scheduler!
echo  Even if this window is closed, Windows will run it at 10:51 AM!
echo ====================================================================
pause
