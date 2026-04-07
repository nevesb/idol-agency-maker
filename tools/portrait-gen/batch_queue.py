#!/usr/bin/env python3
"""
CG-09: Batch queue for ComfyUI portrait generation.
Supports N parallel workers, retry logic, and checkpoint saving.

Usage:
    python tools/portrait-gen/batch_queue.py --input prompts.json --output output/ --workers 2
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "tools" / "portrait-gen"))

try:
    from comfyui_runner import generate_one_image
    HAS_RUNNER = True
except ImportError:
    HAS_RUNNER = False


def load_checkpoint(path: Path) -> set[str]:
    """Load set of completed image IDs from checkpoint file."""
    if not path.exists():
        return set()
    return set(json.loads(path.read_text(encoding="utf-8")))


def save_checkpoint(path: Path, completed: set[str]) -> None:
    path.write_text(json.dumps(sorted(completed)), encoding="utf-8")


def process_item(item: dict, output_dir: Path, host: str, checkpoint: str) -> dict:
    """Process a single prompt batch item."""
    image_id = item.get("filename", item.get("id", "unknown"))
    prompt_text = item.get("positive_prompt", "")
    if not prompt_text:
        return {"id": image_id, "status": "skip", "reason": "no prompt"}

    out_path = output_dir / image_id
    if out_path.exists():
        return {"id": image_id, "status": "skip", "reason": "exists"}

    if not HAS_RUNNER:
        return {"id": image_id, "status": "fail", "reason": "comfyui_runner not available"}

    for attempt in range(3):
        try:
            generate_one_image(host, prompt_text, str(out_path), checkpoint)
            return {"id": image_id, "status": "ok"}
        except Exception as e:
            if attempt < 2:
                time.sleep(2 ** attempt)
                continue
            return {"id": image_id, "status": "fail", "reason": str(e)}

    return {"id": image_id, "status": "fail", "reason": "max retries"}


def main() -> None:
    p = argparse.ArgumentParser(description="Batch queue for ComfyUI portraits")
    p.add_argument("--input", type=Path, required=True, help="JSON array of prompt items")
    p.add_argument("--output", type=Path, default=Path("tools/portrait-gen/output/portraits"))
    p.add_argument("--workers", type=int, default=2)
    p.add_argument("--host", default=os.environ.get("COMFYUI_HOST", "http://127.0.0.1:8188"))
    p.add_argument("--checkpoint", default="animagineXL_v31.safetensors")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    items = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(items, list):
        sys.exit("Input must be JSON array")

    args.output.mkdir(parents=True, exist_ok=True)
    checkpoint_path = args.output / ".checkpoint.json"
    completed = load_checkpoint(checkpoint_path)

    pending = [i for i in items if i.get("filename", i.get("id")) not in completed]
    print(f"Total: {len(items)}, Completed: {len(completed)}, Pending: {len(pending)}")

    if args.dry_run:
        for item in pending[:5]:
            print(f"  Would process: {item.get('filename', item.get('id'))}")
        if len(pending) > 5:
            print(f"  ... and {len(pending) - 5} more")
        return

    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(process_item, item, args.output, args.host, args.checkpoint): item
            for item in pending
        }
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            if result["status"] == "ok":
                completed.add(result["id"])
                save_checkpoint(checkpoint_path, completed)
            print(f"[{len(results)}/{len(pending)}] {result['id']}: {result['status']}")

    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"\nDone: {ok}/{len(pending)} generated, {len(completed)} total completed")


if __name__ == "__main__":
    main()
