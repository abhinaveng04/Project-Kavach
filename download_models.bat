@echo off
setlocal enabledelayedexpansion
title Model Download Suite - 4GB VRAM Topology (RTX 3050)
cd /d "%~dp0"

echo ===============================================================================
echo   DOWNLOADING OFFLINE MODEL ARTIFACTS FOR RTX 3050 (4 GB VRAM BUDGET)
echo ===============================================================================

mkdir models\ceo models\vision models\embedding 2>nul

:: 1. CEO / Brain Model: Qwen3-1.7B (or Qwen2.5-1.5B Instruct Q4_K_M ~1.15 GB)
if not exist "models\ceo\qwen3-1.7b-instruct-q4_k_m.gguf" (
    echo [*] Downloading CEO / Brain Model (Qwen3-1.7B Q4_K_M)...
    curl -L -o "models\ceo\qwen3-1.7b-instruct-q4_k_m.gguf" "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf"
) else (
    echo [OK] CEO Model already present in models\ceo\.
)

:: 2. Vision Model: Qwen2.5-VL-3B Instruct Q4_K_M (~1.65 GB)
if not exist "models\vision\qwen2.5-vl-3b-instruct-q4_k_m.gguf" (
    echo [*] Downloading Vision Specialist Model (Qwen2.5-VL-3B)...
    curl -L -o "models\vision\qwen2.5-vl-3b-instruct-q4_k_m.gguf" "https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct-GGUF/resolve/main/qwen2.5-vl-3b-instruct-q4_k_m.gguf"
) else (
    echo [OK] Vision Model already present in models\vision\.
)

:: 3. Multimodal Projector: mmproj-qwen2.5-vl-3b-f16.gguf (~0.4 GB)
if not exist "models\vision\mmproj-qwen2.5-vl-3b-f16.gguf" (
    echo [*] Downloading Multimodal Projector (mmproj)...
    curl -L -o "models\vision\mmproj-qwen2.5-vl-3b-f16.gguf" "https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct-GGUF/resolve/main/mmproj-qwen2.5-vl-3b-f16.gguf"
) else (
    echo [OK] Multimodal Projector already present in models\vision\.
)

:: 4. ChromaDB Embeddings Model: nomic-embed-text-v1.5 Q8_0 (~0.28 GB, runs on CPU)
if not exist "models\embedding\nomic-embed-text-v1.5.Q8_0.gguf" (
    echo [*] Downloading Embedding Model (nomic-embed-text-v1.5)...
    curl -L -o "models\embedding\nomic-embed-text-v1.5.Q8_0.gguf" "https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/nomic-embed-text-v1.5.Q8_0.gguf"
) else (
    echo [OK] Embedding Model already present in models\embedding\.
)

echo ===============================================================================
echo [SUCCESS] Model suite ready for offline GPU execution.
echo ===============================================================================
pause
