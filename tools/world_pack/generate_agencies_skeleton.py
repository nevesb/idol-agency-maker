#!/usr/bin/env python3
"""
Gera N agências rivais (skeleton mecânico) para o world pack.
Nomes, cultura e dono NPC são gerados pela LLM no pipeline enriquecido.

Cada agência recebe: id, tier, budget, strategy, region, staffCount, roster (subset de idol ids).
"""

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


STRATEGIES = ["aggressive", "balanced", "conservative", "niche", "talent-first"]
REGIONS = ["tokyo", "osaka", "fukuoka", "nagoya", "sapporo", "other"]
REGION_WEIGHTS = [0.40, 0.22, 0.10, 0.08, 0.06, 0.14]

TIER_DISTRIBUTION = {
    "S": 2,
    "A": 4,
    "B": 8,
    "C": 12,
    "D": 14,
    "E": 10,
}


@dataclass
class AgencySkeleton:
    id: str
    tier: str
    budget: int
    strategy: str
    regionId: str
    staffCount: int
    rosterSize: int
    rosterIdolIds: list[str]
    ownerPlaceholder: str


BUDGET_BY_TIER = {"S": 800_000, "A": 500_000, "B": 300_000, "C": 150_000, "D": 80_000, "E": 40_000}
STAFF_BY_TIER = {"S": 12, "A": 9, "B": 7, "C": 5, "D": 3, "E": 2}
ROSTER_BY_TIER = {"S": 30, "A": 22, "B": 16, "C": 10, "D": 6, "E": 3}


def sample_discrete(weights: list[float], labels: list[str], seed: int) -> tuple[str, int]:
    total = sum(weights)
    r, s = rnd(seed)
    t = r * total
    acc = 0.0
    for label, w in zip(labels, weights):
        acc += w
        if t < acc:
            return label, s
    return labels[-1], s


def build_tier_list(n: int) -> list[str]:
    total_defined = sum(TIER_DISTRIBUTION.values())
    tiers: list[str] = []
    for tier, count in TIER_DISTRIBUTION.items():
        scaled = round(count * n / total_defined)
        tiers.extend([tier] * scaled)
    while len(tiers) < n:
        tiers.append("D")
    while len(tiers) > n:
        tiers.pop()
    return tiers


def generate_agency(
    idx: int, tier: str, idol_ids: list[str], seed: int
) -> tuple[AgencySkeleton, int]:
    s = seed ^ (idx * 0x9E3779B1 + 0xDEAD)

    region, s = sample_discrete(REGION_WEIGHTS, REGIONS, s)
    r, s = rnd(s)
    strat = STRATEGIES[int(r * len(STRATEGIES)) % len(STRATEGIES)]

    base_budget = BUDGET_BY_TIER.get(tier, 100_000)
    r, s = rnd(s)
    budget = int(base_budget * (0.7 + r * 0.6))

    staff = STAFF_BY_TIER.get(tier, 3)
    max_roster = min(ROSTER_BY_TIER.get(tier, 5), len(idol_ids))

    r, s = rnd(s)
    roster_size = max(1, int(max_roster * (0.6 + r * 0.4)))

    roster: list[str] = []
    available = list(idol_ids)
    for _ in range(roster_size):
        if not available:
            break
        r, s = rnd(s)
        pick = int(r * len(available)) % len(available)
        roster.append(available.pop(pick))

    ag = AgencySkeleton(
        id=f"ag_{idx:03d}",
        tier=tier,
        budget=budget,
        strategy=strat,
        regionId=region,
        staffCount=staff,
        rosterSize=len(roster),
        rosterIdolIds=roster,
        ownerPlaceholder=f"Owner NPC {idx:03d}",
    )
    return ag, s


def main() -> None:
    p = argparse.ArgumentParser(description="Gerar agências rivais (skeleton)")
    p.add_argument("--seed", type=int, default=99_001)
    p.add_argument("--count", type=int, default=50)
    p.add_argument("--idols-json", type=str, help="JSON array de idols para distribuir em rosters")
    p.add_argument("-o", "--output", type=str, default="-")
    args = p.parse_args()

    idol_ids: list[str] = []
    if args.idols_json:
        from pathlib import Path
        idols = json.loads(Path(args.idols_json).read_text(encoding="utf-8"))
        idol_ids = [x["id"] for x in idols]

    tier_list = build_tier_list(args.count)
    s = args.seed
    remaining_ids = list(idol_ids)

    out: list[dict[str, Any]] = []
    for i, tier in enumerate(tier_list):
        ag, s = generate_agency(i, tier, remaining_ids, s)
        for rid in ag.rosterIdolIds:
            if rid in remaining_ids:
                remaining_ids.remove(rid)
        out.append(asdict(ag))

    text = json.dumps(out, ensure_ascii=False, indent=2)
    if args.output == "-":
        sys.stdout.write(text)
    else:
        from pathlib import Path
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Wrote {len(out)} agencies -> {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
