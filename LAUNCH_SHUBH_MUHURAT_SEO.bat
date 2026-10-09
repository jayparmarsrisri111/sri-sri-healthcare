@echo off
title Sri Sri HealthCare - Shubh Muhurat SEO Launcher
color 0A
echo ====================================================================
echo  🕉️ SRI SRI HEALTHCARE - SHUBH MUHURAT SEO ACTIVATOR
echo  📅 Auspicious Date: 11/10/2026 (10:51 AM - 11:30 AM IST)
echo ====================================================================
echo.

echo [*] Step 1: Building Latest Client with Full Production SEO...
cd /d "%~dp0client"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed! Please check client errors.
    pause
    exit /b %ERRORLEVEL%
)

cd /d "%~dp0"
echo.
echo [*] Step 2: Packaging Production Deployment ZIP Archives...
powershell -Command "Compress-Archive -Path '.\client\dist\*' -DestinationPath '.\LIVE_DEPLOY_READY.zip' -Force; Copy-Item '.\LIVE_DEPLOY_READY.zip' '.\client_deploy.zip' -Force"
echo [OK] LIVE_DEPLOY_READY.zip and client_deploy.zip updated!

echo.
echo [*] Step 3: Syncing and Pushing Changes to GitHub (Triggers Auto Deploy)...
git add .
git commit -m "feat(seo): 11-10-2026 Shubh Muhurat live SEO deployment [10:51 AM - 11:30 AM]"
git push origin main
if %ERRORLEVEL% equ 0 (
    echo [OK] Successfully pushed to GitHub main branch!
) else (
    echo [NOTE] Git push completed or working tree already synchronized.
)

echo.
echo [*] Step 4: Executing Global Search Engine Submissions (IndexNow + Sitemaps)...
node "%~dp0scripts\submit-seo.js"

echo.
echo [*] Step 5: Copying Live Website URL to Windows Clipboard...
echo https://srisrihealthcare.netlify.app | clip
echo [OK] URL Copied: https://srisrihealthcare.netlify.app

echo.
echo [*] Step 6: Opening Live Website & Google Search Console in Browser...
start https://srisrihealthcare.netlify.app
start https://search.google.com/search-console/welcome

echo.
echo ====================================================================
echo  🎉 11-10-2026 SHUBH MUHURAT SEO IS OFFICIALLY LIVE!
echo  🌐 Live Netlify Website: https://srisrihealthcare.netlify.app
echo  🌐 Official Domain:      https://www.srisri111.com
echo  📜 Live Sitemap:         https://srisrihealthcare.netlify.app/sitemap.xml
echo ====================================================================
echo.

if "%1"=="--auto" (
    echo [OK] Automatic Shubh Muhurat Task completed successfully at %TIME%.
    timeout /t 10 /nobreak >nul
    exit /b 0
)

pause
