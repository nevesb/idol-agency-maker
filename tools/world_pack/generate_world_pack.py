#!/usr/bin/env python3
"""P1-10 MVP: gera N idols determinísticos (LCG) — subset do pipeline completo."""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from typing import Any


def lcg(seed: int) -> int:
    return (seed * 1103515245 + 12345) & 0x7FFFFFFF


def rnd(seed: int) -> tuple[float, int]:
    s = lcg(seed)
    return s / 0x7FFFFFFF, s


def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


@dataclass
class IdolOut:
    id: str
    nameRomaji: str
    nameJp: str
    age: int
    gender: str
    potential: int
    visible: dict[str, int]
    hidden: dict[str, int]
    activityState: str
    personalityLabelKey: str
    visualSeed: int
    regionId: str


def make_idol(seed: int, idx: int) -> tuple[IdolOut, int]:
    s = seed ^ (idx * 0x9E3779B1)
    regions = ["tokyo", "osaka", "nagoya", "fukuoka", "sapporo"]
    genders = ["female", "female", "female", "male"]
    r, s = rnd(s)
    region = regions[int(r * len(regions))]
    r, s = rnd(s)
    gender = genders[int(r * len(genders))]
    r, s = rnd(s)
    age = clamp(16 + int(r * 10), 16, 28)
    r, s = rnd(s)
    potential = clamp(35 + int(r * 45), 35, 85)

    def roll(base: int, spread: int) -> int:
        nonlocal s
        rv, s = rnd(s)
        return clamp(base + int((rv - 0.5) * spread), 15, 92)

    visible = {
        "vocal": roll(48, 24),
        "dance": roll(48, 24),
        "acting": roll(45, 24),
        "variety": roll(50, 24),
        "visual": roll(50, 24),
        "charisma": roll(50, 24),
        "communication": roll(48, 24),
        "aura": roll(47, 24),
        "stamina": roll(52, 24),
        "discipline": roll(50, 24),
        "mentality": roll(50, 24),
        "adaptability": roll(48, 24),
    }
    hidden: dict[str, int] = {}
    for key, lo, hi in [
        ("consistency", 4, 18),
        ("ambition", 4, 18),
        ("loyalty", 4, 18),
        ("temperament", 4, 18),
        ("personalLife", 3, 16),
    ]:
        r, s = rnd(s)
        hidden[key] = clamp(lo + int(r * (hi - lo)), lo, hi)

    r, s = rnd(s)
    vid = lcg(s) % 900_000 + 100_000
    name = f"Gen Idol {idx:04d}"

    idol = IdolOut(
        id=f"wp_{idx:05d}",
        nameRomaji=name,
        nameJp=name,
        age=age,
        gender=gender,
        potential=potential,
        visible=visible,
        hidden=hidden,
        activityState="active",
        personalityLabelKey="personality.balanced",
        visualSeed=vid,
        regionId=region,
    )
    return idol, s


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--seed", type=int, default=42_001)
    p.add_argument("--count", type=int, default=120, help="MVP: default 120 (plan full: 5000)")
    p.add_argument("-o", "--output", type=str, default="-")
    args = p.parse_args()
    seed = args.seed
    out: list[dict[str, Any]] = []
    s = seed
    for i in range(args.count):
        idol, s = make_idol(s, i)
        out.append(asdict(idol))
    text = json.dumps(out, ensure_ascii=False, indent=2)
    if args.output == "-":
        sys.stdout.write(text)
    else:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)


if __name__ == "__main__":
    main()
