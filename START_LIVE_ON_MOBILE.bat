@echo off
title Sri Sri HealthCare - Live Mobile & Web Launcher
echo ====================================================================
echo    Sri Sri HealthCare AI - Live Mobile & Web Launcher
echo ====================================================================
echo.

echo [*] Starting Production Web Server (Port 5000)...
start /b node server/server.js

timeout /t 2 /nobreak >nul

echo.
echo [*] Starting Cloudflare Tunnel for Worldwide Access...
echo --------------------------------------------------------------------
echo [NOTE] The tunnel is creating a live public URL.
echo        Copy the https://...trycloudflare.com URL below to open on phone!
echo --------------------------------------------------------------------
echo.

.\cloudflared.exe tunnel --url http://localhost:5000

pause
