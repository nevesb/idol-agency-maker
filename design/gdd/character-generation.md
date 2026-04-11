# Character Generation — ComfyUI + RunPod

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real
> **Supersedes**: visual-generator.md (sprite layering approach)

## Overview

Cada idol no jogo tem um rosto gerado por IA que envelhece ao longo
do tempo. Em vez de sprites modulares, usamos **ComfyUI com modelos de
difusao** rodando em servidores **RunPod** para gerar fotos de alta
qualidade em estilo anime/otome. A geracao e **offline em batch** — nao
em tempo real. Imagens sao pre-geradas, armazenadas em CDN, e o cliente
carrega a imagem correta baseado na idade e humor da idol.

O rosto de cada idol e **deterministico** — mesma seed gera mesma face
em todo playthrough. A face envelhece de forma coerente: uma idol de
8 anos e reconhecivelmente a mesma pessoa aos 35.

## Player Fantasy

O jogador ve a idol **crescer e envelhecer** ao longo dos anos. Aquela
trainee que chegou aos 12 anos com rosto de crianca se transforma na
ace vocal de 24 com rosto maduro. A veterana de 35 tem as marcas de uma
carreira longa. O envelhecimento nao e so numerico — e visual.

## Detailed Design

### 1. Matriz de Imagens por Idol

Cada idol requer **24 imagens** (8 idades × 3 expressoes):

| Idade | Expressao Feliz | Expressao Seria | Expressao Triste |
|---|---|---|---|
| **8 anos** | feliz_08 | seria_08 | triste_08 |
| **12 anos** | feliz_12 | seria_12 | triste_12 |
| **15 anos** | feliz_15 | seria_15 | triste_15 |
| **18 anos** | feliz_18 | seria_18 | triste_18 |
| **24 anos** | feliz_24 | seria_24 | triste_24 |
| **27 anos** | feliz_27 | seria_27 | triste_27 |
| **30 anos** | feliz_30 | seria_30 | triste_30 |
| **35 anos** | feliz_35 | seria_35 | triste_35 |

**Volume total:**
- MVP (100 idols): 100 × 24 = 2.400 imagens
- Vertical Slice (500 idols): 500 × 24 = 12.000 imagens
- Alpha (2.000 idols): 2.000 × 24 = 48.000 imagens
- Full Vision (5.000 idols): 5.000 × 24 = 120.000 imagens

### 2. Resolucao e Formato

| Propriedade | Valor |
|---|---|
| **Resolucao de geracao** | 512×512 (base de geracao) |
| **Resolucao de entrega** | 1024×1024 (upscale pos-geracao no pipeline) |
| **Formato** | WebP (qualidade 85, ~30-60KB por imagem) |
| **Estilo** | Anime/otome — consistente com estetica do jogo |
| **Enquadramento** | Retrato (busto pra cima), fundo neutro/transparente |
| **Thumbnail** | 128×128 WebP (pra listas, rosters) |

**Estimativa de storage:**
- 150KB media por imagem × 120.000 = ~18GB total (1024×1024 apos upscale)
- Thumbnails: ~5KB × 120.000 = ~600MB
- Total: ~19GB pra Full Vision

### 3. Seed e Determinismo

Cada idol tem uma `visual_seed` (uint64) fixa na database que determina:

```
visual_seed → {
  face_shape:      derivado da seed (oval, round, angular, heart, etc.)
  eye_shape:       derivado da seed
  eye_color:       derivado da seed
  hair_style:      derivado da seed (varia por idade — crianca vs adulta)
  hair_color:      derivado da seed
  skin_tone:       derivado da seed
  distinctive:     derivado da seed (sardas, sinal, etc.)
  body_type:       derivado da seed (slim, average, athletic — muda com idade)
}
```

A seed alimenta o prompt do ComfyUI de forma deterministica:
- Mesma seed = mesma face em qualquer geracao
- Regenerar uma idol produz resultado identico (ou muito proximo via IP-Adapter)

### 4. Consistencia Facial entre Idades

**Problema central:** Uma idol de 8 anos precisa ser reconhecivelmente
a mesma pessoa aos 35 anos.

**Abordagem tecnica (ComfyUI workflow):**

```
FASE 1: Gerar face base (idade 18 — referencia)
  1. Usar seed + descricao de features → gerar retrato base idade 18
  2. Este retrato e a "identidade" da idol
  3. Armazenar como reference image

FASE 2: Gerar variacoes de idade (usando IP-Adapter + Age LoRA)
  Para cada idade [8, 12, 15, 18, 24, 27, 30, 35]:
    1. Carregar reference image (idade 18)
    2. IP-Adapter: manter identidade facial (weight 0.6-0.8)
    3. Age LoRA ou prompt de idade: "8 year old child", "35 year old woman"
    4. Ajustar features proporcionais a idade:
       - 8-15: rosto mais redondo, olhos maiores, corpo menor
       - 18-24: proporcoes adultas, pele lisa
       - 27-35: linhas sutis, rosto mais anguloso, maturidade

FASE 3: Gerar expressoes (por idade)
  Para cada idade, 3 runs com prompt de expressao:
    - "happy smile, bright eyes, cheerful expression"
    - "serious expression, neutral face, composed look"
    - "sad expression, downcast eyes, melancholic"
  IP-Adapter mantem identidade, prompt controla expressao
```

### 5. Vestuario por Idade

Cada faixa etaria tem estilo de roupa distinto refletindo maturidade:

| Idade | Estilo de Roupa | Exemplos |
|---|---|---|
| **8 anos** | Infantil, casual, colorido | Camiseta estampada, overalls, lacos no cabelo |
| **12 anos** | Pre-adolescente, uniforme escolar | Sailor fuku, uniforme escolar, roupas simples |
| **15 anos** | Adolescente, tendencia jovem | Uniforme + acessorios, moda harajuku, roupas trendy |
| **18 anos** | Jovem adulta, debut style | Vestido de debut, roupa de palco basica, moda jovem |
| **24 anos** | Adulta, profissional idol | Roupa de performance estilizada, moda elegante |
| **27 anos** | Madura, sofisticada | Roupas de marca, estilo mais contido, elegancia |
| **30 anos** | Veterana, autoridade | Blazer casual, roupas premium, presenca madura |
| **35 anos** | Legado, classica | Estilo atemporal, roupas simples mas de qualidade |

**Regra:** A roupa e definida pelo prompt — nao precisa de modelo separado.
O prompt inclui descricao de roupa proporcional a idade.

### 6. Pipeline de Geracao (Python + ComfyUI + RunPod)

```
┌─────────────────────────────────────────────────────────┐
│                  Python Orchestrator                     │
│                                                         │
│  1. Ler idol database (seed, features)                  │
│  2. Pra cada idol:                                      │
│     a. Construir prompt base (seed → descricao)         │
│     b. Gerar reference image (idade 18, expressao seria)│
│     c. Pra cada idade × expressao:                      │
│        - Construir prompt (idade + expressao + roupa)    │
│        - Enviar pra ComfyUI via API                     │
│        - Aguardar resultado                             │
│        - Validar qualidade (CLIP score ou manual)       │
│        - Upscale pra 1024×1024 + thumbnail 128×128      │
│        - Salvar como WebP                               │
│     d. Upload batch pra Supabase Storage                │
│  3. Registrar manifest (idol_id → URLs das imagens)     │
│                                                         │
│  Paralelismo: N workers simultaneos (limitado por GPU)  │
│  Retry: 3 tentativas por imagem com fallback            │
│  Checkpoint: salva progresso — pode retomar se cair     │
└──────────────────┬──────────────────────────────────────┘
                   │ API HTTP
                   ▼
┌─────────────────────────────────────────────────────────┐
│              RunPod (Serverless GPU)                     │
│                                                         │
│  ComfyUI endpoint com:                                  │
│  - Modelo base: animagine-xl ou similar (anime style)   │
│  - IP-Adapter: face consistency                         │
│  - Age LoRA: aging progression                          │
│  - Expression control via prompt                        │
│                                                         │
│  Tempo estimado por imagem: ~5-10 segundos              │
│  Tempo por idol (24 imgs): ~2-4 minutos                 │
│  Tempo pra 100 idols (MVP): ~4-7 horas                 │
│  Tempo pra 5.000 idols (Full): ~8-14 dias (paralelo)   │
│  Custo estimado: ~$0.01-0.02 por imagem                 │
│  Custo total (120K imgs): ~$1.200-2.400                 │
└─────────────────────────────────────────────────────────┘
                   │ Upload
                   ▼
┌─────────────────────────────────────────────────────────┐
│           Supabase Storage / CDN                        │
│                                                         │
│  Estrutura:                                             │
│  idols/{idol_id}/                                       │
│  ├── ref.webp            (reference face)               │
│  ├── age_08_happy.webp                                  │
│  ├── age_08_serious.webp                                │
│  ├── age_08_sad.webp                                    │
│  ├── age_12_happy.webp                                  │
│  ├── ...                                                │
│  ├── age_35_sad.webp                                    │
│  ├── thumb_08.webp       (thumbnail por idade)          │
│  ├── thumb_12.webp                                      │
│  └── ...                                                │
│                                                         │
│  Total: ~7GB (Full Vision)                              │
│  CDN: imagens servidas com cache longo (imutaveis)      │
└─────────────────────────────────────────────────────────┘
```

### 7. Selecao de Imagem no Cliente

O cliente escolhe qual imagem mostrar baseado no estado atual da idol:

```typescript
function getIdolImageUrl(idol: Idol, context: 'profile' | 'list'): string {
  // Determinar faixa etaria
  const ageBracket = getAgeBracket(idol.age);
  // ageBracket: 8, 12, 15, 18, 24, 27, 30, 35

  // Determinar expressao baseada em wellness
  let expression: 'happy' | 'serious' | 'sad';
  if (idol.happiness > 70) expression = 'happy';
  else if (idol.happiness > 40) expression = 'serious';
  else expression = 'sad';

  // Construir URL
  const size = context === 'list' ? 'thumb' : 'age';
  if (context === 'list') {
    return `${CDN_BASE}/idols/${idol.id}/thumb_${ageBracket}.webp`;
  }
  return `${CDN_BASE}/idols/${idol.id}/age_${ageBracket}_${expression}.webp`;
}

function getAgeBracket(age: number): number {
  if (age <= 10) return 8;
  if (age <= 13) return 12;
  if (age <= 16) return 15;
  if (age <= 21) return 18;
  if (age <= 25) return 24;
  if (age <= 28) return 27;
  if (age <= 32) return 30;
  return 35;
}
```

### 8. Geracao Incremental

Nao precisa gerar 120.000 imagens de uma vez:

| Fase | Idols | Imagens | Custo Est. | Tempo Est. |
|---|---|---|---|---|
| **Prototipo** | 10 | 240 | ~$5 | ~30 min |
| **MVP** | 100 | 2.400 | ~$50 | ~4-7 horas |
| **Vertical Slice** | 500 | 12.000 | ~$200 | ~2-3 dias |
| **Alpha** | 2.000 | 48.000 | ~$800 | ~5-7 dias |
| **Full Vision** | 5.000 | 120.000 | ~$2.000 | ~10-14 dias |

- Idols do MVP sao geradas primeiro (mais importantes)
- Idols restantes geradas em background enquanto desenvolvimento avanca
- Novas idols podem ser geradas sob demanda (pipeline reutilizavel)

### 9. Qualidade e Validacao

**Riscos de qualidade:**
- Face deformada (olhos, boca)
- Inconsistencia entre idades (parece outra pessoa)
- Expressao nao correspondente
- Artefatos de geracao

**Mitigacao:**
- **CLIP Score**: validacao automatica — imagem com score abaixo do threshold e regenerada
- **Face similarity**: comparar embedding facial entre idades (cosine similarity > 0.7)
- **Manual review**: pra MVP (100 idols), revisao manual e viavel
- **Retry pipeline**: ate 3 tentativas por imagem antes de marcar como "needs manual fix"
- **Fallback**: se geracao falhar consistentemente, usar placeholder generico por faixa

### 10. ComfyUI Workflow (Estrutura)

```json
{
  "workflow_name": "idol_portrait_aging",
  "nodes": [
    {
      "id": 1,
      "type": "CheckpointLoaderSimple",
      "model": "animagine-xl-3.1.safetensors"
    },
    {
      "id": 2,
      "type": "IPAdapterModelLoader",
      "model": "ip-adapter-plus-face_sdxl.safetensors"
    },
    {
      "id": 3,
      "type": "CLIPTextEncode",
      "prompt": "{age_prompt}, {expression_prompt}, {clothing_prompt}, {features_prompt}, anime style, high quality portrait, bust shot, neutral background"
    },
    {
      "id": 4,
      "type": "CLIPTextEncode",
      "negative": "deformed, bad anatomy, extra fingers, bad hands, blurry, low quality, watermark, text"
    },
    {
      "id": 5,
      "type": "IPAdapterApply",
      "reference_image": "{reference_face}",
      "weight": 0.7,
      "noise": 0.1
    },
    {
      "id": 6,
      "type": "KSampler",
      "seed": "{idol_visual_seed + age_offset}",
      "steps": 30,
      "cfg": 7.5,
      "sampler": "euler_ancestral",
      "scheduler": "normal",
      "denoise": 1.0
    },
    {
      "id": 7,
      "type": "VAEDecode"
    },
    {
      "id": 8,
      "type": "SaveImage",
      "filename": "{idol_id}/age_{age}_{expression}"
    }
  ]
}
```

**Prompts por idade (exemplos):**

```
age_08: "8 year old child, small face, round cheeks, big eyes, innocent look"
age_12: "12 year old girl, youthful face, pre-teen, school age"
age_15: "15 year old teenager, slim face, adolescent features"
age_18: "18 year old young woman, fresh face, youthful adult"
age_24: "24 year old woman, defined features, mature face, confident"
age_27: "27 year old woman, sophisticated features, subtle maturity"
age_30: "30 year old woman, mature beauty, confident expression"
age_35: "35 year old woman, graceful aging, wisdom in eyes, subtle lines"
```

## Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Idol Database** | <- lê | visual_seed, features derivadas da seed |
| **Happiness & Wellness** | <- lê | Happiness determina qual expressao mostrar |
| **Idol Lifecycle** | <- lê | Idade atual determina qual age bracket mostrar |
| **UI (todas telas com avatar)** | -> fornece | URL da imagem correta por contexto |
| **Supabase Storage** | -> armazena | Imagens servidas via CDN |
| **World Pack Generator** | <- coordena | Gera idols primeiro, depois gera imagens |

## Dependencies

**Hard:**
- Idol Database (seeds e features)
- Supabase Storage (armazenamento)
- RunPod (GPU pra geracao)
- ComfyUI (pipeline de geracao)

**Soft:**
- Happiness & Wellness (selecao de expressao)
- Idol Lifecycle (selecao de idade)

**Depended on by:**
- Todas telas de UI que mostram avatar
- Idol Profile UI (imagem principal)
- Roster lists (thumbnails)
- News Feed (imagem em noticias)
- Scouting (imagem de candidatas)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `GENERATION_RESOLUTION` | 512×512 | 256-768 | Resolucao de entrada pra geracao |
| `DELIVERY_RESOLUTION` | 1024×1024 | 512-2048 | Resolucao de entrega apos upscale |
| `THUMB_RESOLUTION` | 128×128 | 64-256 | Tamanho de thumbnails |
| `WEBP_QUALITY` | 85 | 60-95 | Qualidade vs tamanho de arquivo |
| `IP_ADAPTER_WEIGHT` | 0.7 | 0.5-0.9 | Consistencia facial (alto = mais similar, menos variacao) |
| `SAMPLER_STEPS` | 30 | 20-50 | Qualidade vs tempo de geracao |
| `FACE_SIMILARITY_THRESHOLD` | 0.7 | 0.5-0.9 | Limiar de validacao automatica |
| `MAX_RETRIES` | 3 | 1-5 | Tentativas antes de marcar como falha |
| `PARALLEL_WORKERS` | 4 | 1-8 | Geracao simultanea (limitado por GPU) |

## Acceptance Criteria

1. Mesma seed gera face reconhecivelmente similar em toda regeneracao
2. Face de 8 anos e reconhecivelmente a mesma pessoa de 35 anos
3. 3 expressoes visivelmente distintas por idade
4. Roupa proporcional a maturidade por faixa etaria
5. Todas 24 imagens por idol geradas em < 5 minutos
6. Face similarity score > 0.7 entre idades da mesma idol
7. Geracao base 512×512, upscale pos-geracao pra 1024×1024. WebP com tamanho medio < 150KB
8. Pipeline com checkpoint — pode retomar apos interrupcao
9. MVP (100 idols, 2.400 imgs) gerado em < 8 horas
10. Imagens servidas via CDN com cache longo (imutaveis)

## Open Questions

- Nenhuma pendente
