# Player Reputation & Affinity

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências

## Overview

O Player Reputation & Affinity rastreia a reputação do jogador como produtor
e a afinidade individual com cada idol que já gerenciou. Reputação afeta que
agências oferecem propostas de troca. Afinidade afeta facilidade de recontratar
idols (desconto na negociação, preferência do jogador em propostas). Boa gestão
= afinidade alta = idols querem voltar. Má gestão = afinidade baixa = idols
evitam o jogador.

## Player Fantasy

A fantasia é de **legado pessoal**. Trocar de agência e reencontrar uma idol
que você cuidou anos atrás -- e ela aceitar seu contrato porque lembra que
você tratou ela bem. Serve o **Pilar 2**: suas decisões passadas afetam o
futuro de forma tangível.

## Detailed Design

### Core Rules

#### 1. Afinidade (por idol)

```
Afinidade = 0-100 (começa em 50 ao contratar)

Sobe com:
  + Wellness mantida acima de 60% (+1/mês)
  + Salário justo ou acima do mercado (+2/mês)
  + Jobs bem-sucedidos (+1 por sucesso)
  + Respeitou cláusulas do contrato (+1/mês)

Desce com:
  - Overwork / burnout (-5 por ocorrência)
  - Salário abaixo do mercado (-2/mês)
  - Rescisão unilateral (-20)
  - Fracassos consecutivos (-2 por fracasso)
  - Ignorou pedidos da idol (-3 por pedido)

Afinidade > 70: Idol prefere jogador em negociações (+15% chance)
Afinidade < 30: Idol evita jogador (-20% chance)
```

#### 2. Reputação do Jogador (global)

```
reputacao = (metas_cumpridas / metas_totais × 40)
          + (melhor_ranking_agencia / 50 × 30)
          + (anos_experiencia × 2)
          + (idols_com_afinidade_alta × 1)

Range: 0-100
```

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Contract System** | Afinidade modifica chance de aceitação |
| **Happiness & Wellness** | Wellness mantida afeta afinidade |
| **Agency Meta-Game** | Reputação afeta propostas de troca |
| **Market/Transfer** | Afinidade dá vantagem em recontratar ex-idols |

## Dependencies

**Hard**: Happiness, Contract
**Soft**: Agency Meta-Game, Market/Transfer
- **Producer Profile** (#50): Traço (Pragmático) desacelera crescimento de afinidade em 20%. Ver `producer-profile.md` seção 4d.
**Depended on by**: Agency Meta-Game, Contract (modificador)

#### 3. Legado e Especialização do Produtor

O jogador desenvolve um **perfil de gestão** baseado nas decisões ao longo
da carreira. O mercado reconhece o produtor por seu estilo.

**Títulos de legado (atribuídos automaticamente):**

| Título | Condição | Efeito |
|---|---|---|
| **Formador de Talentos** | 5+ idols desenvolvidas de Trainee a Established | Novatas +15% chance de aceitar contrato |
| **Espremedor** | 3+ burnouts causados, média de stress alta | Idols exigem cláusula de carga máxima, salário +20% |
| **Salvador de Carreiras** | 3+ idols recuperadas de crise/declínio | Idols em crise preferem sua agência |
| **Maestro Musical** | 3+ músicas no top 10, foco vocal | Jobs musicais premium aparecem +20% mais |
| **Rei da TV** | 5+ idols com programas fixos de TV | Emissoras oferecem slots com prioridade |
| **Construtor de Dinastias** | 2+ grupos no top 20 simultaneamente | Sinergia de grupo +10% |
| **Caçador de Diamantes** | 3+ idols SSS+ descobertas via scouting | Scouts da agência ganham +10% precisão |
| **Produtor Lendário** | 10+ anos de carreira com reputação > 80 | Todas idols +5% chance de aceitar contrato |

**Regras:**
- Títulos são **cumulativos** (pode ter vários)
- Título negativo ("Espremedor") pode coexistir com positivos
- Títulos aparecem no perfil do jogador e são visíveis por idols/mercado
- Ao trocar de agência, títulos acompanham o jogador
- Idols e staff reagem aos títulos (ex: idol ambiciosa prefere "Formador")

#### 4. Memórias Históricas

Ex-idols e idols ativas lembram do jogador:

```
Memória {
  idol_id:     uint32
  type:        "positive" | "negative" | "neutral"
  event:       string  // "Salvou minha carreira quando estava em crise"
  impact:      -20 a +20  // Modificador permanente na afinidade
  visible:     bool    // Aparece no perfil como citação
}
```

**Exemplos de memórias:**
- "Ele me deu uma chance quando ninguém mais queria" (afinidade +15)
- "Ela me fez trabalhar doente. Nunca vou esquecer" (afinidade -20)
- "Aprendi tudo com ele. Meu produtor pra sempre" (afinidade +20)
- "Fui trocada por uma novata mais bonita" (afinidade -10)

**Regras:**
- Memórias são geradas por eventos significativos (burnout, resgate, graduation, rescisão)
- Memórias positivas aparecem como citações no News Feed ("Ex-idol X elogia produtor")
- Memórias negativas podem aparecer em entrevistas ("Ex-idol X critica condições")
- Ao reencontrar uma idol (trocar de agência e recontratar), memórias afetam negociação

## Acceptance Criteria

1. Afinidade calculada mensalmente por idol, sobe/desce corretamente
2. Afinidade > 70 dá bônus em negociação com ex-idol
3. Reputação afeta que agências fazem propostas de troca
4. Afinidade persiste após troca de agência
5. Títulos de legado atribuídos automaticamente baseados em histórico
6. Títulos afetam chances de contratação e comportamento de idols
7. Memórias históricas geradas por eventos significativos
8. Ex-idols citam memórias no News Feed
9. Título "Espremedor" causa penalidade real em negociações
10. Títulos acompanham o jogador ao trocar de agência
