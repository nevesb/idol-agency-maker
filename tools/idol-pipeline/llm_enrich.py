#!/usr/bin/env python3
"""
Enriquece cada idol do skeleton com LLM via Gemini (nome, background PT/JA, physical, portrait prompts).
Saída: sidecar JSON (entries por idolId). Use --dry-run sem API.

Requer GEMINI_API_KEY para modo LLM (modelo configurável, default gemini-3.1-pro-preview).
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

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PROMPT_VERSION = "2026-04-gemini-v2"

_SSL = ssl.create_default_context()

SYSTEM_INSTRUCTIONS = """You are a game data author for Star Idol Agency (idol manager sim set in Japan).
Return a single JSON object only (no markdown fences). Required keys:
- schemaVersion: integer 2
- idolId: string (must match input)
- promptVersion: string (use the value given in the user message)
- nameRomaji: string — a believable Japanese full name in romaji (family name first, given name second). Must match the idol's gender and region. MUST NOT be any name from the existingNames list.
- nameJp: string — the same name in Japanese characters (kanji + hiragana/katakana as appropriate)
- background: object with "pt" and "ja" strings (2-4 sentences each, third person, ties region and personality to life story; justify nothing that contradicts stats)
- physical: object with hairStyle, hairColor, eyeShape, eyeColor, skinTone (strings), accessories (string, may be empty), outfitNotes (string, short)
- portraitPromptPositive: one English paragraph for anime bust portrait, chest-up, three-quarter view, plain solid black background, no text/watermark; MUST encode age and gender from input and all physical fields; style: anime otome / visual novel clean lineart soft shading
- portraitPromptNegative: string (short standard quality-negative list)

CRITICAL RULES:
- Names must be unique — never repeat any name from the existingNames list.
- Names should feel authentic for Japanese idol industry. Use common but varied Japanese naming patterns.
- Physical description must be diverse — vary hair colors, styles, eye shapes across idols. Higher visual stat = more striking appearance.
- All narrative must be consistent with the idol's regionId, gender, age, personalityLabelKey, tier, and visible/hidden stats."""


SURNAME_POOL = [
    "Takahashi", "Suzuki", "Tanaka", "Watanabe", "Yamamoto", "Nakamura", "Kobayashi",
    "Sato", "Ito", "Kato", "Yoshida", "Yamada", "Sasaki", "Matsumoto", "Inoue",
    "Kimura", "Shimizu", "Hayashi", "Saito", "Mori", "Ikeda", "Hashimoto", "Abe",
    "Ishikawa", "Ogawa", "Fujita", "Okada", "Goto", "Hasegawa", "Murakami",
    "Aoyama", "Shiina", "Hoshino", "Tsukimura", "Akiyama", "Mizuki", "Sakurai",
    "Aoi", "Nishikawa", "Ueda", "Ono", "Fujimoto", "Okazaki", "Nagai", "Tachibana",
]

GIVEN_F = [
    "Hina", "Yui", "Sakura", "Aoi", "Mio", "Rin", "Koharu", "Mei", "Sora", "Riko",
    "Haruka", "Yuna", "Kanon", "Miyu", "Nanami", "Akari", "Hinata", "Ichika", "Ema",
    "Rena", "Noa", "Ayaka", "Miku", "Honoka", "Shiori", "Kaede", "Misaki", "Chihiro",
]

GIVEN_M = [
    "Haruto", "Yuto", "Sota", "Ren", "Riku", "Kaito", "Minato", "Asahi", "Yuki",
    "Sora", "Hinata", "Takumi", "Hayato", "Ryota", "Kento", "Shun", "Daiki", "Akira",
]


def dry_enrichment(idol: dict, prompt_version: str, idx: int) -> dict:
    """Placeholder determinístico para CI / sem API."""
    gender = idol.get("gender", "female")
    subj = "young man, bishounen" if gender == "male" else "young woman"
    style = "anime style" if gender == "male" else "anime otome"
    age = int(idol.get("age", 18))
    region = idol.get("regionId", "tokyo")

    pool = GIVEN_M if gender == "male" else GIVEN_F
    surname = SURNAME_POOL[idx % len(SURNAME_POOL)]
    given = pool[idx % len(pool)]
    name_romaji = f"{surname} {given}"

    return {
        "schemaVersion": 2,
        "idolId": idol["id"],
        "promptVersion": prompt_version + "-dry",
        "nameRomaji": name_romaji,
        "nameJp": name_romaji,
        "background": {
            "pt": f"{name_romaji} cresceu na região de {region}; personalidade alinhada a {idol.get('personalityLabelKey', '')}. (placeholder dry-run)",
            "ja": f"{region}出身のプロフィールプレースホルダー。",
        },
        "physical": {
            "hairStyle": "shoulder-length straight hair",
            "hairColor": "dark brown hair",
            "eyeShape": "almond eyes",
            "eyeColor": "brown eyes",
            "skinTone": "natural skin tone",
            "accessories": "",
            "outfitNotes": "simple idol-style outfit, solid colors no print",
        },
        "portraitPromptPositive": (
            f"{style}, {age} years old {subj}, visual novel style, clean lineart, flat colors, soft shading, "
            f"shoulder-length straight hair, dark brown hair, almond eyes, brown eyes, natural skin tone, "
            f"simple idol-style outfit solid colors no print, cheerful natural smile, "
            f"three-quarter front view, close-up bust portrait from chest up, plain black background, solid background, no text"
        ),
        "portraitPromptNegative": (
            "blurry, worst quality, low quality, deformed hands, bad anatomy, watermark, text, "
            "full body, wide shot"
        ),
    }


def _extract_first_json_object(text: str) -> dict:
    """Extract the first complete JSON object from potentially messy LLM output."""
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
        raise RuntimeError(e.read().decode("utf-8", errors="replace")) from e
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    return _extract_first_json_object(text)


def build_user_message(idol: dict, prompt_version: str, existing_names: list[str]) -> str:
    return json.dumps(
        {
            "task": "enrich_idol",
            "promptVersion": prompt_version,
            "existingNames": existing_names,
            "idol": {
                "id": idol.get("id"),
                "age": idol.get("age"),
                "gender": idol.get("gender"),
                "regionId": idol.get("regionId"),
                "potential": idol.get("potential"),
                "tier": idol.get("tier"),
                "personalityLabelKey": idol.get("personalityLabelKey"),
                "entryMonth": idol.get("entryMonth"),
                "visible": idol.get("visible"),
                "hidden": idol.get("hidden"),
            },
        },
        ensure_ascii=False,
    )


def validate_enrichment(obj: dict, expected_id: str) -> None:
    sv = obj.get("schemaVersion")
    if sv not in (1, 2):
        raise ValueError(f"schemaVersion must be 1 or 2, got {sv}")
    if obj.get("idolId") != expected_id:
        raise ValueError(f"idolId mismatch {obj.get('idolId')} vs {expected_id}")
    for k in ("background", "physical", "portraitPromptPositive"):
        if k not in obj:
            raise ValueError(f"missing {k}")
    if "pt" not in obj["background"] or "ja" not in obj["background"]:
        raise ValueError("background.pt and background.ja required")
    ph = obj["physical"]
    for k in ("hairStyle", "hairColor", "eyeShape", "eyeColor", "skinTone"):
        if k not in ph:
            raise ValueError(f"physical.{k} required")
    if sv == 2:
        for k in ("nameRomaji", "nameJp"):
            if k not in obj or not obj[k]:
                raise ValueError(f"schema v2 requires non-empty {k}")


def main() -> None:
    p = argparse.ArgumentParser(description="LLM enrichment sidecar for idols (Gemini)")
    p.add_argument("--input", type=Path, required=True, help="JSON array skeleton idols")
    p.add_argument("--output", type=Path, required=True, help="Sidecar JSON com entries")
    p.add_argument("--prompt-version", default=DEFAULT_PROMPT_VERSION)
    p.add_argument("--dry-run", action="store_true", help="Sem API; placeholders determinísticos")
    p.add_argument("--model", default="gemini-3.1-pro-preview")
    p.add_argument("--only-id", help="Processar só um id")
    p.add_argument("--sleep", type=float, default=0.3, help="Pausa entre chamadas API")
    p.add_argument("--resume", action="store_true", help="Retomar: pular ids já no output")
    args = p.parse_args()

    with args.input.open(encoding="utf-8") as f:
        idols = json.load(f)
    if not isinstance(idols, list):
        raise SystemExit("input must be JSON array")

    if args.only_id:
        idols = [x for x in idols if x.get("id") == args.only_id]
        if not idols:
            raise SystemExit(f"id not found: {args.only_id}")

    entries: dict[str, dict] = {}
    if args.resume and args.output.exists():
        prev = json.loads(args.output.read_text(encoding="utf-8"))
        entries = prev.get("entries") or {}
        print(f"Resumed: {len(entries)} existing entries", file=sys.stderr)

    api_key = os.environ.get("GEMINI_API_KEY", "")
    existing_names: list[str] = [e.get("nameRomaji", "") for e in entries.values() if e.get("nameRomaji")]

    for i, idol in enumerate(idols):
        oid = idol["id"]
        if oid in entries:
            continue

        if args.dry_run or not api_key:
            if not args.dry_run and not api_key:
                print("WARN: sem GEMINI_API_KEY; usando dry-run.", file=sys.stderr)
            en = dry_enrichment(idol, args.prompt_version, i)
        else:
            msg = build_user_message(idol, args.prompt_version, existing_names[-200:])
            try:
                en = gemini_json_completion(api_key, args.model, SYSTEM_INSTRUCTIONS, msg)
            except Exception as e:
                print(f"FAIL {oid}: {e}", file=sys.stderr)
                _save_partial(args.output, args.prompt_version, entries)
                raise
            validate_enrichment(en, oid)
            time.sleep(args.sleep)

        validate_enrichment(en, oid)
        entries[oid] = en
        name = en.get("nameRomaji", "?")
        existing_names.append(name)
        print(f"[{i+1}/{len(idols)}] {oid} -> {name}")

        if (i + 1) % 10 == 0:
            _save_partial(args.output, args.prompt_version, entries)

    _save_partial(args.output, args.prompt_version, entries)
    print(f"Done: {args.output} ({len(entries)} entries)")


def _save_partial(path: Path, pv: str, entries: dict[str, dict]) -> None:
    sidecar = {"schemaVersion": 2, "promptVersion": pv, "entries": entries}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(sidecar, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
