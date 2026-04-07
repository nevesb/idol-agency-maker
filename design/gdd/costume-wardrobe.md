# Costume & Wardrobe System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real, Pilar 2 — Suas Decisoes, Suas Consequencias
> **Related**: show-system.md, staff-functional.md, agency-economy.md, setlist-system.md, audience-system.md
> **Equivalent FM26**: Kit Selection + Match Day Equipment — escolha visual com impacto mecanico real

## Overview

O Costume & Wardrobe System gerencia **figurinos como recursos mecanicos** que
afetam diretamente a performance de shows. Figurinos nao sao cosmeticos — eles
concedem buffs de carisma, afetam o conforto fisico (stamina drain), influenciam
a percepcao visual da audiencia, e podem ser trocados mid-show como decisao
tatica. A agencia mantem um **guarda-roupa (wardrobe)** com capacidade limitada
pelo tier das facilities, e figurinos degradam com o uso.

**Principio**: Figurino e uma decisao de investimento. Gastar mais em figurino
premium gera impacto visual maior, mas consome orcamento que poderia ir para
producao tecnica (som, iluminacao). A tensao entre investir em figurino vs.
producao de palco e uma decisao real com trade-off mecanico.

## Player Fantasy

A fantasia e de **vestir o show perfeito**. Escolher o tema Starlight para a
ballad emocional do finale, trocar para Neon Rave no bloco de energia do meio,
e ver o impacto visual explodir na audiencia. Investir num figurino custom
desenhado pela estilista da agencia que so a sua idol usa — e ver o hype subir
porque ninguem na industria tem aquele look.

E quando da errado: o figurino barato desconforta a idol, ela nao consegue
dancar direito na coreografia intensa, a stamina drena rapido e a performance
no finale cai. Ou o figurino tradicional num show de festival neon — mismatch
total, audiencia nao conecta.

## Detailed Design

### 1. Costume Themes (Temas de Figurino)

Cada figurino pertence a um **tema predefinido** que determina seus atributos
base. Temas sao arquetipos visuais com impacto mecanico distinto.

| Tema | Custo Base | Charisma Buff | Conforto | Visual Hype | Genero Match |
|---|---|---|---|---|---|
| **Starlight** (brilhante, glamouroso) | ¥8M | +3 | Medio (0.7) | Alto (0.9) | Pop, Ballad |
| **Casual Chic** (moderno, confortavel) | ¥3M | +1 | Alto (0.9) | Medio (0.6) | Pop, Acoustic |
| **Neon Rave** (neon, agressivo, danca) | ¥6M | +2 | Baixo (0.5) | Muito Alto (1.0) | EDM, Dance, Hip-Hop |
| **Traditional** (kimono, hanbok, etc.) | ¥5M | +2 | Medio (0.7) | Alto (0.8) | Ballad, Enka, Traditional |
| **Streetwear** (urbano, descolado) | ¥2M | +1 | Alto (0.9) | Medio (0.5) | Hip-Hop, R&B, Rap |
| **Elegant Night** (vestido longo, tuxedo) | ¥10M | +4 | Baixo (0.5) | Muito Alto (1.0) | Ballad, Jazz, Classical |
| **Sporty Active** (roupa esportiva, athletic) | ¥2M | +0 | Muito Alto (1.0) | Baixo (0.4) | Dance, Hip-Hop |
| **Fantasy** (cosplay, tematico, fantasia) | ¥7M | +3 | Baixo (0.5) | Muito Alto (1.0) | Pop, Rock, Theme Song |
| **Minimal Pure** (branco, limpo, minimalista) | ¥4M | +2 | Alto (0.9) | Medio (0.7) | Ballad, Acoustic, Indie |
| **Rock Edge** (couro, correntes, dark) | ¥5M | +2 | Medio (0.7) | Alto (0.8) | Rock, Metal, Punk |

**Nota**: Custo Base e para Tier Basico do figurino. Tiers superiores multiplicam.

#### Tiers de Qualidade por Tema

Cada tema tem 3 tiers de qualidade que escalam custo e efeitos:

| Tier Figurino | Mult Custo | Mult Charisma Buff | Mult Conforto | Mult Visual Hype | Durabilidade (usos) |
|---|---|---|---|---|---|
| **Basico** | x1.0 | x1.0 | x1.0 | x1.0 | 8 usos |
| **Profissional** | x2.5 | x1.5 | x1.2 | x1.3 | 15 usos |
| **Premium** | x5.0 | x2.0 | x1.4 | x1.6 | 25 usos |

### 2. Aquisicao de Figurinos

Figurinos sao obtidos por 3 canais com trade-offs distintos:

#### 2a. Catalogo (Compra Direta)

O canal padrao. A agencia compra de um catalogo de fabricantes.

- Disponibilidade: todos os temas, todos os tiers
- Custo: Custo Base x Mult Tier (tabela acima)
- Prazo de entrega: 1 semana (Basico), 2 semanas (Profissional), 3 semanas (Premium)
- Buff: padrao conforme tabela do tema
- Sem exclusividade — rivais podem usar o mesmo tema/tier

#### 2b. Custom Design (Design Exclusivo)

Figurino desenhado sob medida pelo **Costume Designer** (estilista) da agencia
ou contratado externamente. Unico, nao pode ser replicado por rivais.

- Disponibilidade: requer Costume Designer (staff) ou contratacao externa
- Custo: Custo Base x Mult Tier x `CUSTOM_DESIGN_COST_MULT` (default 1.8)
- Prazo: 3-6 semanas dependendo da complexidade e skill do designer
- Buff: Charisma Buff x `CUSTOM_DESIGN_BUFF_MULT` (default 1.3) — 30% melhor
- **Exclusividade**: buff de visual hype +15% porque audiencia nunca viu igual
- Skill do designer afeta qualidade final (ver secao 7)

#### 2c. Patrocinado (Sponsored)

Uma marca paga pelo figurino em troca de visibilidade (logo visivel).

- Disponibilidade: requer Fame minima da idol/grupo (Fame >= 40)
- Custo: ¥0 para a agencia (marca paga)
- Buff: Charisma padrao do tema, mas Visual Hype x 0.85 (logo visivel reduz pureza visual)
- **Bonus**: receita de endorsement por show (¥500K - ¥5M dependendo da marca)
- **Restricao**: marca define o tema (nem sempre alinha com o genero do show)
- Durabilidade: infinita (marca repoe)
- Audiencia hardcore (-5% engagement se fandom percebe "sell out")

| Canal | Custo | Buff | Exclusividade | Trade-off |
|---|---|---|---|---|
| Catalogo | Padrao | Padrao | Nenhuma | Seguro, previsivel |
| Custom | +80% custo | +30% charisma, +15% visual hype | Total | Caro, demora, depende de staff |
| Patrocinado | Gratis + receita | -15% visual hype, restricao de tema | Nenhuma | Gratis mas compromete liberdade e pureza |

### 3. Inventario — Wardrobe (Guarda-Roupa)

A agencia mantem um inventario fisico de figurinos. Capacidade limitada pelo
tier da facility.

#### 3a. Capacidade por Tier de Facility

| Tier Agencia | Wardrobe Facility | Capacidade (figurinos) | Custo Mensal |
|---|---|---|---|
| Garagem | Arara no canto | 5 | ¥0 (incluso) |
| Pequena | Sala de figurinos Nv1 | 15 | ¥200K |
| Media | Sala de figurinos Nv2 | 35 | ¥500K |
| Grande | Wardrobe Room Nv3 | 60 | ¥1M |
| Elite | Fashion Wing dedicada | 100+ | ¥2M |

#### 3b. Degradacao por Uso

Figurinos degradam com o uso e perdem qualidade progressivamente:

```
durabilidade_atual = durabilidade_max - usos_totais

Se durabilidade_atual > 75% max:
  qualidade_figurino = 1.0 (perfeito)
Se durabilidade_atual 50-75% max:
  qualidade_figurino = 0.9 (usado mas bom)
Se durabilidade_atual 25-50% max:
  qualidade_figurino = 0.7 (visivelmente gasto — audiencia nota)
Se durabilidade_atual < 25% max:
  qualidade_figurino = 0.5 (precario — penalidade de visual hype)
Se durabilidade_atual = 0:
  figurino destruido, removido do inventario
```

**Reparo**: Figurinos com durabilidade > 0 podem ser reparados pelo Costume
Designer (custo = 20% do preco original, restaura 50% da durabilidade perdida).
Sem designer: reparo externo custa 40% do preco original.

#### 3c. Gestao do Wardrobe

- Figurinos podem ser **vendidos** por 30% do valor original (menos se degradados)
- Figurinos patrocinados nao podem ser vendidos (propriedade da marca)
- Figurinos custom nao podem ser vendidos (propriedade intelectual da agencia — mas podem ser descartados)
- Alerta quando wardrobe esta > 80% da capacidade
- Alerta quando figurino atinge < 25% durabilidade

### 4. Costume Effects (Efeitos do Figurino no Show)

Figurinos afetam 4 dimensoes mecanicas durante o show:

#### 4a. Charisma Boost

Buff direto ao atributo Carisma/Aura da idol durante o show.

```
charisma_efetiva = charisma_base + costume_charisma_buff

costume_charisma_buff =
  buff_tema_base                    // +0 a +4 conforme tema
  × mult_tier_qualidade             // x1.0 a x2.0 conforme tier
  × mult_custom                     // x1.3 se custom design, x1.0 caso contrario
  × qualidade_figurino              // 1.0 a 0.5 por degradacao
  × mult_designer_skill             // 1.0 a 1.25 (ver secao 7)
```

O charisma boost afeta diretamente `match_presenca` no `show-system.md` (Camada 1).

#### 4b. Comfort (Conforto → Stamina Drain)

O conforto do figurino afeta a taxa de fadiga intra-show (ver `show-system.md` secao 6):

```
comfort_penalty =
  (1.0 - comfort_rating)           // comfort_rating de 0.4 a 1.0
  × COMFORT_STAMINA_FACTOR         // default 0.3
  × mult_coreografia               // x1.5 se musica tem danca intensa

custo_fadiga_modificado = custo_fadiga_base × (1.0 + comfort_penalty)
```

**Exemplo**: Figurino Neon Rave (comfort 0.5) numa coreografia intensa:
`comfort_penalty = (1.0 - 0.5) × 0.3 × 1.5 = 0.225`
`custo_fadiga = base × 1.225` (22.5% mais fadiga que sem figurino)

Figurino Sporty Active (comfort 1.0):
`comfort_penalty = (1.0 - 1.0) × 0.3 × 1.5 = 0.0` (zero penalidade)

#### 4c. Visual Hype (Contribuicao Visual para Engagement)

O figurino contribui para o engagement base da audiencia (ver `audience-system.md`):

```
visual_hype_contribution =
  visual_hype_base                  // 0.4 a 1.0 conforme tema
  × mult_tier_qualidade             // x1.0 a x1.6 conforme tier
  × mult_custom                     // x1.15 se custom, x1.0 caso contrario
  × mult_sponsor_penalty            // x0.85 se patrocinado, x1.0 caso contrario
  × qualidade_figurino              // 1.0 a 0.5 por degradacao
  × mult_lighting_synergy           // x1.0 a x1.3 (ver secao 6)

// Integra no show como parte do mult_production
mult_costume_visual = 0.8 + (visual_hype_contribution × 0.4)
// Range final: 0.8 (figurino terrivel) a 1.36 (figurino premium custom com synergy)
```

#### 4d. Genre Match Bonus

Se o tema do figurino alinha com o genero da musica sendo executada, bonus
adicional:

```
genre_match_bonus =
  SE tema.generos_match CONTEM musica.genero:
    GENRE_MATCH_BONUS_MULT          // default 1.10 (+10%)
  SENAO:
    1.0                             // neutro

  SE tema CLARAMENTE conflita (ex: Traditional + EDM):
    GENRE_MISMATCH_PENALTY          // default 0.90 (-10%)
```

O `genre_match_bonus` multiplica `visual_hype_contribution`.

**Conflitos explicitos** (penalidade de mismatch):

| Tema | Generos que CONFLITAM |
|---|---|
| Traditional | EDM, Hip-Hop, Punk |
| Neon Rave | Ballad, Classical, Enka |
| Elegant Night | Hip-Hop, Punk, Dance |
| Sporty Active | Ballad, Classical, Jazz |
| Streetwear | Classical, Enka, Jazz |

### 5. Mid-Show Costume Change (Troca de Figurino)

Uma decisao tatica equivalente a substituicao no futebol. Permite mudar o
impacto visual para o restante do show.

#### 5a. Regras de Troca

- **Custa 1 slot MC/Interlude** na setlist (ver `setlist-system.md`)
- Requer **Stage Crew disponivel** (Stage Manager contratado ou produtor cobrindo)
- Sem SM ou equivalente: troca impossivel
- Maximo de trocas por show: `MAX_COSTUME_CHANGES` (default 2)
- Troca entre blocos da setlist (ex: slot 1-3 com Starlight, slot 4-6 com Neon Rave)

#### 5b. Custo da Troca

```
custo_troca = COSTUME_CHANGE_BASE_COST × mult_venue

COSTUME_CHANGE_BASE_COST = ¥200K   // logistics, backstage crew
mult_venue:
  Cafe/bar: impossivel (sem backstage)
  Casa de show: x1.0
  Hall: x1.0
  Arena: x1.5 (distancia maior, mais crew)
  Stadium: x2.0

// Stage Manager reduz custo:
custo_final = custo_troca × (1.0 - SM_cost_reduction)
SM_cost_reduction = skill_SM × 0.01  // SM skill 20 = -20% custo
```

#### 5c. Impacto da Troca

- **Imediato**: novo figurino aplica seus buffs a partir da proxima musica
- **Surprise Factor**: primeira musica apos a troca recebe bonus de engagement
  `COSTUME_CHANGE_SURPRISE_BONUS` (default +8% engagement)
- **Risco**: se a troca demora mais que o interlude (SM skill baixo), perda de
  momentum (`SLOW_CHANGE_PENALTY` = -5% engagement)

```
tempo_troca = BASE_CHANGE_TIME / (1.0 + skill_SM × 0.05)

SE tempo_troca > duracao_interlude:
  engagement -= SLOW_CHANGE_PENALTY
SENAO:
  engagement += COSTUME_CHANGE_SURPRISE_BONUS
```

#### 5d. Mid-Show Decision (Wireframe 56 Integration)

Durante o interlude (ver wireframe 56 — Mid-Show Adjustments), o jogador pode:

- **Manter figurino original** (previsto no setup pre-show)
- **Trocar para outro figurino do wardrobe** (decisao reativa)
- Decisao baseada no estado da audiencia: se engagement esta frio, trocar para
  um figurino mais agressivo/visual pode reverter a situacao

### 6. Stage Production Integration

Figurinos interagem com os pacotes de producao de `staff-functional.md`:

#### 6a. Synergy Iluminacao x Figurino

Certos figurinos brilham mais com iluminacao adequada:

| Tema Figurino | Iluminacao Basica | Iluminacao Profissional | Iluminacao Premium |
|---|---|---|---|
| Starlight | x1.0 | x1.15 | x1.30 (spotlight amplifica brilho) |
| Neon Rave | x0.9 (precisa de UV) | x1.10 | x1.25 (lasers + neon) |
| Elegant Night | x1.0 | x1.10 | x1.20 |
| Traditional | x1.0 | x1.05 | x1.10 (sutil) |
| Fantasy | x0.9 (precisa de efeitos) | x1.10 | x1.25 (projecoes + costume) |
| Outros | x1.0 | x1.05 | x1.10 |

O multiplicador de synergy alimenta `mult_lighting_synergy` na formula de visual hype.

#### 6b. Synergy Efeitos Especiais x Figurino

Efeitos especiais (confetes, fogo, laser) amplificam figurinos especificos:

```
sfx_costume_synergy =
  SE tema = "Starlight" E efeito = "Chuva de Prata": +5% visual hype
  SE tema = "Neon Rave" E efeito = "Lasers Sincronizados": +8% visual hype
  SE tema = "Fantasy" E efeito = "Holograma": +10% visual hype
  SE tema = "Rock Edge" E efeito = "Canhoes de Fogo": +6% visual hype
  SENAO: +0% (sem synergy especifica, SFX contribui normalmente)
```

#### 6c. Cenografia x Figurino

Cenografia Elaborada (`staff-functional.md`) harmoniza com o tema do figurino:

```
cenografia_match =
  SE cenografia.tema_visual ALINHADO com costume.tema: x1.05 visual hype
  SE cenografia.tema_visual CONFLITA com costume.tema: x0.95
  SENAO: x1.0
```

### 7. Costume Designer (Estilista) — Staff Role

Nova funcao operacional que estende o sistema de `staff-functional.md`.

#### 7a. Ficha da Funcao

| Atributo | Descricao |
|---|---|
| **Cargo** | Costume Designer (Estilista) |
| **Responsabilidade** | Design de figurinos custom, manutencao do wardrobe, consultoria de tema |
| **Prioridade** | Vertical Slice |
| **Combinacoes Multi-role** | Coreografo + Estilista (viavel, mesmo dominio visual) |
| **Custo de tempo do produtor** | 15 pontos (por figurino custom), 5 pontos (consultoria por show) |

#### 7b. Impacto do Skill

```
// Qualidade de figurino custom
custom_quality_mult = 1.0 + (skill_designer × 0.0125)
// Skill 1: x1.0125, Skill 10: x1.125, Skill 20: x1.25

// Reducao de custo em compras de catalogo
catalog_cost_reduction = skill_designer × 0.01
// Skill 1: -1%, Skill 10: -10%, Skill 20: -20%

// Tempo de confeccao custom
custom_design_weeks = BASE_CUSTOM_WEEKS × (1.0 - skill_designer × 0.02)
// Skill 10: 3 semanas → 2.4 semanas. Skill 20: 3 → 1.8 semanas

// Consultoria: sugere tema otimo para genero/audiencia do show
consultoria_accuracy = 0.5 + (skill_designer × 0.025)
// Skill 20: 100% acerto na sugestao de tema
```

#### 7c. Sem Costume Designer

Se a funcao nao tem NPC E o produtor nao cobre:

- **Custom design**: indisponivel (apenas catalogo e patrocinado)
- **Reparo**: apenas externo (custo 40% vs. 20% com designer)
- **Consultoria de tema**: sem sugestao automatica. Jogador escolhe sozinho
- **Custo de catalogo**: sem desconto
- **Degradacao**: sem manutencao preventiva, figurinos degradam 20% mais rapido

Se o **produtor** cobre a funcao:

- Custom design disponivel com qualidade reduzida (`BASE_PRODUCER_QUALITY` = 0.5)
- Reparo interno disponivel (custo 30% em vez de 20%)
- Consultoria com acuracia do produtor (dependente de perfil)

### States and Transitions

| Estado do Figurino | Descricao | Transicao |
|---|---|---|
| **Encomendado** | Pedido feito, aguardando entrega | → Disponivel (apos prazo de entrega) |
| **Disponivel** | No wardrobe, pronto para uso | → Em Uso (atribuido a show) |
| **Em Uso** | Atribuido a show programado | → Disponivel (pos-show, durabilidade -1) |
| **Degradado** | Durabilidade < 25%, penalidade ativa | → Disponivel (se reparado), → Destruido |
| **Destruido** | Durabilidade = 0 | Terminal (removido do inventario) |

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **show-system.md** | → buffs | Charisma boost, visual hype, comfort penalty alimentam performance |
| **staff-functional.md** | ← producao | Stage Manager coordena trocas. Pacotes de producao geram synergy |
| **agency-economy.md** | ← custos | Custo de figurinos, manutencao de wardrobe, receita de sponsorship |
| **setlist-system.md** | ← slots | Troca de figurino consome 1 slot MC/Interlude |
| **audience-system.md** | → engagement | Visual hype contribution afeta engagement base |
| **idol-attribute-stats.md** | → buff temporario | Charisma boost durante o show |
| **happiness-wellness.md** | ↔ bidirecional | Conforto afeta fadiga. Idol pode ter preferencia de figurino (wellness) |
| **agency-staff-operations.md** | ← staff | Costume Designer como novo cargo |
| **fame-rankings.md** | → fama | Figurinos iconicos geram headlines e boost de fama |
| **fan-club-system.md** | → percepcao | Fas reagem a figurinos (positivo para custom, negativo para sponsored excessivo) |

## Formulas

### Costume Buff Total

```
costume_buff(idol, show, musica) =
  charisma_buff_base(tema)
  × mult_tier_qualidade(tier)
  × mult_custom(1.3 se custom, 1.0 caso contrario)
  × qualidade_figurino(durabilidade)
  × mult_designer_skill(skill)
  × genre_match_bonus(tema, musica.genero)
```

### Comfort Penalty (Fadiga Adicional)

```
comfort_penalty(tema, musica) =
  (1.0 - comfort_rating(tema) × mult_tier_conforto(tier))
  × COMFORT_STAMINA_FACTOR
  × mult_coreografia(musica)

// Clamp comfort_penalty >= 0 (conforto nunca reduz fadiga abaixo do base)
custo_fadiga_final = custo_fadiga_base × (1.0 + max(0, comfort_penalty))
```

### Visual Hype Contribution

```
visual_hype_contribution(figurino, producao, musica) =
  visual_hype_base(tema)
  × mult_tier_qualidade(tier)
  × mult_custom(1.15 se custom, 1.0 caso contrario)
  × mult_sponsor_penalty(0.85 se sponsored, 1.0 caso contrario)
  × qualidade_figurino(durabilidade)
  × mult_lighting_synergy(tema, pacote_iluminacao)
  × genre_match_bonus(tema, musica.genero)
  + sfx_costume_synergy(tema, efeitos_selecionados)

// Integra no show-system.md como multiplicador
mult_costume_visual = 0.8 + (visual_hype_contribution × 0.4)
```

### Costume Change Outcome

```
change_success(SM, interlude) =
  tempo_troca = BASE_CHANGE_TIME / (1.0 + skill_SM × 0.05)

  SE tempo_troca <= duracao_interlude:
    engagement_delta = +COSTUME_CHANGE_SURPRISE_BONUS
  SENAO:
    engagement_delta = -SLOW_CHANGE_PENALTY
```

## Edge Cases

- **Show sem figurino atribuido**: Idols usam "roupa casual" (equivalente a
  Casual Chic Basico degradado). Sem custo, mas visual hype = 0.3 e zero
  charisma buff. Audiencia e midia percebem como amador
- **Wardrobe cheio e show amanha**: Jogador precisa vender/descartar figurino
  para abrir espaco OU usar um ja no inventario. Nao pode encomendar (prazo)
- **Troca mid-show em cafe/bar**: Impossivel (sem backstage). UI bloqueia a
  opcao. Jogador precisa planejar shows em venues maiores se quer trocar
- **Figurino patrocinado em show de fan meeting**: Fas hardcore percebem o
  logo e reagem negativamente (-5% engagement). Mas a receita de endorsement
  compensa se o jogador prioriza dinheiro
- **Custom figurino com designer skill 1**: Qualidade quase igual ao catalogo
  (x1.0125) mas custo 80% maior e demora 3+ semanas. So vale com designer
  skill 8+. O jogo deve sinalizar: "Seu estilista e inexperiente — considere
  comprar do catalogo"
- **Mesmo figurino usado 3 shows seguidos**: Audiencia de fas fieis nota
  repeticao. Penalidade de -3% visual hype por repeticao consecutiva (cap em
  -10%). Incentivo para variar
- **Troca de figurino com SM skill 1**: Tempo de troca excede o interlude.
  Momentum perdido. Audiencia fica esperando. Penalidade de engagement.
  Incentivo para investir em SM antes de tentar trocas taticas
- **Grupo com 8 membros trocando figurino**: Custo de troca x N membros.
  Tempo de troca +30% por membro acima de 4. Groups grandes tornam troca
  mais arriscada

## Dependencies

**Hard:**
- show-system.md — figurino alimenta performance e engagement
- staff-functional.md — Stage Manager necessario para trocas; pacotes geram synergy
- agency-economy.md — custos de aquisicao, manutencao, wardrobe facility

**Soft:**
- setlist-system.md — troca consome slot MC/Interlude
- audience-system.md — visual hype afeta engagement
- agency-staff-operations.md — Costume Designer como novo cargo
- happiness-wellness.md — conforto afeta fadiga e satisfacao

**Depended on by:**
- show-system.md (recebe costume buffs como input)
- audience-system.md (visual hype contribui para engagement)
- wireframes 51 (Costume & Stage Selection) e 56 (Mid-Show Adjustments)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `CUSTOM_DESIGN_COST_MULT` | 1.8 | 1.3-3.0 | Custo extra de figurino custom vs. catalogo |
| `CUSTOM_DESIGN_BUFF_MULT` | 1.3 | 1.1-1.5 | Bonus de charisma buff para custom |
| `CUSTOM_VISUAL_HYPE_BONUS` | 1.15 | 1.05-1.3 | Bonus de visual hype para exclusividade |
| `SPONSOR_VISUAL_PENALTY` | 0.85 | 0.7-0.95 | Penalidade visual de logo de marca |
| `SPONSOR_ENGAGEMENT_PENALTY` | 0.05 | 0.02-0.10 | Penalidade de engagement de fas hardcore |
| `COMFORT_STAMINA_FACTOR` | 0.3 | 0.1-0.5 | Quanto conforto afeta fadiga |
| `GENRE_MATCH_BONUS_MULT` | 1.10 | 1.05-1.20 | Bonus por match genero/tema |
| `GENRE_MISMATCH_PENALTY` | 0.90 | 0.80-0.95 | Penalidade por conflito genero/tema |
| `COSTUME_CHANGE_SURPRISE_BONUS` | 0.08 | 0.03-0.15 | Bonus de engagement por troca bem-sucedida |
| `SLOW_CHANGE_PENALTY` | 0.05 | 0.02-0.10 | Penalidade se troca demora demais |
| `BASE_CHANGE_TIME` | 5.0 | 3.0-8.0 | Minutos base para troca (SM modifica) |
| `MAX_COSTUME_CHANGES` | 2 | 1-4 | Trocas maximas por show |
| `COSTUME_CHANGE_BASE_COST` | ¥200K | ¥100K-¥500K | Custo logistico por troca |
| `REPEAT_COSTUME_PENALTY` | 0.03 | 0.01-0.05 | Penalidade por figurino repetido consecutivo |
| `REPEAT_COSTUME_CAP` | 0.10 | 0.05-0.20 | Maximo de penalidade por repeticao |
| `DEGRADATION_ACCELERATION_NO_DESIGNER` | 1.2 | 1.0-1.5 | Aceleracao de degradacao sem estilista |
| `WARDROBE_CAPACITY_MULTIPLIER` | 1.0 | 0.5-2.0 | Escala capacidade do wardrobe |

## Acceptance Criteria

1. 10 temas de figurino com custo, charisma buff, conforto e visual hype distintos
2. 3 tiers de qualidade (Basico/Profissional/Premium) com scaling de custo e efeitos
3. 3 canais de aquisicao (catalogo, custom, patrocinado) com trade-offs claros
4. Wardrobe com capacidade limitada pelo tier da facility, com custo mensal
5. Figurinos degradam com uso e perdem qualidade progressivamente ate destruicao
6. Charisma buff do figurino integra no `match_presenca` do show-system
7. Comfort penalty afeta `custo_fadiga` intra-show conforme formula
8. Visual hype contribution integra no engagement da audiencia via `mult_costume_visual`
9. Genre match bonus/penalty aplica conforme alinhamento tema vs. genero da musica
10. Mid-show costume change consome 1 slot MC, requer SM, gera surprise bonus ou slow penalty
11. Maximo de 2 trocas por show (configuravel)
12. Synergy de iluminacao e efeitos especiais amplifica visual hype de figurinos compatíveis
13. Costume Designer como novo staff role afeta qualidade custom, custo e tempo de confeccao
14. Sem designer: custom indisponivel, reparos mais caros, degradacao acelerada
15. Repeticao de figurino consecutivo gera penalidade crescente de visual hype

## Open Questions

- Nenhuma pendente
