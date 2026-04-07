#!/usr/bin/env python3
"""
Portrait Prompt Generator — Star Idol Agency
Gera character sheets e prompts ComfyUI a partir de dados de idol (formato validado).

Usage (na raiz do repo):
    python tools/portrait-gen/generate_prompts.py
    python tools/portrait-gen/generate_prompts.py --input idols.json
    python tools/portrait-gen/generate_prompts.py --output tools/portrait-gen/output

Output: character_sheets.json, char_XXXXX_sheet.json, prompts_batch.json
"""

import json
import hashlib
import os
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional

_SCRIPT_DIR = Path(__file__).resolve().parent

# ============ VISUAL SEED → APPEARANCE MAPPING ============

HAIR_STYLES = [
    "long straight hair", "long wavy hair", "shoulder-length bob",
    "short pixie cut", "twin tails", "high ponytail",
    "side ponytail", "braided hair", "messy bun",
    "hime cut", "long hair with bangs", "short layered hair",
    "drill curls", "low twin tails", "half-up half-down",
    "long flowing hair with side part", "asymmetric bob",
    "straight bangs with long hair", "loose curls", "french braid",
]

HAIR_COLORS = [
    "black hair", "dark brown hair", "light brown hair",
    "blonde hair", "platinum blonde hair", "pink hair",
    "light pink hair", "red hair", "auburn hair",
    "blue hair", "light blue hair", "purple hair",
    "lavender hair", "silver hair", "mint green hair",
    "orange hair", "strawberry blonde hair", "ash brown hair",
    "dark blue hair", "rose gold hair",
]

EYE_COLORS = [
    "brown eyes", "dark brown eyes", "hazel eyes",
    "amber eyes", "green eyes", "blue eyes",
    "light blue eyes", "violet eyes", "red eyes",
    "golden eyes", "teal eyes", "grey eyes",
    "pink eyes", "deep purple eyes",
]

# Heterochromia combos with specific eye assignment
HETEROCHROMIA_COMBOS = [
    "heterochromia left eye blue right eye green",
    "heterochromia left eye red right eye blue",
    "heterochromia left eye amber right eye violet",
    "heterochromia left eye green right eye golden",
    "heterochromia left eye teal right eye amber",
]

SKIN_TONES = [
    "fair skin", "light skin", "pale skin",
    "warm skin tone", "tan skin", "medium skin tone",
    "porcelain skin", "peachy skin", "ivory skin",
    "olive skin tone",
]

FACE_SHAPES = [
    "round face", "oval face", "heart-shaped face",
    "delicate features", "sharp features", "soft features",
    "angular jawline", "baby face",
]

ACCESSORIES = [
    None, None, None, None, None,  # Most have no accessories
    "small hair ribbon", "flower hair clip", "star earrings",
    "thin glasses", "headband", "hair pins",
    "choker necklace", "small bow", "crystal hair clip",
    "cat ear headband",
]

# ============ STAT/DATA → PROMPT DESCRIPTORS ============

def visual_stat_to_attractiveness(visual: int) -> str:
    """Maps Visual stat (1-100) to beauty descriptors."""
    if visual >= 85:
        return "extremely beautiful, stunning, model-like beauty"
    if visual >= 70:
        return "very pretty, attractive, photogenic"
    if visual >= 55:
        return "cute, pleasant appearance"
    if visual >= 40:
        return "average appearance, plain but charming"
    return "ordinary looking, understated appearance"


def region_to_appearance_hints(region: str) -> str:
    """Maps region to subtle appearance tendencies (world pack usa regionId em minúsculas)."""
    r = (region or "").strip().lower()
    hints = {
        "tokyo": "modern stylish look, urban fashion sense",
        "kansai": "warm friendly appearance, expressive eyes",
        "osaka": "warm friendly appearance, expressive eyes",
        "fukuoka": "refined elegant features, gentle look",
        "nagoya": "classic beauty, traditional charm",
        "sapporo": "fresh natural beauty, clear complexion",
        "hokkaido": "fresh natural beauty, clear complexion",
        "other": "unique distinctive look",
    }
    return hints.get(r, "")


def personality_to_expression_hint(label: str) -> str:
    """Adds subtle expression nuances based on personality."""
    label_lower = label.lower()
    if "disciplinada" in label_lower or "trabalhadora" in label_lower:
        return "confident composed smile, determined eyes"
    if "bomba" in label_lower or "instavel" in label_lower:
        return "intense gaze, sharp smile"
    if "silencioso" in label_lower or "solitario" in label_lower:
        return "gentle subtle smile, calm serene expression"
    if "natural" in label_lower or "carismática" in label_lower:
        return "bright radiant smile, sparkling eyes"
    if "rebelde" in label_lower:
        return "confident smirk, bold expression"
    if "anjo" in label_lower or "coracao" in label_lower:
        return "warm gentle smile, kind soft eyes"
    if "perfeccionista" in label_lower:
        return "poised elegant smile, focused eyes"
    if "sonhadora" in label_lower:
        return "dreamy soft smile, wistful expression"
    if "sensivel" in label_lower or "artista" in label_lower:
        return "delicate thoughtful smile, expressive eyes"
    return "cheerful natural smile"


def seed_select(seed: int, options: list, salt: str = ""):
    """Deterministically select from a list using seed."""
    h = hashlib.md5(f"{seed}_{salt}".encode()).hexdigest()
    index = int(h[:8], 16) % len(options)
    return options[index]


# ============ CHARACTER SHEET ============

@dataclass
class CharacterSheet:
    idol_key: str
    rng_seed: int
    name_romaji: str
    name_jp: str
    gender: str
    age: int  # age for this portrait
    expression: str  # happy | sad | serious (+ aliases feliz, triste, seria)
    region: str
    visual_stat: int
    personality_label: str

    # Derived from visual_seed
    hair_style: str
    hair_color: str
    eye_color: str
    skin_tone: str
    face_shape: str
    accessory: Optional[str]

    # Generated prompt
    prompt: str
    negative_prompt: str
    filename: str


_EXPRESSION_PROMPTS: dict[str, str] = {
    "happy": "happy face, bright smile, cheerful expression",
    "feliz": "happy face, bright smile, cheerful expression",
    "sad": "sad face, downcast eyes, melancholic expression",
    "triste": "sad face, downcast eyes, melancholic expression",
    "serious": "serious expression, neutral face, composed look",
    "seria": "serious expression, neutral face, composed look",
}

_MALE_OUTFITS: list[tuple[str, str]] = [
    ("white idol jacket with silver trim", "white"),
    ("navy school blazer with white shirt", "blue"),
    ("black stage outfit with red accents", "red"),
    ("casual denim jacket over white tshirt", "blue"),
    ("grey formal suit jacket idol style", "white"),
    ("sporty track jacket white and blue", "blue"),
    ("traditional hakama inspired modern outfit", "red"),
    ("mint green casual shirt", "green"),
    ("purple concert jacket with gold trim", "gold"),
    ("elegant black vest white shirt", "white"),
]


def build_prompt(sheet: CharacterSheet) -> str:
    """
    Builds ComfyUI prompt in structured blocks matching proven format:
    style → hair → eyes → face → extras → clothing → age → expression → framing → background
    """
    lines = []

    # Block 1: Style + Age (age upfront helps the model understand)
    expr_key = (sheet.expression or "happy").lower()
    expression_desc = _EXPRESSION_PROMPTS.get(expr_key, _EXPRESSION_PROMPTS["happy"])
    g = (sheet.gender or "female").lower()
    if g == "male":
        lines.append(
            f"anime style {sheet.age} years old young man, bishounen, visual novel style, "
            f"clean lineart, flat colors, soft shading,"
        )
    else:
        lines.append(
            f"anime otome {sheet.age} years old woman, visual novel style, clean lineart, flat colors, soft shading,"
        )

    # Block 2: Hair
    lines.append(f"{sheet.hair_style}, {sheet.hair_color},")

    # Block 3: Eyes
    eye_shape = seed_select(
        sheet.rng_seed,
        ["round eyes", "almond eyes", "large eyes", "sharp eyes", "droopy eyes", "cat eyes"],
        "eye_shape",
    )
    lines.append(f"{eye_shape}, {sheet.eye_color},")

    # Block 4: Face
    face_extras = [sheet.face_shape]
    extra_feature = seed_select(
        sheet.rng_seed,
        [
            None,
            None,
            None,
            None,
            None,
            "blush",
            "freckles",
            "beauty mark",
            "dimples",
            "light blush",
        ],
        "face_extra",
    )
    if extra_feature:
        face_extras.append(extra_feature)
    lines.append(", ".join([f for f in face_extras if f]) + ",")

    # Block 5: Clothing — avoid same dominant color as hair
    OUTFITS = [
        ("white idol dress with pink ribbons", "pink"),
        ("school uniform with blue ribbon", "blue"),
        ("casual pink hoodie", "pink"),
        ("white stage outfit with silver accents", "white"),
        ("pastel yellow sundress", "yellow"),
        ("red and white cheerleader outfit", "red"),
        ("navy blazer with plaid skirt", "blue"),
        ("purple concert dress with sequins", "purple"),
        ("mint green casual blouse", "green"),
        ("white and gold idol costume", "gold"),
        ("denim jacket over white tshirt", "blue"),
        ("traditional kimono with modern twist", "red"),
        ("sporty crop top and jacket", "white"),
        ("elegant red dress", "red"),
        ("light blue summer dress", "blue"),
    ]

    HAIR_COLOR_MAP = {
        "pink": "pink", "light pink": "pink", "rose gold": "pink",
        "blue": "blue", "light blue": "blue", "dark blue": "blue",
        "red": "red", "auburn": "red",
        "purple": "purple", "lavender": "purple",
        "mint green": "green",
        "blonde": "yellow", "platinum blonde": "yellow", "strawberry blonde": "yellow",
        "orange": "orange",
        "silver": "white",
    }

    hair_dominant = "none"
    for key, color in HAIR_COLOR_MAP.items():
        if key in sheet.hair_color.lower():
            hair_dominant = color
            break

    outfits_pool = _MALE_OUTFITS if g == "male" else OUTFITS

    # Try up to 5 times to find non-clashing outfit
    outfit_text = None
    for attempt in range(5):
        idx = seed_select(sheet.rng_seed, list(range(len(outfits_pool))), f"outfit_{attempt}")
        candidate, outfit_color = outfits_pool[idx]
        if outfit_color != hair_dominant:
            outfit_text = candidate
            break
    if outfit_text is None:
        outfit_text = outfits_pool[0][0]

    lines.append(f"{outfit_text} plain solid color no print no text,")

    # Block 6: Expression
    lines.append(f"{expression_desc},")

    # Block 7: Framing (3/4 view, bust shot — chest line and above)
    lines.append("three-quarter front view, body slightly turned, mostly facing forward,")
    lines.append("close-up bust portrait, from chest up, shoulders and face focus,")
    lines.append("head slightly tilted, looking at camera, soft diagonal angle,")

    # Block 8: Background
    lines.append("plain black background, solid background, no text")

    return "\n\n".join(lines)


def sanitize_idol_key(raw_id) -> str:
    s = str(raw_id).replace("/", "_").replace("\\", "_").replace(":", "_")
    return s


def coerce_idol_record(raw: dict) -> dict:
    """
    Aceita world pack (camelCase, IdolCore) ou formato legado de teste (snake_case, id int).
    Produz chaves canónicas para generate_sheet.
    """
    if "nameRomaji" in raw or "visualSeed" in raw:
        vis = raw.get("visible") or {}
        return {
            "idol_key": sanitize_idol_key(raw.get("id", "unknown")),
            "rng_seed": int(raw.get("visualSeed", 0)),
            "name_romaji": raw.get("nameRomaji", ""),
            "name_jp": raw.get("nameJp", ""),
            "gender": raw.get("gender", "female"),
            "region": raw.get("regionId", raw.get("region", "tokyo")),
            "visual": int(vis.get("visual", 50)),
            "personality_label": raw.get("personalityLabelKey", raw.get("personality_label", "")),
        }

    _id = raw.get("id", 0)
    if isinstance(_id, int):
        idol_key = f"{_id:05d}"
    else:
        idol_key = sanitize_idol_key(_id)
    return {
        "idol_key": idol_key,
        "rng_seed": int(raw.get("visual_seed", _id if isinstance(_id, int) else 0)),
        "name_romaji": raw.get("name_romaji", ""),
        "name_jp": raw.get("name_jp", ""),
        "gender": raw.get("gender", "female"),
        "region": raw.get("region", "tokyo"),
        "visual": int(raw.get("visual", 50)),
        "personality_label": raw.get("personality_label", ""),
    }


def portrait_filename(idol_key: str, expression: str, age: int) -> str:
    return f"char_{sanitize_idol_key(idol_key)}_{expression}_{age}.png"


def expression_enrichment_fragment(expression: str) -> str:
    key = (expression or "happy").lower()
    return _EXPRESSION_PROMPTS.get(key, _EXPRESSION_PROMPTS["happy"])


def generate_sheet_from_enrichment(
    merged_idol: dict,
    age: int,
    expression: str = "happy",
) -> CharacterSheet:
    """
    Retrato: fonte de verdade = enrichment.portraitPromptPositive (+ physical em metadados).
    """
    en = merged_idol.get("enrichment")
    if not en or not en.get("portraitPromptPositive"):
        raise ValueError(
            f"Idol {merged_idol.get('id')} sem enrichment.portraitPromptPositive — "
            "correr tools/idol-pipeline/llm_enrich.py e merge_enriched.py (ou --dry-run)."
        )
    c = coerce_idol_record(merged_idol)
    idol_key = c["idol_key"]
    base = str(en["portraitPromptPositive"]).strip()
    expr_frag = expression_enrichment_fragment(expression)
    age_note = (
        f"Portrait shot at age {age}: same identity as the main description, "
        f"age-appropriate face and proportions, consistent features."
    )
    full_prompt = f"{base}\n\n{age_note}\nExpression for this variant: {expr_frag}."
    neg = str(en.get("portraitPromptNegative") or "").strip() or build_negative_prompt()
    ph = en.get("physical") or {}
    hair_style = str(ph.get("hairStyle", ""))
    hair_color = str(ph.get("hairColor", ""))
    eye_shape = str(ph.get("eyeShape", ""))
    eye_color = str(ph.get("eyeColor", ""))
    skin_tone = str(ph.get("skinTone", ""))
    accessory = str(ph.get("accessories", ""))
    eye_line = f"{eye_shape}, {eye_color}".strip().strip(",")

    return CharacterSheet(
        idol_key=idol_key,
        rng_seed=0,
        name_romaji=str(merged_idol.get("nameRomaji", c.get("name_romaji", "Unknown"))),
        name_jp=str(merged_idol.get("nameJp", c.get("name_jp", ""))),
        gender=str(merged_idol.get("gender", c.get("gender", "female"))),
        age=age,
        expression=expression,
        region=str(merged_idol.get("regionId", c.get("region", "tokyo"))),
        visual_stat=int((merged_idol.get("visible") or {}).get("visual", c.get("visual", 50))),
        personality_label=str(
            merged_idol.get("personalityLabelKey", c.get("personality_label", ""))
        ),
        hair_style=hair_style,
        hair_color=hair_color,
        eye_color=eye_line,
        skin_tone=skin_tone,
        face_shape="(enrichment)",
        accessory=accessory,
        prompt=full_prompt,
        negative_prompt=neg,
        filename=portrait_filename(idol_key, expression, age),
    )


def build_negative_prompt() -> str:
    return (
        "blurry, worst quality, low quality, jpeg artifacts, signature, "
        "watermark, username, error, deformed hands, bad anatomy, "
        "extra limbs, poorly drawn hands, poorly drawn face, mutation, "
        "deformed, extra eyes, extra arms, extra legs, malformed limbs, "
        "fused fingers, too many fingers, long neck, cross-eyed, "
        "bad proportions, missing arms, missing legs, extra digit, "
        "fewer digits, cropped, "
        "back view, over the shoulder, turned away, looking back, "
        "rear view, back facing, profile view, black clothes, "
        "full body, lower body, waist down, legs visible, "
        "wide shot, far away, distant, "
        "text, logo, stamp, print on clothes, graphic tee, "
        "words on clothing, letters, numbers on clothes"
    )


def generate_sheet(idol_data: dict, age: int = 18, expression: str = "happy") -> CharacterSheet:
    """Generates a character sheet from idol data (world pack camelCase ou legado)."""
    c = coerce_idol_record(idol_data)
    seed = int(c["rng_seed"])

    hair_style = seed_select(seed, HAIR_STYLES, "hair_style")
    hair_color = seed_select(seed, HAIR_COLORS, "hair_color")
    # ~10% chance of heterochromia based on seed
    _het_roll = int(hashlib.md5(f"{seed}_heterochromia".encode()).hexdigest()[:8], 16) % 100
    if _het_roll < 10:
        eye_color = seed_select(seed, HETEROCHROMIA_COMBOS, "heterochromia")
    else:
        eye_color = seed_select(seed, EYE_COLORS, "eye_color")
    skin_tone = seed_select(seed, SKIN_TONES, "skin_tone")
    face_shape = seed_select(seed, FACE_SHAPES, "face_shape")
    accessory = seed_select(seed, ACCESSORIES, "accessory")

    idol_key = c["idol_key"]
    filename = portrait_filename(idol_key, expression, age)

    sheet = CharacterSheet(
        idol_key=idol_key,
        rng_seed=seed,
        name_romaji=c.get("name_romaji", "Unknown"),
        name_jp=c.get("name_jp", ""),
        gender=c.get("gender", "female"),
        age=age,
        expression=expression,
        region=c.get("region", "tokyo"),
        visual_stat=int(c.get("visual", 50)),
        personality_label=c.get("personality_label", ""),
        hair_style=hair_style,
        hair_color=hair_color,
        eye_color=eye_color,
        skin_tone=skin_tone,
        face_shape=face_shape,
        accessory=accessory,
        prompt="",
        negative_prompt=build_negative_prompt(),
        filename=filename,
    )

    sheet.prompt = build_prompt(sheet)
    return sheet


# ============ Dados de teste (seeds determinísticos) ============

TEST_IDOLS = [
    {"id": 1,  "name_jp": "山田 玲",      "name_romaji": "Yamada Rei",        "gender": "Female", "region": "Tokyo",    "visual": 60,  "personality_label": "Estrela Disciplinada",  "visual_seed": 12345},
    {"id": 2,  "name_jp": "佐藤 美咲",    "name_romaji": "Sato Misaki",       "gender": "Female", "region": "Kansai",   "visual": 70,  "personality_label": "Bomba-Relogio",         "visual_seed": 20264},
    {"id": 3,  "name_jp": "鈴木 花",      "name_romaji": "Suzuki Hana",       "gender": "Female", "region": "Fukuoka",  "visual": 65,  "personality_label": "Pilar Silencioso",       "visual_seed": 28183},
    {"id": 4,  "name_jp": "田中 愛",      "name_romaji": "Tanaka Ai",         "gender": "Female", "region": "Nagoya",   "visual": 92,  "personality_label": "Ambiciosa Instavel",     "visual_seed": 36102},
    {"id": 5,  "name_jp": "高橋 結衣",    "name_romaji": "Takahashi Yui",     "gender": "Female", "region": "Hokkaido", "visual": 55,  "personality_label": "Talento Natural",        "visual_seed": 44021},
    {"id": 6,  "name_jp": "伊藤 楓",      "name_romaji": "Ito Kaede",         "gender": "Female", "region": "Other",    "visual": 60,  "personality_label": "Trabalhadora Dedicada",  "visual_seed": 51940},
    {"id": 7,  "name_jp": "渡辺 さくら",  "name_romaji": "Watanabe Sakura",   "gender": "Female", "region": "Tokyo",    "visual": 65,  "personality_label": "Espírito Livre",         "visual_seed": 59859},
    {"id": 8,  "name_jp": "中村 凛",      "name_romaji": "Nakamura Rin",      "gender": "Female", "region": "Kansai",   "visual": 70,  "personality_label": "Perfeccionista",         "visual_seed": 67778},
    {"id": 9,  "name_jp": "小林 真央",    "name_romaji": "Kobayashi Mao",     "gender": "Female", "region": "Fukuoka",  "visual": 80,  "personality_label": "Carismática Nata",       "visual_seed": 75697},
    {"id": 10, "name_jp": "加藤 ひなた",  "name_romaji": "Kato Hinata",       "gender": "Female", "region": "Nagoya",   "visual": 45,  "personality_label": "Diamante Bruto",         "visual_seed": 83616},
    {"id": 11, "name_jp": "吉田 七海",    "name_romaji": "Yoshida Nanami",    "gender": "Female", "region": "Hokkaido", "visual": 55,  "personality_label": "Veterana Sabia",         "visual_seed": 91535},
    {"id": 12, "name_jp": "松本 柚子",    "name_romaji": "Matsumoto Yuzu",    "gender": "Female", "region": "Other",    "visual": 55,  "personality_label": "Estrela Ascendente",     "visual_seed": 99454},
    {"id": 13, "name_jp": "井上 瑠璃",    "name_romaji": "Inoue Ruri",        "gender": "Female", "region": "Tokyo",    "visual": 50,  "personality_label": "Coracao de Ouro",        "visual_seed": 107373},
    {"id": 14, "name_jp": "木村 朝陽",    "name_romaji": "Kimura Asahi",      "gender": "Female", "region": "Kansai",   "visual": 60,  "personality_label": "Lobo Solitario",         "visual_seed": 115292},
    {"id": 15, "name_jp": "林 茉莉",      "name_romaji": "Hayashi Mari",      "gender": "Female", "region": "Fukuoka",  "visual": 65,  "personality_label": "Artista Sensivel",       "visual_seed": 123211},
    {"id": 16, "name_jp": "清水 心春",    "name_romaji": "Shimizu Koharu",    "gender": "Female", "region": "Nagoya",   "visual": 58,  "personality_label": "Lider Natural",          "visual_seed": 131130},
    {"id": 17, "name_jp": "森 陽菜",      "name_romaji": "Mori Hina",         "gender": "Female", "region": "Hokkaido", "visual": 75,  "personality_label": "Sonhadora",              "visual_seed": 139049},
    {"id": 18, "name_jp": "池田 莉子",    "name_romaji": "Ikeda Riko",        "gender": "Female", "region": "Other",    "visual": 55,  "personality_label": "Pragmatica",             "visual_seed": 146968},
    {"id": 19, "name_jp": "橋本 詩",      "name_romaji": "Hashimoto Uta",     "gender": "Female", "region": "Tokyo",    "visual": 85,  "personality_label": "Rebelde",                "visual_seed": 154887},
    {"id": 20, "name_jp": "山口 光",      "name_romaji": "Yamaguchi Hikari",  "gender": "Female", "region": "Kansai",   "visual": 50,  "personality_label": "Anjo",                   "visual_seed": 162806},
]


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Generate ComfyUI portrait prompts from idol data")
    parser.add_argument("--input", help="JSON file with idol data (default: test data)")
    parser.add_argument(
        "--output",
        type=Path,
        default=_SCRIPT_DIR / "output",
        help="Output directory (default: tools/portrait-gen/output)",
    )
    parser.add_argument("--age", type=int, default=18, help="Age for portraits (default: 18)")
    parser.add_argument("--expression", default="happy", help="Expression (default: happy)")
    parser.add_argument(
        "--legacy-visual-seed",
        action="store_true",
        help="Usar visualSeed/listas HAIR_* (legado). Sem isto, input precisa enrichment (LLM).",
    )
    args = parser.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except (OSError, ValueError):
            pass

    # Load idol data
    if args.input:
        with open(args.input, encoding="utf-8") as f:
            idols = json.load(f)
    else:
        idols = TEST_IDOLS
        print(f"Using test data ({len(idols)} idols)")

    use_legacy = args.legacy_visual_seed
    if args.input and not use_legacy:
        ens = [bool(x.get("enrichment") and x["enrichment"].get("portraitPromptPositive")) for x in idols]
        if all(ens):
            use_legacy = False
        elif not any(ens):
            print(
                "Input sem enrichment: usar --legacy-visual-seed para o gerador antigo (visualSeed) "
                "ou correr llm_enrich + merge_enriched.",
                file=sys.stderr,
            )
            sys.exit(1)
        else:
            print("Pack misto (alguns com/sem enrichment). Corrigir input.", file=sys.stderr)
            sys.exit(1)
    else:
        if not args.input:
            use_legacy = True

    args.output.mkdir(parents=True, exist_ok=True)

    sheets = []
    for idol in idols:
        if use_legacy:
            sheet = generate_sheet(idol, age=args.age, expression=args.expression)
        else:
            sheet = generate_sheet_from_enrichment(idol, age=args.age, expression=args.expression)
        sheets.append(asdict(sheet))

        # Print preview
        print(f"\n{'='*60}")
        print(f"  {sheet.filename}")
        print(f"  {sheet.name_romaji} ({sheet.name_jp})")
        print(f"  {sheet.hair_style}, {sheet.hair_color}, {sheet.eye_color}")
        print(f"  Visual: {sheet.visual_stat} | {sheet.personality_label}")
        print(f"  Prompt: {sheet.prompt[:100]}...")

    # Write combined file
    combined_path = args.output / "character_sheets.json"
    with open(combined_path, "w", encoding="utf-8") as f:
        json.dump(sheets, f, indent=2, ensure_ascii=False)
    print(f"\n\nWrote {len(sheets)} character sheets to {combined_path}")

    # Write individual sheets
    for sheet in sheets:
        safe = sanitize_idol_key(sheet["idol_key"])
        individual_path = args.output / f"char_{safe}_sheet.json"
        with open(individual_path, "w", encoding="utf-8") as f:
            json.dump(sheet, f, indent=2, ensure_ascii=False)

    # Write prompts-only file (for batch ComfyUI processing)
    prompts_path = args.output / "prompts_batch.json"
    batch = []
    for sheet in sheets:
        batch.append({
            "filename": sheet["filename"],
            "prompt": sheet["prompt"],
            "negative_prompt": sheet["negative_prompt"],
        })
    with open(prompts_path, "w", encoding="utf-8") as f:
        json.dump(batch, f, indent=2, ensure_ascii=False)
    print(f"Wrote batch prompts to {prompts_path}")


if __name__ == "__main__":
    main()
