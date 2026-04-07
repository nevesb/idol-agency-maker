# Wireframe 12 — Instalações da Agência (Facilities)

> **Status**: Draft
> **Referência visual**: FM26 Training Facilities + Agency Overview tile "Instalações"
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/facilities`
> **GDDs**: agency-economy (seção 6), schedule-agenda, talent-development-plans, happiness-wellness

---

## Conceito

Tela de gestão das instalações físicas da agência. Cada facility tem:
- **Nível** (1-3): determina a qualidade do buff de treino
- **Capacidade**: quantas idols podem usar a facility **ao mesmo tempo** num slot de agenda
- **Buff de treino**: multiplicador aplicado ao crescimento de atributos

O jogador decide onde investir: upgrades de nível (melhor buff) ou
expansões de capacidade (mais idols treinando ao mesmo tempo). Ambos
custam dinheiro e requerem aprovação do board se ultrapassar o budget.

**Princípio**: Facilities são o motor de desenvolvimento do roster.
Uma facility Nível 3 com capacidade 1 treina uma idol muito bem.
Uma facility Nível 1 com capacidade 5 treina muitas idols de forma
medíocre. O jogador precisa equilibrar.

---

## Layout Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar — Logo agência | Portal  Roster  Market  Operations  Agency  ⚙]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌── AGENCY SUB-NAV ─────────────────────────────────────────────────────┐ │
│ │ Visão Geral · [Instalações] · Finanças · Staff · Estratégia · Direção│ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── SEDE (header) ──────────────────────────────────────────────────────┐ │
│ │ 🏢 Escritório Shibuya (2º andar)  ·  Tier: Pequena                   │ │
│ │ Capacidade: 15 idols / 10 staff  ·  Aluguel: ¥800K/mês              │ │
│ │ Próxima sede: Andar Completo Shibuya (¥2M/mês, 30 idols / 15 staff) │ │
│ │ Requer: Tier Média + ¥50M em caixa          [Solicitar Upgrade →]   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── RESUMO RÁPIDO ──────────────────────────────────────────────────────┐ │
│ │ Facilities instaladas: 4/9  ·  Custo mensal total: ¥1.9M            │ │
│ │ Investimento acumulado: ¥16M  ·  Slots de treino usados: 12/18      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── FACILITIES ─────────────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  ── DESENVOLVIMENTO (treino de atributos) ──────────────────────────  │ │
│ │                                                                        │ │
│ │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│ │  │ 🎤 Sala de Treino Vocal                                        │  │ │
│ │  │ Nível: 2 (Bom) ████████░░  ·  Buff: ×1.5 Vocal                │  │ │
│ │  │ Capacidade: 3 idols/slot  ·  Usando: 2/3 esta semana          │  │ │
│ │  │ Custo: ¥1M/mês  ·  Requer: coach + slot na agenda             │  │ │
│ │  │                                                                 │  │ │
│ │  │ [Upgrade → Nv.3 ¥2M/mês] [Expandir +1 slot ¥3M]  [Detalhes]  │  │ │
│ │  └─────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                        │ │
│ │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│ │  │ 💃 Studio de Dança                                              │  │ │
│ │  │ Nível: 1 (Básico) ████░░░░░░  ·  Buff: ×1.2 Dança             │  │ │
│ │  │ Capacidade: 2 idols/slot  ·  Usando: 2/2 esta semana          │  │ │
│ │  │ Custo: ¥300K/mês  ·  Requer: coach + slot na agenda           │  │ │
│ │  │                                                                 │  │ │
│ │  │ [Upgrade → Nv.2 ¥1M/mês] [Expandir +1 slot ¥2M]  [Detalhes]  │  │ │
│ │  └─────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                        │ │
│ │  ┌─ NÃO INSTALADA ────────────────────────────────────────────────┐  │ │
│ │  │ 🎭 Coaching de Atuação                                         │  │ │
│ │  │ (não possui)  ·  Buff potencial: ×1.2 Atuação + Variedade     │  │ │
│ │  │ Instalar Nv.1: ¥400K/mês, capacidade 2 idols/slot             │  │ │
│ │  │                                                                 │  │ │
│ │  │ [Instalar ¥400K/mês]                                           │  │ │
│ │  └─────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                        │ │
│ │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│ │  │ 🏋 Academia Física                                              │  │ │
│ │  │ Nível: 1 (Básico) ████░░░░░░  ·  Buff: Resistência +reduz dec.│  │ │
│ │  │ Capacidade: 3 idols/slot  ·  Usando: 1/3 esta semana          │  │ │
│ │  │ Custo: ¥200K/mês  ·  Requer: slot na agenda                   │  │ │
│ │  │                                                                 │  │ │
│ │  │ [Upgrade → Nv.2 ¥800K/mês] [Expandir +1 slot ¥2M] [Detalhes] │  │ │
│ │  └─────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                        │ │
│ │  ┌─ NÃO INSTALADA ────────────────────────────────────────────────┐  │ │
│ │  │ 🧑‍🏫 Mentoria (Veterana)                                       │  │ │
│ │  │ (gratuita — requer idol veterana no roster)                     │  │ │
│ │  │ Buff: bônus geral pra novatas + hints de atributos ocultos     │  │ │
│ │  │ Capacidade: 1 novata por veterana mentora                      │  │ │
│ │  │ Status: sem veterana disponível no roster                       │  │ │
│ │  └─────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                        │ │
│ │  (continua: Inteligência, Marketing, Produção — mesma estrutura)      │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sede (Header)

Informações da sede física que abriga a agência. A sede é o "container"
das facilities — trocá-la desbloqueia mais espaço e mais facilities.

| Elemento | Descrição |
|---|---|
| **Nome da sede** | Tipo do espaço + localização (ex: "Escritório Shibuya 2F") |
| **Tier** | Tier atual da agência (determina quais facilities podem ser instaladas) |
| **Capacidade** | Max idols e staff que a sede comporta |
| **Aluguel** | Custo mensal fixo da sede |
| **Próxima sede** | Upgrade path: nome, custo, capacidade. Mostra requisitos |
| **[Solicitar Upgrade →]** | Envia pedido ao board para mudar de sede (se tier permitir) |

### Sedes por Tier

| Tier | Sede padrão | Aluguel/mês | Cap. idols | Cap. staff | Facilities max |
|---|---|---|---|---|---|
| Garagem | Apartamento convertido | ¥200K | 5 | 3 | 4 |
| Pequena | Escritório comercial | ¥800K | 15 | 10 | 7 |
| Média | Andar completo | ¥2M | 30 | 15 | 10 |
| Grande | Prédio próprio | ¥5M | 50 | 25 | 13 |
| Elite | Campus/Flagship | ¥10M | 100+ | 50+ | Todas |

---

## Resumo Rápido

Barra de contexto entre header e lista de facilities:

| Dado | Descrição |
|---|---|
| **Facilities instaladas** | X de Y possíveis no tier atual |
| **Custo mensal total** | Soma de todos os custos mensais de facilities |
| **Investimento acumulado** | Total já gasto em instalações e upgrades |
| **Slots de treino usados** | Soma de idols escaladas em facilities esta semana vs. capacidade total |

---

## Lista de Facilities — 4 Departamentos

Cada facility é um card expandível com informações densas. Facilities
não instaladas aparecem em estilo "ghost" (opacidade reduzida, borda tracejada).

### Departamento de Desenvolvimento (treino de atributos)

Facilities que melhoram atributos diretamente. **Requerem slot na agenda**
da idol + coach correspondente para funcionar com qualidade total.

| Facility | Nv.1 | Nv.2 | Nv.3 | Cap. base | Atributos |
|---|---|---|---|---|---|
| 🎤 Sala de Treino Vocal | ×1.2, ¥300K/mês | ×1.5, ¥1M/mês | ×2.0, ¥2M/mês | 2 idols/slot | Vocal |
| 💃 Studio de Dança | ×1.2, ¥300K/mês | ×1.5, ¥1M/mês | ×2.0, ¥2M/mês | 2 idols/slot | Dança |
| 🏋 Academia Física | buff, ¥200K/mês | buff+, ¥800K/mês | buff++, ¥1.5M/mês | 3 idols/slot | Resistência |
| 🎭 Coaching de Atuação | ×1.2, ¥400K/mês | ×1.5, ¥1.5M/mês | ×2.0, ¥2.5M/mês | 2 idols/slot | Atuação, Variedade |
| 🧑‍🏫 Mentoria (Veterana) | — | — | — | 1 novata/veterana | Geral (novatas) |

**Capacidade base** = quantas idols podem usar a facility **no mesmo slot
de agenda**. Expandir capacidade custa investimento único (¥2M-¥5M por slot
adicional, depende da facility).

**Sem coach**: a facility funciona a 50% do multiplicador (produtor cobre
com qualidade reduzida). Com coach de nível alto, o multiplicador efetivo
pode ser ainda maior.

### Departamento de Inteligência/Defesa (prevenção de riscos)

Facilities de proteção. Algumas requerem slot na agenda, outras são passivas.

| Facility | Nv.1 | Nv.2 | Nv.3 | Cap. base | Req. idol |
|---|---|---|---|---|---|
| 🧘 Psicólogo | ¥500K/mês, alerta burnout 2 sem | ¥1.5M, + stress ×0.8 | ¥3M, + recup. rápida | 2 idols/slot | Slot na agenda |
| 📰 PR/Crisis Management | ¥800K/mês, escândalos -20% | ¥2M, -40% + alerta | — | — (passiva) | — |
| ⚖ Assessoria Jurídica | ¥1M/mês, negociação + | — | — | — (passiva) | — |

**Psicólogo** é a única desta categoria que exige slot na agenda e tem
capacidade limitada. As demais são serviços passivos que beneficiam toda
a agência.

```
┌─ CARD: PSICÓLOGO ──────────────────────────────────────────────────┐
│                                                                     │
│  🧘 Psicólogo                                                      │
│  Nível: 2 (Bom) ████████░░  ·  Efeito: stress ×0.8 + alerta 2sem │
│  Capacidade: 2 idols/slot  ·  Usando: 2/2 esta semana             │
│  Custo: ¥1.5M/mês                                                  │
│                                                                     │
│  Idols escaladas esta semana:                                       │
│  🟡 Suzuki Rin (stress 72%) — sessão terça                         │
│  🟢 Tanaka Yui (stress 45%) — sessão quinta                        │
│                                                                     │
│  ⚠ Capacidade lotada — Yamada Rei (stress 68%) na fila de espera   │
│                                                                     │
│  [Upgrade → Nv.3 ¥3M/mês] [Expandir +1 slot ¥4M]  [Detalhes]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Departamento de Marketing/Bem-Estar (visibilidade + felicidade)

Facilities passivas que beneficiam o roster inteiro (sem slot de agenda).

| Facility | Nv.1 | Nv.2 | Nv.3 | Cap. base | Req. idol |
|---|---|---|---|---|---|
| 📱 Equipe de Social Media | ¥500K/mês, fama passiva + | ¥1.5M, campanhas + | ¥3M, viral chance | — (passiva) | — |
| ☕ Sala de Convivência | ¥200K/mês, felicidade base + | ¥600K, + team bonding | ¥1M, + afinidade | — (passiva) | — |
| 🛋 Área de Descanso | ¥300K/mês, stress recovery + | ¥800K, recovery ++ | — | — (passiva) | — |
| 🍱 Refeitório/Chef | ¥400K/mês, Resistência passiva + | ¥1.5M, + moral | — | — (passiva) | — |

**Nota sobre capacidade**: Facilities passivas não têm capacidade limitada —
elas beneficiam todas as idols do roster automaticamente. O buff escala com
o nível, não com a quantidade de usuários.

```
┌─ CARD: SALA DE CONVIVÊNCIA ────────────────────────────────────────┐
│                                                                     │
│  ☕ Sala de Convivência                                             │
│  Nível: 1 (Básico) ████░░░░░░  ·  Efeito: felicidade base +5%    │
│  Tipo: Passiva (beneficia todas as idols)                           │
│  Custo: ¥200K/mês                                                   │
│                                                                     │
│  Impacto atual: 5 idols recebendo bônus de felicidade              │
│                                                                     │
│  [Upgrade → Nv.2 ¥600K/mês: +team bonding +10%]  [Detalhes]       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Facilities de Produção (redução de custo / receita)

Investimentos de capital com retorno a médio-longo prazo. Desbloqueiam
com tier da agência. Capacidade mede **quantos projetos simultâneos**.

| Facility | Custo inicial | Custo/mês | Efeito | Cap. base | Tier mín. |
|---|---|---|---|---|---|
| 🎵 Studio de Gravação | ¥50M | ¥3M | Produção musical -50% custo | 1 projeto/vez | Média |
| 🖨 Gráfica/Impressão | ¥30M | ¥2M | Merch -40% custo | 1 linha/vez | Média |
| 🛒 Loja Online Própria | ¥10M | ¥1M | Margem +20% vendas diretas | — (passiva) | Pequena |

```
┌─ CARD: STUDIO DE GRAVAÇÃO ─────────────────────────────────────────┐
│                                                                     │
│  🎵 Studio de Gravação                                              │
│  Nível: Instalado  ·  Efeito: custo de produção musical -50%      │
│  Capacidade: 1 projeto simultâneo (expandir: +1 por ¥30M)          │
│  Custo: ¥3M/mês  ·  Investido: ¥50M                               │
│                                                                     │
│  Projeto atual: Gravação single "Starlight Dream" (Yamada Rei)     │
│  Progresso: ████████░░ 78%  ·  Entrega: semana 48                  │
│                                                                     │
│  ⚠ Studio ocupado — próximo slot disponível: semana 49             │
│                                                                     │
│  [Expandir +1 slot ¥30M]  [Detalhes]                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detalhe de Facility (Modal/Drill-Down)

Ao clicar em [Detalhes] de qualquer facility, abre painel lateral ou
modal com informações completas:

```
┌─ DETALHE: SALA DE TREINO VOCAL ────────────────────────────────────┐
│                                                                     │
│  🎤 Sala de Treino Vocal                                            │
│                                                                     │
│  ── NÍVEL & BUFF ──                                                 │
│                                                                     │
│  Nível atual: 2 (Bom)                                               │
│  Multiplicador: ×1.5 ao crescimento de Vocal                       │
│                                                                     │
│  Nv.1 (Básico)  ✓   ×1.2   ¥300K/mês                              │
│  Nv.2 (Bom)     ◉   ×1.5   ¥1M/mês    ← atual                    │
│  Nv.3 (Exc.)    ○   ×2.0   ¥2M/mês    [Upgrade ¥2M/mês]          │
│                                                                     │
│  ── CAPACIDADE ──                                                   │
│                                                                     │
│  Slots simultâneos: 3 idols por período de agenda                  │
│  Base (Nv.1): 2  ·  Expansão comprada: +1  ·  Total: 3            │
│                                                                     │
│  Expansão seguinte: +1 slot por ¥3M (investimento único)           │
│  Máximo nesta sede: 5 idols/slot                                    │
│                                                                     │
│  ── USO ESTA SEMANA ──                                              │
│                                                                     │
│  Seg  Ter  Qua  Qui  Sex  Sáb  Dom                                │
│  AM:  2/3  3/3  1/3  2/3  3/3  ──   ──                            │
│  PM:  1/3  2/3  ──   3/3  2/3  ──   ──                            │
│                                                                     │
│  Idols usando esta semana:                                          │
│  Yamada Rei    — Ter AM, Qui AM, Sex PM    (foco: Vocal)           │
│  Tanaka Yui    — Ter AM, Sex AM            (foco: Vocal)           │
│  Suzuki Rin    — Qua AM, Qui PM, Sex AM    (foco: geral)          │
│                                                                     │
│  ── COACH RESPONSÁVEL ──                                            │
│                                                                     │
│  Kato Hiroshi (Vocal Coach, Skill 14)                               │
│  Eficácia: ×1.3 adicional ao multiplicador da sala                 │
│  Resultado efetivo: ×1.5 × ×1.3 = ×1.95 crescimento              │
│                                                                     │
│  ── HISTÓRICO ──                                                    │
│                                                                     │
│  Instalada: Semana 8, Ano 1 (Nv.1)                                │
│  Upgrade Nv.2: Semana 22, Ano 1                                    │
│  Expansão +1 slot: Semana 35, Ano 1                                │
│  Investimento total: ¥3M (instalação) + ¥3M (expansão) = ¥6M      │
│                                                                     │
│  ── IMPACTO MEDIDO ──                                               │
│                                                                     │
│  Idols que treinaram aqui: 4                                        │
│  Crescimento médio de Vocal: +2.8/semana (vs +1.2 sem facility)   │
│  ROI estimado: ¥2.5M em receita adicional de jobs vocais           │
│                                                                     │
│  [Upgrade Nível] [Expandir Capacidade] [Fechar]                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Mecânica de Capacidade — Regras

A capacidade define **quantas idols podem ser escaladas para a mesma
facility no mesmo período de agenda** (manhã ou tarde de um dia).

| Regra | Descrição |
|---|---|
| **Capacidade base** | Definida pelo tipo de facility (2-3 para treino, 1 para produção) |
| **Expansão** | Investimento único por slot adicional (¥2M-¥5M conforme facility) |
| **Máximo por sede** | Cada tier de sede tem um teto de capacidade por facility |
| **Conflito** | Se mais idols querem treinar do que slots disponíveis, as excedentes ficam em fila de espera |
| **Fila de espera** | Idols na fila não treinam naquele período — são realocadas automaticamente para "Descanso" |
| **Agenda** | O jogador escala idols nas facilities via tela de Operações/Agenda |

### Capacidade máxima por sede

| Tier sede | Treino (por facility) | Psicólogo | Produção (projetos) |
|---|---|---|---|
| Garagem | 2 | 1 | — |
| Pequena | 3 | 2 | 1 |
| Média | 5 | 3 | 2 |
| Grande | 8 | 5 | 3 |
| Elite | 12 | 8 | 5 |

### Custo de expansão de capacidade

| Tipo de facility | Custo por +1 slot |
|---|---|
| Treino (Vocal, Dança, Atuação) | ¥3M (único) |
| Academia Física | ¥2M (único) |
| Psicólogo | ¥4M (único) |
| Studio de Gravação | ¥30M (único) |
| Gráfica | ¥15M (único) |

---

## Upgrade Path — Visualização

O card de cada facility mostra a progressão de nível visualmente:

```
Nv.1 ──●──── Nv.2 ──●──── Nv.3
       ✓            ◉            ○
     ×1.2         ×1.5         ×2.0
    ¥300K/m       ¥1M/m        ¥2M/m
                  (atual)    [Upgrade]
```

- ✓ = nível já desbloqueado
- ◉ = nível atual
- ○ = próximo upgrade disponível
- Locked = requer tier superior (ícone de cadeado)

---

## Variações

### Agência Garagem

- Sede: "Apartamento convertido" com capacidade mínima
- 0-2 facilities instaladas. Maioria em "(não possui)"
- Sem facilities de Produção (tier insuficiente)
- Capacidade máxima: 2 idols/slot em treino
- Mensagem: "Melhore seu tier para desbloquear mais facilities"

### Agência Elite

- Sede: "Campus Flagship" com todas facilities disponíveis
- Maioria em Nv.3, capacidade expandida ao máximo
- Múltiplos studios de gravação (3-5 projetos simultâneos)
- Dashboard de utilização mostrando eficiência por facility

### Facility Lotada

- Card com borda amarela/laranja
- Badge "LOTADA" no canto superior
- Lista de idols na fila de espera
- Sugestão: "Expandir capacidade (+1 slot, ¥XM)" ou "Redistribuir agenda"

### Facility sem Coach

- Card com ícone ⚠ e texto "Sem coach — buff reduzido a 50%"
- Link: "Contratar coach →" (navega para `/agency/staff`)
- Barra de buff mostra a parte "perdida" em cinza

---

## Comportamento

| Ação | Resultado |
|---|---|
| **Click em card de facility** | Expande card inline com resumo rápido |
| **Click em [Detalhes]** | Abre painel lateral com informações completas |
| **Click em [Upgrade]** | Confirma upgrade de nível (se budget disponível) ou envia pedido ao board |
| **Click em [Expandir]** | Confirma expansão de capacidade (investimento único) |
| **Click em [Instalar]** | Instala facility Nv.1 (se tier e budget permitirem) |
| **Click em [Solicitar Upgrade → sede]** | Abre modal de pedido ao board |
| **Hover em barra de nível** | Tooltip: efeito mecânico detalhado + comparação com próximo nível |
| **Hover em idol escalada** | Tooltip: agenda completa da idol + resultados de treino recentes |
| **Click em nome de idol** | Navega para perfil da idol (wireframe 07) |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Agency Overview → Facilities | Click no tile "Instalações" | Sub-nav highlight muda |
| Facilities → Detalhe | Click em [Detalhes] | Painel desliza da direita |
| Facilities → Staff | Click em "Contratar coach →" | Navega para `/agency/staff` |
| Facilities → Board | Click em "Solicitar Upgrade" | Abre modal de pedido |
| Facilities → Agenda | Click em idol escalada | Navega para perfil ou agenda |

---

## Assets Necessários

| Asset | Formato | Tamanho | Uso |
|---|---|---|---|
| Ícones de facility (9 tipos) | SVG | 24×24 | Cards de facility |
| Ícone de cadeado (locked) | SVG | 16×16 | Facilities não disponíveis no tier |
| Ícone de upgrade (seta up) | SVG | 16×16 | Botões de upgrade |
| Ícone de expansão (+ slot) | SVG | 16×16 | Botões de expandir capacidade |
| Barra de nível (3 estágios) | CSS/SVG | variável | Progressão Nv.1→2→3 |
| Badge "LOTADA" | CSS | inline | Facilities com capacidade esgotada |
| Grid de uso semanal | CSS | tabela | Detalhe de ocupação por período |

---

## Acceptance Criteria

1. Header mostra sede atual com tier, capacidade, aluguel e path para próxima sede
2. Resumo rápido com facilities instaladas vs. possíveis, custo mensal total, slots usados
3. Facilities organizadas em 4 departamentos: Desenvolvimento, Inteligência, Marketing, Produção
4. Cada facility mostra nível (1-3), buff multiplicador, capacidade (idols/slot), uso atual e custo
5. Facilities não instaladas aparecem em estilo ghost com botão [Instalar]
6. Botão [Upgrade] para subir nível (mostra novo custo mensal)
7. Botão [Expandir] para adicionar +1 slot de capacidade (investimento único)
8. Detalhe de facility mostra: progressão de nível, grid de uso semanal, coach responsável, idols escaladas, histórico, impacto medido
9. Capacidade máxima por facility é limitada pelo tier da sede
10. Facilities sem coach mostram aviso de buff reduzido a 50% com link para contratar
11. Facilities lotadas mostram badge + fila de espera + sugestão de ação
12. Facilities passivas (Marketing/Bem-Estar) indicam claramente que beneficiam todo o roster
13. Facilities de Produção mostram projetos em andamento e próximo slot disponível
14. Mentoria é gratuita mas requer veterana no roster — status visível
15. Hover em barras mostra tooltip com efeito mecânico detalhado
16. Variação Garagem: poucas facilities, sem Produção, mensagem de progresso
17. Variação Elite: todas facilities, alta capacidade, dashboard de utilização
