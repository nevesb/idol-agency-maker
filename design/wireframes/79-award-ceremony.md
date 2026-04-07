# Wireframe 79 — Award Ceremony (Cerimonia de Premiacao)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Awards Night / End of Season Awards  
> **Resolução alvo**: 1920×1080 (PC-first) ou Modal  
> **Rota**: Modal triggered by calendar event  
> **GDDs**: award-shows

---

## Conceito

No Football Manager, ao final da temporada, uma tela mostra os prêmios: Bola de Ouro, Melhor Jogador da Liga, Melhor Jovem. Seus jogadores aparecem como indicados e, se vencerem, a moral sobe, o valor de mercado dispara e a mídia cobre extensivamente.
No **Star Idol Agency**, a **Cerimônia de Premiação** é o evento anual que define o prestígio do seu roster. Japan Record Awards, Kōhaku Uta Gassen, Japan Gold Disc Awards — cada cerimônia tem categorias, indicados e vencedores. Se a sua idol ganha "Melhor Artista Revelação", a fama explode, o board fica satisfeito e endorsements surgem. Se ela era favorita e perdeu, a moral cai. E antes de tudo: você decide se comparece (custo + estresse, mas bônus de fama) ou pula (sem custo, sem bônus).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                  |
|-------------------------------------------------------------------------------------------------|
|                          CERIMÔNIA DE PREMIAÇÃO                                      [X Fechar] |
+-------------------------------------------------------------------------------------------------+
| [ HEADER ]                                                                                      |
|                                                                                                  |
|  ★★★★★  JAPAN RECORD AWARDS 2027  ★★★★★                                                      |
|  Data: 30 de Dezembro, 2027  |  Local: NHK Hall, Tokyo  |  Prestígio: ★★★★★ (Máximo)         |
|                                                                                                  |
+-------------------------------------------------------------------------------------------------+
| [ DECISÃO DE PARTICIPAÇÃO ]                                                                     |
|                                                                                                  |
|  Sua agência foi convidada. Deseja participar?                                                  |
|                                                                                                  |
|  [ Participar da Cerimônia ]                    [ Não Comparecer ]                              |
|  Custo: ¥5.000.000 (transporte + vestuário)     Sem custo                                       |
|  Estresse: +15 para idols presentes              Sem estresse adicional                          |
|  Bônus: +8 Fama para todos os indicados          Sem bônus de fama por presença                 |
|  Oportunidade: Red Carpet Photo Moment           Endorsements não são ativados                   |
|                                                                                                  |
+-------------------------------------------------------------------------------------------------+
| [ SUAS INDICAÇÕES — DESTAQUE ]                                                                  |
|                                                                                                  |
|  ┌─────────────────────────────────────────────────────────────────────────────────────────┐    |
|  │  🏆 Melhor Artista Revelação        →  SAKURA (Celestial Nine)                         │    |
|  │     Chance estimada (Intelligence): ████████████░░░░ 72%                                │    |
|  │                                                                                         │    |
|  │  🏆 Melhor Single do Ano            →  "Neon Pulse" (Celestial Nine)                   │    |
|  │     Chance estimada (Intelligence): ██████░░░░░░░░░░ 38%                                │    |
|  │                                                                                         │    |
|  │  🏆 Melhor Performance de Grupo     →  Celestial Nine                                  │    |
|  │     Chance estimada (Intelligence): ██████████░░░░░░ 55%                                │    |
|  └─────────────────────────────────────────────────────────────────────────────────────────┘    |
|                                                                                                  |
+-------------------------------------------------------------------------------------------------+
| [ CATEGORIAS E RESULTADOS ]                                                                     |
|                                                                                                  |
| ┌───────────────────────────────────────────────────────────────────────────────────────────┐   |
| │  MELHOR ARTISTA REVELAÇÃO                                                                 │   |
| │  ─────────────────────────────────────────────────────────────────────────────────────── │   |
| │  [Avatar] SAKURA (Celestial Nine / Star Idol Agency)        ◄◄◄ VENCEDORA 🥇          │   |
| │  [Avatar] Hina Takahashi (PRISM / Starlight Ent.)                                       │   |
| │  [Avatar] Ren Aoyama (Solo / Zenith Music)                                              │   |
| │  [Avatar] Mei Kuroda (NOVA★RISE / Dream Factory)                                        │   |
| │  [Avatar] Yuto Nakamura (Solo / Crown Agency)                                           │   |
| └───────────────────────────────────────────────────────────────────────────────────────────┘   |
|                                                                                                  |
| ┌───────────────────────────────────────────────────────────────────────────────────────────┐   |
| │  MELHOR SINGLE DO ANO                                                                     │   |
| │  ─────────────────────────────────────────────────────────────────────────────────────── │   |
| │  [Avatar] "Eternal Flame" — PRISM (Starlight Ent.)          ◄◄◄ VENCEDOR 🥇           │   |
| │  [Avatar] "Neon Pulse" — Celestial Nine (Star Idol Agency)                              │   |
| │  [Avatar] "Midnight Run" — BLAZE (Horizon Prod.)                                        │   |
| │  [Avatar] "Cherry Blossom Road" — Ami Suzuki (Solo)                                     │   |
| │  [Avatar] "Thunder Heart" — NOVA★RISE (Dream Factory)                                   │   |
| └───────────────────────────────────────────────────────────────────────────────────────────┘   |
|                                                                                                  |
| ┌───────────────────────────────────────────────────────────────────────────────────────────┐   |
| │  MELHOR PERFORMANCE DE GRUPO                                                              │   |
| │  ─────────────────────────────────────────────────────────────────────────────────────── │   |
| │  [Avatar] Celestial Nine (Star Idol Agency)                 ◄◄◄ VENCEDOR 🥇           │   |
| │  [Avatar] PRISM (Starlight Ent.)                                                         │   |
| │  [Avatar] NOVA★RISE (Dream Factory)                                                      │   |
| │  [Avatar] BLAZE (Horizon Prod.)                                                          │   |
| │  [Avatar] Stellar (Zenith Music)                                                         │   |
| └───────────────────────────────────────────────────────────────────────────────────────────┘   |
|                                                                                                  |
+-------------------------------------------------------------------------------------------------+
| [ IMPACTO DOS RESULTADOS ]                                                                      |
|                                                                                                  |
|  Fama Ganha:                Sakura +18 | Celestial Nine +12                                     |
|  Confiança do Board:        +5 (2 prêmios conquistados de 3 indicações)                         |
|  Endorsements Ativados:     Sakura recebeu proposta da Shiseido (cosméticos)                    |
|  Manchetes da Mídia:        "Sakura brilha no Japan Record Awards — agência em ascensão"        |
|  Moral do Roster:           Celestial Nine +10 | Resto da agência +3 (orgulho coletivo)         |
|                                                                                                  |
+-------------------------------------------------------------------------------------------------+
|                                        [ Continuar ]                                             |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Awards Night Result Screen
No FM, ao final da temporada, uma tela dedicada revela os vencedores de cada categoria com animação de destaque. O vencedor tem borda dourada e ícone de troféu. A Cerimônia de Premiação replica essa apresentação: categorias listadas verticalmente, indicados com avatares e agências, e o vencedor destacado com marcação visual.

### 2. Pre-Match Decision (Attend vs Skip)
No FM, antes de um jogo, você pode escolher entre dar coletiva de imprensa ou não, gerenciar a moral do time ou delegar. Aqui, a decisão de "Participar" vs "Não Comparecer" tem trade-offs claros: custo financeiro e estresse em troca de bônus de fama e oportunidades de endorsement. É uma micro-decisão estratégica como escalar o time titular ou poupar para o próximo jogo.

### 3. Intelligence-Based Probability (Scouting Confidence)
No FM, o olheiro dá uma avaliação de confiança ("potencial 4 estrelas, certeza 60%"). Aqui, o Intelligence Report da agência estima a chance de vitória em cada categoria com barra de probabilidade, usando dados de vendas, charts e popularidade comparada dos concorrentes.

### 4. Post-Match Impact Summary
No FM, após o jogo, você vê o resumo: mudança na tabela, moral do time, notícias da mídia. O painel "Impacto dos Resultados" mostra exatamente isso: fama ganha/perdida, confiança do board, endorsements ativados e manchetes geradas.

---

## Acceptance Criteria

1. Header exibindo nome da premiação, data, local e nível de prestígio (1-5 estrelas).
2. Decisão binária de participação (Participar / Não Comparecer) com trade-offs claros de custo, estresse, bônus de fama e oportunidades listados lado a lado.
3. Seção destacada de "Suas Indicações" mostrando categorias onde idols/grupos da agência do jogador estão indicados, com barra de probabilidade estimada pelo sistema de Intelligence.
4. Lista de categorias com 5 indicados cada, exibindo avatar, nome, agência e destaque visual (borda dourada) para o vencedor.
5. Painel de impacto pós-cerimônia exibindo: fama ganha/perdida, mudança na confiança do board, endorsements ativados, manchetes de mídia geradas e efeito na moral do roster.
6. Botão [Continuar] para avançar o calendário após revisão dos resultados.
