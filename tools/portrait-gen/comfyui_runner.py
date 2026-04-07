#!/usr/bin/env python3
"""
ComfyUI — geração em lote de retratos (Star Idol Agency)
Liga a um ComfyUI (local ou RunPod) e gera PNGs a partir de `prompts_batch.json`.

Usage (na raiz do repo):
    python tools/portrait-gen/comfyui_runner.py
    python tools/portrait-gen/comfyui_runner.py --host https://xxx-comfyui.proxy.runpod.net
    python tools/portrait-gen/comfyui_runner.py --input tools/portrait-gen/output/prompts_batch.json
    python tools/portrait-gen/comfyui_runner.py --only char_00001_happy_18.png
    python tools/portrait-gen/comfyui_runner.py --dry-run

Environment:
    COMFYUI_HOST — URL base da API ComfyUI (ex.: https://<pod>-8188.proxy.runpod.net)

Checkpoint:
    O ficheiro .safetensors tem de existir no ComfyUI do pod (lista em Load Checkpoint no UI).
    Usa --checkpoint "nome_exato.safetensors".
"""

import json
import os
import ssl
import sys
import time
import urllib.request
import urllib.error
import uuid
from pathlib import Path

# Allow unverified SSL for RunPod proxy (self-signed certs)
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

# ============ COMFYUI WORKFLOW TEMPLATE ============

def build_workflow(prompt: str, negative_prompt: str, filename: str,
                   width: int = 1024, height: int = 1024,
                   steps: int = 28, cfg: float = 7.0,
                   seed: int = -1,
                   ckpt_name: str = "NetaYumev35_pretrained_all_in_one.safetensors") -> dict:
    """
    Builds a ComfyUI API workflow JSON for portrait generation.
    Uses a simple txt2img pipeline: checkpoint → clip → ksampler → vae decode → save.
    Adjust checkpoint name to match your RunPod setup.
    """
    if seed < 0:
        seed = hash(filename) % (2**32)

    return {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": steps,
                "cfg": cfg,
                "sampler_name": "euler_ancestral",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": ckpt_name,
            }
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": width,
                "height": height,
                "batch_size": 1,
            }
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": prompt,
                "clip": ["4", 1],
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": negative_prompt,
                "clip": ["4", 1],
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2],
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": filename.replace(".png", ""),
                "images": ["8", 0],
            }
        },
    }


# ============ COMFYUI API CLIENT ============

class ComfyUIClient:
    _HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
    }

    def __init__(self, host: str):
        self.host = host.rstrip("/")
        self.client_id = str(uuid.uuid4())

    def _request(self, path: str, data: bytes = None, extra_headers: dict = None) -> urllib.request.Request:
        headers = dict(self._HEADERS)
        if extra_headers:
            headers.update(extra_headers)
        return urllib.request.Request(f"{self.host}{path}", data=data, headers=headers)

    def queue_prompt(self, workflow: dict) -> str:
        """Queues a workflow and returns the prompt_id."""
        payload = json.dumps({
            "prompt": workflow,
            "client_id": self.client_id,
        }).encode("utf-8")

        req = self._request("/prompt", data=payload, extra_headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, context=_SSL_CTX) as resp:
            result = json.loads(resp.read())
            return result["prompt_id"]

    def wait_for_completion(self, prompt_id: str, timeout: int = 300, poll_interval: int = 3) -> dict:
        """Polls until the prompt completes or times out."""
        start = time.time()
        while time.time() - start < timeout:
            try:
                req = self._request(f"/history/{prompt_id}")
                with urllib.request.urlopen(req, context=_SSL_CTX) as resp:
                    history = json.loads(resp.read())
                    if prompt_id in history:
                        return history[prompt_id]
            except urllib.error.URLError:
                pass
            time.sleep(poll_interval)
        raise TimeoutError(f"Prompt {prompt_id} did not complete within {timeout}s")

    def download_image(self, filename: str, subfolder: str, output_dir: str) -> str:
        """Downloads a generated image from ComfyUI."""
        output_path = os.path.join(output_dir, filename)
        req = self._request(f"/view?filename={filename}&subfolder={subfolder}&type=output")
        with urllib.request.urlopen(req, context=_SSL_CTX) as resp:
            with open(output_path, "wb") as f:
                f.write(resp.read())
        return output_path

    def check_connection(self) -> bool:
        """Tests if the ComfyUI server is reachable."""
        try:
            req = self._request("/system_stats")
            with urllib.request.urlopen(req, timeout=15, context=_SSL_CTX) as resp:
                return resp.status == 200
        except Exception:
            return False


# ============ BATCH RUNNER ============

def run_batch(prompts_file: str, host: str, output_dir: str,
              only: str = None, dry_run: bool = False,
              width: int = 1024, height: int = 1024,
              steps: int = 28, cfg: float = 7.0,
              ckpt_name: str = "NetaYumev35_pretrained_all_in_one.safetensors"):
    """Generates all portraits from a prompts_batch.json file."""

    with open(prompts_file, encoding="utf-8") as f:
        batch = json.load(f)

    if only:
        batch = [b for b in batch if b["filename"] == only]
        if not batch:
            print(f"No entry found for '{only}'")
            return

    os.makedirs(output_dir, exist_ok=True)

    # Skip already generated
    existing = set(os.listdir(output_dir))
    remaining = [b for b in batch if b["filename"] not in existing]
    skipped = len(batch) - len(remaining)
    if skipped > 0:
        print(f"Skipping {skipped} already generated portraits")

    print(f"Generating {len(remaining)} portraits → {output_dir}")
    print(f"ComfyUI: {host}")
    print(f"Settings: {width}x{height}, {steps} steps, cfg {cfg}")
    print()

    if dry_run:
        for entry in remaining:
            print(f"  [DRY RUN] {entry['filename']}")
            print(f"    Prompt: {entry['prompt'][:80]}...")
        print(f"\n{len(remaining)} portraits would be generated.")
        return

    client = ComfyUIClient(host)

    if not client.check_connection():
        print(f"ERROR: Cannot connect to ComfyUI at {host}")
        print("Make sure the RunPod instance is running and the URL is correct.")
        sys.exit(1)

    success = 0
    failed = 0

    for i, entry in enumerate(remaining):
        filename = entry["filename"]
        print(f"[{i+1}/{len(remaining)}] Generating {filename}...", end=" ", flush=True)

        try:
            workflow = build_workflow(
                prompt=entry["prompt"],
                negative_prompt=entry["negative_prompt"],
                filename=filename,
                width=width, height=height,
                steps=steps, cfg=cfg,
                ckpt_name=ckpt_name,
            )

            prompt_id = client.queue_prompt(workflow)
            result = client.wait_for_completion(prompt_id)

            # Find output image in result
            outputs = result.get("outputs", {})
            downloaded = False
            for node_id, node_output in outputs.items():
                if "images" in node_output:
                    for img in node_output["images"]:
                        dl_path = client.download_image(
                            img["filename"],
                            img.get("subfolder", ""),
                            output_dir,
                        )
                        # Rename to our convention
                        final_path = os.path.join(output_dir, filename)
                        if dl_path != final_path:
                            os.replace(dl_path, final_path)
                        downloaded = True
                        break
                if downloaded:
                    break

            if downloaded:
                print("OK")
                success += 1
            else:
                print("WARN: no image in output")
                failed += 1

        except Exception as e:
            print(f"FAIL: {e}")
            failed += 1

    print(f"\nDone! {success} generated, {failed} failed, {skipped} skipped.")


# ============ MAIN ============

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Gerar retratos via API ComfyUI (Star Idol Agency)")
    parser.add_argument("--host", default=os.environ.get("COMFYUI_HOST", "http://127.0.0.1:8188"),
                        help="ComfyUI API URL (or set COMFYUI_HOST env var)")
    parser.add_argument("--input", default="tools/portrait-gen/output/prompts_batch.json",
                        help="Prompts batch JSON file")
    parser.add_argument("--output", default="tools/portrait-gen/portraits",
                        help="Output directory for generated PNGs")
    parser.add_argument("--only", help="Generate only this filename (e.g. char_00001_happy_18.png)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without generating")
    parser.add_argument("--width", type=int, default=1024)
    parser.add_argument("--height", type=int, default=1024)
    parser.add_argument("--steps", type=int, default=28)
    parser.add_argument("--cfg", type=float, default=7.0)
    parser.add_argument("--checkpoint", default="NetaYumev35_pretrained_all_in_one.safetensors",
                        help="Checkpoint model name on the ComfyUI server")
    args = parser.parse_args()

    run_batch(
        prompts_file=args.input,
        host=args.host,
        output_dir=args.output,
        only=args.only,
        dry_run=args.dry_run,
        width=args.width,
        height=args.height,
        steps=args.steps,
        cfg=args.cfg,
        ckpt_name=args.checkpoint,
    )


if __name__ == "__main__":
    main()
