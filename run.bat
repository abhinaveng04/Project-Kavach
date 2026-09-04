@echo off
chcp 65001 >nul
title Swara.ai - Sovereign Workbench
cd /d "%~dp0"

echo ======================================================================
echo   Swara.ai - Sovereign On-Premise AI Workbench
echo   MoPNG / MRPL (SIH26117)
echo ======================================================================
echo.

REM 1. Check or Create Virtual Environment
if not exist "venv\Scripts\python.exe" (
    echo [1/3] Virtual environment not found. Initializing venv...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Ensure Python 3.10+ is on PATH.
        pause
        exit /b 1
    )
    echo [1/3] Virtual environment initialized.
) else (
    echo [1/3] Virtual environment detected [venv].
)

REM 2. Verify and Install Requirements
echo.
echo [2/3] Checking and installing dependencies from requirements.txt...
venv\Scripts\python.exe -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo [WARNING] Dependencies check finished with warnings. Proceeding to launch...
) else (
    echo [2/3] Dependencies verified.
)

REM 3. Launch System
echo.
echo [3/3] Starting Swara.ai Sovereign Engine...
venv\Scripts\python.exe run.py

if errorlevel 1 (
    echo.
    echo [NOTICE] Process exited with code %errorlevel%.
)
echo.
pause
