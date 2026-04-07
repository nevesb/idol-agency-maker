"""
Quotas de tier — GDD idol-database-generator.md "Distribuição de Tiers no Pack".
"""

from __future__ import annotations

TIER_ORDER: tuple[str, ...] = ("F", "E", "D", "C", "B", "A", "S", "SS", "SSS")

# Frações oficiais do GDD (soma = 1.0)
GDD_TIER_FRACTIONS: dict[str, float] = {
    "F": 0.30,
    "E": 0.25,
    "D": 0.20,
    "C": 0.12,
    "B": 0.07,
    "A": 0.035,
    "S": 0.015,
    "SS": 0.007,
    "SSS": 0.003,
}


def tier_targets(n: int) -> dict[str, int]:
    """Contagens por tier com método dos maiores restos; soma exatamente n."""
    floors: dict[str, int] = {t: int(n * GDD_TIER_FRACTIONS[t]) for t in TIER_ORDER}
    rem = n - sum(floors.values())
    fracs = sorted(
        TIER_ORDER,
        key=lambda t: -(n * GDD_TIER_FRACTIONS[t] - floors[t]),
    )
    for j in range(rem):
        floors[fracs[j]] += 1
    return floors


def validate_tier_counts(counts: dict[str, int], n: int, tolerance: float = 0.02) -> list[str]:
    """Devolve lista de avisos se % por tier se afastar demais do GDD."""
    errs: list[str] = []
    if sum(counts.values()) != n:
        errs.append(f"sum(counts)={sum(counts.values())} != n={n}")
    for t in TIER_ORDER:
        exp = GDD_TIER_FRACTIONS[t]
        got = counts.get(t, 0) / n if n else 0
        if abs(got - exp) > tolerance + (1 / n if n else 0):
            errs.append(f"tier {t}: got {got:.3f} expected ~{exp:.3f}")
    return errs
