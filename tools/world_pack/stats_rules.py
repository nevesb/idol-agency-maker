"""
Espelho das regras em src/lib/simulation/stats.ts (tierFromPotential, personalityLabelKey, TA).
Manter sincronizado com o TypeScript.
"""

from __future__ import annotations

from typing import Literal

IdolTier = Literal["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"]

VISIBLE_KEYS = (
    "vocal",
    "dance",
    "acting",
    "variety",
    "visual",
    "charisma",
    "communication",
    "aura",
    "stamina",
    "discipline",
    "mentality",
    "adaptability",
)


def tier_from_potential(pt: int) -> IdolTier:
    p = round(pt)
    if p <= 20:
        return "F"
    if p <= 35:
        return "E"
    if p <= 50:
        return "D"
    if p <= 65:
        return "C"
    if p <= 75:
        return "B"
    if p <= 85:
        return "A"
    if p <= 92:
        return "S"
    if p <= 97:
        return "SS"
    return "SSS"


def pt_range_for_tier(tier: IdolTier) -> tuple[int, int]:
    """Intervalo inclusivo de PT que mapeia para o tier (inverso de tier_from_potential)."""
    bounds: dict[IdolTier, tuple[int, int]] = {
        "F": (1, 20),
        "E": (21, 35),
        "D": (36, 50),
        "C": (51, 65),
        "B": (66, 75),
        "A": (76, 85),
        "S": (86, 92),
        "SS": (93, 97),
        "SSS": (98, 100),
    }
    return bounds[tier]


def compute_talent_average(visible: dict[str, int]) -> float:
    s = sum(visible[k] for k in VISIBLE_KEYS)
    return s / 12.0


def personality_label_key(hidden: dict[str, int]) -> str:
    c = hidden["consistency"]
    amb = hidden["ambition"]
    loy = hidden["loyalty"]
    temp = hidden["temperament"]
    pl = hidden["personalLife"]
    if temp <= 6 and amb >= 14:
        return "personality.unstable_ambitious"
    if c >= 16 and amb >= 12:
        return "personality.disciplined_star"
    if loy >= 15 and temp >= 14:
        return "personality.golden_heart"
    if c <= 8 and temp <= 7:
        return "personality.time_bomb"
    if amb <= 6 and c >= 12:
        return "personality.silent_pillar"
    if pl >= 15:
        return "personality.public_life"
    return "personality.balanced"
