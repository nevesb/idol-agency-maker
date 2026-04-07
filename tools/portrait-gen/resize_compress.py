#!/usr/bin/env python3
"""
CG-11: Resize and compress idol portraits.
768 -> 512 (medium) + 128 (thumbnail), WebP quality 85.

Requires Pillow: pip install Pillow
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install Pillow")


SIZES = {
    "medium": 512,
    "thumbnail": 128,
}
WEBP_QUALITY = 85


def resize_portrait(src: Path, out_dir: Path, sizes: dict[str, int] = SIZES) -> list[Path]:
    """Resize a single portrait to multiple sizes."""
    img = Image.open(src)
    results: list[Path] = []

    for label, target_size in sizes.items():
        ratio = target_size / max(img.size)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        resized = img.resize(new_size, Image.LANCZOS)

        out_path = out_dir / label / src.with_suffix(".webp").name
        out_path.parent.mkdir(parents=True, exist_ok=True)
        resized.save(out_path, "WEBP", quality=WEBP_QUALITY)
        results.append(out_path)

    return results


def main() -> None:
    p = argparse.ArgumentParser(description="Resize & compress idol portraits")
    p.add_argument("--input-dir", type=Path, required=True, help="Directory with full-size PNGs")
    p.add_argument("--output-dir", type=Path, required=True, help="Output directory")
    args = p.parse_args()

    src_files = sorted(args.input_dir.glob("*.png")) + sorted(args.input_dir.glob("*.webp"))
    if not src_files:
        print("No PNG/WebP files found", file=sys.stderr)
        return

    total = 0
    for src in src_files:
        results = resize_portrait(src, args.output_dir)
        total += len(results)
        print(f"{src.name}: {len(results)} variants")

    print(f"\nDone: {total} files from {len(src_files)} sources -> {args.output_dir}")


if __name__ == "__main__":
    main()
