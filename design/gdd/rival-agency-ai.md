# Rival Agency AI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 4 — O Drama Nasce das Mecânicas

## Overview

O Rival Agency AI controla as ~50 agências não-jogador que competem no mesmo
mercado. Cada agência IA contrata idols, escala em jobs, negocia contratos,
investe em facilities, produz músicas, e compete em rankings -- usando as mesmas
regras do jogador. São o "mundo vivo" que faz o mercado funcionar: sem elas,
não há competição por idols, não há disputas por jobs premium, e os rankings
seriam estáticos. As agências são fixas na seed (mesmas 50 em todo playthrough),
cada uma com perfil, tier, e estratégia própria.

## Player Fantasy

A fantasia é de **competir contra rivais inteligentes**. Saber que a Agência
Starlight está tentando roubar sua idol #1. Perder uma contratação porque a
Agência Nova Wave ofereceu salário maior. Ver uma rival subir no ranking porque
investiu pesado em marketing. Serve o **Pilar 4**: os dramas mais memoráveis
vêm da competição com rivais ("perdi a idol X pra Starlight e ela virou SSS
lá"). Agências do mesmo tier competem entre si -- Elite não rouba de Garagem.

## Detailed Design

### Core Rules

#### 1. Ficha de Agência Rival

```
RivalAgency {
  id:             uint32
  name:           string
  region:         enum (sede principal)
  tier:           Garagem | Pequena | Média | Grande | Elite
  budget:         ¥amount (saldo atual)
  strategy:       "balanced" | "aggressive" | "conservative" | "specialist"
  specialty:      string? // "vocal", "dance", "variety", null=generalista
  roster:         idol_id[]
  groups:         group_id[]
  facilities:     facility_level{}
  reputation:     0-100
}
```

#### 2. Perfis de Estratégia

| Estratégia | Comportamento | Exemplo |
|---|---|---|
| **Balanced** | Equilibra custos e crescimento. Contrata mix de tiers | Maioria das agências |
| **Aggressive** | Gasta mais, contrata rápido, compete por jobs premium | Agências em ascensão |
| **Conservative** | Poupa, foca em idols baratas, evita risco | Agências pequenas estáveis |
| **Specialist** | Foca num tipo de idol/job (vocal, dança, variedade) | Agências de nicho |

#### 3. Decisões Semanais da IA (processadas no Week Simulation)

Cada agência IA executa estas decisões por semana via `AgencyTick()` — a mesma
pipeline unificada do jogador (ADR-002). Não há heurísticas separadas:

```
1. CONTRATAÇÃO
   - Avaliar idols disponíveis no mercado do seu tier
   - Se tem orçamento e slot: fazer proposta pra melhor custo-benefício
   - Priorizar stats que combinam com specialty (se tiver)
   - Competir com outras agências do mesmo tier

2. ESCALAÇÃO DE JOBS
   - Alocar idols nos melhores jobs disponíveis pro tier
   - Priorizar jobs premium disputados se strategy == "aggressive"
   - Match idol/job pelo melhor encaixe de stats

3. GESTÃO DE ROSTER
   - Renovar contratos de idols que performam bem
   - Rescindir idols que custam mais do que geram
   - Manter wellness acima de 40% (dar folgas se necessário)

4. INVESTIMENTOS
   - Upgradar facilities proporcionalmente ao tier
   - Investir em marketing pra idols top do roster
   - Encomendar músicas de compositores (proporcionalmente ao tier)

5. EVENTOS E MÚSICA
   - Criar eventos proporcionais ao tier
   - Produzir CDs/merch de idols populares
   - Fazer covers e collabs dentro do roster
```

#### 4. Competição por Tier

Agências só competem com agências do mesmo tier (±1 tier):

| Tier | Compete com | Jobs que disputa |
|---|---|---|
| Garagem | Garagem, Pequena | Nenhum (jobs abundantes) |
| Pequena | Garagem, Pequena, Média | Raramente |
| Média | Pequena, Média, Grande | Jobs nacionais premium |
| Grande | Média, Grande, Elite | Jobs nacionais + festivais |
| Elite | Grande, Elite | Jobs VIP, eventos especiais, endorsements top |

#### 5. Sistema de Buyout (IA ↔ IA e IA ↔ Jogador)

Buyout é mecânica do **mercado inteiro** -- IAs tentam comprar idols de
OUTRAS IAs com a mesma frequência que tentam do jogador. O foco é ver
quem está performando bem no mercado e fazer propostas, não importunar
o jogador.

**Regras:**
- Cada agência IA tenta no máximo **1 buyout por mês** (de qualquer alvo)
- Alvos: idols de alta performance em agências do mesmo tier (±1)
- IA avalia: fama da idol, custo de buyout, encaixe no roster
- IA → IA: resolve automaticamente (aceita/recusa baseado em heurística)
- IA → Jogador: chega como evento urgente (Pause automático). Jogador
  decide: aceitar ($$), recusar, ou contra-oferecer renovação
- Jogador vê no News Feed buyouts entre IAs ("Agência X contratou Idol Y
  da Agência Z") -- mostra que o mercado é vivo

#### 6. Progressão da IA ao Longo do Jogo

- Agências IA sobem e descem de tier organicamente (mesmas regras do jogador)
- Agência que perde idols top pode cair de tier
- Agência que contrata bem pode subir
- Ao longo de 20 anos, o cenário competitivo muda naturalmente
- Novas agências podem surgir (do World Pack, em datas pré-definidas)
- Agências podem falir e desaparecer (se dívida prolongada)

### States and Transitions

| Estado da Agência IA | Descrição | Transição |
|---|---|---|
| **Ativa** | Operando normalmente | → Em crescimento, → Em declínio, → Falida |
| **Em crescimento** | Subindo de tier (2+ meses cumprindo metas) | → Ativa (novo tier) |
| **Em declínio** | Perdendo dinheiro/idols | → Ativa (recuperou), → Falida |
| **Falida** | Dívida prolongada, idols liberadas | Terminal (agência desaparece) |
| **Nova** | Agência recém-criada (World Pack schedule) | → Ativa |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Idol Database** | ← lê | Agências e rosters iniciais do World Pack |
| **Market/Transfer** | ↔ bidirecional | IA busca idols, faz propostas, compete com jogador |
| **Job Assignment** | ↔ bidirecional | IA escala idols em jobs. Compete por jobs premium do mesmo tier |
| **Contract System** | ↔ usa | IA negocia contratos, renova, rescinde. Pode fazer buyout do jogador |
| **Agency Economy** | ↔ usa | IA gerencia orçamento com mesmas regras (simplificadas) |
| **Fame & Rankings** | ← lê, → atualiza | IA consulta rankings pra decidir. Ações da IA afetam rankings |
| **Week Simulation** | ← processado por | Decisões da IA são executadas no tick semanal |
| **Music Charts** | ← usa | IA encomenda músicas, produz CDs, compete no ranking musical |
| **Media Entities** | ← usa | IA candidata idols a shows de TV/rádio |
| **News Feed** | → gera | Ações da IA aparecem no feed (contratações, eventos, escândalos) |

## Formulas

#### Budget de Performance (por agência por tick)

```
target: 2ms por agência, 100ms total pra 51 agências (ADR-002)

AgencyTick() unificada — mesma pipeline do jogador, otimizada pra Web Worker:
  contratacao: avaliar top 5 idols no mercado (bounded search pra performance)
  escalacao: match top 3 idols × top 5 jobs (bounded, não N×M completo)
  gestao: checar só idols com wellness <40% ou contrato vencendo
```

#### Decisão de Contratação

```
score_idol = (PT × 0.4 + stats_relevantes × 0.3 + fama × 0.2 + idade_factor × 0.1)
           / custo_estimado

Contratar se: score_idol > THRESHOLD_POR_STRATEGY
  balanced: 0.5
  aggressive: 0.3 (aceita pior custo-benefício)
  conservative: 0.7 (só contrata se for bom negócio)
```

#### Decisão de Rescisão

```
Rescindir se:
  custo_mensal > receita_gerada × 2 POR 3+ meses
  OU wellness < 20 POR 4+ semanas (idol em crise)
  OU tier da idol caiu 2+ tiers desde contratação
```

#### Decisão de Buyout (1 tentativa/mês por agência)

```
// Cada IA avalia 1 vez por mês se vale tentar buyout
// Alvo: idol de outra agência (IA ou jogador) no mesmo tier ±1

score_buyout = (fama_idol / 10000) × encaixe_roster × BUYOUT_AGGRESSION
  BUYOUT_AGGRESSION = 0.3 (balanced), 0.5 (aggressive), 0.1 (conservative)
  encaixe_roster = 1.5 se preenche lacuna, 1.0 se genérico, 0.5 se redundante

Tenta buyout se: score_buyout > 0.3 E tem orçamento pra multa de rescisão
Só 1 tentativa por mês por agência (IA→IA ou IA→jogador)
Ignora idols com fama < 1000
```

## Edge Cases

- **Todas 50 agências tentam contratar a mesma idol SSS**: Improváve
  (tiers diferentes veem idols diferentes). Se acontecer, idol escolhe
  a melhor proposta + lealdade
- **Agência IA falida libera 30 idols de uma vez**: Mercado inundado
  temporariamente. Oportunidade pra jogador pegar idols baratas
- **Agência IA com idol #1 do ranking**: Jogador sente a pressão de
  competir. Pode tentar buyout se tiver dinheiro
- **IA tenta buyout da idol do jogador durante turnê**: Proposta chega
  mas transferência só após turnê. Jogador tem tempo de contra-oferecer
- **Agência IA specialist em vocal contrata idol de dança**: Pode
  acontecer se a idol for custo-benefício muito bom. Specialist prioriza
  mas não é exclusivo
- **30 agências no mesmo tier competindo**: Performance ok -- cada uma
  processa em 2ms. Competição diluída entre 30 = cada uma pega poucas idols

## Dependencies

**Hard:**
- Market/Transfer — acessa mercado pra contratar
- Job Assignment — escala idols em jobs
- Agency Economy — gerencia orçamento
- Week Simulation — processado semanalmente

**Soft:**
- Idol Database — agências e rosters iniciais
- Contract System — negocia contratos
- Fame & Rankings — rankings informam decisões
- Music Charts — produz músicas
- **Producer Profile** (#50): Background e traço (Carismático) afetam comportamento de rivais. Ver `producer-profile.md` seção 4a/4d.

**Depended on by:**
Market/Transfer (competição), Job Assignment (disputa jobs), News Feed
(ações da IA viram notícias), Fame & Rankings (IA afeta rankings)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `TOTAL_RIVAL_AGENCIES` | 50 | 10-100 | Número de agências IA |
| `AI_BUDGET_MS` | 2ms/agência | 1-5ms | Budget de performance |
| `BUYOUT_AGGRESSION` | 0.3 | 0.1-0.7 | Frequência de tentativas de buyout |
| `AI_WELLNESS_THRESHOLD` | 40% | 20-60% | Quando IA dá folga pra idol |
| `AI_RESCISSION_MONTHS` | 3 | 1-6 | Meses de prejuízo antes de rescindir |
| `AI_STRATEGY_DISTRIBUTION` | 50% balanced, 20% aggressive, 20% conservative, 10% specialist | Ajustável | Mix de estratégias no mercado |
| `AI_TIER_UPGRADE_MONTHS` | 6 | 3-12 | Meses cumprindo metas pra subir tier |

## Acceptance Criteria

1. 50 agências IA processam decisões semanais em <100ms total
2. IA contrata idols do mercado proporcionalmente ao tier/estratégia
3. IA escala idols em jobs com match de stats razoável
4. Agências só competem com ±1 tier (Elite não rouba de Garagem)
5. Buyout de idols do jogador aparece como evento urgente com Pause
6. Agências IA sobem e descem de tier ao longo do jogo
7. Agências IA podem falir e liberar rosters pro mercado
8. Rankings refletem atividade das agências IA (mundo vivo)
9. IA aparece no News Feed (contratações, eventos, escândalos)
10. Estado inicial (5 anos simulados) tem agências com rosters realistas

## Agency Profiles & Personalities

Cada agência rival deve ser **memorável e distinta**. O jogador precisa
reconhecer rivais por nome, estética e comportamento -- não só por tier.

### 1. Ficha Expandida de Personalidade

```
RivalAgencyProfile {
  // Identidade (fixo na seed)
  owner_name:       string    // NPC dono -- pode ser ex-idol debutada
  owner_personality: string   // "Predador", "Paternalista", "Visionário", etc.
  founding_year:    uint16    // História da agência
  aesthetic:        string    // "Neon pop", "Classical elegance", "Street casual"
  motto:            string?   // Slogan visível na UI

  // Estratégia (do Agency Strategy system)
  agency_focus:     enum      // Mainstream, Nicho, Variety, Vocal, Acting, Digital
  image_direction:  enum      // Pure, Edgy, Cute, Mature
  growth_posture:   enum      // Push novatas, Proteger premium, Caixa, Legado

  // Reputação e comportamento
  market_reputation:   0-100  // Como o mercado vê a agência
  media_relationship:  0-100  // Relação com mídia
  buyout_pattern:      "predatory" | "opportunistic" | "passive" | "never"
  internal_culture:    "nurturing" | "demanding" | "toxic" | "professional"
  retention_rate:      0-100  // % de idols que renovam contrato
  flagship_idol_id:    uint32? // Idol principal que define a agência
}
```

### 2. Arquétipos de Agência Rival

| Arquétipo | Dono Típico | Comportamento | Exemplo de Nome |
|---|---|---|---|
| **Predadora de Buyout** | Empresário agressivo | Buyout frequency alta, oferece salários inflados, rouba talentos | "Crown Entertainment" |
| **Nicho Seiyuu** | Ex-produtora de anime | Foco total em dublagem e eventos otaku. Roster pequeno, especializado | "Voice Garden" |
| **Variety Machine** | Ex-comediante famoso | Produz personalidades de TV. Muitos jobs de variety. Pouca música | "Laugh Factory" |
| **Premium Boutique** | Produtor veterano prestigiado | Poucos idols, todos tier alto. Foco em qualidade. Caro | "Maison Étoile" |
| **Tóxica que queima talentos** | Empresário ganancioso | Agenda agressiva, salários baixos, turnover alto. Resultados de curto prazo | "Blaze Productions" |
| **Agência Família** | Casal ou família de ex-idols | Alta retenção, salários justos, crescimento lento. Idols leais | "Heartbeat Agency" |
| **Factory Idol** | Conglomerado corporativo | Volume massivo, sistema de graduação, grupos grandes | "48 Project" |
| **Rising Underdog** | Ex-idol jovem e ambiciosa | Começa pequena, cresce rápido, estratégia agressiva | "NEO Stage" |
| **Digital Pioneer** | Influencer/streamer | Foco em conteúdo online e streaming. Pouca TV tradicional | "PixelStar" |
| **Legacy Institution** | Família de produção com história | Décadas de história, idols lendárias debutadas, prestígio | "Sakura Crown" |

**Regras:**
- As ~50 agências são distribuídas entre esses arquétipos pela seed
- Cada agência tem nome, dono NPC, estética e comportamento únicos
- Arquétipos afetam decisões da IA (predadora tenta mais buyouts, etc.)
- O jogador aprende a reconhecer padrões ("Crown sempre tenta roubar minha ace")

### 3. Memória e Rivalidade

- Agências lembram de **interações passadas** com o jogador
- Rejeitar buyout de uma agência 3x faz ela parar de tentar (por 6 meses)
- Aceitar collab frequentemente com uma agência cria **relação positiva**
- Roubar idol de uma agência cria **rivalidade** (mais buyouts retaliatórios)
- Rivalidades aparecem no News Feed ("Tensão entre [sua agência] e Crown Entertainment")
- Agências com relação positiva oferecem melhores termos de collab
- Rivalidades duradouras criam narrativa emergente (pilar 4)

### 4. Visibilidade no Jogo

| Onde | O que mostra |
|---|---|
| **Ranking de agências** | Nome, tier, dono, foco, roster size |
| **News Feed** | Ações da rival com tom de voz do dono |
| **Perfil da rival** | Ficha completa com roster, histórico, estética |
| **Market/Transfer** | Quem está competindo pela mesma idol |
| **Agency Intelligence** | Comparativo com rivais (estimado) |
| **Planning Board** | Movimentos projetados de rivais |

## Open Questions

- **RESOLVIDO**: Dono da agência IA tem nome e personalidade visível. É um
  NPC -- pode inclusive ser uma idol debutada. NPC é classe pai de vários
  tipos: idol, compositor, admin de empresa, treinador, scout, etc.
- **RESOLVIDO**: Agências IA podem cooperar (alianças, collabs frequentes).
  É orgânico pro meio, ajuda mútua natural
- **RESOLVIDO**: IA pode convidar jogador pra collab (não só buyout). É fonte
  de jobs cross-agency
