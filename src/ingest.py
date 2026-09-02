"""
src/ingest.py — Sovereign RAG & Multimodal Ingestion Pipeline
Sovereign On-Premise Agentic AI Workbench (SIH26117 / MRPL / MoPNG)
Architecture: v5.3 locked.

Spec cross-references:
  PRD  §5      Block 2 - Ingestion pipeline: pdfplumber, density gate, Vision OCR path, ChromaDB + pid_tags
  ARCH §11     Sovereign RAG & Multimodal Ingestion
  ARCH §11.1   Density Gate + Gibberish Filter
  ARCH §11.2   Other Ingestion Decisions (Table Preservation, Citation Contract)
"""

import base64
import io
import json
import logging
import re
import sqlite3
import sys
from pathlib import Path
from typing import Any

import httpx

try:
    import chromadb
except ImportError:
    pass  # Allow py_compile to pass if chromadb is missing in this strict environment

try:
    import pdfplumber
except ImportError:
    pass

from src.density_gate import is_gibberish_or_blank

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
log = logging.getLogger("sovereign.ingest")

# ---------------------------------------------------------------------------
# Constants (ARCH §11)
# ---------------------------------------------------------------------------
VISION_URL = "http://127.0.0.1:8081"
EMBED_URL = "http://127.0.0.1:8083"
CHROMA_DB_PATH = "./chroma_db"
SQLITE_DB_PATH = "pid_tags.db"

# Chunking Budget: 1000-1200 tokens. Approximated via word counts.
# 850 words ~ 1100 tokens, 75 words ~ 100 tokens overlap.
CHUNK_WORDS = 850
OVERLAP_WORDS = 75

# ---------------------------------------------------------------------------
# Database Initialization
# ---------------------------------------------------------------------------

def init_sqlite() -> sqlite3.Connection:
    """Initialize SQLite database for PID tag bounding boxes."""
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS pid_tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_name TEXT,
            page_num INTEGER,
            tag TEXT,
            bbox TEXT,
            thumbnail BLOB
        )
    ''')
    conn.commit()
    return conn

# ---------------------------------------------------------------------------
# Chunking & Embeddings
# ---------------------------------------------------------------------------

def chunk_text(text: str) -> list[str]:
    """Chunk into windows of 1000-1200 tokens with an overlap of 100 tokens."""
    words = text.split()
    chunks = []
    if not words:
        return []
        
    start = 0
    while start < len(words):
        end = start + CHUNK_WORDS
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end >= len(words):
            break
        start += (CHUNK_WORDS - OVERLAP_WORDS)
    return chunks

def extract_section(text: str) -> str:
    """Attempt to extract section header (e.g. 1.2, 4.0) for citation metadata."""
    m = re.search(r'(?:^|\n)§?\s*(\d+\.\d+)', text)
    return m.group(1) if m else "1.0"

def get_embedding(text: str) -> list[float]:
    """Generate embedding using nomic-embed-text-v1.5 served at port 8083."""
    resp = httpx.post(
        f"{EMBED_URL}/v1/embeddings",
        json={"model": "nomic-embed-text-v1.5", "input": text},
        timeout=15.0
    )
    resp.raise_for_status()
    return resp.json()["data"][0]["embedding"]

def store_in_chroma(chunks: list[str], doc_name: str, page_num: int):
    """Store chunks in ChromaDB with metadata for SOP-REF citation contract."""
    if not chunks:
        return
        
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    collection = client.get_or_create_collection("sovereign_rag")
    
    ids = []
    embeddings = []
    metadatas = []
    documents = []
    
    for i, chunk in enumerate(chunks):
        section = extract_section(chunk)
        citation = f"[SOP-REF §{section} p.{page_num}]"
        
        ids.append(f"{doc_name}_p{page_num}_{i}")
        embeddings.append(get_embedding(chunk))
        metadatas.append({
            "doc_name": doc_name,
            "page_num": page_num,
            "section": section,
            "citation": citation
        })
        documents.append(chunk)
        
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents
    )
    log.info("[CHROMA] Stored %d chunks for %s page %d", len(chunks), doc_name, page_num)

# ---------------------------------------------------------------------------
# Multimodal Extraction (Tables & Vision OCR)
# ---------------------------------------------------------------------------

def extract_page_content(page: Any) -> str:
    """
    Extract tables from PDF pages and convert them to intact Markdown table 
    blocks BEFORE extracting surrounding narrative text (ARCH §11.2).
    """
    tables = page.find_tables()
    md_blocks = []
    
    def not_in_table(obj: dict) -> bool:
        """Filter out text objects that fall inside any table's bounding box."""
        if 'top' not in obj or 'bottom' not in obj or 'x0' not in obj or 'x1' not in obj:
            return True
        cx = (obj['x0'] + obj['x1']) / 2
        cy = (obj['top'] + obj['bottom']) / 2
        
        for t in tables:
            if (t.bbox[0] <= cx <= t.bbox[2]) and (t.bbox[1] <= cy <= t.bbox[3]):
                return False
        return True
    
    # Process tables into Markdown
    for table in tables:
        data = table.extract()
        if not data: 
            continue
        md = []
        for i, row in enumerate(data):
            cleaned = [str(cell).replace('\n', ' ').strip() if cell else "" for cell in row]
            md.append("| " + " | ".join(cleaned) + " |")
            if i == 0:
                md.append("|" + "|".join(["---"] * len(cleaned)) + "|")
        md_blocks.append("\n".join(md))
        
    # Process narrative text avoiding table regions
    text_page = page.filter(not_in_table)
    narrative = text_page.extract_text() or ""
    
    content = ""
    if md_blocks:
        content += "\n\n".join(md_blocks) + "\n\n"
    content += narrative
    
    return content.strip()

def process_vision_ocr(page: Any, doc_name: str, conn: sqlite3.Connection):
    """
    Rasterize blank/scanned/gibberish pages and send to Vision model on :8081.
    Persist P&ID equipment tags and bounding boxes to SQLite `pid_tags`.
    """
    page_num = page.page_number
    log.info("[VISION] Rasterizing %s page %d for Vision OCR", doc_name, page_num)
    
    img = page.to_image(resolution=150).original
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    raw_img = img_bytes.getvalue()
    b64 = base64.b64encode(raw_img).decode("utf-8")
    
    payload = {
        "model": "qwen2.5-vl-3b",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
                    {
                        "type": "text", 
                        "text": "Extract all equipment tags and bounding boxes from this P&ID diagram. Return JSON: {\"tags\": [str], \"bboxes\": [[x,y,w,h]]}"
                    }
                ]
            }
        ],
        "max_tokens": 512,
        "temperature": 0.0
    }
    
    try:
        resp = httpx.post(f"{VISION_URL}/v1/chat/completions", json=payload, timeout=45.0)
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        
        # Parse JSON from response
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            data = json.loads(content[start_idx:end_idx+1])
            tags = data.get("tags", [])
            bboxes = data.get("bboxes", [])
            
            for i, tag in enumerate(tags):
                bbox_str = json.dumps(bboxes[i]) if i < len(bboxes) else "[]"
                conn.execute(
                    "INSERT INTO pid_tags (doc_name, page_num, tag, bbox, thumbnail) VALUES (?, ?, ?, ?, ?)",
                    (doc_name, page_num, tag, bbox_str, raw_img)
                )
            conn.commit()
            log.info("[VISION] Extracted %d tags from %s page %d", len(tags), doc_name, page_num)
        else:
            log.warning("[VISION] Failed to parse JSON from Vision model response.")
            
    except Exception as exc:
        log.error("[VISION] Vision OCR failed on %s page %d: %s", doc_name, page_num, exc)

# ---------------------------------------------------------------------------
# Pipeline Entry Point
# ---------------------------------------------------------------------------

def ingest_pdf(file_path: Path | str) -> None:
    """
    Main ingestion pipeline.
    1. Reads PDF via pdfplumber.
    2. Runs density/gibberish gate on each page's raw text.
    3. Low density -> Rasterize -> Vision model -> SQLite pid_tags.
    4. Clean text -> Markdown tables + Narrative -> Chunking -> ChromaDB.
    """
    path = Path(file_path)
    if not path.is_file():
        log.error("File not found: %s", path)
        return
        
    doc_name = path.name
    conn = init_sqlite()
    
    try:
        with pdfplumber.open(str(path)) as pdf:
            for page in pdf.pages:
                raw_text = page.extract_text() or ""
                
                # ARCH §11.1 Density Gate + Gibberish Filter
                if is_gibberish_or_blank(raw_text):
                    process_vision_ocr(page, doc_name, conn)
                else:
                    # ARCH §11.2 Table extraction first
                    page_content = extract_page_content(page)
                    
                    if page_content.strip():
                        chunks = chunk_text(page_content)
                        store_in_chroma(chunks, doc_name, page.page_number)
    except Exception as exc:
        log.error("[INGEST] Pipeline failed for %s: %s", doc_name, exc)
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ingest_pdf(sys.argv[1])
    else:
        print("Usage: python -m src.ingest <path_to_pdf>")
