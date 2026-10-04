@echo off
title Sri Sri HealthCare - Update Live Netlify App
echo ====================================================================
echo    Sri Sri HealthCare AI (શ્રી શ્રી હેલ્થકેર)
echo    Update: https://srisrihealthcare.netlify.app
echo ====================================================================
echo.
echo [*] Opening Netlify Deploys page in browser...
start https://app.netlify.com/sites/srisrihealthcare/deploys

timeout /t 2 /nobreak >nul

echo [*] Opening folder containing client\dist and LIVE_DEPLOY_READY.zip...
explorer.exe /select,"a:\SRI SRI ❤️ ALL AI PROJECT\LIVE_DEPLOY_READY.zip"

echo.
echo ====================================================================
echo  પગલાં (Simple Steps):
echo ====================================================================
echo  1. બ્રાઉઝરમાં Netlify Deploys પેજ પર જાઓ.
echo  2. "Drag and drop your site output folder here" વાળા બોક્સમાં
echo     "client\dist" ફોલ્ડર અથવા "LIVE_DEPLOY_READY.zip" મૂકો.
echo  3. તરત જ https://srisrihealthcare.netlify.app અપડેટ થઈ જશે!
echo ====================================================================
echo.
pause
