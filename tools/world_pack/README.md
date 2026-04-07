# World pack generator (P1-10 MVP)

## Idols — legado (LCG simples)

```bash
cd tools/world_pack
python generate_world_pack.py --seed 42001 --count 500 -o world_pack.json
```

## Idols — estratificado (GDD quotas de tier + `entryMonth`)

Usa as mesmas regras de tier/personalidade que `src/lib/simulation/stats.ts` (`stats_rules.py`).

```bash
cd tools/world_pack
python generate_idols_stratified.py --seed 42001 --count 120 --max-entry-month 240 -o world_pack.json
```

## Relatórios e balanceamento

Requer `pip install -r requirements.txt` (PyYAML).

```bash
python balance_report.py world_pack.json
python balance_report.py world_pack.json --resample-entry-months --output world_pack_balanced.json
python balance_personality.py world_pack.json -o world_pack_personality.json
```

Knobs em `balance_targets.yaml`.

O cliente carrega idols via `parseWorldPackIdolsJson` e sidecar LLM via `parseEnrichedSidecarJson` + `mergeIdolsWithEnrichment` em `src/lib/world-pack/loader.ts`.

## NPCs não-idol (rivais + mercados)

`generate_world_npcs.py` produz **50 agências rivais** (pirâmide 14/12/10/9/5 por tier),
opcionalmente **staff** (~800 default), **scouts** (500) e **compositores** (160). Mesma `seed` = mesmo universo.

```bash
cd tools/world_pack
# Só rivais (leve; exemplo versionado em sample/)
python generate_world_npcs.py --rivals-only --seed 42001 -o sample/rivals_50.seed42001.json

# Pack completo (ficheiro grande)
python generate_world_npcs.py --seed 42001 --staff-count 800 --scouts 500 --composers 160 -o world_npcs.json
```

Rivais no formato estendido (dono, arquétipo, …): `parseWorldPackNpcsJson` em `loader.ts` devolve só `RivalAgencyStub[]` até a UI consumir o resto.
