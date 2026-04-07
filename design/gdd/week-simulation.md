# Week Simulation Engine

> **Status**: Designed (v2 — integrado com show/setlist/audience/music systems)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: show-system.md, setlist-system.md, audience-system.md, music-entities.md, staff-functional.md

## Overview

O Week Simulation Engine é o orquestrador central que processa uma semana
completa de jogo. Recebe a agenda de todas idols, roda cada job/atividade,
calcula resultados, atualiza stats, barras de wellness, fama, economia, e
gera eventos aleatórios. É o "motor" invisível que transforma decisões do
jogador em consequências. Em modo Skip, roda instantaneamente. Em modo Live,
distribui os processos ao longo dos dias da semana.

## Player Fantasy

Infraestrutura invisível. O jogador não interage com este sistema diretamente
-- ele sente os EFEITOS: "rodei a semana e minha idol rank C surpreendeu num
show de TV porque a Consistência rolou alto". O drama emergente do **Pilar 4**
vem daqui: é este sistema que transforma números em histórias.

## Detailed Design

### Core Rules

#### 1. Pipeline de Processamento Semanal

A simulação processa na seguinte ordem (crítica -- ordem importa):

```
FASE 1: INÍCIO DA SEMANA (segunda-feira)
  1.1 Novas idols entram no mercado (entry_month check)
  1.2 Novos jobs aparecem no board (Media Entities + Events + Brand offers)
  1.3 Resultados de castings/scouting agendados na semana anterior
  1.4 Mercado de transferências atualiza (propostas pendentes resolvidas)
  1.5 Contratos que vencem nesta semana são sinalizados

FASE 2: PROCESSAMENTO DIÁRIO (seg-dom, ou instantâneo no Skip)
  Para cada dia da semana, para cada idol com atividade:
    2.1 Checar se idol está disponível (não bloqueada, não em burnout)
    2.2 Se slot é JOB: calcular performance (Job Assignment formula)
    2.3 Se slot é PERFORMANCE EVENT (★): processar via show-system.md
        → Setlist música por música (setlist-system.md)
        → Audiência dinâmica (audience-system.md)
        → Produção técnica (staff-functional.md)
        → Feedback individual por idol por música
    2.4 Se slot é TREINO GENÉRICO: aplicar crescimento de stat focado
    2.5 Se slot é ENSAIO DE SETLIST: aplicar mastery dividido (setlist-system.md)
    2.6 Se slot é ENSAIO DE MÚSICA: aplicar mastery focado (setlist-system.md)
    2.7 Se slot é PSICÓLOGO: reduzir stress
    2.8 Se slot é COMPOSIÇÃO: progresso na música sendo composta (music-entities.md)
    2.9 Se slot é DESCANSO: recuperar saúde e stress
    2.10 Se slot BLOQUEADO (sem exclusividade): registrar perda
    2.11 Checar eventos aleatórios do dia (Event/Scandal Generator)

FASE 3: FIM DA SEMANA (domingo)
  3.1 Stats crescem/decaem (Stats System tick semanal)
  3.2 Wellness atualiza (Happiness tick semanal)
  3.3 Fama atualiza (Fame & Rankings)
  3.4 Receitas/despesas semanais processadas (Agency Economy)
  3.5 Contratos avançam 1 semana
  3.6 Rival Agency AI processa decisões (contratações, escalações, etc.)
  3.7 News Feed populado com eventos da semana
  3.8 Idol Personal Finance: gastos semanais processados

FASE 4: RELATÓRIO (após processamento)
  4.1 Gerar resumo da semana (jobs, receita, eventos, mudanças)
  4.2 Se fim de mês: relatório mensal (Economy, Rankings, Charts)
  4.3 Se fim de temporada: eventos sazonais processados
  4.4 Checar condições de Pause automático (escândalos, burnout, propostas)
```

#### 2. Processamento de Rival AI

No passo 3.6, TODAS as 50 agências IA processam sua semana:
- Avaliam mercado e fazem propostas de contratação
- Escalam suas idols nos jobs disponíveis pro tier delas
- Renovam/rescindem contratos vencendo
- Investem em facilities e marketing (proporcionalmente ao tier)
- Encomendam músicas, produzem merch
- Respondem a eventos/escândalos de suas idols

**Performance**: IA usa heurísticas simplificadas (não roda a mesma pipeline
completa do jogador). Decisões são: contratar idol com melhor custo-benefício
no tier, escalar idol com melhor match de stats, manter wellness acima de 40%.

#### 3. Geração de Eventos Aleatórios

No passo 2.8, cada dia tem chance de gerar eventos:

```
chance_evento_dia = BASE_EVENT_CHANCE + modifier_por_idol

BASE_EVENT_CHANCE = 0.05 (5% por dia por idol ativa)

Tipos de evento possíveis:
- Escândalo (Temperamento baixo + Vida Pessoal alta aumentam chance)
- Oportunidade surpresa (convite inesperado pra job premium)
- Conflito interno (entre idols do mesmo grupo)
- Fã club reage (positiva ou negativamente a algo que aconteceu)
- Lesão/doença (Saúde baixa aumenta chance)
- Viral online (chance pequena, boost enorme de fama se acontecer)
- Idol debutada anuncia volta (raro, aparece no News Feed)
```

#### 4. Modo Live vs. Skip

| Aspecto | Live | Skip |
|---|---|---|
| Velocidade | ~1 min/dia (ajustável ×0.5 a ×4) | Instantâneo |
| Eventos | Aparecem em "tempo real" durante a semana | Acumulados no relatório |
| Intervenção | Jogador pode pausar e intervir a qualquer momento | Sem intervenção até o relatório |
| Pause automático | Evento urgente pausa imediatamente | Evento urgente interrompe skip |
| Skip | Disponível em todas versões | Disponível para todos |

### States and Transitions

| Estado da Simulação | Descrição | Transição |
|---|---|---|
| **Aguardando** | Semana não iniciada, jogador preparando agenda | → Processando (jogador inicia) |
| **Processando (Live)** | Dias passando em tempo real | → Pausado, → Interrompido, → Concluído |
| **Processando (Skip)** | Semana inteira instantânea | → Interrompido, → Concluído |
| **Pausado** | Jogador pausou durante Live | → Processando (resume) |
| **Interrompido** | Evento urgente forçou pause | → Processando (após resolver) |
| **Concluído** | Semana processada, relatório gerado | → Aguardando (próxima semana) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Schedule/Agenda** | ← input | Agenda completa de todas idols como input |
| **Job Assignment** | ← fórmulas | Calcula performance de cada Job (não-show) usando fórmulas do Job Assignment |
| **show-system.md** | ← processa | Processa Performance Events (★) com setlist, audiência, produção |
| **setlist-system.md** | ← mastery | Ensaios processados como atividade. Mastery atualizado |
| **audience-system.md** | ← engagement | Audiência processada durante shows |
| **music-entities.md** | ← composição | Composições em progresso avançam |
| **staff-functional.md** | ← funções | Funções de staff processadas. Produtor time budget consumido |
| **Stats System** | ↔ tick | Dispara crescimento/decaimento semanal. Lê stats (16 atributos + 6 ocultos + traits) |
| **Happiness & Wellness** | ↔ tick | Atualiza barras. Lê barras pra modificar performance |
| **Fame & Rankings** | → atualiza | Atualiza fama baseado em resultados dos jobs |
| **Agency Economy** | → atualiza | Processa receitas e despesas da semana |
| **Contract System** | → atualiza | Avança contratos, checa vencimentos |
| **Rival Agency AI** | → dispara | Aciona processamento das 50 agências IA |
| **Event/Scandal Generator** | → dispara | Rola eventos aleatórios por dia/idol |
| **Time/Calendar** | ← tick | Recebe sinal de avançar semana |
| **Music Charts** | → atualiza | Se fim de mês: atualiza ranking de músicas |
| **Media Entities** | → atualiza | Se fim de mês: atualiza audiência de shows |
| **Idol Personal Finance** | → atualiza | Processa gastos semanais das idols |
| **News Feed** | → popula | Gera notícias de tudo que aconteceu |
| **Market/Transfer** | → atualiza | Novas idols no mercado, propostas resolvidas |

## Formulas

#### Tempo de Processamento (performance budget)

```
// Modo Skip: tudo em 1 frame burst
target_skip_time = <200ms no PC

// Budget por fase:
  Fase 1 (início): <50ms
  Fase 2 (diário × 7 dias × N idols): <200ms
  Fase 3 (fim semana + IA): <200ms
  Fase 4 (relatório): <50ms

// Rival AI: 50 agências × heurística simplificada
  target_ai_time = <100ms total (2ms por agência)
```

#### Chance de Evento por Dia

```
chance_evento = BASE_EVENT_CHANCE × (1 + risk_modifiers)

risk_modifiers:
  + (20 - Temperamento) / 100     // Temperamento baixo = mais eventos
  + (Vida_Pessoal) / 100          // Vida Pessoal alta = mais exposição
  + stress / 200                  // Stress alto = mais vulnerável
  + fama / 5000                   // Mais famosa = mais atenção da mídia

Exemplo: idol com Temperamento 5, Vida Pessoal 15, stress 60, fama 3000
  chance = 0.05 × (1 + 0.15 + 0.15 + 0.30 + 0.60) = 0.05 × 2.20 = 11%/dia
```

## Moment Engine — Fazendo o Jogador SENTIR os Resultados

O pipeline de simulacao processa numeros. O Moment Engine transforma
numeros em **momentos dramaticos** que o jogador lembra. E a diferenca
entre "performance 0.92" e "Tanaka Yui calou o Budokan com uma performance
que ninguem esperava".

### Principio

No FM, o match engine e onde o jogo ACONTECE. O jogador ve gols,
lesoes, viradas. No Idol Agency, o equivalente sao os **momentos da
semana** — shows, programas, lancamentos, escandalos, reacoes de fas.
O jogo precisa de uma camada de apresentacao que transforme dados em
sensacao.

### 1. Headlines da Semana

Apos a simulacao, o jogo gera **2-5 headlines** dos momentos mais
impactantes da semana. Nao sao todos os resultados — sao os que
IMPORTAM.

```
SEMANA 34 — DESTAQUES

★ "Tanaka Yui recebe ovacao de pe no Budokan"
  Show solo — Nota S (0.94). Primeiro show solo em arena grande.
  Fama +250. Fas: euforia.
  [Ver detalhes]

⚡ "Suzuki Mei saiu chorando do programa ao vivo"
  TV variety — Nota D (0.42). Pressao + stress acumulado.
  Mentalidade testada. Fama -80. Midia: preocupacao.
  [Ver detalhes]

📰 "Crown Entertainment comprou a ace vocal da rival Heartbeat"
  Buyout de ¥45M. Mercado reagiu.
  [Ver no mercado]

💬 "Fas do grupo Aurora iniciam campanha #AuroraForever"
  Fan mood +15. Loyalty +5. Merch vendendo 40% acima do normal.

🌟 "Novata Kimura Riko surpreende em programa regional"
  Primeira aparicao em TV — Nota A (0.87). Ninguem esperava.
  Scout alert: "Fiquem de olho."
```

**Regras de selecao de headlines:**
- Prioridade: Nota S ou F > escandalos > mudancas de ranking > surpresas
- Maximo 5 headlines (menos e melhor)
- Headlines de rival so aparecem se tier similar ao jogador
- Cada headline e 1-2 linhas + link pra detalhes
- Tom de voz varia: celebratorio, preocupado, neutro, dramatico

### 2. Reaction Cards

Apos cada headline, o jogo pode mostrar **reacoes** do ecossistema:

```
REACOES — "Suzuki Mei saiu chorando do programa"

[MIDIA]  TV Tokyo: "Momento preocupante ao vivo. Audiencia pico de 3.2M
          espectadores nesse instante."
[FAS]    Mood -15. "#ProtejamSuzuki" trending. Dedicados preocupados.
         Hardcore enviando mensagens de apoio. Anti-fans: "Nunca devia
         ter ido pra TV nacional."
[IDOL]   Motivacao -15. Stress +20. Mentalidade testada (passou — 62 > 40).
         Pediu conversa com produtor.
[STAFF]  Wellness Advisor: "Eu avisei ha 2 semanas. Ela precisava de folga."
         Talent Manager: "Sugiro cancelar os jobs da proxima semana."
[RIVAL]  Crown Entertainment observando. Score de buyout recalculado.
```

**Regras:**
- Reaction cards sao **opcionais** (jogador expande se quiser)
- No modo Skip: so headlines aparecem, reactions no drill-down
- No modo Live: reactions aparecem em tempo real durante o dia
- Reactions de staff so aparecem se staff relevante contratado

### 3. Moment Summaries por Tipo

Cada tipo de "grande momento" tem formato de apresentacao proprio:

#### Show / Concerto

```
╔═══════════════════════════════════════╗
║  🎤 LIVE SHOW — Budokan, Tokyo       ║
║  Tanaka Yui — Solo Concert           ║
╠═══════════════════════════════════════╣
║  Audiencia: 12,000 (LOTADO)          ║
║  Nota: S (0.94)                      ║
║                                      ║
║  Momentos:                           ║
║  ♫ Abertura com hit #1 — publico     ║
║    cantou junto                      ║
║  ♫ MC emocional sobre a jornada —    ║
║    Comunicacao 78 brilhou            ║
║  ♫ Encore improvizado — Aura 85     ║
║    levantou arena                    ║
║                                      ║
║  Fator decisivo: Aura excepcional    ║
║  Ponto fraco: Resistencia testada    ║
║    (passou — 68 > 60)               ║
╚═══════════════════════════════════════╝
```

#### Programa de TV

```
╔═══════════════════════════════════════╗
║  📺 TV — Music Monday Ep. 52        ║
║  Suzuki Mei — Guest                  ║
╠═══════════════════════════════════════╣
║  Audiencia: 2.1M espectadores        ║
║  Nota: D (0.42)                      ║
║                                      ║
║  O que aconteceu:                    ║
║  ✗ Nervosa desde o inicio — maos     ║
║    tremendo no microfone             ║
║  ✗ Esqueceu letra no trecho final    ║
║  ✗ Apresentador tentou ajudar mas    ║
║    Mei nao conseguiu improvisar      ║
║  ✓ Momento de honestidade ao final   ║
║    gerou empatia do publico          ║
║                                      ║
║  Fator decisivo: Stress 78% entrando ║
║  Ponto positivo: Carisma salvou de F ║
╚═══════════════════════════════════════╝
```

#### Lancamento Musical

```
╔═══════════════════════════════════════╗
║  💿 LANCAMENTO — "Starlight Dreams" ║
║  Grupo Aurora — 3rd Single           ║
╠═══════════════════════════════════════╣
║  Vendas semana 1: 45,000 copias      ║
║  Posicao no chart: #7 (↑)           ║
║  Streaming: 1.2M plays              ║
║                                      ║
║  Recepcao:                           ║
║  Critica: ★★★★☆ "Evolucao real"    ║
║  Fas: "Melhor single ate agora"      ║
║  Publico geral: "Quem sao essas?"   ║
║                                      ║
║  Impacto: Fama grupo +180           ║
║  Ponto forte: Vocal de Sato (82)    ║
║  Ponto fraco: Coreografia simples   ║
╚═══════════════════════════════════════╝
```

### 4. Internal Agency Mood

Apos o processamento da semana, o jogo calcula e mostra o **clima interno**
da agencia:

```
CLIMA DA AGENCIA ESTA SEMANA: ☀️ OTIMISTA

"Semana forte. A equipe esta animada com os resultados do show da
 Tanaka e o lancamento do Aurora. Suzuki ainda esta abalada mas o
 staff esta de olho. Moral geral em alta."

Moral media do roster: 72 (+5)
Staff mood: Bom (coach celebrando, PR aliviado)
Proximo desafio: renovacao da Sato em 3 semanas
```

**Niveis de mood:**
| Mood | Condicao | Efeito visual |
|---|---|---|
| ☀️ Otimista | Media moral > 70, semana boa | Tom leve, cores quentes |
| 🌤 Normal | Media moral 50-70 | Neutro |
| 🌧 Tenso | Media moral 30-50, ou evento negativo | Tom preocupado |
| ⛈ Crise | Media moral < 30, ou escandalo grave | Tom urgente, vermelho |

- Mood e 1 frase + 1 emoji. Nao e painel. E SABOR
- Aparece no topo do resumo semanal, antes das headlines
- Jogador pode ignorar completamente (e so atmosfera)

### 5. Geracao dos Momentos

```
// Apos o processamento numerico da semana:

momentos_brutos = todos resultados de jobs + eventos + mudancas de ranking

// Filtrar por impacto:
momentos_relevantes = filtrar(momentos_brutos, impacto > MOMENT_THRESHOLD)

// Rankear por dramaticidade:
momentos_ranked = sort(momentos_relevantes, by: dramaticidade DESC)
  dramaticidade = |resultado - esperado| × visibilidade × emocionalidade

// Selecionar top N:
headlines = momentos_ranked[0:MAX_HEADLINES]  // MAX_HEADLINES = 5

// Gerar texto:
pra cada headline:
  usar template + dados do momento
  adicionar reaction cards (midia, fas, idol, staff, rival)
```

**Dramaticidade alta quando:**
- Resultado muito diferente do esperado (surpresa positiva ou negativa)
- Job de alta visibilidade (TV nacional, festival, Kouhaku)
- Idol em momento critico (debut, retorno de crise, ultimo show)
- Rival envolvido (perdeu job disputado, buyout)
- Fas reagiram forte (mood mudou > 15 pontos)

## Edge Cases

- **50 agências IA + 3000 idols no Skip**: Precisa rodar em <500ms.
  IA usa heurísticas, não pipeline completa. Profiling obrigatório
- **Evento urgente no último dia da semana (domingo)**: Processa fim de
  semana, DEPOIS apresenta o evento. Jogador resolve antes de avançar
- **Jogador pausa no meio do Live e muda agenda**: Mudanças na agenda
  só afetam dias NÃO processados. Dias já rodados são irreversíveis
- **Idol entra em burnout na quarta-feira**: Slots de quinta a domingo
  são automaticamente cancelados. Jobs perdidos com consequências
- **Fim de mês + fim de temporada + evento sazonal na mesma semana**:
  Todos processados sequencialmente. Relatório combinado
- **Rival AI tenta contratar sua idol durante a semana**: Proposta chega
  como evento urgente (Pause automático). Jogador decide na hora
- **Zero idols contratadas**: Simulação roda normalmente mas sem
  processamento de idols. Rival AI continua jogando. Jogador só vê
  mercado e relatórios

## Dependencies

**Hard:**
- Schedule/Agenda — input principal (agenda completa)
- Job Assignment — fórmulas de performance
- Time/Calendar — trigger de avançar semana
- Stats System — tick semanal de crescimento
- Happiness & Wellness — tick semanal de barras

**Soft:**
- Todos outros sistemas são atualizados por este (Economy, Fame, Contract,
  AI, Events, News, Charts, Media, Finance)

**Depended on by:**
Week Results UI, News Feed, todos sistemas que dependem de tick semanal

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_EVENT_CHANCE` | 0.05/dia | 0.01-0.15 | Frequência de eventos aleatórios |
| `SKIP_TARGET_MS` | 500ms | 200-2000ms | Budget de performance pro Skip |
| `AI_BUDGET_MS_PER_AGENCY` | 2ms | 1-5ms | Budget de IA por agência |
| `URGENT_EVENT_TYPES` | escândalo, burnout, proposta rival, buyout | Configurável | Quais eventos forçam Pause |
| `MONTHLY_PROCESSING` | Charts, Rankings, Economy report, Media audience | Fixo | O que roda no fim do mês |
| `SEASONAL_PROCESSING` | Eventos sazonais, premiações | Fixo | O que roda no fim da temporada |

## Acceptance Criteria

1. Pipeline processa uma semana completa na ordem correta (Fases 1→4)
2. Modo Skip roda em <200ms no PC target com 50 agências e 3000 idols
3. Modo Live distribui processamento ao longo dos 7 dias sem drops de FPS
4. Eventos urgentes interrompem Skip e forçam Pause corretamente
5. Rival AI processa decisões pra 50 agências dentro do budget de 100ms
6. Fim de mês dispara relatórios mensais (Economy, Charts, Rankings)
7. Todos sistemas são atualizados na ordem correta (stats antes de fama,
   fama antes de economia)
8. Eventos aleatórios respeitam fórmula de chance com modificadores
9. Jogador pode pausar durante Live e mudanças na agenda afetam só dias
   não processados
10. Relatório semanal resume tudo que aconteceu de forma clara

## Open Questions

- **RESOLVIDO**: Processamento paralelo em Godot: Sim. Jobs de idols
  diferentes calculados em paralelo via threads/jobs
- **RESOLVIDO**: Replay da semana: Não implementar. Sem vantagem clara
- **RESOLVIDO**: Skip em hardware low-end: aparece barra de loading até
  completar processamento. Sem redução de features
