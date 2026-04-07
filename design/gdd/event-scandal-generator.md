# Event/Scandal Generator

> **Status**: Designed (v2 — referências a 6 ocultos incl. Profissionalismo, traits)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 4 — O Drama Nasce das Mecânicas
> **Related**: idol-attribute-stats.md (6 ocultos: Temperamento, Vida Pessoal, Profissionalismo + traits afetam probabilidade de eventos)

## Overview

O Event/Scandal Generator produz eventos aleatórios que criam drama emergente.
Não há eventos scriptados -- tudo nasce da combinação de estado das idols
(ocultos, wellness, fama, agenda) com probabilidade. Escândalos leves/médios
AUMENTAM fama mas destroem felicidade. Escândalos graves destroem fama.
Oportunidades surpresa, conflitos internos, virais, e crises de saúde também
são gerados. Processado diariamente pelo Week Simulation Engine.

## Player Fantasy

A fantasia é de **viver num mundo imprevisível mas justo**. Você sabia que a
idol tinha Temperamento baixo. Você viu que ela tinha folga na quarta. Você
escolheu não ativar restrição de namoro. Quando o escândalo aparece, é
consequência das suas decisões -- não injustiça aleatória. Serve o **Pilar 4**:
todo drama tem causa mecânica rastreável.

## Detailed Design

### Core Rules

#### 1. Tipos de Evento

#### 1. Sistema DETERMINÍSTICO de Triggers

Escândalos **NÃO são aleatórios**. Cada tipo tem triggers específicos e quando
TODOS os triggers estão ativos simultaneamente, o escândalo **acontece com
certeza**. Faz parte do meta-game aprender quais são os triggers e evitar
que se combinem. O assistente avisa sobre triggers ativos.

#### 2. Catálogo de Escândalos (Triggers Determinísticos)

**ESCÂNDALOS LEVES** (fama sobe, felicidade desce pouco):

| Escândalo | Trigger 1 | Trigger 2 | Trigger 3 | Resultado |
|---|---|---|---|---|
| **Flagrada na rua com amigo** | Vida Pessoal > 12 | 2+ semanas com folga | Fama > 500 | +20 fama, -5 felicidade |
| **Compras luxuosas expostas** | Personal Finance: compra recente | Vida Pessoal > 10 | Fama > 1000 | +15 fama, -3 felicidade, fãs comentam |
| **Foto em lugar inesperado** | Vida Pessoal > 14 | 3+ dias de folga na semana | Fama > 300 | +10 fama, -3 felicidade |

**ESCÂNDALOS MÉDIOS** (fama sobe bastante, felicidade e stress sofrem):

| Escândalo | Trigger 1 | Trigger 2 | Trigger 3 | Trigger 4 | Resultado |
|---|---|---|---|---|---|
| **Namoro exposto** | Restrição namoro OFF | Vida Pessoal > 12 | 3+ semanas com folga consecutivas | Fama > 500 | +50 fama, -15 felicidade, +25 stress |
| **Comentário polêmico** | Temperamento < 8 | Stress > 60 | Job público na semana (TV/evento) | — | +30 fama, -10 felicidade, +20 stress |
| **Briga pública** | Temperamento < 6 | Stress > 70 | Saúde < 40 | — | +40 fama, -20 felicidade, +30 stress |
| **Vazamento de informação** | Exclusividade OFF | Job em agência rival na semana | Temperamento < 10 | — | +25 fama, -10 felicidade, +15 stress |

**ESCÂNDALOS GRAVES** (fama DESCE, consequências severas):

| Escândalo | Trigger 1 | Trigger 2 | Trigger 3 | Trigger 4 | Resultado |
|---|---|---|---|---|---|
| **Colapso público** | Saúde < 20 | Stress > 90 | Job forçado na semana | — | -200 fama, -30 felicidade, burnout imediato |
| **Agressão/Briga séria** | Temperamento < 3 | Stress > 80 | Felicidade < 20 | Conflito ativo no grupo | -300 fama, -30 felicidade, possível rescisão |
| **Fraude/Engano** | Idol endividada (Personal Finance) | Dívida > 3× renda | Temperamento < 5 | — | -500 fama, -30 felicidade, crise total |

**CONFLITOS INTERNOS (grupo)**:

| Conflito | Trigger 1 | Trigger 2 | Trigger 3 | Resultado |
|---|---|---|---|---|
| **Rivalidade entre membros** | 2 membros com Temperamento < 8 | Diferença de fama > 2000 entre membros | 4+ semanas juntas | -10 felicidade todos, chemistry -0.05 |
| **Ciúme de destaque** | 1 membro com fama > 3× média do grupo | Membro com Ambição > 14 | — | Membro famoso pede solo, -15 felicidade dele |

**EVENTOS POSITIVOS** (também determinísticos):

| Evento | Trigger 1 | Trigger 2 | Trigger 3 | Resultado |
|---|---|---|---|---|
| **Viral inesperado** | Job público recente com Sucesso | Carisma > 70 | Fama < 2000 (ainda não famosa) | +100-300 fama, +15 felicidade |
| **Oportunidade VIP** | Fama > 3000 | 2+ jobs Sucesso consecutivos | Tier agência Média+ | Convite pra job premium exclusivo |
| **Fãs fazem campanha positiva** | Fan Club mood > 80 | Música no top 20 | — | +30 fama, +10 felicidade |

#### 3. Checagem de Triggers (por idol por dia)

```
Para cada idol ativa, todo dia:
  Para cada tipo de escândalo/evento:
    checar se TODOS os triggers estão ativos
    se sim: evento ACONTECE (determinístico, não probabilístico)
    marcar evento como "ocorrido" (cooldown de X semanas antes de poder ocorrer de novo)
```

**Cooldown**: Mesmo tipo de escândalo não pode acontecer pra mesma idol
dentro de X semanas (evita spam):
- Escândalo leve: cooldown 4 semanas
- Escândalo médio: cooldown 8 semanas
- Escândalo grave: cooldown 16 semanas
- Conflito interno: cooldown 6 semanas
- Eventos positivos: cooldown 4 semanas

#### 4. Tabela de Efeitos (resumo)

| Evento | Fama | Felicidade | Stress | Motivação |
|---|---|---|---|---|
| Escândalo leve | +10 a +20 | -3 a -5 | +5 a +10 | -3 |
| Escândalo médio | +25 a +50 | -10 a -20 | +15 a +30 | -10 |
| Escândalo grave | -200 a -500 | -30 | +30 a +40 | -20 |
| Conflito interno | 0 | -10 a -15 todos | +15 | -5 |
| Viral | +100 a +300 | +15 | +5 | +20 |
| Oportunidade | +30 | +10 | 0 | +15 |
| Fã club positivo | +20 a +30 | +10 | 0 | +10 |

#### 5. PR/Crisis Management (Facility)

PR **NÃO previne** o escândalo (triggers ativos = acontece). PR **reduz impacto**:
- Nível 1: Reduz efeitos negativos em 20%
- Nível 2: Reduz 40% + desativa 1 trigger aleatório por semana (pode impedir escândalo)
- Nível 3: Reduz 50% + monitora 2 triggers + pode "abafar" escândalos leves (não vira notícia)

#### 6. Assistente (Dicas de Triggers)

O assistente **avisa** quando triggers estão se acumulando:
- "Idol Tanaka está com 2/3 triggers de 'namoro exposto' ativos. Cuidado com a folga"
- "Idol Yamada com Stress 65 e Temperamento baixo num job de TV amanhã. Risco de 'comentário polêmico'"

### States and Transitions

Eventos não têm estados próprios -- são instantâneos. O que tem estado é a
**crise resultante** no Happiness System (Em Crise) ou no Fame System (queda).

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Happiness & Wellness** | ← lê, → afeta | Stress/wellness triggers. Eventos afetam barras |
| **Fame & Rankings** | → afeta | Escândalos leves/médios = +fama. Graves = -fama |
| **Contract System** | ← lê | Restrição de namoro, exclusividade afetam chances |
| **Time/Calendar** | ← tick diário | Processado a cada dia no Week Simulation |
| **Stats System** | ← lê ocultos | Temperamento, Vida Pessoal, Consistência |
| **Agency Economy** | ← facility | PR dept reduz impacto |
| **News Feed** | → gera | Todos eventos viram notícias proporcionais ao tier |
| **Idol Personal Finance** | ← lê | Crise financeira da idol pode gerar eventos |

## Formulas

#### Checagem Diária de Triggers

```
// Processado pelo Week Simulation a cada dia, pra cada idol ativa

para cada tipo_evento em CATALOGO_EVENTOS:
  se cooldown_ativo(idol, tipo_evento): skip

  triggers_ativos = 0
  triggers_totais = tipo_evento.triggers.length

  para cada trigger em tipo_evento.triggers:
    se avaliar_trigger(idol, trigger): triggers_ativos++

  se triggers_ativos == triggers_totais:
    executar_evento(idol, tipo_evento)
    aplicar_cooldown(idol, tipo_evento, COOLDOWN_SEMANAS[tipo_evento])
```

#### Impacto com PR

```
impacto_final = impacto_base × (1 - PR_REDUCTION)
  PR_REDUCTION = 0 (sem), 0.20 (nível 1), 0.40 (nível 2), 0.50 (nível 3)

PR nível 2+: pode desativar 1 trigger aleatório por semana (prevenção)
PR nível 3: pode abafar escândalo leve (50% chance de não gerar notícia)
```

#### Cooldown

```
cooldown_semanas = {
  leve: 4,
  medio: 8,
  grave: 16,
  conflito: 6,
  positivo: 4
}
```

## Edge Cases

- **3 escândalos na mesma semana**: Possível se triggers diferentes estão todos
  ativos. Cada um tem cooldown independente. Efeitos empilham. Devastador mas
  SEMPRE evitável -- jogador falhou em gerenciar múltiplos triggers
- **Escândalo durante evento ao vivo**: Pause automático. Jogador decide como reagir
- **Viral + escândalo na mesma semana**: Ambos determinísticos, processados
  separadamente. Net effect pode ser positivo (mais fama que felicidade perdida)
- **Idol com Temperamento 20 e Vida Pessoal 1**: Quase impossível ter escândalo
  -- a maioria dos triggers exige Temperamento baixo ou Vida Pessoal alta
- **Todos triggers exceto 1 ativos**: Escândalo NÃO acontece. É binário: todos
  ou nenhum. O jogador que gerenciar 1 trigger crucial evita o escândalo
- **PR nível 2 desativou trigger que era o último ativo**: Escândalo prevenido.
  PR vale o investimento. Jogador vê no log: "PR desativou trigger X esta semana"
- **Idol com 0 folga e sem restrição de namoro**: Trigger de "folga consecutiva"
  nunca ativa → escândalo de namoro não acontece. Mas stress sobe (overwork)

## Dependencies

**Hard**: Happiness, Fame, Time/Calendar, Stats (ocultos)
**Soft**: Contract (cláusulas), Agency Economy (PR facility), News Feed
**Depended on by**: Happiness, Fame, News Feed, Week Simulation

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_EVENT_CHANCE` | 0.03/dia | 0.01-0.10 | Frequência de eventos |
| `SCANDAL_LIGHT_FAME` | +20 | +5-50 | Fama de escândalo leve |
| `SCANDAL_GRAVE_FAME` | -200 a -500 | -100-1000 | Perda de escândalo grave |
| `PR_REDUCTION_BY_LEVEL` | 0/0.20/0.40/0.50 | 0-0.60 | Redução do PR dept |
| `VIRAL_CHANCE` | 0.001/dia | 0.0001-0.01 | Chance de viral |

## Acceptance Criteria

1. Sistema é DETERMINÍSTICO: todos triggers ativos = evento acontece (não probabilístico)
2. Cada tipo de escândalo tem triggers específicos documentados
3. Escândalos leves/médios AUMENTAM fama, graves REDUZEM
4. PR dept reduz impacto E pode desativar 1 trigger/semana (nível 2+)
5. Cooldowns impedem repetição do mesmo tipo (4-16 semanas)
6. Todos eventos aparecem no News Feed proporcional ao tier
7. Eventos urgentes forçam Pause automático
8. Assistente avisa sobre triggers ativos ("2/3 triggers de namoro ativos")
9. Nenhum escândalo é "injusto" -- SEMPRE é rastreável aos triggers
