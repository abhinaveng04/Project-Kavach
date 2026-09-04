"""Master Single-Command Launcher for Project-Kavach.
Launches:
  1. Local Model Server (llama_cpp Qwen 2.5 on :8080)
  2. Orchestrator Backend & Web UI (FastAPI on :8000)
  3. Automatically opens browser to http://localhost:8000
"""

from __future__ import annotations

import os
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0


def get_python_exe() -> str:
    venv_py = Path(__file__).parent / "venv" / "Scripts" / "python.exe"
    if venv_py.is_file():
        return str(venv_py)
    return sys.executable


def banner():
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    print(r"""
 ======================================================================
   [#] KAVACH -- Sovereign On-Premise Agentic AI Workbench
   MoPNG / MRPL (SIH26117)
 ======================================================================
   * Air-Gapped Localhost Enforcement : ACTIVE
   * Local Reasoning Engine (Qwen2.5) : http://127.0.0.1:8080
   * Sovereign Backend & Web UI       : http://127.0.0.1:8000
   * Zero Cloud Dependencies          : 100% On-Premise
 ======================================================================
    """)


def main():
    banner()
    python_exe = get_python_exe()
    procs: list[subprocess.Popen] = []

    try:
        # 1. Start Local Model Server on :8080 if not already running
        if not is_port_in_use(8080):
            print("[1/3] Starting Local Model Server (Qwen on :8080)...")
            model_proc = subprocess.Popen(
                [python_exe, "-m", "src.model_server"],
                cwd=str(Path(__file__).parent),
            )
            procs.append(model_proc)
            # Wait for port 8080 to become active
            for _ in range(30):
                if is_port_in_use(8080):
                    print("      Model server ready on port 8080.")
                    break
                time.sleep(0.5)
        else:
            print("[1/3] Port 8080 already in use (using active model server).")

        # 1b. Start Local Vision Server on :8081 if vision models are present
        vis_model = Path("models/vision/Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf")
        vis_proj = Path("models/vision/mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf")
        if vis_model.is_file() and vis_proj.is_file() and not is_port_in_use(8081):
            print("      Starting Local Vision Server (Qwen2.5-VL on :8081)...")
            vis_proc = subprocess.Popen(
                [python_exe, "-m", "src.vision_server"],
                cwd=str(Path(__file__).parent),
            )
            procs.append(vis_proc)
            for _ in range(40):
                if is_port_in_use(8081):
                    print("      Vision server ready on port 8081.")
                    break
                time.sleep(0.5)

        # 2. Schedule Browser Launch
        def open_browser():
            time.sleep(2.0)
            print("[3/3] Launching browser to http://localhost:8000 ...")
            webbrowser.open("http://localhost:8000")

        import threading
        threading.Thread(target=open_browser, daemon=True).start()

        # 3. Start Main Backend & UI Server on :8000
        print("[2/3] Starting Sovereign Workbench on http://127.0.0.1:8000...")
        backend_proc = subprocess.Popen(
            [python_exe, "-m", "uvicorn", "src.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
            cwd=str(Path(__file__).parent),
        )
        procs.append(backend_proc)

        print("\n>>> KAVACH is running! Press CTRL+C at any time to shut down.\n")
        backend_proc.wait()

    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Stopping Kavach services...")
    finally:
        for p in procs:
            try:
                p.terminate()
                p.wait(timeout=2.0)
            except Exception:
                try:
                    p.kill()
                except Exception:
                    pass
        print("[SHUTDOWN] All services stopped.")


if __name__ == "__main__":
    main()
