#!/usr/bin/env python3
"""
Gera NPCs não-idol para o World Pack (GDD: rival-agency-ai, agency-staff-operations,
scouting-recruitment, music-charts).

Saída: JSON com rivalAgencies (50, pirâmide por tier), staffMarket, scouts, composers
e metadados de pesos para reprodutibilidade (mesma seed = mesmo universo).
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from typing import Any, Literal

# --- RNG (mesma família que generate_world_pack.py) ---


def lcg(seed: int) -> int:
    return (seed * 1103515245 + 12345) & 0x7FFFFFFF


def rnd(seed: int) -> tuple[float, int]:
    s = lcg(seed)
    return s / 0x7FFFFFFF, s


def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def clampf(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


AgencyTier = Literal["garage", "small", "medium", "large", "elite"]

TIER_ORDER: list[AgencyTier] = ["garage", "small", "medium", "large", "elite"]
# Pirâmide: 50 rivais (alinhado à conversa de design / GDD)
TIER_COUNTS: list[int] = [14, 12, 10, 9, 5]

STAFF_ROLES: list[tuple[str, float]] = [
    ("staff.talentManager", 1.4),
    ("staff.prManager", 1.2),
    ("staff.scout", 1.1),
    ("staff.vocalCoach", 1.25),
    ("staff.danceCoach", 1.25),
    ("staff.actingCoach", 0.85),
    ("staff.wellnessAdvisor", 0.75),
    ("staff.legalCounsel", 0.7),
    ("staff.musicProducer", 0.55),
    ("staff.socialMediaManager", 0.65),
    ("staff.eventPlanner", 0.55),
]

SCOUT_SPECIALTIES: list[str | None] = [None, "vocal", "dance", "variety", "visual"]

COMPOSER_SPECIALTIES: list[str] = [
    "pop",
    "rock",
    "ballad",
    "electronic",
    "idol",
    "variety",
]

ARCHETYPES: list[tuple[str, list[AgencyTier]]] = [
    ("rival.buyoutPredator", ["small", "medium", "large", "elite"]),
    ("rival.nicheSeiyuu", ["garage", "small", "medium"]),
    ("rival.varietyMachine", ["small", "medium", "large"]),
    ("rival.premiumBoutique", ["medium", "large", "elite"]),
    ("rival.talentBurnout", ["garage", "small", "medium"]),
    ("rival.familyAgency", ["garage", "small", "medium"]),
    ("rival.idolFactory", ["medium", "large", "elite"]),
    ("rival.risingUnderdog", ["garage", "small"]),
    ("rival.digitalPioneer", ["small", "medium", "large", "elite"]),
    ("rival.legacyInstitution", ["large", "elite"]),
]

STRATEGIES = ["balanced", "aggressive", "conservative", "specialist"]

OWNER_PERSONALITIES = [
    "owner.predator",
    "owner.paternal",
    "owner.visionary",
    "owner.cautious",
    "owner.artisan",
    "owner.hustler",
    "owner.nurturing",
    "owner.ruthless",
]

AESTHETICS = [
    "aesthetic.neonPop",
    "aesthetic.classicalElegance",
    "aesthetic.streetCasual",
    "aesthetic.minimalChic",
    "aesthetic.cyberKawaii",
    "aesthetic.vintageShowa",
    "aesthetic.rockEdge",
    "aesthetic.softPastel",
]

REGIONS = ["tokyo", "osaka", "nagoya", "fukuoka", "sapporo"]

SYL_A = [
    "Aki",
    "Ren",
    "Haru",
    "Kai",
    "Sora",
    "Mio",
    "Yui",
    "Rin",
    "Nao",
    "Rei",
    "Ken",
    "Ryo",
    "Daiki",
    "Sho",
    "Tsubasa",
]
SYL_B = [
    "tanaka",
    "yamada",
    "suzuki",
    "sato",
    "watanabe",
    "ito",
    "kobayashi",
    "kato",
    "yoshida",
    "yamamoto",
    "nakamura",
    "okada",
    "fujita",
    "mori",
    "hayashi",
]
AGENCY_P1 = [
    "Neon",
    "Crimson",
    "Azure",
    "Velvet",
    "Crystal",
    "Golden",
    "Silver",
    "Royal",
    "Urban",
    "Lunar",
    "Solar",
    "Stellar",
    "Polar",
    "Amber",
    "Jade",
]
AGENCY_P2 = [
    "Stage",
    "Wave",
    "Crown",
    "Beat",
    "Line",
    "Works",
    "Hive",
    "Lab",
    "House",
    "Star",
    "Key",
    "Tone",
    "Shift",
    "Frame",
    "Link",
]
AGENCY_SUFFIX = ["Pro", "LLC", "Inc", "Group", "Entertainment", "Agency", "Ltd", "Studio"]


def tier_budget_range(tier: AgencyTier) -> tuple[int, int]:
    return {
        "garage": (180_000, 1_600_000),
        "small": (900_000, 5_500_000),
        "medium": (3_500_000, 16_000_000),
        "large": (11_000_000, 48_000_000),
        "elite": (32_000_000, 130_000_000),
    }[tier]


def pick_weighted_index(seed: int, weights: list[float]) -> tuple[int, int]:
    r, s = rnd(seed)
    total = sum(weights)
    t = r * total
    acc = 0.0
    for i, w in enumerate(weights):
        acc += w
        if t < acc:
            return i, s
    return len(weights) - 1, s


def romaji_owner_name(seed: int) -> tuple[str, int]:
    r, s = rnd(seed)
    a = SYL_A[int(r * len(SYL_A))]
    r, s = rnd(s)
    b = SYL_B[int(r * len(SYL_B))].capitalize()
    return f"{b} {a}", s


def agency_name(seed: int) -> tuple[str, int]:
    r, s = rnd(seed)
    p1 = AGENCY_P1[int(r * len(AGENCY_P1))]
    r, s = rnd(s)
    p2 = AGENCY_P2[int(r * len(AGENCY_P2))]
    r, s = rnd(s)
    suf = AGENCY_SUFFIX[int(r * len(AGENCY_SUFFIX))]
    return f"{p1} {p2} {suf}", s


def archetype_for_tier(seed: int, tier: AgencyTier) -> tuple[str, int]:
    allowed = [a for a, tiers in ARCHETYPES if tier in tiers]
    if not allowed:
        allowed = [ARCHETYPES[0][0]]
    r, s = rnd(seed)
    return allowed[int(r * len(allowed))], s


@dataclass
class RivalAgencyOut:
    id: str
    name: str
    tier: AgencyTier
    budgetYen: int
    regionId: str
    archetypeKey: str
    strategy: str
    ownerNameRomaji: str
    ownerPersonalityKey: str
    specialty: str | None
    aestheticKey: str
    buyoutPattern: str
    internalCulture: str


@dataclass
class StaffMarketOut:
    id: str
    roleKey: str
    nameRomaji: str
    regionId: str
    skill: int
    dedication: int
    adaptability: int
    peopleSkills: int
    salaryYenPerMonth: int


@dataclass
class ScoutOut:
    id: str
    nameRomaji: str
    level: int
    xp: int
    specialty: str | None
    regionId: str
    status: str


@dataclass
class ComposerOut:
    id: str
    nameRomaji: str
    nameJp: str
    specialty: str
    regionId: str
    costTier: int
    royaltyRate: float
    fameSeed: float


def make_rival_list(seed: int) -> tuple[list[RivalAgencyOut], int]:
    s = seed
    tiers: list[AgencyTier] = []
    for tier, n in zip(TIER_ORDER, TIER_COUNTS, strict=True):
        tiers.extend([tier] * n)
    # Fisher-Yates shuffle (determinístico)
    for i in range(len(tiers) - 1, 0, -1):
        r, s = rnd(s)
        j = int(r * (i + 1))
        tiers[i], tiers[j] = tiers[j], tiers[i]

    out: list[RivalAgencyOut] = []
    for idx, tier in enumerate(tiers):
        arch, s = archetype_for_tier(s, tier)
        nm, s = agency_name(s ^ (idx * 0xB529))
        owner, s = romaji_owner_name(s ^ (idx * 0xC62B))
        r, s = rnd(s)
        region = REGIONS[int(r * len(REGIONS))]
        r, s = rnd(s)
        strategy = STRATEGIES[int(r * len(STRATEGIES))]
        r, s = rnd(s)
        personality = OWNER_PERSONALITIES[int(r * len(OWNER_PERSONALITIES))]
        r, s = rnd(s)
        aesthetic = AESTHETICS[int(r * len(AESTHETICS))]
        lo, hi = tier_budget_range(tier)
        r, s = rnd(s)
        budget = lo + int(r * (hi - lo))
        specialty: str | None
        if strategy == "specialist":
            r, s = rnd(s)
            specialty = ["vocal", "dance", "variety", "acting", "digital"][int(r * 5)]
        else:
            specialty = None
        buyout = "passive"
        if arch == "rival.buyoutPredator":
            buyout = "predatory"
        elif arch in ("rival.premiumBoutique", "rival.legacyInstitution"):
            buyout = "opportunistic"
        elif arch == "rival.familyAgency":
            buyout = "passive"
        culture = "professional"
        if arch == "rival.talentBurnout":
            culture = "toxic"
        elif arch in ("rival.familyAgency", "rival.nicheSeiyuu"):
            culture = "nurturing"
        elif arch == "rival.buyoutPredator":
            culture = "demanding"

        out.append(
            RivalAgencyOut(
                id=f"rival_{idx + 1:02d}",
                name=nm,
                tier=tier,
                budgetYen=budget,
                regionId=region,
                archetypeKey=arch,
                strategy=strategy,
                ownerNameRomaji=owner,
                ownerPersonalityKey=personality,
                specialty=specialty,
                aestheticKey=aesthetic,
                buyoutPattern=buyout,
                internalCulture=culture,
            )
        )
    return out, s


def make_staff_market(seed: int, count: int) -> tuple[list[StaffMarketOut], int]:
    s = seed
    weights = [w for _, w in STAFF_ROLES]
    roles = [k for k, _ in STAFF_ROLES]
    out: list[StaffMarketOut] = []
    for i in range(count):
        ri, s = pick_weighted_index(s, weights)
        role_key = roles[ri]
        owner, s = romaji_owner_name(s ^ (i * 0x2D31))
        name = f"{owner} ({role_key.split('.')[-1]})"
        r, s = rnd(s)
        region = REGIONS[int(r * len(REGIONS))]
        r, s = rnd(s)
        base = 4 + int(r * 12)
        r, s = rnd(s)
        skill = clamp(base + int((r - 0.5) * 6), 1, 20)
        r, s = rnd(s)
        dedication = clamp(base + int((r - 0.5) * 8), 1, 20)
        r, s = rnd(s)
        adaptability = clamp(5 + int(r * 14), 1, 20)
        r, s = rnd(s)
        people_skills = clamp(5 + int(r * 14), 1, 20)
        salary = 180_000 + skill * 45_000 + dedication * 12_000
        out.append(
            StaffMarketOut(
                id=f"stf_{i + 1:04d}",
                roleKey=role_key,
                nameRomaji=name,
                regionId=region,
                skill=skill,
                dedication=dedication,
                adaptability=adaptability,
                peopleSkills=people_skills,
                salaryYenPerMonth=salary,
            )
        )
    return out, s


def make_scouts(seed: int, count: int) -> tuple[list[ScoutOut], int]:
    s = seed
    out: list[ScoutOut] = []
    for i in range(count):
        owner, s = romaji_owner_name(s ^ (i * 0x51ED))
        name = f"{owner}"
        r, s = rnd(s)
        region = REGIONS[int(r * len(REGIONS))]
        r, s = rnd(s)
        level = max(1, min(20, int(r * r * 21)))
        r, s = rnd(s)
        xp = int(r * 1000)
        r, s = rnd(s)
        spec = SCOUT_SPECIALTIES[int(r * len(SCOUT_SPECIALTIES))]
        out.append(
            ScoutOut(
                id=f"sct_{i + 1:04d}",
                nameRomaji=name,
                level=level,
                xp=xp,
                specialty=spec,
                regionId=region,
                status="free",
            )
        )
    return out, s


def make_composers(seed: int, count: int) -> tuple[list[ComposerOut], int]:
    s = seed
    out: list[ComposerOut] = []
    for i in range(count):
        owner, s = romaji_owner_name(s ^ (i * 0x6D9B))
        r, s = rnd(s)
        spec = COMPOSER_SPECIALTIES[int(r * len(COMPOSER_SPECIALTIES))]
        r, s = rnd(s)
        region = REGIONS[int(r * len(REGIONS))]
        r, s = rnd(s)
        cost_tier = max(1, min(10, int(r * 10) + 1))
        r, s = rnd(s)
        royalty = round(clampf(0.05 + r * 0.1, 0.05, 0.15), 3)
        r, s = rnd(s)
        fame_seed = round(r * 8.0, 2)
        jp = owner.replace(" ", "・")
        out.append(
            ComposerOut(
                id=f"cmp_{i + 1:04d}",
                nameRomaji=owner,
                nameJp=jp,
                specialty=spec,
                regionId=region,
                costTier=cost_tier,
                royaltyRate=royalty,
                fameSeed=fame_seed,
            )
        )
    return out, s


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--seed", type=int, default=42_001)
    p.add_argument("--staff-count", type=int, default=800, help="Tamanho do pool de staff no mercado")
    p.add_argument("--scouts", type=int, default=500)
    p.add_argument("--composers", type=int, default=160)
    p.add_argument("--rivals-only", action="store_true", help="Só as 50 agências rivais")
    p.add_argument("-o", "--output", type=str, default="-")
    args = p.parse_args()

    seed = args.seed
    rivals, s = make_rival_list(seed)
    payload: dict[str, Any] = {
        "schemaVersion": 1,
        "seed": seed,
        "tierPyramid": {t: c for t, c in zip(TIER_ORDER, TIER_COUNTS, strict=True)},
        "rivalAgencies": [asdict(x) for x in rivals],
        "generationNotes": {
            "staffRolesWeights": {k: v for k, v in STAFF_ROLES},
            "rivalArchetypes": [a[0] for a in ARCHETYPES],
        },
    }
    if not args.rivals_only:
        staff, s = make_staff_market(s, args.staff_count)
        sc, s = make_scouts(s, args.scouts)
        comp, _s = make_composers(s, args.composers)
        payload["staffMarket"] = [asdict(x) for x in staff]
        payload["scouts"] = [asdict(x) for x in sc]
        payload["composers"] = [asdict(x) for x in comp]

    text = json.dumps(payload, ensure_ascii=False, indent=2)
    if args.output == "-":
        sys.stdout.write(text)
    else:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)


if __name__ == "__main__":
    main()
