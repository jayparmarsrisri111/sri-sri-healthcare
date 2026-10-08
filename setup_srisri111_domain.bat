@echo off
:: Sri Sri HealthCare - Local Custom Domain Setup for www.srisri111.com
:: Must be run as Administrator
title Sri Sri HealthCare Domain Setup (www.srisri111.com)

echo =====================================================================
echo    Sri Sri HealthCare AI - Local Domain Activator
echo =====================================================================
echo.

:: Check Admin Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run this file as ADMINISTRATOR!
    echo Right-click on this file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

set HOSTS_FILE=%SystemRoot%\System32\drivers\etc\hosts

:: Check if entry already exists
findstr /i "srisri111.com" "%HOSTS_FILE%" >nul
if %errorLevel% equ 0 (
    echo [OK] www.srisri111.com is ALREADY configured in your hosts file!
) else (
    echo [INFO] Mapping www.srisri111.com to local healthcare engine...
    echo. >> "%HOSTS_FILE%"
    echo # Sri Sri HealthCare Local Domain Mapping >> "%HOSTS_FILE%"
    echo 127.0.0.1 www.srisri111.com >> "%HOSTS_FILE%"
    echo 127.0.0.1 srisri111.com >> "%HOSTS_FILE%"
    echo [SUCCESS] Successfully added www.srisri111.com to Windows hosts file!
)

echo [INFO] Flushing Windows DNS Cache...
ipconfig /flushdns >nul

echo.
echo =====================================================================
echo    CONGRATULATIONS! www.srisri111.com IS NOW LIVE ON YOUR PC!
echo    Opening http://www.srisri111.com in your default browser...
echo =====================================================================
echo.

start http://www.srisri111.com

pause
