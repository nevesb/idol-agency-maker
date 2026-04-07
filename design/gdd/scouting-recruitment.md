# Scouting & Recruitment

> **Status**: Designed (v2 — referências a 16 atributos, traits, perfil vocal)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Related**: idol-attribute-stats.md (scouts revelam 16 atributos + 1-2 traits com skill alto + perfil vocal)

## Overview

O Scouting & Recruitment gerencia os 5 pipelines de descoberta de talentos:
olheiros de rua, open auditions (castings), festivais/eventos, scouting online,
e transferências diretas. Cada método tem custo, risco e qualidade de informação
diferentes. Olheiros são enviados pra cidades específicas (custo proporcional à
distância/tamanho), e a região afeta os stats das idols encontradas. Agências
ricas podem ter múltiplos olheiros simultâneos em cidades diferentes.

## Player Fantasy

A fantasia é de **caçador de diamantes brutos**. Mandar um olheiro pra Fukuoka
porque leu no feed que uma idol promissora apareceu lá. Fazer um casting e
descobrir uma novata rank D que na verdade é S+ (porque o scout estimou errado).
Serve o **Pilar 1**: scouting tem regras reais de custo, precisão, e risco.

## Detailed Design

### Core Rules

#### 1. Os 5 Pipelines

| Pipeline | Custo | Pool | Precisão de Stats | Tempo |
|---|---|---|---|---|
| **Olheiro de rua** | ¥200K-¥1M/semana por cidade | Raw talent, aleatório | ±15 nos stats, tier range ±2 | 1-4 semanas |
| **Open audition (casting)** | ¥500K-¥2M por audição | Filtrado por requisitos | Exato nos atributos testados | Agenda 1 semana antes, resultado na seguinte |
| **Festival/Evento** | ¥100K-¥500K ingresso | Idols indie já ativas | Consistência revelada (viu performar). Stats ±10 | Durante o evento |
| **Scouting online** | ¥50K-¥200K | Virais, streamers | ±20 nos stats (vídeo não é confiável) | Instantâneo |
| **Transfer direto** | Custo de buyout (¥1M-¥300M+) | Idols já contratadas por rival | Stats completos (já pública) | Negociação 1-4 semanas |

#### 2. Scouts como NPCs do Mundo (Seed Fixa)

Scouts são **entidades fixas no World Pack** (~500 no total). Não envelhecem,
não surgem novos. São contratados e demitidos do mercado de scouts.

```
Scout {
  id:        uint32
  name:      string       // Nome fixo pela seed
  level:     1-20         // Nível atual (determina precisão)
  xp:        0-1000       // XP atual dentro do nível (barra visível)
  specialty: string?      // "vocal", "dance", null=generalista
  salary:    ¥amount/mês  // Proporcional ao nível
  status:    "free" | "hired" | "scouting" | "reporting"
  agency_id: uint32?      // Qual agência contratou (null se livre)
}
```

**Progressão de Scouts:**
- Scouts ganham **XP** a cada trabalho de scouting completado
- XP suficiente = sobe de nível (barra de XP visível pro jogador)
- Nível mais alto = melhor precisão de stats, range de tier menor
- **Nível e XP são visíveis** no perfil do scout (não é oculto)
- XP ganho por missão: proporcional à dificuldade da região e resultado

**Sala de Scouts (facility da agência):**
- Agência tem uma **sala de scouts** com slots limitados por tier:

| Tier Agência | Slots de Scout |
|---|---|
| Garagem | 1 |
| Pequena | 2 |
| Média | 3 |
| Grande | 4 |
| Elite | 5+ |

**Mercado de Scouts:**
- ~500 scouts no pool total (seed fixa, mesmos em todo playthrough)
- Jogador contrata do mercado (scouts livres)
- Pode demitir a qualquer momento (scout volta pro mercado, mantém nível/XP)
- Agências IA também contratam scouts (competição pelo pool)
- Scout contratado por rival não está disponível pra você
- Scout com skill alto: range de tier menor (±1 vs ±2), stats mais precisos
- Scout especialista: +20% precisão em stats da especialidade
- Custo de enviar scout = salary + viagem (proporcional à distância)

#### 3. Regiões e Tendências

| Região | Tendência de Stats | Custo de Scout | Volume de Talentos |
|---|---|---|---|
| Tokyo (Harajuku, Shibuya, Akiba) | Polimento, bem-rounded | Base | Muito alto |
| Kansai (Osaka, Namba) | Carisma/Humor alto | ×1.2 | Alto |
| Fukuoka (Tenjin) | Visual alto | ×1.3 | Médio |
| Nagoya (Sakae) | Disciplina alta | ×1.3 | Médio |
| Hokkaido | Resistência alta | ×1.5 | Baixo |
| Outras regionais | Stats baixos, lealdade alta, custo baixo | ×1.5 | Baixo |

#### 4. News Feed como Scouting Passivo

Conforme definido no Market/Transfer GDD:
- Notícias revelam pistas sobre idols (localização, tier, habilidade)
- Jogador atento manda olheiro pra região certa antes da concorrência
- Idol debutada que anuncia volta = scouting por news feed

#### 5. Scouting e Atributos Ocultos

- Olheiro de rua: vê rótulo de personalidade + background. Sem pistas de ocultos
- Casting: revela Consistência (viu performar sob pressão) + rótulo
- Festival: revela Consistência + Temperamento (viu em ambiente real)
- Online: só rótulo (vídeo não mostra personalidade real)
- Scout skill 15+: pode dar 1 pista extra de oculto ("parece ter ambição alta")

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Disponível** | Scout esperando ordens | → Enviado (jogador envia) |
| **Enviado** | Scout viajando pra destino | → Scouting (chegou) |
| **Scouting** | Buscando idols na região | → Reportando (encontrou) |
| **Reportando** | Relatório pronto pra jogador | → Disponível (jogador leu) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Market/Transfer** | → filtra | Retorna subset de idols por região/método |
| **Idol Database** | ← lê | Pool de idols disponíveis por região |
| **Agency Economy** | ← custo | Salário de scouts + custo de viagem |
| **Stats System** | ← lê (parcial) | Stats com margem de erro por skill do scout |
| **News Feed** | ← pistas | Notícias como scouting passivo |
| **Contract System** | → alimenta | Idol encontrada → inicia proposta |

## Formulas

```
precisao_stats = STAT_REAL ± (MAX_ERROR × (1 - scout_skill / 20))
  MAX_ERROR = 15 (rua), 10 (festival), 20 (online), 0 (transfer/casting testado)

tier_range = ±(3 - floor(scout_skill / 7))
  skill 1-6: ±2 tiers, skill 7-13: ±1 tier, skill 14-20: exato (exceto S+ masking)

custo_viagem = BASE_TRAVEL × distancia_regiao × semanas_scouting
  BASE_TRAVEL = ¥100K
```

## Edge Cases

- Scout enviado pra região sem idols disponíveis: Volta sem resultado. Custo gasto
- Dois scouts na mesma cidade: Podem encontrar idols diferentes (pool é grande)
- Scout encontra idol que IA já está negociando: Jogador recebe aviso de competição
- Scout skill 1 estima tier SSS como tier C: Possível. Jogador investe confiando e descobre depois

## Dependencies

**Hard**: Market/Transfer, Idol Database, Agency Economy
**Soft**: News Feed (scouting passivo), Stats System
- **Producer Profile** (#50): Background, cidade e estilo afetam precisão de scouting. Ver `producer-profile.md` seção 4a-4c.
**Depended on by**: Contract System, Scouting UI

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `MAX_STAT_ERROR` | 15 | 5-25 | Margem de erro máxima de stats |
| `SCOUT_SALARY_BASE` | ¥300K/mês | ¥100K-¥1M | Custo de manter scout |
| `SCOUTING_WEEKS` | 1-4 | 1-8 | Semanas pra completar busca |
| `SCOUTS_PER_TIER` | Garagem 1, Elite 5 | 1-10 | Max scouts por tier |

## Acceptance Criteria

1. 5 pipelines funcionam com custos e precisões diferentes
2. Scout skill afeta precisão de stats e range de tier
3. Regiões retornam idols com tendências de stats corretas
4. S+ masking funciona (S/SS/SSS reportados como "S+")
5. News feed serve como scouting passivo funcional
6. Custos de scouting debitados corretamente da economia

## Open Questions

- **RESOLVIDO**: Scouts com sistema de leveling (XP + nível visível).
  Já definido na seção "Scouts como NPCs do Mundo"
- **RESOLVIDO**: Scouts são NPCs fixos no World Pack (~500). Não gerados
  em runtime. Já definido
