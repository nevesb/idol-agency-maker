# Idol Archetypes & Roles

> **Status**: Designed (v2 — referências a 16 atributos + traits)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real, Pilar 3 — Multiplos Caminhos ao Topo
> **Related**: idol-attribute-stats.md (16 atributos em 4 categorias, traits, perfil vocal), show-system.md (papéis no show por música)

## Overview

O Idol Archetypes & Roles formaliza **papeis jogaveis** que classificam cada
idol baseado na combinacao de seus stats. Como posicoes no futebol, arquetipos
dao linguagem comum pra scouting, montagem de grupos, leitura de roster e
decisoes de escalacao. Arquetipos sao **derivados dos stats** (nao atribuidos
manualmente) e podem mudar conforme a idol cresce. Sao a camada de leitura
que faltava entre numeros brutos e decisoes estrategicas.

## Player Fantasy

A fantasia e de **produtor que le o mercado em termos de papeis**. "Preciso
de uma center pra esse grupo." "Essa novata e all-rounder ou bait de visual?"
"Meu roster esta fraco em variety engines." Arquetipos criam linguagem de
comunidade e facilitam discussoes estrategicas -- exatamente como "regista",
"mezzala" e "trequartista" no FM.

## Detailed Design

### Core Rules

#### 1. Lista de Arquetipos

| Arquetipo | Stats Dominantes | Descricao | Uso Ideal |
|---|---|---|---|
| **Center** | Carisma > 70, Aura > 65, Visual > 60 | O rosto do grupo. Magnetismo natural. Puxa atencao | Lider de grupo, foco de marketing, face da agencia |
| **Ace Vocal** | Vocal > 75, Comunicacao > 55 | Pillar musical. Voz que define o grupo | Gravacoes, shows, solos, composicao |
| **Dance Ace** | Danca > 75, Resistencia > 60 | Ancora coreografica. Fisico excepcional | Performances ao vivo, MVs, turnes |
| **Visual Face** | Visual > 80, Carisma > 55 | Atratividade excepcional. Imagem da marca | Sessoes de fotos, endorsements, merch |
| **Variety Engine** | Variedade > 70, Comunicacao > 60 | Motor de entretenimento. Humor e presenca | TV, radio, talk shows, eventos |
| **All-Rounder** | Nenhum stat > 75, media geral > 55 | Versátil. Encaixa em qualquer contexto | Coringa, substituta, base estavel |
| **Reliable Veteran** | Mentalidade > 70, Comunicacao > 65, idade > 25 | Pilar de estabilidade. Mentora natural | Mentoria, TV, programas fixos |
| **Rising Trainee** | TA < 40% do PT, idade < 20, PT tier B+ | Diamante bruto. Potencial alto, stats baixos | Investimento de longo prazo |
| **Chaos Magnet** | Temperamento < 6 (oculto), Carisma > 60 | Imprevisivel. Drama ambulante mas carismática | Alto risco/alto retorno. Gera noticias |
| **Fan Magnet** | Carisma > 70, Comunicacao > 65, fan_club.size > media | Adorada pelos fas. Conexao emocional forte | Fan meets, merch, redes sociais |
| **Crossover Actress** | Atuacao > 70, Variedade > 55 | Talento dramatico. Potencial fora do idol | Dramas, filmes, dublagem, carreira longa |
| **Digital Native** | Comunicacao > 60, Aprendizado > 70 | Nativa digital. Domina streaming e redes | Streaming, conteudo online, presenca digital |

#### 2. Atribuicao Automatica de Arquetipo

Arquetipos sao **calculados, nao atribuidos**. O sistema avalia os stats da
idol e atribui o arquetipo que melhor encaixa:

```
para cada arquetipo:
  score = soma(stat_valor / stat_requisito pra cada requisito do arquetipo)
  se todos requisitos atendidos: score *= 1.5 (bonus de match completo)

arquetipo_primario = arquetipo com maior score (se score > threshold)
arquetipo_secundario = segundo maior score (se score > threshold × 0.7)
```

**Regras:**
- Toda idol tem **1 arquetipo primario** (sempre)
- Pode ter **1 arquetipo secundario** (se stats suportam)
- Idol sem nenhum stat dominante = "All-Rounder" (catch-all)
- Arquetipo **muda dinamicamente** conforme stats mudam (treinou Vocal e
  virou Ace Vocal; envelheceu e virou Reliable Veteran)
- Mudanca de arquetipo e notificada ao jogador (evento informativo)
- Jogador **nao pode forcar** arquetipo -- e derivado dos stats
- Arquetipo aparece como badge no perfil e nas listas

#### 3. Arquetipos em Contexto de Grupo

Ao montar um grupo, o jogo mostra a **composicao por arquetipo**:

```
Grupo "Aurora" (5 membros):
  Center:        Tanaka Yui ★
  Ace Vocal:     Sato Hana
  Dance Ace:     Kimura Riko
  Variety Engine: Yamada Moe
  Visual Face:   Suzuki Rin

Sinergia de composicao: EXCELENTE
  - Todos papeis cobertos
  - Nenhum arquetipo duplicado
  - Center forte unifica o grupo
```

**Regras de sinergia por arquetipo:**
- Grupo com todos 5 papeis "core" (Center, Vocal, Dance, Visual, Variety): bonus sinergia +0.15
- Grupo sem Center: penalidade -0.10 (falta lideranca visual)
- 2+ do mesmo arquetipo: penalidade -0.05 por duplicata (redundancia)
- All-Rounder nao conta como duplicata (e versátil)
- Chaos Magnet no grupo: sinergia variavel (+0.10 a -0.20 por semana, aleatorio)

#### 4. Nomes Diegeticos vs Labels Internas

Os arquetipos tem **dois nomes**: o label interno (sistema) e o nome
diegetico (como o mundo do jogo chama). Isso evita que o jogo soe
como planilha de game design e permite que a comunidade adote a
linguagem naturalmente.

| Label Interno (sistema) | Nome Diegetico (UI / midia / fas) | Contexto de uso |
|---|---|---|
| Center | **センター** (Sentaa) / "O Rosto" | "Tanaka e o Rosto do grupo Aurora" |
| Ace Vocal | **歌姫** (Utahime) / "A Voz" | "Sato e a Voz da geracao" |
| Dance Ace | **踊り手** (Odoritte) / "A Dançarina" | "A melhor Dancarina do mercado" |
| Visual Face | **ビジュアル担当** (Bijuaru Tantou) / "O Visual" | "Visual incontestavel" |
| Variety Engine | **バラエティ番長** (Baraeti Banchou) / "A Entertainer" | "Nasceu pra TV" |
| All-Rounder | **万能型** (Bannou-gata) / "Polivalente" | "Faz tudo bem, nada excepcional" |
| Reliable Veteran | **大黒柱** (Daikokubashira) / "O Pilar" | "O Pilar que sustenta o roster" |
| Rising Trainee | **金の卵** (Kin no Tamago) / "Ovo de Ouro" | "Novata promissora, observem" |
| Chaos Magnet | **お騒がせ** (Osawagase) / "A Inquieta" | "Sempre nos titulos — nem sempre por boas razoes" |
| Fan Magnet | **推され** (Oshirase) / "A Queridinha" | "Os fas a adoram incondicionalmente" |
| Crossover Actress | **女優アイドル** (Joyuu Aidoru) / "A Atriz" | "Mais atriz que idol — e isso e um elogio" |
| Digital Native | **ネット発** (Netto-hatsu) / "A Nativa Digital" | "Nasceu no streaming" |

**Regras de apresentacao:**
- **UI do jogo**: Usa nome diegetico em japones + traducao
- **News Feed**: Midia usa nome diegetico ("A nova Utahime de Tokyo")
- **Perfil da idol**: Badge com nome diegetico + tooltip com descricao
- **Sistema interno / comparacoes**: Pode usar label tecnico quando util
- **Filtros de scouting**: Aceita ambos (jogador pode buscar por "Center" ou "Sentaa")
- **Comunidade**: Vai naturalmente usar os termos que forem mais memoraveis

Os nomes diegeticos em japones reforcam o sabor cultural do jogo e
dao peso ao mundo ficcional. Nao sao so rotulos -- sao como a
industria real fala.

#### 5. Arquetipos no Scouting

Scouts podem buscar por arquetipo especifico:

```
"Buscar idol com potencial pra Center"
= Scout prioriza candidatos com Carisma + Aura + Visual altos
= Mesmo que TA baixo, PT alto nos stats certos e relevante
```

- Formaliza o "buscar lateral esquerdo" do FM
- Scout reporta arquetipo estimado do candidato (com margem de erro)
- Arquetipo estimado pode estar errado (stats estimados pelo scout)

#### 5. Arquetipos na UI

| Contexto | Como aparece |
|---|---|
| **Perfil da idol** | Badge com icone e nome do arquetipo |
| **Lista de roster** | Coluna de arquetipo filtravel |
| **Montagem de grupo** | Barra mostrando arquetipos presentes/faltantes |
| **Scouting** | Filtro por arquetipo desejado |
| **Comparacao** | Comparar idols do mesmo arquetipo |
| **Roster Balance** | Grafico de cobertura por arquetipo |
| **News Feed** | "[Idol] esta se consolidando como Ace Vocal" |

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Idol Attribute/Stats** | <- lê stats | Stats determinam arquetipo |
| **Group Management** | -> sinergia | Composicao de arquetipos afeta sinergia |
| **Scouting & Recruitment** | -> filtro | Scouts podem buscar por arquetipo |
| **Job Assignment** | -> recomendacao | Arquetipo sugere jobs ideais |
| **Roster Balance** | -> cobertura | Cobertura por arquetipo no roster |
| **Talent Development** | <- foco de imagem | Foco de treino pode mudar arquetipo |
| **Agency Intelligence** | -> reports | Reports usam linguagem de arquetipo |
| **Fame & Rankings** | <- lê fama | Fama afeta alguns arquetipos (Fan Magnet) |
| **Fan Club System** | <- lê fas | Tamanho do fa-clube afeta Fan Magnet |
| **News Feed** | -> notifica | Mudancas de arquetipo viram noticias |

## Formulas

#### Score de Arquetipo

```
score_arquetipo = sum(min(stat_valor / stat_min, 1.5) pra cada requisito)
                × match_bonus

match_bonus = 1.5 se TODOS requisitos >= min
            = 1.0 se algum requisito nao atendido

arquetipo_primario = max(score) se score > ARCHETYPE_THRESHOLD (default: 2.0)
arquetipo_secundario = segundo max se score > ARCHETYPE_THRESHOLD × 0.7
```

#### Sinergia de Grupo por Arquetipos

```
bonus_composicao = 0.0
  + 0.15 se grupo tem 5 arquetipos core distintos
  - 0.10 se nao tem Center
  - 0.05 × duplicatas (exceto All-Rounder)
  + 0.05 se tem Reliable Veteran (estabilidade)
  ± random(-0.20, +0.10) se tem Chaos Magnet

sinergia_total = sinergia_base_do_grupo + bonus_composicao
```

## Edge Cases

- **Idol com stats todos iguais**: All-Rounder (catch-all)
- **Idol muda de arquetipo apos treino**: Normal e esperado. Notificacao
  no feed. Grupo pode perder bonus de composicao
- **Trainee com stats baixos demais pra qualquer arquetipo**: "Rising
  Trainee" se PT tier B+ e idade < 20. Senao, All-Rounder
- **Chaos Magnet atribuido a idol com Temperamento oculto**: Sim, jogador
  nao sabe por que ela e Chaos Magnet (oculto) -- descobre pelo comportamento
- **Idol com 2 arquetipos candidatos empatados**: Primario = o com match_bonus
  mais alto. Se empate total, usa o primeiro na lista de prioridade
- **Grupo com 12 membros**: Composicao pode ter duplicatas inevitaveis.
  Penalidade e real mas diluida pelo tamanho do grupo
- **Scout estima arquetipo errado**: Stats estimados pelo scout podem
  resultar em arquetipo diferente do real. Risco normal do scouting

## Dependencies

**Hard:**
- Idol Attribute/Stats -- stats determinam arquetipo

**Soft:**
- Fan Club System (Fan Magnet)
- Fame & Rankings (Fan Magnet)
- Idol Lifecycle (idade pra Veteran)

**Depended on by:**
- Group Management (sinergia)
- Scouting & Recruitment (filtro)
- Roster Balance (cobertura)
- Agency Intelligence (linguagem de reports)
- Job Assignment (recomendacoes)
- Talent Development (image focus)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `ARCHETYPE_THRESHOLD` | 2.0 | 1.5-3.0 | Score minimo pra atribuir arquetipo |
| `SECONDARY_THRESHOLD_MULT` | 0.7 | 0.5-0.9 | Fator pra arquetipo secundario |
| `GROUP_FULL_COMP_BONUS` | 0.15 | 0.05-0.25 | Bonus por composicao completa |
| `NO_CENTER_PENALTY` | -0.10 | -0.05 a -0.20 | Penalidade sem Center |
| `DUPLICATE_PENALTY` | -0.05 | -0.02 a -0.10 | Penalidade por duplicata |
| `CHAOS_MAGNET_VARIANCE` | [-0.20, +0.10] | ajustavel | Range de aleatoriedade |

## Acceptance Criteria

1. 12 arquetipos derivados automaticamente dos stats
2. Toda idol tem 1 arquetipo primario, opcionalmente 1 secundario
3. Arquetipo muda dinamicamente conforme stats mudam
4. Badge de arquetipo visivel no perfil e nas listas
5. Montagem de grupo mostra composicao por arquetipo com sinergia
6. Scouts podem filtrar busca por arquetipo desejado
7. Sinergia de grupo afetada por composicao de arquetipos
8. All-Rounder e catch-all pra idols sem dominancia clara
9. Chaos Magnet detectada por ocultos (jogador nao sabe por que)
10. Mudanca de arquetipo notificada no feed

## Open Questions

- Nenhuma pendente
