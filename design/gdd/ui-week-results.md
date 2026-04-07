# Week Results UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 2 — Suas Decisoes, Suas Consequencias, Pilar 4 — O Drama Nasce das Mecanicas
> **Parent**: ui-information-architecture.md
> **Dominio**: Operacoes (tecla 4) > Resultados

## Overview

Tela exibida apos cada semana simulada. Integra o **Moment Engine** pra
transformar resultados numericos em experiencia dramatica. Segue a filosofia:
**headlines primeiro, dados on demand**. O jogador SENTE os resultados
antes de analisar os numeros.

**PC-First.** Layout de 2 colunas com densidade controlada.

## Layout — PC (1920×1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌── AGENCY MOOD ─────────────────────────────────────────────────────────┐ │
│ │ ☀ OTIMISTA — "Semana forte. A equipe esta animada com o show da       │ │
│ │ Tanaka e o lancamento do Aurora. Suzuki abalada mas staff de olho."   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── COLUNA ESQUERDA (65%) ──────────┐  ┌── COLUNA DIREITA (35%) ────────┐ │
│ │                                    │  │                                │ │
│ │  HEADLINES (max 5)                 │  │  FINANCAS DA SEMANA            │ │
│ │  ─────────────────────────         │  │  Receita:  ¥8.2M  ▲+12%      │ │
│ │                                    │  │  Despesas: ¥5.1M              │ │
│ │  ★ "Tanaka Yui recebeu ovacao     │  │  Lucro:    ¥3.1M  🟢         │ │
│ │     de pe no Budokan"              │  │  Meta mes: 67% ██████░░░     │ │
│ │     Show solo — Nota S (0.94)      │  │                                │ │
│ │     Fama +250. Fas: euforia.       │  │  RANKING                       │ │
│ │     [▼ Expandir detalhes]          │  │  Suzuki: #52→#48 ▲4           │ │
│ │                                    │  │  Tanaka: #45→#46 ▼1           │ │
│ │  ⚡ "Suzuki Mei saiu chorando do   │  │  Agencia: #15→#14 ▲1          │ │
│ │     programa ao vivo"              │  │                                │ │
│ │     TV — Nota D (0.42). Stress.    │  │  STATUS DAS IDOLS              │ │
│ │     Fama -80. Midia: preocupacao.  │  │  Suzuki: Stress 42→58 🟡     │ │
│ │     [▼ Expandir detalhes]          │  │  Tanaka: Motiv 70→82 🟢      │ │
│ │                                    │  │  Yamada: Sem mudanca          │ │
│ │  📰 "Crown comprou ace da          │  │                                │ │
│ │     Heartbeat por ¥45M"            │  │  PROXIMA SEMANA                │ │
│ │     [▼ Expandir]                   │  │  ⚠ Prazo Anime Expo (2 sem)  │ │
│ │                                    │  │  ⚠ Contrato Yamada (3 sem)   │ │
│ │  💬 "Fas do Aurora iniciam         │  │  📅 3 jobs agendados          │ │
│ │     #AuroraForever"                │  │  📅 1 casting pendente        │ │
│ │     [▼ Expandir]                   │  │                                │ │
│ │                                    │  │                                │ │
│ └────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                             │
│ ┌── CONTROLES ───────────────────────────────────────────────────────────┐ │
│ │  [← Semana anterior]  [Continuar →]  [Ver todos resultados (tabela)]  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Headline Expandida (Momento Dramatizado)

Ao clicar "Expandir detalhes" numa headline, ela abre inline:

```
┌──────────────────────────────────────────────────────────────────┐
│ ★ "Tanaka Yui recebeu ovacao de pe no Budokan"                  │
│                                                                  │
│ 🎤 LIVE SHOW — Budokan, Tokyo                                   │
│ Tanaka Yui — Solo Concert                                        │
│ Audiencia: 12,000 (LOTADO) | Nota: S (0.94)                     │
│                                                                  │
│ FATORES POSITIVOS:                                               │
│ ✓ Vocal 78 — delivery excepcional                               │
│ ✓ Aura 70 — levantou a arena no encore                          │
│ ✓ Carisma 75 — MC emocional conectou com publico (+16% bonus)   │
│                                                                  │
│ FATORES NEGATIVOS:                                               │
│ ✗ Resistencia 45 — cansou no final do set                       │
│ ✗ Primeira arena grande — adaptabilidade testada (passou: 65>50) │
│                                                                  │
│ REACOES:                                                         │
│ 📺 Midia: "Revelacao do ano. Budokan inteiro de pe." (TV Nat.)  │
│ 💬 Fas: Mood +25, Loyalty +5. "#TanakaLegend" trending.         │
│ 🏢 Interno: Motivacao +15. Coach: "Melhor show que ja vi dela." │
│ 👀 Rivais: Crown Entertainment reavaliando proposta de buyout.   │
│                                                                  │
│ IMPACTO:                                                         │
│ Fama: +250 | Receita: ¥5M | Stress: +12 | Vocal XP: +3         │
│                                                                  │
│ 💡 Coach sugere: "Dar folga na proxima semana. Corpo precisa."   │
│                                                                  │
│ [▲ Recolher] [Ver perfil da Tanaka] [Ver agenda da Tanaka]       │
└──────────────────────────────────────────────────────────────────┘
```

## Content Budget — Regras Anti-Verbosidade

A forca dos Week Results vem da EDICAO, nao do volume.
Se cada headline expandida tiver informacao demais, o jogador:
- cansa
- pula tudo
- perde o valor dramatico

### Headlines Collapsed (Modo Default)
```
REGRA: 1 linha forte + 1 linha factual. NADA MAIS.

Bom:  ★ "Tanaka Yui recebeu ovacao de pe no Budokan"
      Show solo — Nota S. Fama +250.

Ruim: ★ "Tanaka Yui recebeu ovacao de pe no Budokan durante
      seu primeiro show solo na maior arena de Tokyo, com audiencia
      de 12,000 pessoas..."
```

### Headlines Expanded (Clique do Jogador)
```
BUDGET MAXIMO por headline expandida:
- Fatores positivos: MAX 3
- Fatores negativos: MAX 3
- Reacao de midia: 1 frase
- Reacao de fas: 1 frase + numeros
- Impacto interno: 1 frase
- Sugestao do staff: 1 frase (so se staff contratado)
- TOTAL: max 10-12 linhas

Se um job teve 6 fatores positivos, selecionar os 3 mais relevantes.
A edicao e o que faz a tela funcionar.
```

### Relatorio Mensal
```
4 tiles + lista de metas (cumpridas/falhadas).
Nada mais no resumo. "Ver completo" abre Financial Reporting.
```

---

## Coluna Direita — Dados Compactos

### Financas da Semana
1 tile com numeros essenciais. Clique abre Financial Reporting completo.

### Ranking
Mudancas de ranking das idols e da agencia. So mostra quem mudou (nao todas).

### Status das Idols
So mudancas significativas de wellness (>10 pontos ou mudanca de cor).
Hover mostra valores exatos.

### Proxima Semana
2-4 itens que exigem atencao. Cada item clicavel — navega direto pra acao.

## Relatorio Mensal (Extra)

A cada 4 semanas, secao adicional aparece acima do layout normal:

```
┌──────────────────────────────────────────────────────────────────┐
│ 📊 RELATORIO MENSAL — Novembro, Ano 3                           │
│                                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ Receita  │ │ Lucro    │ │ ROI Top3 │ │ Metas    │            │
│ │ ¥32M     │ │ ¥12M     │ │ Suzuki   │ │ 2/3      │            │
│ │ ▲+8% mês│ │ ▲ otimo  │ │ +55%     │ │ cumpridas│            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│                                                                  │
│ Metas do Dono:                                                   │
│ ✅ Faturar ¥30M+ (¥32M)                                         │
│ ⚠ Idol no Top 20 (melhor: #28)                                  │
│ ✅ Wellness medio >60% (68%)                                     │
│ Bonus: ¥2M extra budget                                          │
│                                                                  │
│ [Ver relatorio financeiro completo]                              │
└──────────────────────────────────────────────────────────────────┘
```

## "Ver Todos Resultados" (Tabela Densa)

Botao no rodape abre visao de tabela completa (Camada 3):

| Idol | Job | Tipo | Nota | Perf. | Receita | Fama | Stress Δ | Motiv Δ |
|---|---|---|---|---|---|---|---|---|
| Tanaka | Budokan | Show | S | 0.94 | ¥5M | +250 | +12 | +15 |
| Suzuki | Music Mon. | TV | D | 0.42 | ¥600K | -80 | +20 | -15 |
| Aurora | Single | Gravacao | A | 0.82 | ¥2M | +120 | +5 | +8 |

- Tabela completa, filtravel, ordenavel
- Colunas configuraveis
- Clique na linha abre post-mortem

## Animacao de Revelacao (Opcional)

Em modo Live, resultados aparecem 1 a 1 com revelacao:
- Nota S: animacao positiva (destaque dourado)
- Nota F: animacao negativa (shake vermelho)
- Toggle nas settings: "Animacoes de resultado" ON/OFF
- Em modo Skip ou se OFF: tudo aparece de uma vez

## Acceptance Criteria

1. Agency mood aparece no topo em 1 frase
2. Max 5 headlines selecionadas por dramaticidade
3. Headlines expansiveis inline com post-mortem completo
4. Post-mortem mostra fatores positivos/negativos + reacoes
5. Coluna direita mostra financas, ranking, wellness, proxima semana
6. Relatorio mensal aparece a cada 4 semanas como secao extra
7. "Ver todos resultados" abre tabela densa filtravel
8. Animacoes opcionais (toggle OFF disponivel)
9. Links contextuais funcionam (perfil, agenda, comparar)
10. Coach/staff sugerem acoes nos post-mortems (se contratados)

## Open Questions

- Nenhuma pendente
