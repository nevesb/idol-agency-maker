#!/usr/bin/env python3
"""
Lê `balance_targets.yaml` + JSON de idols (estrutura IdolCore/skeleton),
imprime histogramas (tier, ano de jogo, personality), valida quotas de tier vs GDD.
Opcional: re-amostrar entryMonth com distribuição uniforme por ano (determinístico).
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]

from stats_rules import tier_from_potential
from tier_quotas import GDD_TIER_FRACTIONS, TIER_ORDER, validate_tier_counts


def load_yaml(path: Path) -> dict:
    if not path.exists():
        return {}
    if yaml is None:
        raise SystemExit("PyYAML necessário: pip install pyyaml")
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def year_from_entry_month(m: int) -> int:
    return max(0, min(19, m // 12))


def report_idols(idols: list[dict], tier_tol: float) -> int:
    n = len(idols)
    if n == 0:
        print("Nenhuma idol.")
        return 1

    tier_counts = Counter()
    for x in idols:
        t = x.get("tier") or tier_from_potential(int(x["potential"]))
        tier_counts[str(t)] += 1

    print("=== Tier ===")
    for t in TIER_ORDER:
        c = tier_counts.get(t, 0)
        pct = 100 * c / n
        exp = 100 * GDD_TIER_FRACTIONS[t]
        print(f"  {t}: {c} ({pct:.1f}%)  [GDD ~{exp:.1f}%]")
    errs = validate_tier_counts(dict(tier_counts), n, tolerance=tier_tol)
    if errs:
        print("Avisos tier:", errs)

    print("\n=== Ano de jogo (entryMonth // 12) ===")
    yc = Counter(year_from_entry_month(int(x.get("entryMonth", 0))) for x in idols)
    for y in range(20):
        c = yc.get(y, 0)
        print(f"  ano {y:2d}: {c}")

    print("\n=== personalityLabelKey ===")
    pc = Counter(x.get("personalityLabelKey", "?") for x in idols)
    for k in sorted(pc.keys()):
        print(f"  {k}: {pc[k]}")

    return 0


def _lcg(seed: int) -> int:
    return (seed * 1103515245 + 12345) & 0x7FFFFFFF


def _rnd(seed: int) -> tuple[float, int]:
    s = _lcg(seed)
    return s / 0x7FFFFFFF, s


def resample_entry_months_uniform_by_year(idols: list[dict], seed: int, max_month: int) -> list[dict]:
    """Distribui n/20 idols por ano de jogo; entryMonth uniforme dentro de cada ano."""
    import copy

    n = len(idols)
    per_year = [n // 20] * 20
    for i in range(n % 20):
        per_year[i] += 1

    indices = list(range(n))
    s = seed
    for i in range(len(indices) - 1, 0, -1):
        r, s = _rnd(s)
        j = int(r * (i + 1))
        indices[i], indices[j] = indices[j], indices[i]

    year_for_index = [0] * n
    pos = 0
    for y in range(20):
        for _ in range(per_year[y]):
            year_for_index[indices[pos]] = y
            pos += 1

    out: list[dict] = []
    s2 = seed ^ 0xABCDEF01
    for i in range(n):
        y = year_for_index[i]
        idol = copy.deepcopy(idols[i])
        lo = y * 12
        hi = min(lo + 11, max_month - 1)
        if lo > hi:
            lo = max(0, max_month - 1)
            hi = lo
        r, s2 = _rnd(s2)
        span = hi - lo + 1
        idol["entryMonth"] = lo + int(r * span)
        out.append(idol)
    return out


def main() -> None:
    p = argparse.ArgumentParser(description="Relatório de balanceamento de pack de idols")
    p.add_argument("input", type=Path, help="JSON array de idols")
    p.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parent / "balance_targets.yaml",
        help="YAML com knobs",
    )
    p.add_argument(
        "--resample-entry-months",
        action="store_true",
        help="Reescrever entryMonth (uniforme por ano) e gravar em --output",
    )
    p.add_argument("--output", type=Path, help="JSON de saída com entryMonth ajustado")
    p.add_argument("--seed", type=int, default=42_001)
    args = p.parse_args()

    cfg = load_yaml(args.config)
    entry_cfg = cfg.get("entry_month") or {}
    max_month = int(entry_cfg.get("max_month", 240))
    tier_tol = float(cfg.get("tier_tolerance", 0.03))

    with args.input.open(encoding="utf-8") as f:
        idols = json.load(f)
    if not isinstance(idols, list):
        raise SystemExit("Input deve ser array JSON")

    if args.resample_entry_months:
        if not args.output:
            raise SystemExit("--output obrigatório com --resample-entry-months")
        idols = resample_entry_months_uniform_by_year(idols, args.seed, max_month)
        with args.output.open("w", encoding="utf-8") as f:
            json.dump(idols, f, ensure_ascii=False, indent=2)
        print(f"Gravado {args.output} ({len(idols)} idols)\n")

    sys.exit(report_idols(idols, tier_tol))


if __name__ == "__main__":
    main()
