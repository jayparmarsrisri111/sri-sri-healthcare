@echo off
title Sri Sri HealthCare - Netlify 1-Click Deploy & Update
echo ====================================================================
echo    Sri Sri HealthCare AI (શ્રી શ્રી હેલ્થકેર)
echo    1-Click Live Update to https://srisrihealthcare.netlify.app
echo ====================================================================
echo.
echo [*] Opening your Netlify Site Deploys page in browser...
start https://app.netlify.com/sites/srisrihealthcare/deploys
start https://app.netlify.com/drop

timeout /t 2 /nobreak >nul

echo [*] Opening the folder with your fresh LIVE_DEPLOY_READY.zip and client\dist...
explorer.exe /select,"a:\SRI SRI ❤️ ALL AI PROJECT\LIVE_DEPLOY_READY.zip"

echo.
echo ====================================================================
echo   ગુજરાતી માર્ગદર્શન (HOW TO UPDATE IN 10 SECONDS):
echo ====================================================================
echo   ૧. તમારા બ્રાઉઝરમાં Netlify નું Deploys પેજ ખૂલ્યું હશે.
echo   ૨. તે પેજ પર નીચે લખેલું હશે:
echo      "Need to update your site? Drag and drop your site output folder here"
echo   ૩. હવે સામે ખૂલેલા ફોલ્ડરમાંથી "client\dist" ફોલ્ડર અથવા 
echo      "LIVE_DEPLOY_READY.zip" ને ખેંચીને (Drag & Drop) બ્રાઉઝર પર મૂકો.
echo   ૪. બસ! ૩ સેકન્ડમાં https://srisrihealthcare.netlify.app પર
echo      નવી અપડેટેડ એપ લાઈવ થઈ જશે!
echo ====================================================================
echo.
pause
