"""
src/sandbox_runner.py — Hardened Docker Code Sandbox Execution
Sovereign On-Premise Agentic AI Workbench (SIH26117 / MRPL / MoPNG)
Architecture: v5.3 locked. Reference: Dev_guide.md Section 3.
"""

import os
import shutil
import tempfile
import logging

try:
    import docker
except ImportError:
    docker = None

log = logging.getLogger("sovereign.sandbox")


def run_code(code: str, timeout: int = 45) -> dict:
    """
    Execute python script inside locked sovereign-sandbox:1.0 container.
    Security parameters:
      - network_mode="none" (Zero external socket escape)
      - mem_limit="2g", timeout=45s
      - security_opt=["no-new-privileges"], cap_drop=["ALL"]
      - tmpfs={"/tmp/job/out": "rw,noexec,nosuid"} (Headless Chart Export)
    """
    if docker is None:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Docker SDK not installed in python environment.",
            "images": []
        }

    try:
        client = docker.from_env()
        client.ping()
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Docker daemon unavailable: {str(e)}",
            "images": []
        }

    job_dir = tempfile.mkdtemp(prefix="swara_sandbox_")
    out_dir = os.path.join(job_dir, "out")
    os.makedirs(out_dir, exist_ok=True)
    script_path = os.path.join(job_dir, "script.py")

    injected_code = (
        "import matplotlib\n"
        "matplotlib.use('Agg')\n"
        "import matplotlib.pyplot as plt\n"
        + code
    )

    with open(script_path, "w", encoding="utf-8") as f:
        f.write(injected_code)

    container = None
    try:
        container = client.containers.run(
            image="sovereign-sandbox:1.0",
            command="python -u /tmp/job/script.py",
            network_mode="none",
            mem_limit="2g",
            security_opt=["no-new-privileges"],
            cap_drop=["ALL"],
            volumes={job_dir: {"bind": "/tmp/job", "mode": "rw"}},
            tmpfs={"/tmp/job/out": "rw,noexec,nosuid"},
            detach=True,
            user="1000:1000"
        )

        result = container.wait(timeout=timeout)
        exit_code = result.get("StatusCode", 1)
        stdout = container.logs(stdout=True, stderr=False).decode("utf-8")
        stderr = container.logs(stdout=False, stderr=True).decode("utf-8")

        generated_charts = []
        os.makedirs("artifacts", exist_ok=True)
        if os.path.exists(out_dir):
            for filename in os.listdir(out_dir):
                if filename.endswith(".png"):
                    dest = os.path.abspath(f"artifacts/{filename}")
                    shutil.copyfile(os.path.join(out_dir, filename), dest)
                    generated_charts.append(dest)

        return {
            "success": exit_code == 0,
            "stdout": stdout,
            "stderr": stderr,
            "images": generated_charts
        }
    except Exception as ex:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Sandbox execution failure: {str(ex)}",
            "images": []
        }
    finally:
        if container:
            try:
                container.remove(force=True)
            except Exception:
                pass
        shutil.rmtree(job_dir, ignore_errors=True)
