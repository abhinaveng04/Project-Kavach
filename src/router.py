import re

CALC_RE = re.compile(r"\b(calculate|compute|trend|rate|delta)\b", re.I)

def route_l1(mimes, names, prompt, page_outcome):
    """Deterministic fast-path (< 5 ms). Returns (specialist, trace)."""
    if any(m.startswith("image/") for m in mimes):
        return "vision", "L1 MIME image/* -> Vision"
    if any(n.lower().endswith((".xlsx", ".csv")) for n in names):
        return "coder", "L1 MIME spreadsheet -> Coder"
    if CALC_RE.search(prompt):
        return "coder", "L1 regex math-intent -> Coder"
    if page_outcome in ("blank", "scanned", "gibberish"):
        return "vision", "L1 density/gibberish -> Vision OCR"
    return None, "L1 no-match -> L2"

def route_l2(prompt, brain_client):
    """Brain-7B constrained JSON judge (temperature 0, max_tokens 64, < 1500 ms)."""
    decision = brain_client.chat(
        prompt=prompt, temperature=0.0, max_tokens=64,
        response_schema={"specialist": ["vision", "rag", "coder", "brain"]},
    )
    return decision["specialist"], f"L2 Brain-7B judge -> {decision['specialist']}"
