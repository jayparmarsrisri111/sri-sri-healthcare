@echo off
title Sri Sri HealthCare - Shubh Muhurat SEO Launcher
echo ====================================================================
echo  🕉️ SRI SRI HEALTHCARE - SHUBH MUHURAT SEO ACTIVATOR
echo  📅 Auspicious Date: 11/10/2026 (10:40 AM - 12:08 PM IST)
echo ====================================================================
echo.

echo [*] Copying Live Netlify Website URL to Windows Clipboard...
echo https://srisrihealthcare.netlify.app | clip
echo [OK] URL Copied: https://srisrihealthcare.netlify.app
echo.

echo [*] Executing Search Engine IndexNow + Sitemap API Submissions...
node "%~dp0scripts\submit-seo.js"

echo.
echo [*] Opening Google Search Console in Default Browser...
start https://search.google.com/search-console/welcome

echo.
echo ====================================================================
echo  🎉 SHUBH MUHURAT SEO SUCCESSFULLY APPLIED!
echo  Your Live Site: https://srisrihealthcare.netlify.app
echo  Sitemap URL:    https://srisrihealthcare.netlify.app/sitemap.xml
echo ====================================================================
echo.

if "%1"=="--auto" (
    echo [OK] Automatic Shubh Muhurat task completed successfully.
    timeout /t 5 /nobreak >nul
    exit /b 0
)

pause
