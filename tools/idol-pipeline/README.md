# Pipeline idols (LLM + merge)

## Fluxo completo

1. Gerar skeleton: `tools/world_pack/generate_idols_stratified.py`
2. Enriquecer (Gemini LLM ou dry-run): `llm_enrich.py` — gera nomes, background, physical, portrait prompts
3. Fundir: `merge_enriched.py` — junta skeleton + sidecar, sobrescreve nomes v2
4. Retratos MVP: `tools/portrait-gen/generate_mvp_gemini.py` com sidecar enriquecido
5. Upload: `tools/portrait-gen/upload_to_supabase.mjs` para bucket `idol-images`

## Enriquecimento de idols

```bash
# Sem API (placeholders válidos para pipeline)
python tools/idol-pipeline/llm_enrich.py --input skeleton.json --output tools/idol-pipeline/output/enriched_sidecar.json --dry-run

# Com Gemini (GEMINI_API_KEY)
python tools/idol-pipeline/llm_enrich.py --input skeleton.json --output tools/idol-pipeline/output/enriched_sidecar.json

# Retomar batch interrompido
python tools/idol-pipeline/llm_enrich.py --input skeleton.json --output tools/idol-pipeline/output/enriched_sidecar.json --resume
```

## Enriquecimento de agências

```bash
# Gerar skeletons
python tools/world_pack/generate_agencies_skeleton.py --count 50 -o tools/idol-pipeline/output/agencies_skeleton.json

# Enriquecer com Gemini
python tools/idol-pipeline/llm_enrich_agencies.py --input tools/idol-pipeline/output/agencies_skeleton.json --output tools/idol-pipeline/output/agencies_enriched.json --idol-names-json tools/idol-pipeline/output/enriched_sidecar.json
```

## Merge

```bash
python tools/idol-pipeline/merge_enriched.py --skeleton skeleton.json --sidecar tools/idol-pipeline/output/enriched_sidecar.json -o idols_merged.json --strict
```

## Retratos MVP (Gemini Image)

```bash
python tools/portrait-gen/generate_mvp_gemini.py --sidecar tools/idol-pipeline/output/enriched_sidecar.json --output-dir tools/portrait-gen/output/portraits --skip-existing
```

## Schemas

- `schemas/idol_enriched.schema.json` (v2: inclui nameRomaji, nameJp)
- `schemas/enriched_sidecar.schema.json`
