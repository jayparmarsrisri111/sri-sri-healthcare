@echo off
title Sri Sri HealthCare - 1-Click Netlify Deploy
color 0A
echo ====================================================================
echo    Sri Sri HealthCare AI - Netlify Deployment Helper
echo ====================================================================
echo.
echo [*] Step 1: Opening Netlify Deploys Page in your browser...
start https://app.netlify.com/sites/srisrihealthcare/deploys

timeout /t 2 /nobreak >nul

echo [*] Step 2: Opening your built "client" folder in Windows Explorer...
explorer.exe /select,"a:\SRI SRI ❤️ ALL AI PROJECT\client\dist"

echo.
echo ====================================================================
echo  NETLIFY DEPLOY MARG-DARSHIKA (Step-by-Step Guide):
echo ====================================================================
echo  NOTE: Netlify ma ZIP file drag-drop nathi thavaano option aavto!
echo  Netlify ma "dist" FOLDER drag-drop karvanu hoy che!
echo.
echo  1. Tamari browser ma Netlify nu "Deploys" page khuliyu hase.
echo  2. Te page ma CHEK NICHE (Scroll to the bottom) jav.
echo  3. Tya ek dotted box dekhase:
echo     "Need to update your site? Drag and drop your site output folder here"
echo  4. Tamara computer ma je "client" folder khuliyu che,
echo     te mathi "dist" FOLDER ne paki ne browser na te box ma DROP karo!
echo  5. Matra 10 second ma https://srisrihealthcare.netlify.app update thai jase!
echo ====================================================================
echo.
pause
