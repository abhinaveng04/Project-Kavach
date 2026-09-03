"""Local Sovereign Model Inference Server.
Hosts Qwen 2.5 on port 8080 with an OpenAI-compatible /v1/chat/completions endpoint.
Zero cloud egress, 100% on-premise air-gapped inference.
"""

from __future__ import annotations

import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] model.server — %(message)s")
log = logging.getLogger("model.server")

app = FastAPI(title="Kavach Sovereign Local Model Server", version="1.0.0")

_llm = None
MODEL_PATHS = [
    Path("models/ceo/qwen2.5-1.5b-instruct-q4_k_m.gguf"),
    Path("models/finalizer/qwen2.5-0.5b-instruct-q4_k_m.gguf"),
]


def get_llm():
    global _llm
    if _llm is None:
        import llama_cpp

        target_model = None
        for p in MODEL_PATHS:
            if p.is_file():
                target_model = p
                break

        if not target_model:
            log.warning("No GGUF model files found in models/. Model server will run in fallback mock mode.")
            return None

        log.info("Loading GGUF model from %s...", target_model)
        try:
            _llm = llama_cpp.Llama(
                model_path=str(target_model),
                n_ctx=8192,
                n_gpu_layers=99,  # Offload to GPU if available, else falls back to CPU automatically
                verbose=False,
            )
            log.info("GGUF model loaded successfully with 8192 context window.")
        except Exception as exc:
            log.warning("GPU offload failed (%s), loading on CPU...", exc)
            _llm = llama_cpp.Llama(
                model_path=str(target_model),
                n_ctx=8192,
                n_gpu_layers=0,
                verbose=False,
            )
            log.info("GGUF model loaded on CPU successfully with 8192 context window.")
    return _llm


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    model: Optional[str] = "qwen2.5-1.5b-instruct"
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = 512
    stream: Optional[bool] = False


@app.get("/health")
async def health():
    return JSONResponse({
        "status": "healthy",
        "model_loaded": _llm is not None or any(p.is_file() for p in MODEL_PATHS),
        "service": "kavach-model-inference",
        "port": 8080,
    })


@app.post("/v1/chat/completions")
async def chat_completions(req: ChatCompletionRequest):
    llm = get_llm()
    if llm is None:
        raise HTTPException(
            status_code=503,
            detail="Local GGUF model not found in models/ directory. Run download or place Qwen2.5 GGUF in models/.",
        )

    # Prepare message dicts for llama_cpp
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    try:
        res = llm.create_chat_completion(
            messages=messages,
            temperature=req.temperature or 0.3,
            max_tokens=req.max_tokens or 1024,
            repeat_penalty=1.15,
            frequency_penalty=0.08,
        )
        return JSONResponse(res)
    except Exception as e:
        log.error("Inference error: %s", e)
        return JSONResponse({
            "id": f"chatcmpl-err-{int(time.time())}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": req.model or "qwen2.5-1.5b-instruct",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"Inference error: {e}",
                    },
                    "finish_reason": "error",
                }
            ],
        })


def main():
    get_llm()
    uvicorn.run(app, host="127.0.0.1", port=8080, log_level="warning")


if __name__ == "__main__":
    main()
