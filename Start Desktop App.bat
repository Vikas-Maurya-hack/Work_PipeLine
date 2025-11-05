@echo off
title Work Pipeline - Desktop App
color 0A

echo ====================================================
echo    Work Pipeline - Desktop App
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
    npm install
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

:: Check if we need to build
if not exist "dist" (
    echo [INFO] Building application...
    echo.
    npm run build
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Build failed
        echo.
        pause
        exit
    )
    echo.
)

:: Start the Electron app
echo ====================================================
echo  IMPORTANT: Your data is saved to Excel file at:
echo  %USERPROFILE%\Documents\WorkPipeline\leads_database.xlsx
echo ====================================================
echo.
echo [INFO] Starting Work Pipeline Desktop App...
echo This will open in a new window...
echo.
echo Keep this window open while using the app!
echo.

:: Start Vite dev server first
start /B npm run dev

:: Wait for Vite to start
timeout /t 7 /nobreak >nul

:: Start Electron
set NODE_ENV=development
npx electron .

:: When done, stop any remaining processes
echo.
echo [INFO] Cleaning up...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq*vite*" >nul 2>&1