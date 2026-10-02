@echo off
title SwasthyaSetu Pro - MERN + Python AI Launcher
echo =========================================================
echo    SwasthyaSetu Pro (MERN Stack + Python AI Platform)
echo =========================================================
echo.
echo [1/3] Starting Python FastAPI AI Microservice on Port 8000...
if exist ".venv\Scripts\python.exe" (
    start cmd /k "".venv\Scripts\python.exe" ai_engine\main.py"
) else (
    start cmd /k "python ai_engine\main.py"
)

echo [2/3] Starting Express.js Backend Gateway on Port 5000...
start cmd /k "cd server && npm start"

echo [3/3] Starting React.js Frontend on Port 5173...
start cmd /k "cd client && npm run dev"

echo.
echo =========================================================
echo    All 3 Microservices Launched Successfully!
echo    React Frontend: http://localhost:5173
echo    Express Gateway: http://localhost:5000
echo    Python AI Engine: http://localhost:8000/docs
echo =========================================================
pause
