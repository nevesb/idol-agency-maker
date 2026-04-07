#!/usr/bin/env python3
"""Junta skeleton (array) + sidecar (entries por id) -> array com campo `enrichment` por idol.

Se o sidecar tiver nameRomaji/nameJp (schema v2), sobrescreve os nomes placeholder do skeleton.
"""

from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--skeleton", type=Path, required=True)
    p.add_argument("--sidecar", type=Path, required=True)
    p.add_argument("-o", "--output", type=Path, required=True)
    p.add_argument(
        "--strict",
        action="store_true",
        help="Falha se algum idol do skeleton não tiver entrada no sidecar",
    )
    args = p.parse_args()

    sk = json.loads(args.skeleton.read_text(encoding="utf-8"))
    sc = json.loads(args.sidecar.read_text(encoding="utf-8"))
    entries = sc.get("entries") or {}
    if not isinstance(sk, list):
        sys.exit("skeleton must be array")

    missing: list[str] = []
    out = []
    for idol in sk:
        iid = idol.get("id")
        en = entries.get(iid)
        if not en:
            missing.append(str(iid))
        row = copy.deepcopy(idol)
        row["enrichment"] = en
        if en:
            if en.get("nameRomaji"):
                row["nameRomaji"] = en["nameRomaji"]
            if en.get("nameJp"):
                row["nameJp"] = en["nameJp"]
        out.append(row)
    if missing and args.strict:
        sys.exit(f"strict: missing enrichment for {len(missing)} ids, e.g. {missing[:5]}")
    if missing:
        print(f"WARN: {len(missing)} idols sem enrichment (campo null).", file=sys.stderr)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(out)} merged idols -> {args.output}")


if __name__ == "__main__":
    main()
