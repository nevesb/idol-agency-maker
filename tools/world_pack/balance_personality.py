#!/usr/bin/env python3
"""
Reamostra `hidden` por idol para aproximar quotas de personalityLabelKey (MVP stats.ts).
Mantém potential, visible, tier, entryMonth, etc. Preserva ordem do array.

Uso: python balance_personality.py idols.json -o idols_balanced.json --seed 42001
"""

from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path

from generate_idols_stratified import generate_hidden, rnd
from stats_rules import personality_label_key

PERSONALITY_KEYS: tuple[str, ...] = (
    "personality.unstable_ambitious",
    "personality.disciplined_star",
    "personality.golden_heart",
    "personality.time_bomb",
    "personality.silent_pillar",
    "personality.public_life",
    "personality.balanced",
)


def target_counts(n: int, fractions: dict[str, float] | None) -> dict[str, int]:
    if not fractions:
        base = n // len(PERSONALITY_KEYS)
        counts = {k: base for k in PERSONALITY_KEYS}
        rem = n - sum(counts.values())
        for j in range(rem):
            counts[PERSONALITY_KEYS[j % len(PERSONALITY_KEYS)]] += 1
        return counts
    counts = {k: int(n * fractions.get(k, 0)) for k in PERSONALITY_KEYS}
    rem = n - sum(counts.values())
    keys_sorted = sorted(PERSONALITY_KEYS, key=lambda x: -fractions.get(x, 0))
    for j in range(rem):
        counts[keys_sorted[j % len(keys_sorted)]] += 1
    return counts


def shuffle_multiset(labels: list[str], seed: int) -> list[str]:
    s = seed
    for i in range(len(labels) - 1, 0, -1):
        r, s = rnd(s)
        j = int(r * (i + 1))
        labels[i], labels[j] = labels[j], labels[i]
    return labels


def id_to_salt(idol_id: str) -> int:
    h = 0
    for c in idol_id:
        h = (h * 31 + ord(c)) & 0x7FFFFFFF
    return h


def rebalance_personality(idols: list[dict], seed: int, fractions: dict[str, float] | None) -> list[dict]:
    n = len(idols)
    targets = target_counts(n, fractions)
    multiset: list[str] = []
    for k in PERSONALITY_KEYS:
        multiset.extend([k] * targets[k])
    assert len(multiset) == n, (len(multiset), n, targets)
    multiset = shuffle_multiset(multiset, seed)

    out: list[dict] = []
    for i, idol in enumerate(idols):
        target = multiset[i]
        row = copy.deepcopy(idol)
        base = seed ^ id_to_salt(row["id"]) ^ (i * 0x9E3779B1)
        found = False
        for attempt in range(8000):
            hidden, _ = generate_hidden(base + attempt * 0x10001)
            if personality_label_key(hidden) == target:
                row["hidden"] = hidden
                row["personalityLabelKey"] = target
                found = True
                break
        if not found:
            row["personalityLabelKey"] = target
            row["hidden"] = idol.get("hidden", {})
            print(f"WARN: não atingiu {target} para id={row['id']}; mantidos ocultos.", file=sys.stderr)
        out.append(row)
    return out


def main() -> None:
    p = argparse.ArgumentParser(description="Balancear personalityLabelKey no pack")
    p.add_argument("input", type=Path)
    p.add_argument("-o", "--output", type=Path, required=True)
    p.add_argument("--seed", type=int, default=42_001)
    args = p.parse_args()

    with args.input.open(encoding="utf-8") as f:
        idols = json.load(f)
    if not isinstance(idols, list):
        raise SystemExit("Input deve ser array JSON")

    out = rebalance_personality(idols, args.seed, None)
    with args.output.open("w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Gravado {args.output} ({len(out)} idols)")


if __name__ == "__main__":
    main()
