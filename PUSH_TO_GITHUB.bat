@echo off
title Sri Sri HealthCare AI - GitHub Push Launcher
color 0A
echo ========================================================
echo   SRI SRI HEALTHCARE AI - GITHUB AUTOMATED PUSH
echo ========================================================
echo.
echo GitHub Account: jayparmarsrisri111
echo Target Repo:    https://github.com/jayparmarsrisri111/sri-sri-healthcare
echo.
echo STEP 1: If you haven't created the repository on GitHub yet,
echo open https://github.com/new and create repository name:
echo "sri-sri-healthcare" (keep it empty, no README/license).
echo.
pause
echo.
echo [1/3] Configuring Git remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/jayparmarsrisri111/sri-sri-healthcare.git

echo [2/3] Setting primary branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Project pushed to GitHub successfully!
    echo   Link: https://github.com/jayparmarsrisri111/sri-sri-healthcare
    echo ========================================================
) else (
    echo.
    echo [NOTICE] If push was rejected because repo is not created yet,
    echo please visit https://github.com/new and create it now.
)
echo.
pause
