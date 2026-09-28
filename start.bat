@echo off
title Campus Event Management System (CEMS)
echo ========================================================
echo   Campus Event Management System (CEMS) - Quick Start
echo ========================================================
echo.

echo [1/3] Starting Backend Server on http://localhost:5000...
start "CEMS - Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Client on http://localhost:5173...
start "CEMS - Frontend Client" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Launching your default web browser...
start http://localhost:5173

echo.
echo ========================================================
echo   Application is now running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000/api/v1/health
echo ========================================================
echo   Keep the two opened terminal windows running.
echo   Press any key in this window to exit this launcher.
pause >nul
