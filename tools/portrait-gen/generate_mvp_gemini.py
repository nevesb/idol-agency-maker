#!/usr/bin/env python3
"""
Gera retratos MVP das idols usando Gemini Image Generation API.
Lê portraitPromptPositive do sidecar enriquecido e gera uma imagem por idol.

Requer GEMINI_API_KEY.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

_SSL = ssl.create_default_context()
IMAGE_MODEL = "gemini-2.5-flash-image"


def generate_image(api_key: str, prompt: str, model: str = IMAGE_MODEL) -> bytes | None:
    """Call Gemini image generation and return PNG bytes."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, context=_SSL, timeout=120) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code}: {err_body[:500]}", file=sys.stderr)
        return None

    candidates = raw.get("candidates", [])
    if not candidates:
        print(f"No candidates in response", file=sys.stderr)
        return None

    parts = candidates[0].get("content", {}).get("parts", [])
    for part in parts:
        if "inlineData" in part:
            b64 = part["inlineData"].get("data", "")
            if b64:
                return base64.b64decode(b64)
    print("No image data in response parts", file=sys.stderr)
    return None


def main() -> None:
    p = argparse.ArgumentParser(description="Generate MVP idol portraits via Gemini Image")
    p.add_argument("--sidecar", type=Path, required=True, help="Enriched sidecar JSON")
    p.add_argument("--output-dir", type=Path, default=Path("tools/portrait-gen/output/portraits"))
    p.add_argument("--model", default=IMAGE_MODEL)
    p.add_argument("--sleep", type=float, default=2.0, help="Pause between API calls")
    p.add_argument("--only-id", help="Generate for a single idol id")
    p.add_argument("--skip-existing", action="store_true", help="Skip if output file exists")
    args = p.parse_args()

    sidecar = json.loads(args.sidecar.read_text(encoding="utf-8"))
    entries = sidecar.get("entries", {})
    if not entries:
        sys.exit("No entries in sidecar")

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        sys.exit("GEMINI_API_KEY not set")

    args.output_dir.mkdir(parents=True, exist_ok=True)

    items = list(entries.items())
    if args.only_id:
        items = [(k, v) for k, v in items if k == args.only_id]
        if not items:
            sys.exit(f"id not found: {args.only_id}")

    manifest: list[dict] = []
    for i, (idol_id, en) in enumerate(items):
        out_path = args.output_dir / f"char_{idol_id}_default.png"
        if args.skip_existing and out_path.exists():
            print(f"[{i+1}/{len(items)}] {idol_id} SKIP (exists)")
            manifest.append({"idolId": idol_id, "file": out_path.name, "status": "skipped"})
            continue

        prompt = en.get("portraitPromptPositive", "")
        if not prompt:
            print(f"[{i+1}/{len(items)}] {idol_id} SKIP (no prompt)")
            continue

        print(f"[{i+1}/{len(items)}] {idol_id} generating...", end=" ", flush=True)
        img_bytes = generate_image(api_key, prompt, args.model)
        if img_bytes:
            out_path.write_bytes(img_bytes)
            print(f"OK ({len(img_bytes)} bytes) -> {out_path.name}")
            manifest.append({"idolId": idol_id, "file": out_path.name, "status": "ok"})
        else:
            print("FAIL")
            manifest.append({"idolId": idol_id, "file": "", "status": "fail"})

        if i < len(items) - 1:
            time.sleep(args.sleep)

    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    ok_count = sum(1 for m in manifest if m["status"] == "ok")
    print(f"\nDone: {ok_count}/{len(items)} portraits generated -> {args.output_dir}")


if __name__ == "__main__":
    main()
