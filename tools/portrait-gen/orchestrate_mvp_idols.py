#!/usr/bin/env python3
"""
Orquestra o pipeline MVP de idols: World Pack (dados) → prompts ComfyUI → (opcional) geração no ComfyUI.

Alinha-se ao GDD `docs/gdd/character-generation.md`:
  - MVP alvo: ~100 idols (configurável; world_pack default no repo é 120).
  - Matriz completa: 8 idades × 3 expressões = 24 imagens/idol.

Modos:
  quick      — 1 retrato/idol (idade 18, happy): ideal para smoke / dev.
  roster     — idade de jogo por idol (campo age do world pack), 3 expressões: menos runs que full.
  full       — todas as idades GDD × 3 expressões (volume grande).

Uso (na raiz do repositório):
  python tools/portrait-gen/orchestrate_mvp_idols.py --gen-world-pack --mode quick
  python tools/portrait-gen/orchestrate_mvp_idols.py --world-pack path/to/idols.json --mode full --write-prompts-only
  python tools/portrait-gen/orchestrate_mvp_idols.py --world-pack tools/world_pack/world_pack_mvp.json --mode quick --run-comfy
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from dataclasses import asdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
WORLD_PACK_SCRIPT = REPO_ROOT / "tools" / "world_pack" / "generate_world_pack.py"
STRATIFIED_SCRIPT = REPO_ROOT / "tools" / "world_pack" / "generate_idols_stratified.py"
LLM_ENRICH_SCRIPT = REPO_ROOT / "tools" / "idol-pipeline" / "llm_enrich.py"
MERGE_ENRICHED_SCRIPT = REPO_ROOT / "tools" / "idol-pipeline" / "merge_enriched.py"
COMFY_RUNNER = REPO_ROOT / "tools" / "portrait-gen" / "comfyui_runner.py"
_PORTRAIT_GEN_DIR = Path(__file__).resolve().parent

# GDD character-generation.md — idades da matriz
GDD_PORTRAIT_AGES = (8, 12, 15, 18, 24, 27, 30, 35)
GDD_EXPRESSIONS = ("happy", "serious", "sad")

_DEFAULT_MVP_COUNT = 100


def _load_generate_prompts():
    """Importa generate_prompts do mesmo diretório sem exigir package."""
    if str(_PORTRAIT_GEN_DIR) not in sys.path:
        sys.path.insert(0, str(_PORTRAIT_GEN_DIR))
    import generate_prompts as gp  # noqa: PLC0415

    return gp


def run_world_pack(seed: int, count: int, output_json: Path) -> None:
    output_json.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(WORLD_PACK_SCRIPT),
        "--seed",
        str(seed),
        "--count",
        str(count),
        "-o",
        str(output_json),
    ]
    subprocess.run(cmd, check=True, cwd=str(REPO_ROOT))


def run_stratified(seed: int, count: int, output_json: Path, max_entry_month: int = 240) -> None:
    output_json.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(STRATIFIED_SCRIPT),
        "--seed",
        str(seed),
        "--count",
        str(count),
        "--max-entry-month",
        str(max_entry_month),
        "-o",
        str(output_json),
    ]
    subprocess.run(cmd, check=True, cwd=str(REPO_ROOT))


def run_enrich_dry(skeleton: Path, sidecar: Path) -> None:
    sidecar.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(LLM_ENRICH_SCRIPT),
        "--input",
        str(skeleton),
        "--output",
        str(sidecar),
        "--dry-run",
    ]
    subprocess.run(cmd, check=True, cwd=str(REPO_ROOT))


def run_merge(skeleton: Path, sidecar: Path, merged: Path, strict: bool = True) -> None:
    merged.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(MERGE_ENRICHED_SCRIPT),
        "--skeleton",
        str(skeleton),
        "--sidecar",
        str(sidecar),
        "-o",
        str(merged),
    ]
    if strict:
        cmd.append("--strict")
    subprocess.run(cmd, check=True, cwd=str(REPO_ROOT))


def load_idols(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or not data:
        raise SystemExit(f"Ficheiro inválido ou vazio: {path}")
    return data


def build_sheets_for_mode(
    gp,
    idols: list[dict],
    mode: str,
    legacy_visual_seed: bool,
) -> tuple[list[dict], dict]:
    """
    Retorna (lista de asdict(CharacterSheet), manifest meta).
    """
    sheets: list[dict] = []
    manifest_jobs: list[dict] = []

    def make_sheet(idol: dict, age: int, expr: str):
        if legacy_visual_seed:
            return gp.generate_sheet(idol, age=age, expression=expr)
        return gp.generate_sheet_from_enrichment(idol, age=age, expression=expr)

    if mode == "quick":
        for idol in idols:
            sh = make_sheet(idol, 18, "happy")
            d = asdict(sh)
            sheets.append(d)
            manifest_jobs.append(
                {
                    "idol_key": d["idol_key"],
                    "age": 18,
                    "expression": "happy",
                    "filename": d["filename"],
                }
            )
    elif mode == "roster":
        for idol in idols:
            age = int(idol.get("age", 18))
            age = max(8, min(35, age))
            for expr in GDD_EXPRESSIONS:
                sh = make_sheet(idol, age, expr)
                d = asdict(sh)
                sheets.append(d)
                manifest_jobs.append(
                    {
                        "idol_key": d["idol_key"],
                        "age": age,
                        "expression": expr,
                        "filename": d["filename"],
                    }
                )
    elif mode == "full":
        for idol in idols:
            for age in GDD_PORTRAIT_AGES:
                for expr in GDD_EXPRESSIONS:
                    sh = make_sheet(idol, age, expr)
                    d = asdict(sh)
                    sheets.append(d)
                    manifest_jobs.append(
                        {
                            "idol_key": d["idol_key"],
                            "age": age,
                            "expression": expr,
                            "filename": d["filename"],
                        }
                    )
    else:
        raise SystemExit(f"Modo desconhecido: {mode}")

    meta = {
        "mode": mode,
        "idol_count": len(idols),
        "portrait_jobs": len(sheets),
        "ages": list(GDD_PORTRAIT_AGES) if mode == "full" else None,
        "expressions": list(GDD_EXPRESSIONS),
    }
    return sheets, {"meta": meta, "jobs": manifest_jobs}


def write_outputs(
    out_dir: Path,
    sheets: list[dict],
    manifest: dict,
) -> tuple[Path, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    combined = out_dir / "character_sheets.json"
    with combined.open("w", encoding="utf-8") as f:
        json.dump(sheets, f, indent=2, ensure_ascii=False)

    manifest_path = out_dir / "mvp_portrait_manifest.json"
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    batch_path = out_dir / "prompts_batch.json"
    batch = [
        {
            "filename": s["filename"],
            "prompt": s["prompt"],
            "negative_prompt": s["negative_prompt"],
        }
        for s in sheets
    ]
    with batch_path.open("w", encoding="utf-8") as f:
        json.dump(batch, f, indent=2, ensure_ascii=False)

    return batch_path, manifest_path


def run_comfy(batch_path: Path, host: str, checkpoint: str, output_portraits: Path) -> None:
    cmd = [
        sys.executable,
        str(COMFY_RUNNER),
        "--input",
        str(batch_path),
        "--output",
        str(output_portraits),
        "--host",
        host,
        "--checkpoint",
        checkpoint,
    ]
    env = os.environ.copy()
    if host and not os.environ.get("COMFYUI_HOST"):
        env["COMFYUI_HOST"] = host
    subprocess.run(cmd, check=True, cwd=str(REPO_ROOT), env=env)


def main() -> None:
    p = argparse.ArgumentParser(description="Orquestrar world pack MVP + prompts/retratos ComfyUI")
    p.add_argument(
        "--gen-world-pack",
        action="store_true",
        help="Gera JSON com tools/world_pack/generate_world_pack.py (legado, sem quotas tier)",
    )
    p.add_argument(
        "--gen-stratified",
        action="store_true",
        help="Gera JSON com quotas GDD (generate_idols_stratified.py)",
    )
    p.add_argument(
        "--smoke-enrich",
        action="store_true",
        help="Após skeleton: llm_enrich --dry-run + merge -> pack com enrichment",
    )
    p.add_argument(
        "--legacy-visual-seed",
        action="store_true",
        help="Prompts a partir de visualSeed (sem LLM). Default: exige enrichment no JSON.",
    )
    p.add_argument(
        "--sidecar-out",
        type=Path,
        default=REPO_ROOT / "tools" / "idol-pipeline" / "output" / "enriched_sidecar.json",
    )
    p.add_argument(
        "--merged-out",
        type=Path,
        default=REPO_ROOT / "tools" / "idol-pipeline" / "output" / "idols_merged.json",
    )
    p.add_argument("--seed", type=int, default=42_001, help="Seed do world pack (--gen-world-pack)")
    p.add_argument(
        "--count",
        type=int,
        default=_DEFAULT_MVP_COUNT,
        help=f"Número de idols no world pack gerado (default {_DEFAULT_MVP_COUNT}, GDD MVP ~100)",
    )
    p.add_argument(
        "--world-pack",
        type=Path,
        help="JSON de idols (IdolCore / world pack). Obrigatório se não usar --gen-world-pack",
    )
    p.add_argument(
        "--world-pack-out",
        type=Path,
        default=REPO_ROOT / "tools" / "world_pack" / "world_pack_mvp.json",
        help="Destino ao gerar world pack",
    )
    p.add_argument(
        "--mode",
        choices=("quick", "roster", "full"),
        default="quick",
        help="quick=1 retrato/idol; roster=idade do save × 3 expr; full=matriz GDD 8×3",
    )
    p.add_argument(
        "--out",
        type=Path,
        default=REPO_ROOT / "tools" / "portrait-gen" / "output" / "mvp_run",
        help="Diretório de saída (character_sheets, manifest, prompts_batch)",
    )
    p.add_argument(
        "--write-prompts-only",
        action="store_true",
        help="Não invoca ComfyUI (só JSON)",
    )
    p.add_argument("--run-comfy", action="store_true", help="Após prompts, chamar comfyui_runner.py")
    p.add_argument(
        "--comfy-host",
        default=os.environ.get("COMFYUI_HOST", "http://127.0.0.1:8188"),
        help="URL base ComfyUI",
    )
    p.add_argument(
        "--checkpoint",
        default="NetaYumev35_pretrained_all_in_one.safetensors",
        help="Nome do checkpoint no servidor ComfyUI",
    )
    p.add_argument(
        "--portraits-dir",
        type=Path,
        default=REPO_ROOT / "tools" / "portrait-gen" / "portraits" / "mvp",
        help="Onde gravar PNGs quando --run-comfy",
    )
    args = p.parse_args()

    pack_path = args.world_pack
    if args.gen_stratified and args.gen_world_pack:
        p.error("Use apenas um de --gen-stratified ou --gen-world-pack")
    if args.gen_world_pack:
        print(f"Gerando world pack: seed={args.seed} count={args.count} -> {args.world_pack_out}")
        run_world_pack(args.seed, args.count, args.world_pack_out)
        pack_path = args.world_pack_out
    elif args.gen_stratified:
        print(f"Gerando pack estratificado: seed={args.seed} count={args.count} -> {args.world_pack_out}")
        run_stratified(args.seed, args.count, args.world_pack_out)
        pack_path = args.world_pack_out
    if pack_path is None:
        p.error("Indique --world-pack, --gen-world-pack ou --gen-stratified")

    if args.smoke_enrich:
        print(f"Enrichment dry-run -> {args.sidecar_out}")
        run_enrich_dry(Path(pack_path), args.sidecar_out)
        print(f"Merge -> {args.merged_out}")
        run_merge(Path(pack_path), args.sidecar_out, args.merged_out, strict=True)
        pack_path = args.merged_out

    gp = _load_generate_prompts()
    idols = load_idols(Path(pack_path))
    print(f"Carregados {len(idols)} idols de {pack_path}")

    legacy = args.legacy_visual_seed
    if not legacy:
        missing = [
            i.get("id")
            for i in idols
            if not (i.get("enrichment") and i["enrichment"].get("portraitPromptPositive"))
        ]
        if missing:
            raise SystemExit(
                f"Faltam enrichment em {len(missing)} idols (ex.: {missing[:3]}). "
                "Usar --smoke-enrich, ou llm_enrich + merge_enriched, ou --legacy-visual-seed."
            )

    sheets, manifest = build_sheets_for_mode(gp, idols, args.mode, legacy)
    batch_path, manifest_path = write_outputs(args.out, sheets, manifest)
    print(f"Escritos {len(sheets)} jobs -> {batch_path}")
    print(f"Manifest -> {manifest_path}")

    if args.run_comfy and not args.write_prompts_only:
        print(f"ComfyUI: {args.comfy_host} -> {args.portraits_dir}")
        run_comfy(batch_path, args.comfy_host, args.checkpoint, args.portraits_dir)
    elif args.run_comfy and args.write_prompts_only:
        print("Aviso: --write-prompts-only ignora --run-comfy")


if __name__ == "__main__":
    main()
