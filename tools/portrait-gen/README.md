# Gerador de retratos (ComfyUI)

**Fluxo oficial:** retratos usam apenas `enrichment.portraitPromptPositive` (LLM / dry-run), não `visualSeed` + listas de cabelo/olhos. O legado (`--legacy-visual-seed`) existe só para desenvolvimento.

Ver [`tools/idol-pipeline/README.md`](../idol-pipeline/README.md).

## Orquestração MVP (pack + LLM + matriz GDD)

Encadeia **skeleton** (idealmente `generate_idols_stratified.py`), **enrichment** (`llm_enrich.py` + `merge_enriched.py` ou `--smoke-enrich`), e **prompts** alinhados ao GDD [`docs/gdd/character-generation.md`](../../docs/gdd/character-generation.md):

| Modo | Retratos por idol | Uso |
|------|-------------------|-----|
| `quick` | 1 (idade 18, `happy`) | smoke, dev, primeiro lote |
| `roster` | 3 (`happy` / `serious` / `sad`) na idade atual da ficha | UI de elenco sem matriz completa |
| `full` | 24 (8 idades × 3 expressões) | alvo longo prazo; volume = `N × 24` jobs ComfyUI |

```bash
# Pack com quotas GDD + dry-run LLM + merge + prompts (recomendado)
python tools/portrait-gen/orchestrate_mvp_idols.py --gen-stratified --count 100 --smoke-enrich --mode quick --write-prompts-only

# Pack legado (sem quotas) + obrigatório --legacy-visual-seed se não houver enrichment
python tools/portrait-gen/orchestrate_mvp_idols.py --gen-world-pack --count 100 --legacy-visual-seed --mode quick --write-prompts-only

# JSON já fundido (idols_merged.json), matriz completa
python tools/portrait-gen/orchestrate_mvp_idols.py --world-pack tools/idol-pipeline/output/idols_merged.json --mode full --write-prompts-only

# ComfyUI
set COMFYUI_HOST=https://seu-endpoint.proxy.runpod.net
python tools/portrait-gen/orchestrate_mvp_idols.py --world-pack tools/idol-pipeline/output/idols_merged.json --mode quick --run-comfy
```

Saídas em `--out` (default `tools/portrait-gen/output/mvp_run/`): `character_sheets.json`, `prompts_batch.json`, `mvp_portrait_manifest.json`.

**IdolCore** em camelCase; com LLM cada entrada inclui `enrichment` após merge.

## Fluxo manual (passo a passo)

1. **Gerar prompts** a partir de idols (JSON do World Pack ou dados de teste embutidos):

   ```bash
   # Na raiz do repositório — dados de teste (legado visualSeed)
   python tools/portrait-gen/generate_prompts.py
   # Pack fundido com enrichment (default)
   python tools/portrait-gen/generate_prompts.py --input tools/idol-pipeline/output/idols_merged.json --output tools/portrait-gen/output
   # Skeleton sem enrichment (só dev)
   python tools/portrait-gen/generate_prompts.py --input skeleton.json --legacy-visual-seed --output tools/portrait-gen/output
   ```

   Saídas: `character_sheets.json`, `char_XXXXX_sheet.json`, `prompts_batch.json`.

2. **Gerar imagens** num ComfyUI (local ou RunPod). Defina `COMFYUI_HOST` ou `--host`.

   ```bash
   set COMFYUI_HOST=https://seu-endpoint.proxy.runpod.net
   python tools/portrait-gen/comfyui_runner.py --checkpoint NomeDoSeuCheckpoint.safetensors
   python tools/portrait-gen/comfyui_runner.py --dry-run
   python tools/portrait-gen/comfyui_runner.py --only char_00001_happy_18.png
   ```

3. **Copiar para o cliente web** (ficheiros estáticos SvelteKit em `/portraits/...`):

   ```bash
   python tools/portrait-gen/copy_to_static.py
   ```

   Para produção, o alvo é **Supabase Storage** (`idol-images`); este passo serve para desenvolvimento local.

### Upload para Supabase (CG-12)

1. Gere `manifest.example.json` (ou manifest real do lote) com `idolId`, `localPath`, `storagePath`.
2. Defina `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no ambiente.
3. Execute:

```bash
node tools/portrait-gen/upload_to_supabase.mjs --manifest tools/portrait-gen/manifest.example.json --base .
```

4. No cliente, use `getIdolPortraitPublicUrl` em [`src/lib/media/idol-image.ts`](../../src/lib/media/idol-image.ts) com `PUBLIC_SUPABASE_URL`.

## Notas

- O workflow API usa txt2img simples (Checkpoint → CLIP → KSampler → VAE → SaveImage). O nome do checkpoint tem de existir no servidor ComfyUI.
- SSL: o runner desativa verificação de certificado (útil em proxies RunPod); use apenas com hosts confiáveis.
