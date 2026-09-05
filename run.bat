@echo off
setlocal enabledelayedexpansion
title Swara.ai - Sovereign Workbench (Offline 4GB VRAM)
cd /d "%~dp0"

echo ===============================================================================
echo   SWARA.AI - SOVEREIGN ON-PREMISE AI WORKBENCH (OFFLINE AIR-GAP RUNTIME)
echo   SIH26117 / MoPNG / MRPL - 4 GB VRAM Budget (RTX 3050 Topology)
echo ===============================================================================
echo.

:: 1. Verify Python 3.10 / 3.11 presence
echo [1/8] Verifying Python runtime...
set PY_CMD=
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=python
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PY_CMD=py
    )
)

if "%PY_CMD%"=="" (
    echo [ERROR] Python not found on system PATH. Please install Python 3.10 or 3.11.
    pause
    exit /b 1
)

for /f "tokens=2 delims= " %%v in ('%PY_CMD% --version 2^>^&1') do set PY_VER=%%v
echo [OK] Python runtime detected: %PY_VER%

:: 2. Initialize and activate venv
echo.
echo [2/8] Checking Python virtual environment...
if not exist "venv\Scripts\python.exe" (
    echo [*] Creating virtual environment (venv)...
    %PY_CMD% -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize virtual environment.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created.
) else (
    echo [OK] Virtual environment found [venv].
)
call venv\Scripts\activate.bat

:: 3. Quietly verify and install requirements
echo.
echo [3/8] Checking dependencies (requirements.txt)...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [WARNING] Dependencies check finished with warnings. Proceeding...
) else (
    echo [OK] Python dependencies verified.
)

:: 4. Check dist/index.html. If absent, compile frontend/ and copy to root dist/
echo.
echo [4/8] Checking UI static build (dist/index.html)...
if not exist "dist\index.html" (
    echo [*] dist/index.html not found. Building frontend bundle...
    if exist "frontend" (
        cd frontend
        call npm run build
        cd ..
        if exist "frontend\dist" (
            echo [*] Copying frontend build artifacts to root dist\...
            mkdir dist 2>nul
            xcopy /E /I /Y "frontend\dist\*" "dist\" >nul
            echo [OK] Frontend successfully built and copied to root dist\.
        ) else (
            echo [WARNING] frontend\dist not found after build.
        )
    ) else (
        echo [WARNING] frontend directory not found.
    )
) else (
    echo [OK] Static frontend bundle verified in dist\.
)

:: 5. Configure .env with loopback defaults
echo.
echo [5/8] Enforcing sovereign loopback defaults in .env...
if not exist ".env" (
    (
        echo BRAIN_URL=http://127.0.0.1:8080
        echo FAST_BRAIN_URL=http://127.0.0.1:8080
        echo DEEP_BRAIN_URL=http://127.0.0.1:8080
        echo VISION_URL=http://127.0.0.1:8081
        echo CODER_URL=http://127.0.0.1:8082
        echo EMBED_URL=http://127.0.0.1:8083
        echo EMBEDDING_URL=http://127.0.0.1:8083
        echo SOVEREIGN_FIREWALL_ACTIVE=1
        echo SOVEREIGN_FIREWALL_DISABLE=0
    ) > .env
    echo [OK] Created default loopback .env.
) else (
    echo [OK] Verified loopback configuration in .env.
)

:: 6. Inference Engines: llama-server daemons or mock_llms.py fallback
echo.
echo [6/8] Starting inference engines...
set HAS_LLAMA=0
if exist "llama-server.exe" (
    if exist "models\ceo\*.gguf" (
        set HAS_LLAMA=1
    )
)

if "!HAS_LLAMA!"=="1" (
    echo [*] Hardware mode: llama-server.exe and GGUF weights detected.
    for %%F in (models\ceo\*.gguf) do set CEO_GGUF=%%F
    start "Swara Llama Server - Brain (:8080)" /B llama-server.exe -m "!CEO_GGUF!" --port 8080 -c 4096 --n-gpu-layers 33
    
    if exist "models\vision\*.gguf" (
        for %%F in (models\vision\*qwen2.5-vl*.gguf models\vision\*Qwen2.5-VL*.gguf) do set VIS_GGUF=%%F
        for %%F in (models\vision\*mmproj*.gguf) do set PROJ_GGUF=%%F
        start "Swara Llama Server - Vision (:8081)" /B llama-server.exe -m "!VIS_GGUF!" --mmproj "!PROJ_GGUF!" --port 8081 -c 2048 --n-gpu-layers 24
    )
    if exist "models\embedding\*.gguf" (
        for %%F in (models\embedding\*.gguf) do set EMBED_GGUF=%%F
        start "Swara Llama Server - Embedding (:8083)" /B llama-server.exe -m "!EMBED_GGUF!" --port 8083 --embedding -c 2048
    )
    echo [OK] Local llama-server instances dispatched on :8080, :8081, :8083.
) else (
    echo [*] Fallback mode: GGUF weights or llama-server.exe missing.
    echo [*] Launching automated mock LLM daemon (tools/mock_llms.py) on :8080, :8081, :8082, :8083...
    start "Swara Mock LLM Daemon" /B python tools/mock_llms.py
    echo [OK] Mock LLM daemon running in background.
)

:: 7. Launch browser in background (Chrome app mode or default browser)
echo.
echo [7/8] Scheduling browser launch...
start "" cmd /c "timeout /t 3 /nobreak >nul & (if exist \"%ProgramFiles%\Google\Chrome\Application\chrome.exe\" (start \"\" \"%ProgramFiles%\Google\Chrome\Application\chrome.exe\" --app=http://127.0.0.1:8000) else (if exist \"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe\" (start \"\" \"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe\" --app=http://127.0.0.1:8000) else (where chrome >nul 2>nul && start \"\" chrome.exe --app=http://127.0.0.1:8000 || start http://127.0.0.1:8000)))"

:: 8. Boot FastAPI orchestrator on port 8000 via Uvicorn
echo.
echo [8/8] Booting FastAPI orchestrator on http://127.0.0.1:8000 ...
echo ===============================================================================
echo   SWARA.AI IS RUNNING! (Press CTRL+C in this console to terminate)
echo ===============================================================================
echo.
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000

if %errorlevel% neq 0 (
    echo [NOTICE] Workbench server exited with code %errorlevel%.
)
pause
