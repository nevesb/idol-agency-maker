#!/usr/bin/env python3
"""
Gera N idols com quotas de tier (GDD), PT por faixa, género/região GDD,
atributos alinhados à fórmula simplificada do GDD, entryMonth, personalityLabelKey
via stats_rules (espelho de stats.ts).

Não gera aparência para retrato — isso vem da LLM no pipeline enriquecido.
visualSeed permanece como identificador numérico auxiliar (não usado em prompts de retrato).
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from typing import Any

from stats_rules import (
    VISIBLE_KEYS,
    compute_talent_average,
    personality_label_key,
    pt_range_for_tier,
    tier_from_potential,
)
from tier_quotas import TIER_ORDER, tier_targets

TIER_SALT: dict[str, int] = {
    "F": 1,
    "E": 2,
    "D": 3,
    "C": 4,
    "B": 5,
    "A": 6,
    "S": 7,
    "SS": 8,
    "SSS": 9,
}


def lcg(seed: int) -> int:
    return (seed * 1103515245 + 12345) & 0x7FFFFFFF


def rnd(seed: int) -> tuple[float, int]:
    s = lcg(seed)
    return s / 0x7FFFFFFF, s


def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def clampf(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def age_to_initial_factor(age: int) -> float:
    """GDD: mais velha = mais desenvolvida; linear 16→0.2, 28→0.6."""
    a = clamp(age, 16, 28)
    return 0.2 + (a - 16) / 12.0 * 0.4


def sample_discrete(weights: list[tuple[str, float]], seed: int) -> tuple[str, int]:
    total = sum(w for _, w in weights)
    r, s = rnd(seed)
    t = r * total
    acc = 0.0
    for name, w in weights:
        acc += w
        if t < acc:
            return name, s
    return weights[-1][0], s


def sample_pt_in_tier(tier: str, seed: int) -> tuple[int, int]:
    lo, hi = pt_range_for_tier(tier)  # type: ignore[arg-type]
    r, s = rnd(seed)
    return lo + int(r * (hi - lo + 1)) if hi >= lo else lo, s


def generate_visible_for_pt(pt: int, age: int, seed: int) -> tuple[dict[str, int], int]:
    """GDD simplificado: teto[i] ≈ PT * (0.5 + u), valor = teto * initial_factor * jitter."""
    s = seed
    initial = age_to_initial_factor(age)
    visible: dict[str, int] = {}
    for key in VISIBLE_KEYS:
        r, s = rnd(s)
        ceiling = pt * (0.5 + r)
        ceiling = min(100.0, ceiling)
        r2, s = rnd(s)
        jitter = 0.85 + r2 * 0.3
        v = int(ceiling * initial * jitter)
        visible[key] = clamp(v, 15, 92)
    return visible, s


def generate_hidden(seed: int) -> tuple[dict[str, int], int]:
    s = seed
    hidden: dict[str, int] = {}
    for key, lo, hi in [
        ("consistency", 4, 18),
        ("ambition", 4, 18),
        ("loyalty", 4, 18),
        ("temperament", 4, 18),
        ("personalLife", 3, 16),
    ]:
        r, s = rnd(s)
        hidden[key] = clamp(lo + int(r * (hi - lo + 1)), lo, hi)
    return hidden, s


def sample_entry_month(max_month: int, seed: int) -> tuple[int, int]:
    r, s = rnd(seed)
    return int(r * max(1, max_month)), s


@dataclass
class IdolSkeletonOut:
    id: str
    nameRomaji: str
    nameJp: str
    age: int
    gender: str
    potential: int
    tier: str
    visible: dict[str, int]
    hidden: dict[str, int]
    activityState: str
    personalityLabelKey: str
    visualSeed: int
    regionId: str
    entryMonth: int
    talentAverage: float


def make_skeleton(
    idx: int,
    tier: str,
    seed: int,
    max_entry_month: int,
) -> tuple[IdolSkeletonOut, int]:
    s = seed ^ (idx * 0x9E3779B1) ^ (TIER_SALT.get(tier, 0) * 0x85EBCA6B)

    region, s = sample_discrete(
        [
            ("tokyo", 0.45),
            ("osaka", 0.20),
            ("fukuoka", 0.08),
            ("nagoya", 0.07),
            ("sapporo", 0.05),
            ("other", 0.15),
        ],
        s,
    )
    r, s = rnd(s)
    gender = "female" if r < 0.70 else "male"
    r, s = rnd(s)
    age = clamp(16 + int(r * 13), 16, 28)

    potential, s = sample_pt_in_tier(tier, s)
    assert tier_from_potential(potential) == tier, (potential, tier)

    visible, s = generate_visible_for_pt(potential, age, s)
    hidden, s = generate_hidden(s)
    label = personality_label_key(hidden)

    r, s = rnd(s)
    vid = lcg(s) % 900_000 + 100_000
    entry_month, s = sample_entry_month(max_entry_month, s)

    name = f"Gen Idol {idx:04d}"
    ta = compute_talent_average(visible)

    out = IdolSkeletonOut(
        id=f"wp_{idx:05d}",
        nameRomaji=name,
        nameJp=name,
        age=age,
        gender=gender,
        potential=potential,
        tier=tier,
        visible=visible,
        hidden=hidden,
        activityState="active",
        personalityLabelKey=label,
        visualSeed=vid,
        regionId=region,
        entryMonth=entry_month,
        talentAverage=round(ta, 2),
    )
    return out, s


def build_tier_assignment(n: int, seed: int) -> list[str]:
    targets = tier_targets(n)
    tiers: list[str] = []
    for t in TIER_ORDER:
        tiers.extend([t] * targets[t])
    assert len(tiers) == n, (len(tiers), n, targets)
    # Fisher–Yates shuffle determinístico
    s = seed
    for i in range(len(tiers) - 1, 0, -1):
        r, s = rnd(s)
        j = int(r * (i + 1))
        tiers[i], tiers[j] = tiers[j], tiers[i]
    return tiers


def main() -> None:
    p = argparse.ArgumentParser(description="Gerar idols estratificados por tier (GDD)")
    p.add_argument("--seed", type=int, default=42_001)
    p.add_argument("--count", type=int, default=120)
    p.add_argument(
        "--max-entry-month",
        type=int,
        default=240,
        help="Mês de entrada 0..max-1 (default 240 = 20 anos x 12)",
    )
    p.add_argument("-o", "--output", type=str, default="-")
    args = p.parse_args()

    tier_list = build_tier_assignment(args.count, args.seed)
    out: list[dict[str, Any]] = []
    s = args.seed
    for i, tier in enumerate(tier_list):
        skel, s = make_skeleton(i, tier, s, args.max_entry_month)
        d = asdict(skel)
        # tier_from_potential sanity
        assert tier_from_potential(d["potential"]) == d["tier"]
        out.append(d)

    text = json.dumps(out, ensure_ascii=False, indent=2)
    if args.output == "-":
        sys.stdout.write(text)
    else:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)


if __name__ == "__main__":
    main()
