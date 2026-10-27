@echo off
title Sri Sri HealthCare - Apply SEO & Live Netlify Deploy
color 0A
echo ====================================================================
echo  🕉️ SRI SRI HEALTHCARE AI (શ્રી શ્રી હેલ્થકેર)
echo  🚀 INSTANT SEO ACTIVATOR & NETLIFY LIVE UPDATER
echo  🌐 Live Website: https://srisrihealthcare111.netlify.app
echo ====================================================================
echo.

echo [*] ૧. Search Engine IndexNow સબમિશન ચકાસી રહ્યું છે...
node "%~dp0scripts\submit-seo.js"

echo.
echo [*] ૨. Netlify Deploys પેજ બ્રાઉઝરમાં ખોલી રહ્યું છે...
start https://app.netlify.com/sites/srisrihealthcare111/deploys
timeout /t 2 /nobreak >nul

echo.
echo [*] ૩. Windows Explorer માં તૈયાર ફોલ્ડર ખોલી રહ્યું છે...
explorer.exe /select,"%~dp0client\dist"

echo.
echo ====================================================================
echo  🎉 SEO ૧૦૦% લાગુ થઈ ગયું છે! હવે Netlify પર Live કરવાની રીત:
echo ====================================================================
echo  ૧. તમારા બ્રાઉઝરમાં Netlify નું Deploys પેજ ખૂલ્યું હશે.
echo  ૨. તે પેજ પર નીચે સ્ક્રોલ કરો, જ્યાં લખેલું હશે:
echo     "Need to update your site? Drag and drop your site output folder here"
echo  ૩. સામે ખૂલેલા ફોલ્ડરમાંથી "dist" FOLDER ને પકડીને
echo     બ્રાઉઝરના તે બોક્સમાં મૂકો (Drag ^& Drop કરો)!
echo  ૪. માત્ર ૫ સેકન્ડમાં https://srisrihealthcare111.netlify.app પર
echo     નવું ૧૦૦% SEO સાથેનું વર્ઝન લાઈવ થઈ જશે!
echo ====================================================================
echo.
pause
