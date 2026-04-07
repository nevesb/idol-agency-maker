#!/usr/bin/env python3
"""
Enriquece cada agência skeleton com LLM via Gemini (nome, dono NPC, cultura).
Saída: sidecar JSON (entries por agencyId). Use --dry-run sem API.
"""

from __future__ import annotations

import argparse
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

DEFAULT_PROMPT_VERSION = "2026-04-agency-v1"
_SSL = ssl.create_default_context()

SYSTEM_INSTRUCTIONS = """You are a game data author for Star Idol Agency (idol manager sim set in Japan).
Return a single JSON object only (no markdown fences). Required keys:
- agencyId: string (must match input)
- agencyNameRomaji: string — a believable Japanese talent agency name in romaji. MUST NOT be any name from existingNames.
- agencyNameJp: string — the same name in Japanese characters
- ownerNameRomaji: string — full name of the agency owner NPC (family given). MUST NOT duplicate any name from existingNames.
- ownerNameJp: string — owner name in Japanese characters
- ownerBackground: object with "pt" and "ja" strings (2-3 sentences each about the owner's career and personality)
- agencyCulture: object with "pt" and "ja" strings (1-2 sentences about the agency's philosophy and reputation)

CRITICAL RULES:
- All names must be unique — never repeat anything from existingNames.
- Agency names should sound like real Japanese entertainment companies (e.g. talent agencies, idol labels).
- The owner's personality should align with the agency's strategy (aggressive, balanced, conservative, niche, talent-first).
- Culture should reflect the tier and strategy."""


def _extract_first_json_object(text: str) -> dict:
    decoder = json.JSONDecoder()
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[-1]
        if "```" in text:
            text = text[:text.rindex("```")]
        text = text.strip()
    obj, _ = decoder.raw_decode(text)
    if not isinstance(obj, dict):
        raise ValueError(f"expected dict, got {type(obj).__name__}")
    return obj


def gemini_json_completion(api_key: str, model: str, system_text: str, user_text: str) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    body = {
        "systemInstruction": {"parts": [{"text": system_text}]},
        "contents": [{"parts": [{"text": user_text}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.65,
        },
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, context=_SSL, timeout=120) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(e.read().decode("utf-8", errors="replace")) from e
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    return _extract_first_json_object(text)


def dry_enrichment(agency: dict, idx: int) -> dict:
    return {
        "agencyId": agency["id"],
        "agencyNameRomaji": f"Agency {agency['tier']}-{idx:03d}",
        "agencyNameJp": f"事務所{agency['tier']}-{idx:03d}",
        "ownerNameRomaji": f"Owner {idx:03d}",
        "ownerNameJp": f"オーナー{idx:03d}",
        "ownerBackground": {
            "pt": f"Dono da agencia {agency['tier']} na regiao {agency['regionId']}. (placeholder)",
            "ja": f"{agency['regionId']}の{agency['tier']}事務所オーナー。（プレースホルダー）",
        },
        "agencyCulture": {
            "pt": f"Estrategia {agency['strategy']}. (placeholder)",
            "ja": f"{agency['strategy']}戦略。（プレースホルダー）",
        },
    }


def build_user_message(agency: dict, existing_names: list[str]) -> str:
    return json.dumps(
        {
            "task": "enrich_agency",
            "existingNames": existing_names,
            "agency": {
                "id": agency["id"],
                "tier": agency["tier"],
                "budget": agency["budget"],
                "strategy": agency["strategy"],
                "regionId": agency["regionId"],
                "staffCount": agency["staffCount"],
                "rosterSize": agency["rosterSize"],
            },
        },
        ensure_ascii=False,
    )


def validate(obj: dict, expected_id: str) -> None:
    if obj.get("agencyId") != expected_id:
        raise ValueError(f"agencyId mismatch: {obj.get('agencyId')} vs {expected_id}")
    for k in ("agencyNameRomaji", "agencyNameJp", "ownerNameRomaji", "ownerNameJp", "ownerBackground", "agencyCulture"):
        if k not in obj or not obj[k]:
            raise ValueError(f"missing or empty: {k}")


def _save(path: Path, pv: str, entries: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump({"promptVersion": pv, "entries": entries}, f, ensure_ascii=False, indent=2)


def main() -> None:
    p = argparse.ArgumentParser(description="LLM enrichment for agency skeletons (Gemini)")
    p.add_argument("--input", type=Path, required=True)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--idol-names-json", type=Path, help="Sidecar de idols para coletar nomes existentes")
    p.add_argument("--prompt-version", default=DEFAULT_PROMPT_VERSION)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--model", default="gemini-3.1-pro-preview")
    p.add_argument("--sleep", type=float, default=0.5)
    p.add_argument("--resume", action="store_true")
    args = p.parse_args()

    agencies = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(agencies, list):
        raise SystemExit("input must be JSON array")

    entries: dict[str, dict] = {}
    if args.resume and args.output.exists():
        prev = json.loads(args.output.read_text(encoding="utf-8"))
        entries = prev.get("entries") or {}
        print(f"Resumed: {len(entries)} existing entries", file=sys.stderr)

    existing_names: list[str] = []
    if args.idol_names_json and args.idol_names_json.exists():
        idol_sidecar = json.loads(args.idol_names_json.read_text(encoding="utf-8"))
        for e in (idol_sidecar.get("entries") or {}).values():
            if e.get("nameRomaji"):
                existing_names.append(e["nameRomaji"])
    for e in entries.values():
        for k in ("agencyNameRomaji", "ownerNameRomaji"):
            if e.get(k):
                existing_names.append(e[k])

    api_key = os.environ.get("GEMINI_API_KEY", "")

    for i, ag in enumerate(agencies):
        aid = ag["id"]
        if aid in entries:
            continue

        if args.dry_run or not api_key:
            if not args.dry_run and not api_key:
                print("WARN: sem GEMINI_API_KEY; usando dry-run.", file=sys.stderr)
            en = dry_enrichment(ag, i)
        else:
            msg = build_user_message(ag, existing_names[-100:])
            try:
                en = gemini_json_completion(api_key, args.model, SYSTEM_INSTRUCTIONS, msg)
            except Exception as e:
                print(f"FAIL {aid}: {e}", file=sys.stderr)
                _save(args.output, args.prompt_version, entries)
                raise
            validate(en, aid)
            time.sleep(args.sleep)

        validate(en, aid)
        entries[aid] = en
        for k in ("agencyNameRomaji", "ownerNameRomaji"):
            if en.get(k):
                existing_names.append(en[k])
        print(f"[{i+1}/{len(agencies)}] {aid} -> {en.get('agencyNameRomaji', '?')}")

        if (i + 1) % 10 == 0:
            _save(args.output, args.prompt_version, entries)

    _save(args.output, args.prompt_version, entries)
    print(f"Done: {args.output} ({len(entries)} entries)")


if __name__ == "__main__":
    main()
