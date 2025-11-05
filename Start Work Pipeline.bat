@echo off
title Work Pipeline - Lead Management System
color 0A

echo ====================================================
echo    Work Pipeline - Lead Management System
echo ====================================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo After installation, restart your computer and run this file again.
    echo.
    pause
    exit
)

echo [OK] Node.js found
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] First-time setup: Installing dependencies...
    echo This will take 2-3 minutes. Please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies
        echo.
        pause
        exit
    )
    echo.
    echo [OK] Dependencies installed!
    echo.
)

:: Start the application
echo [INFO] Starting Work Pipeline...
echo.
echo Your data is automatically saved in the browser
echo To export to Excel: Click the "Export" button in the app
echo.
echo Browser will open at: http://localhost:8080
echo.
echo ====================================================
echo   IMPORTANT: Keep this window open while using the app
echo   To stop: Close this window or press Ctrl+C
echo ====================================================
echo.

:: Wait a moment then open browser
timeout /t 3 /nobreak >nul
start http://localhost:8080

:: Start the dev server (this keeps running)
npm run dev