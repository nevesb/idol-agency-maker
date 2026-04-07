# Idol Lifecycle & Ecosystem

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

O Idol Lifecycle & Ecosystem gerencia o ciclo completo de vida de uma idol:
aspirante → contratada → ativa → veterana → debutada (aposentada). Controla
envelhecimento, condições de debut, transição pra carreira pós-idol, e o
ecossistema rotativo de ~3.000 idols ativas. Garante que o mercado se
renova naturalmente ao longo dos 20 anos com entradas e saídas orgânicas.

## Player Fantasy

A fantasia é de **testemunha de uma indústria viva**. Ver idols que você
conheceu novatas se tornarem lendas e debutarem. Novas gerações surgindo
com stats diferentes. O mundo muda e você precisa se adaptar.

## Detailed Design

### Core Rules

#### 1. Ciclo de Vida

```
Aspirante (no mercado) → Contratada → Ativa → Veterana → Debutada
                                                         ↓
                                                   Pós-carreira
                                                   (apresentadora,
                                                    produtora, mentora)
```

#### 2. Condições de Debut (aposentadoria)

Idol decide debutar quando:
- Popularidade < limiar por 6+ meses E infelicidade > 60%
- Idade > limiar (feminina 25-35, masculina 35-40) E popularidade caindo
- Idol pede pra sair (Ambição baixa + dinheiro suficiente + idade)
- Jogador pode sugerir debut (cerimônia de graduação = fama boost final)

#### 3. Transição de Gerações

- Novas idols entram todo mês (World Pack schedule)
- Idols veteranas debutam organicamente
- Pool ativo mantém ~3.000 em equilíbrio dinâmico
- A cada 5 anos, "geração" muda significativamente
- Idols lendárias que debutaram ficam no Hall of Fame

#### 4. Pós-debut

Ex-idols não desaparecem:
- Podem virar apresentadoras de TV/rádio (geram jobs)
- Podem virar mentoras (facility da agência, bônus pra novatas)
- Podem dar entrevistas dizendo que voltariam (scouting passivo)
- Fama decai lentamente (-1%/mês até sair do ranking)

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Time/Calendar** | Tick semanal checa idade e condições de debut |
| **Stats System** | Curva de idade, decaimento de stats |
| **Fame & Rankings** | Popularidade influencia decisão de debut |
| **Happiness & Wellness** | Infelicidade + idade = pressão pra debutar |
| **Idol Database** | Novas idols entram conforme World Pack |
| **Market/Transfer** | Idol debutada sai do mercado. Volta se anuncia retorno |
| **Post-Debut Career** | Carreira pós-idol (Full Vision) |
| **News Feed** | Debut e graduação viram notícias |

#### 5. Cerimônia de Graduação

Quando uma idol vai debutar (aposentar), o jogador pode organizar uma
**cerimônia de graduação** — um evento especial que celebra a carreira
da idol e dá um boost final de fama e moral.

**Mecânicas:**

```
Graduação {
  tipo: "Simples" | "Show Especial" | "Tour Final"
  
  Simples:
    custo: ¥0 (anúncio apenas)
    fama_boost: +50
    fan_mood: -10 (tristeza, mas respeito)
    duração: 0 (instantâneo no fim da semana)
  
  Show Especial:
    custo: ¥5M-¥50M (proporcional à fama)
    fama_boost: +200 a +500 (proporcional ao sucesso do show)
    fan_mood: +10 (celebração, lágrimas de alegria)
    duração: 1 semana de preparação + 1 dia de evento
    bonus: headline garantida, merch especial vendável
  
  Tour Final:
    custo: ¥20M-¥200M (múltiplos venues)
    fama_boost: +500 a +1000
    fan_mood: +20
    duração: 2-8 semanas
    bonus: álbum "Best Hits" lançável, receita de bilheteria
    requisito: fama > 3000 (só faz sentido pra idols famosas)
}
```

**Regras:**
- Jogador deve anunciar graduação com 4+ semanas de antecedência
- Fãs são notificados (fan_mood cai temporariamente, depois sobe com evento)
- Se idol sai sem cerimônia (rescisão, fuga): fama -100, fan_mood -30,
  headline negativa
- Idol pode mudar de ideia se Felicidade subir acima de 70 durante o período
  de anúncio (raro mas possível)
- Ex-idol com cerimônia bem-sucedida: +20% chance de carreira pós-debut
  bem-sucedida (TV host, mentora)
- Merch de graduação (photobook final, DVD do show) gera receita por 3 meses

**Graduação Forçada (idol insatisfeita):**
- Se idol pede rescisão e jogador não negocia: idol sai sem cerimônia
- Se jogador aceita pedido e organiza cerimônia: efeito positivo reduzido
  (fan_mood neutro em vez de positivo)

## Dependencies

**Hard**: Time/Calendar, Stats, Fame, Happiness
**Soft**: Idol Database, Market/Transfer, Player-Created Events (para Show Especial/Tour)
**Depended on by**: Post-Debut Career, News Feed, Market, Merchandising Production

## Acceptance Criteria

1. Idols debutam organicamente quando condições são atendidas
2. Pool ativo mantém ~3.000 em equilíbrio (±500)
3. Ex-idols geram jobs no ecossistema (TV, rádio, mentoria)
4. Cerimônia de graduação opcional dá fama boost
5. Novas gerações surgem mensalmente conforme World Pack
6. Jogador pode escolher entre 3 tipos de cerimônia de graduação
7. Graduação sem cerimônia tem consequências negativas (fama, fan mood)
8. Merch de graduação gera receita temporária
