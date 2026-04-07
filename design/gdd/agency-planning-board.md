# Agency Planning Board

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 2 — Suas Decisoes, Suas Consequencias, Pilar 3 — Multiplos Caminhos ao Topo

## Overview

O Agency Planning Board e o sistema de **planejamento de medio e longo prazo**
da agencia. Enquanto o Schedule/Agenda gerencia a semana e o Financial
Reporting cobre o mes, o Planning Board olha pra frente: metas trimestrais,
roadmap anual, riscos, gargalos e oportunidades sazonais. E o equivalente
da tela de "planejamento de proxima temporada" do Football Manager.

Sem este sistema, o jogador vive reagindo ao curto prazo sem nunca construir
uma visao estrategica. Com ele, cada decisao semanal se conecta a um plano
maior.

## Player Fantasy

A fantasia e de **estrategista de longo prazo**. Nao so sobreviver semana a
semana, mas ter um plano: "em 3 meses quero debutar a Kimura solo. Em 6 meses
quero subir pra tier Media. Em 12 meses quero o grupo Aurora no top 10."
E olhar pra tras e ver que o plano funcionou -- ou entender por que nao.

## Detailed Design

### Core Rules

#### 1. Horizontes de Planejamento

| Horizonte | Duracao | Conteudo | Visibilidade |
|---|---|---|---|
| **Curto prazo** | 4 semanas | Jobs agendados, contratos vencendo, eventos iminentes | Sempre visivel |
| **Medio prazo** | 12 semanas (trimestre) | Metas trimestrais, planos de desenvolvimento, campanhas | Visivel com detalhes |
| **Longo prazo** | 52 semanas (ano) | Roadmap anual, grandes eventos sazonais, transicoes de roster | Visao geral + marcos |

#### 2. Metas Trimestrais (Jogador Define)

O jogador pode definir ate **5 metas** por trimestre:

| Tipo de Meta | Exemplos | Metrica |
|---|---|---|
| **Financeira** | "Receita > ¥10M no trimestre" | Receita total |
| **Ranking** | "Agencia no top 20" | Posicao no ranking |
| **Desenvolvimento** | "3 idols subirem de estagio" | Contagem de transicoes |
| **Grupos** | "Grupo Aurora no top 10 de grupos" | Ranking de grupo |
| **Expansion** | "Contratar 2 idols tier B+" | Contratacoes qualificadas |
| **Wellness** | "Nenhum burnout no trimestre" | Contagem de burnouts |
| **Prestigio** | "Ganhar 1 premiacao" | Premiacoes |

**Regras:**
- Metas sao **opcionais** -- jogador pode jogar sem definir
- Metas cumpridas dao bonus de reputacao do jogador (+3 por meta)
- Metas falhadas nao tem penalidade direta (so falta de bonus)
- O dono da agencia define metas **obrigatorias** (do Agency Meta-Game)
- Metas do jogador sao **adicionais** as do dono

#### 3. Roadmap Anual

Visao de 12 meses com marcos planejados:

```
ROADMAP 2027

Q1 (Jan-Mar):
  [x] Contratar vocal coach skill 12+
  [x] Kimura passar pra estagio Rising
  [ ] Iniciar gravacao do album do grupo Aurora

Q2 (Abr-Jun):
  [ ] Debut solo da Tanaka
  [ ] Participar do TIF (Tokyo Idol Festival)
  [ ] Renovar contrato da Sato (vence Jun)

Q3 (Jul-Set):
  [ ] Lancar album
  [ ] Campanha de marketing pra grupo Aurora
  [ ] Avaliar roster: quem renovar, quem liberar

Q4 (Out-Dez):
  [ ] Kouhaku qualificacao (se ranking permitir)
  [ ] Preparar graduation da veterana Watanabe
  [ ] Planejar ano seguinte
```

**Regras:**
- Jogador edita livremente o roadmap (e uma ferramenta, nao uma restricao)
- Eventos sazonais conhecidos aparecem automaticamente no roadmap
- Contratos vencendo aparecem automaticamente
- Marcos de desenvolvimento de idols podem ser adicionados
- O jogo nao pune por nao seguir o roadmap -- e so organizacao

#### 4. Calendario Sazonal

O jogo tem eventos fixos e previsíveis que o Planning Board destaca:

| Mes | Evento Sazonal | Impacto |
|---|---|---|
| **Janeiro** | Shin-nen (Ano Novo) | Jobs de TV especiais, premiacao anual |
| **Marco** | Graduation season | Idols debutam, mercado agitado |
| **Maio** | Golden Week | Eventos ao vivo, turismo, fan meets |
| **Julho** | Summer festivals (TIF, etc.) | Grandes shows, exposicao massiva |
| **Agosto** | Comiket, anime events | Jobs otaku, nicho forte |
| **Outubro** | Autumn concert season | Turnês, shows premium |
| **Dezembro** | Kouhaku / Year-end | Premiacao maxima, Jobs VIP |

**Regras:**
- Eventos sazonais aparecem no Planning Board com **8 semanas de antecedencia**
- Jogador pode se preparar (treinar, agendar, escalar)
- Perder evento sazonal = perder janela de oportunidade (volta so ano que vem)
- Agencias rivais tambem se preparam (competicao intensifica)

#### 5. Painel de Riscos e Gargalos

O Planning Board mostra riscos projetados:

```
RISCOS ATIVOS:

[!] Contrato da Sato vence em 6 semanas - renovar ou perder
[!] Orcamento negativo projetado em 3 meses se manter custos atuais
[?] Nenhuma idol preparada pra summer festival (Julho)
[?] Roster sem variety engine - gap em jobs de TV

GARGALOS:

[x] Apenas 1 coach pra 8 idols (workload 95%)
[x] Sem PR manager - proxima crise sera nao-mitigada
[ ] Pipeline de novatas vazio - nenhuma trainee no roster
```

- Riscos gerados automaticamente pelo Agency Intelligence
- Gargalos derivados do Roster Balance e Staff Operations
- Jogador pode marcar como "ciente" ou "resolvido"

#### 6. Oportunidades Projetadas

```
OPORTUNIDADES:

[★] Idol indie "Akagi Mio" (tier A estimado) entra no mercado em ~4 semanas
[★] Emissora NHK abrindo slots pra agencias tier Media+ no proximo trimestre
[★] Grupo rival "Sunshine" perdeu 2 membros - mercado de danca aquecido
```

- Oportunidades vem do News Feed, Market/Transfer e Agency Intelligence
- Ajudam o jogador a planejar movimentos proativos

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Agency Intelligence** | <- alimenta | Riscos, gargalos, oportunidades projetadas |
| **Time/Calendar** | <- datas | Eventos sazonais, deadlines |
| **Agency Meta-Game** | <- metas obrigatorias | Metas do dono da agencia |
| **Contract System** | <- prazos | Contratos vencendo |
| **Talent Development** | <- marcos | Planos de desenvolvimento de idols |
| **Agency Strategy** | <- direcao | Estrategia informa prioridades do roadmap |
| **Roster Balance** | <- lacunas | Gaps identificados aparecem como gargalos |
| **Agency Economy** | <- projecoes | Projecao financeira aparece em riscos |
| **Market/Transfer** | <- oportunidades | Movimentos de mercado projetados |
| **Player Reputation** | -> bonus | Metas cumpridas dao reputacao |
| **Scouting** | <- pipeline | Pipeline de novatas no radar |

## Edge Cases

- **Jogador nao define metas**: Funciona sem metas. Planning Board so mostra
  calendario sazonal e riscos automaticos. Sem bonus de reputacao
- **Meta impossivel** (ex: "top 1" pra agencia garagem): O sistema nao impede.
  Meta falha no fim do trimestre. Nao tem punicao alem de nao ganhar bonus
- **Todos riscos resolvidos**: Board mostra "Sem riscos ativos" -- raro mas
  possivel em periodos calmos
- **Roadmap com 20 marcos**: Sem limite tecnico. Jogador organiza como quiser
- **Evento sazonal conflita com burnout de idol estrela**: Risco aparece
  automaticamente: "Idol X pode nao estar disponivel pra [evento]"

## Dependencies

**Hard:**
- Time/Calendar -- datas e sazonalidade
- Agency Meta-Game -- metas do dono

**Soft:**
- Agency Intelligence (riscos e oportunidades)
- Todos sistemas que alimentam Intelligence

**Depended on by:**
- Agency Dashboard UI (widget de planning)
- Player Reputation (bonus por metas)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `MAX_QUARTERLY_GOALS` | 5 | 3-10 | Metas trimestrais maximas |
| `GOAL_REPUTATION_BONUS` | 3 | 1-5 | Reputacao por meta cumprida |
| `SEASONAL_ADVANCE_WEEKS` | 8 | 4-12 | Antecedencia de eventos sazonais |
| `RISK_PROJECTION_MONTHS` | 3 | 1-6 | Horizonte de projecao de riscos |

## Acceptance Criteria

1. 3 horizontes de planejamento visiveis (curto/medio/longo prazo)
2. Ate 5 metas trimestrais configuraveis pelo jogador
3. Roadmap anual editavel com marcos
4. Eventos sazonais aparecem automaticamente com antecedencia
5. Riscos e gargalos gerados automaticamente
6. Oportunidades projetadas a partir de dados do mercado
7. Contratos vencendo aparecem automaticamente
8. Metas cumpridas dao bonus de reputacao
9. Board funciona sem metas definidas (modo passivo)
10. Calendario sazonal com eventos fixos por mes

## Open Questions

- Nenhuma pendente
