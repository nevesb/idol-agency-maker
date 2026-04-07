# Wireframe 08 — Idol Full Profile

> **Status**: Draft v2
> **Referência visual**: FM26 Player Profile (screenshots: Overview list/radar, Personal, Performance, Career)
> **Resolução alvo**: 1920×1080 (PC-first, sem scroll no overview)
> **Rota**: `/roster/[id]`
> **GDDs**: ui-idol-profile, idol-attribute-stats (v2, 16 atributos), happiness-wellness, contract-system, talent-development-plans, idol-lifecycle, show-system, setlist-system, music-entities, fan-club-system, fame-rankings

---

## Conceito

Tela mais visitada do jogo. Equivalente direto do Player Profile do FM26.
**Header fixo** (identidade + ações) + **4 tiles de overview** + **4 tabs de
conteúdo denso**. O jogador toma 80% das decisões sobre uma idol a partir
desta tela.

**Consolidação de tabs**: FM26 foi criticado por ter tabs demais (console-first
esconde informação atrás de cliques). Como somos PC-first, consolidamos de 7
para 4 tabs agrupando conteúdos consultados juntos para a mesma decisão:

| Tab | Agrupa | Lógica |
|---|---|---|
| **Overview** | Resumo rápido | "Escalo? Treino? Descanso?" — decisão em 10s |
| **Stats & Desenvolvimento** | Stats + Desenvolvimento + Repertório | "Como está?" + "Como melhorar?" + "O que sabe tocar?" |
| **Repertório** | Mastery de músicas + Perfil Vocal + Compatibilidade | "O que sabe cantar?" + "Quão bem encaixa?" |
| **Performance & Mídia** | Jobs + Mídia/Fãs | "O que fez?" + "Como reagiram?" = causa e efeito |
| **Contrato & Carreira** | Contrato + Histórico | "Quanto custa?" + "O que construiu?" = valor total |

---

## Layout Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar — Logo agência | Portal  Roster  Market  Operations  Agency  ⚙]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Portal > Roster > 山田 玲 (Yamada Rei)                          [◀ ▶]     │
│                                                                             │
│ ┌── HEADER (fixo, não scrolla) ──────────────────────────────────────────┐ │
│ │  ┌──────────┐                                                      TA  │ │
│ │  │          │  山田 玲 (Yamada Rei)  28        Idol Agency      ★★★★☆   │
│ │  │  [AVT    │  歌姫 (Utahime) — A Voz                                  │ │
│ │  │  160×200 │  Osaka (Kansai)  ·  Established  ·  0 escândalos          │ │
│ │  │  borda A │  💎 ¥80M    ¥4M p/m  · Contrato até 31/12/2026          │ │
│ │  │          │                                                          │ │
│ │  └──────────┘  [▼ Actions]                                             │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── OVERVIEW TILES ──────────────────────────────────────────────────────┐ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │
│ │ │ Performance  │ │ Receita      │ │ Fama         │ │ Dev. Plan    │   │ │
│ │ │ Última: A    │ │ ¥1.2M/mês   │ │ ▲+120 /sem   │ │ "Vocal→65"   │   │ │
│ │ │ Média: B+    │ │ ROI: +35%    │ │ #45 Rising   │ │ 67% completo │   │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── TABS ────────────────────────────────────────────────────────────────┐ │
│ │ [Overview]  [Stats & Desenvolvimento]  [Repertório]                   │ │
│ │ [Performance & Mídia]  [Contrato & Carreira]            [Comparison]  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── CONTENT AREA (scroll interno) ───────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (conteúdo da tab selecionada — ver seções abaixo)                     │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Header (Fixo — Sempre Visível)

> **FM26 equivalente**: Player header (foto, nome, posição, clube, contrato,
> valor, CA/PA stars, botão Actions)

O header persiste em todas as tabs. Nunca scrolla.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────┐                                                          TA │
│  │          │  山田 玲 (Yamada Rei)  28                           ★★★★☆   │
│  │  [AVT    │  歌姫 (Utahime) — A Voz                                     │
│  │  160×200 │  Osaka (Kansai)  ·  Rising  ·  0 escândalos / 47 jobs       │
│  │  borda=  │  ──────────────────────────────────────────                  │
│  │  tier A  │  [LOGO 24] Nova Star Agency    💎 ¥80M                      │
│  │  dourada │  Contrato: ¥4M p/m · até 31/12/2026 (8 meses)              │
│  │          │  🟢 Saúde  🟡 Felic  🟢 Stress  🟢 Motiv                   │
│  └──────────┘                                                              │
│                                                                             │
│  [▼ Actions]                                          [Comparison]         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Elementos do Header

| Elemento | Posição | Descrição |
|---|---|---|
| **Avatar** | Esquerda, 160×200px | Visual gerado (otome/VTuber). Borda colorida do tier (F=cinza, D=bronze, C=prata, B=azul, A=roxo, S=dourado, SS=diamante, SSS=prisma) |
| **Nome** | Direita do avatar, bold grande | Kanji + romaji. Ex: "山田 玲 (Yamada Rei)" |
| **Idade** | Inline ao nome | Número + (data nascimento no hover) |
| **Arquétipo** | Abaixo do nome | Nome diegético japonês + tradução. Ex: "歌姫 (Utahime) — A Voz" |
| **Cidade de Origem** | Texto inline | Cidade + região. Ex: "Osaka (Kansai)". Todos os idols são japoneses — o que muda é a cidade |
| **Estágio** | Badge inline | Trainee / Rookie / Rising / Established / Ace / Veteran / Legacy |
| **Histórico** | Inline | Contagem: escândalos + jobs realizados |
| **Agência** | Logo 24×24 + nome | Agência atual |
| **Valor estimado** | 💎 + valor | ¥80M (como FM26 — valor de mercado) |
| **Contrato** | Texto inline | Salário + data de expiração + tempo restante |
| **Wellness** | 4 pontos coloridos | 🟢🟡🔴 por barra (Saúde, Felicidade, Stress, Motivação). Hover = % exato + tooltip |
| **TA** | Direita, estrelas | ★★★★☆ Tier A (apenas Talento Atual — Potencial NÃO é revelado diretamente. O coach dá pistas qualitativas via Coach Report) |
| **[▼ Actions]** | Botão dropdown, roxo | Menu de ações rápidas (ver abaixo) |
| **[Comparison]** | Botão direita | Abre split view lado a lado com outra idol |

### Dropdown: Actions (com submenus)

> **FM26 equivalente direto**: Botão roxo "Actions ▼" com submenus hierárquicos
> (Squad >, Training >, Transfer >, Contract >, Report >, Misc >).
> Cada categoria agrupa ações relacionadas. Hover no item com ">" expande submenu.

```
┌─ Actions ──────────────────────┐
│ Agenda          >              │  ┌──────────────────────────────┐
│ Treino          >              │  │ Escalar em Job               │
│ Transferência   >              │  │ Dar Folga                    │
│ Contrato        >              │  │ Cancelar Job Agendado        │
│ Relatório       >              │  └──────────────────────────────┘
│ Mais            >              │
└────────────────────────────────┘
```

**Submenus por categoria:**

| Categoria | Itens |
|---|---|
| **Agenda** | Escalar em Job · Dar Folga · Cancelar Job Agendado |
| **Treino** | Plano de Desenvolvimento · Alterar Foco de Treino · Definir Intensidade (Light/Normal/Intensive) · Atribuir Mentor · Agendar Ensaio de Setlist · Agendar Ensaio de Música |
| **Transferência** | Listar para Transfer · Definir como Indisponível · Adicionar a Shortlist |
| **Contrato** | Renovar Contrato · Rescindir Contrato · Ver Propostas Ativas |
| **Relatório** | Pedir Relatório do Coach · Comparar com... · Ver Relatório de Scouting |
| **Mais** | Definir como Ace · Transferir para Grupo · Sugerir Graduation · Seguir > |

### Submenu: Seguir (Watchlist)

"Seguir" uma idol faz com que notícias sobre ela apareçam no seu News Feed.
Para organizar idols seguidas, o jogador pode criar **grupos de seguidos**
(watchlists) — facilitando filtrar notícias depois por grupo.

```
┌─ Seguir          > ─────────────────────┐
│ ☑ Seguindo                              │
│ ──────────────────────────────────────  │
│ Grupos:                                  │
│ ☑ Rivais Diretas                        │
│ ☐ Alvos de Transferência                │
│ ☐ Promessas (Scouting)                  │
│ ──────────────────────────────────────  │
│ + Criar novo grupo...                    │
└──────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **☑ Seguindo** | Toggle on/off. Quando ativo, notícias sobre essa idol aparecem no News Feed |
| **Grupos** | Checkboxes — uma idol pode pertencer a múltiplos grupos simultaneamente |
| **Grupos padrão** | O jogador cria os que quiser. Exemplos iniciais: "Rivais Diretas", "Alvos de Transferência", "Promessas" |
| **+ Criar novo grupo** | Abre input inline para nomear novo grupo |

**Integração com News Feed (wireframe 03)**:
- Tab "Seguidas" no News Feed ganha dropdown para filtrar por grupo de watchlist
- Ex: "Mostrar apenas notícias de: [Alvos de Transferência ▼]"
- Idols do próprio roster são automaticamente seguidas no grupo **"Roster"** (não removíveis manualmente — sair do roster remove do grupo)
- Idols seguidas sem grupo atribuído aparecem em "Todas as Seguidas"

**Variação por contexto** (itens mudam conforme a situação da idol):

| Contexto | Itens adicionais / removidos |
|---|---|
| **Idol do rival (scoutada)** | Apenas: Fazer Proposta · Enviar Scout (melhorar) · Seguir > · Comparar · Shortlist |
| **Idol do rival (não scoutada)** | Apenas: Enviar Scout · Seguir > |
| **Idol livre** | Fazer Proposta · Seguir > · Comparar · Shortlist |
| **Idol em burnout** | Agenda: itens desabilitados (cinza). Treino: apenas "Dar Folga" |
| **Contrato expirando (<4 sem)** | Contrato > "Renovar" fica destacado (amarelo) |

### Breadcrumb + Navegação entre Idols

```
Portal > Roster > 山田 玲 (Yamada Rei)                    [◀] [▶]
```

- `[◀ ▶]` navega para idol anterior/próxima do roster (como FM26)
- Breadcrumb clicável volta para Roster

---

## Overview Tiles (4 tiles — Abaixo do Header)

> **FM26 equivalente**: Não tem equivalente direto — FM26 pula do header
> direto para tabs. Os tiles são adição nossa para decisão rápida (Design
> Principle #1: Overview First).

| Tile | Conteúdo | Click |
|---|---|---|
| **Performance** | Nota do último job (letra + cor) + nota média dos últimos 10 | Scrolla para tab Performance & Mídia |
| **Receita** | Receita gerada no mês + ROI (receita - custo / custo) | Scrolla para tab Contrato & Carreira |
| **Fama** | Variação semanal (▲/▼ + número) + posição ranking + trend | Scrolla para tab Performance & Mídia |
| **Dev. Plan** | Meta ativa + % progresso. "Sem plano" se inativo | Scrolla para tab Stats & Desenvolvimento |

---

## Tab: Overview (Default)

> **FM26 equivalente**: Overview tab — posições, papéis, info panel, barras
> de status no rodapé. Tudo que o jogador precisa para uma decisão rápida.

Layout de 3 zonas: **Esquerda (30%)**, **Centro (40%)**, **Direita (30%)**.
Cabe em 1920×1080 sem scroll.

```
┌─ OVERVIEW TAB ──────────────────────────────────────────────────────────────┐
│                                                                             │
│ ┌─ VOCAL PROFILE ──┐  ┌─ TRAITS ──────────────────┐  ┌─ INFO ───────────┐ │
│ │                   │  │                            │  │                   │ │
│ │ Tessitura:        │  │ 🟢 Performance:            │  │ Altura: 162cm    │ │
│ │ Mezzo-Soprano     │  │   Voz Firme, Dança Suave   │  │                   │ │
│ │                   │  │                            │  │ Personalidade:    │ │
│ │ Textura:          │  │ 🟣 Personalidade:           │  │ Estrela           │ │
│ │ Clear             │  │   Determinada               │  │ Disciplinada      │ │
│ │                   │  │                            │  │                   │ │
│ │ Papel Vocal:      │  │ 🔵 Carreira:                │  │ Grupo:            │ │
│ │ Lead              │  │   Workaholic                │  │ Stellar Seven     │ │
│ │                   │  │                            │  │ (Center)          │ │
│ │ Vocal Fit: 1.0    │  │ 🟠 Nicho:                   │  │                   │ │
│ │ (setlist atual)   │  │   Ídolo de Palco            │  │ Foco Atual:       │ │
│ └───────────────────┘  │                            │  │ Vocal +2/sem      │ │
│                         └────────────────────────────┘  │                   │ │
│ ┌─ AGENDA SEMANAL ─────────────────────────────────┐   │ Background:       │ │
│ │ Seg  Ter  Qua  Qui  Sex  Sáb  Dom               │   │ "Ex-membro de     │ │
│ │ 🎤   —   📺   🎤    —   📸   ——                 │   │  coral escolar.   │ │
│ │ Show      TV  Show      Foto  FOLGA              │   │  Sonha ser a voz  │ │
│ └──────────────────────────────────────────────────┘   │  do Japão."       │ │
│                                                         │                   │ │
│ ┌─ ÚLTIMOS JOBS ───────────────────────────────────┐   │ Relação c/        │ │
│ │ Sem 44  Show Budokan     Concerto   S  ¥5M      │   │ Produtor:         │ │
│ │ Sem 43  Music Monday     TV         D  ¥600K    │   │ 🟢 Boa (72/100)  │ │
│ │ Sem 42  Gravação Single  Gravação   A  ¥2M      │   │ Memórias: 4 (+)   │ │
│ │ Sem 41  Handshake Event  Fan Meet   B  ¥800K    │   │           1 (-)   │ │
│ │ Sem 40  Fuji TV Special  TV         A  ¥1.5M    │   │                   │ │
│ └──────────────────────────────────────────────────┘   └───────────────────┘ │
│                                                                             │
│ ┌─ WELLNESS ────────────┐ ┌─ FORM ──────────┐ ┌─ DISCIPLINE ─────────────┐ │
│ │ 😊 Feliz              │ │ ████▌░           │ │ 🟢 Exemplar              │ │
│ │ Saúde      85% █████  │ │ 6.80             │ │ 0 atrasos / 0 incidentes │ │
│ │ Felicidade 78% ████░  │ │ Últimos 5 jobs   │ │ na temporada             │ │
│ │ Stress     35% ██░░░  │ │                  │ │                           │ │
│ │ Motivação  82% ████░  │ │                  │ │                           │ │
│ │ A Favor: 3  Contra: 0 │ │                  │ │                           │ │
│ └───────────────────────┘ └──────────────────┘ └───────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Zona Superior Esquerda: Vocal Profile + Vocal Profile Hybrid

> **FM26 equivalente**: Positions + Roles (o "perfil funcional" do jogador).
> Para idols, o perfil funcional é o perfil vocal.

| Elemento | Descrição |
|---|---|
| **Tessitura** | Soprano / Mezzo-Soprano / Alto / Tenor / Baritone |
| **Textura** | Clear / Breathy / Husky / Powerful / Sweet / Raw |
| **Papel Vocal** | Lead / Harmony / Rap / Spoken |
| **Vocal Fit** | Compatibilidade média com setlist atual (1.0 = perfeito, 0.65 = incompatível) |

Hover em cada campo mostra tooltip explicando o impacto no show-system.

**Vocal Profile Hybrid (badges)**: Abaixo dos campos individuais, exibir as 3 características vocais fixas como badges compactos lado a lado:

```
[ Mezzo-Soprano ]  [ Clear ]  [ Lead ]
```

- Cada badge tem cor baseada na categoria: Tessitura = roxo, Textura = azul, Papel Vocal = verde
- Badges são apenas informativos (não editáveis) — representam traços fixos da idol
- Hover em badge = tooltip com explicação do impacto mecânico no show-system
- Visíveis tanto na Overview quanto no header de contexto da tab Repertório

### Zona Superior Centro: Traits

> **FM26 equivalente**: Player Traits (Shoots With Power, Likes To Beat
> Opponent, Runs With Ball Often — listados no painel Info do FM26).

Traits organizados por categoria com cor:
- 🟢 **Performance** — afetam como a idol performa tecnicamente
- 🟣 **Personalidade** — afetam comportamento e interações
- 🔵 **Carreira** — afetam progressão e decisões de carreira
- 🟠 **Nicho** — definem identidade especializada

Cada trait é hover = tooltip com efeito mecânico. Max ~6-8 traits visíveis.
Se idol tem >8 traits, mostra os 6 mais relevantes + "... +2 mais".

### Zona Superior Direita: Info

> **FM26 equivalente**: Info panel (Height, Reputation, Personality, Left/Right
> Foot, Country/Region)

| Campo | Descrição |
|---|---|
| **Altura** | Valor em cm |
| **Personalidade** | Rótulo derivado dos 6 ocultos (ex: "Estrela Disciplinada") |
| **Grupo** | Nome do grupo + papel (Center/Main Vocal/etc.). "Solo" se sem grupo |
| **Foco Atual** | Stat sendo treinada + crescimento semanal |
| **Background** | 2-3 frases narrativas sobre a história da idol |
| **Relação c/ Produtor** | Afinidade (barra 0-100 + cor) + contagem de memórias positivas/negativas |

### Zona Centro: Agenda + Últimos Jobs

**Agenda Semanal** (7 colunas, como FM26 training schedule):
- Cada dia mostra ícone do tipo de atividade (🎤 Show, 📺 TV, 📸 Foto, 🎵 Gravação, 💪 Treino, —— Folga)
- Cor do slot segue código wellness: 🟢 verde, 🟡 amarelo, 🔴 vermelho
- Hover = detalhes do job (nome, horário, local)
- Click = abre detalhes do job

**Últimos 5 Jobs** (tabela compacta):
- Semana, nome do job, tipo (ícone), nota (letra + cor), receita
- Click na linha abre post-mortem completo

### Zona Inferior: Status Bars

> **FM26 equivalente**: Barra inferior com Fitness, Happiness, Form, Discipline,
> Season Stats — sempre visível no Overview.

3 cards horizontais no rodapé:

| Card | Conteúdo |
|---|---|
| **Wellness** | Emoji + label (😊 Feliz), 4 barras com % (Saúde, Felicidade, Stress, Motivação), A Favor/Contra (hover = lista de fatores) |
| **Form** | Barra de forma (média das últimas 5 notas), valor numérico (ex: 6.80). Como FM26 Form (barras verdes/vermelhas dos últimos 5 jogos) |
| **Discipline** | Status (Exemplar/Normal/Problemática), contagem de atrasos e incidentes na temporada |

---

## Tab: Stats & Desenvolvimento

> **FM26 equivalente**: Overview tab (atributos lista/radar) + Performance tab
> (Coach Report, Training, Performance Data) consolidados. "Como está?" e
> "Como melhorar?" são a mesma decisão.

Layout em 3 zonas: **Esquerda (35%)** atributos lista, **Centro (30%)** radar
(sempre visível), **Direita (35%)** coach report + desenvolvimento. Scroll
vertical para Repertório abaixo.

### Seção: Atributos + Radar (Sempre Visíveis Lado a Lado)

O radar **não é toggle** — fica permanentemente ao lado da lista de atributos.
Quando o jogador ativa comparação, o segundo polígono aparece no radar E os
valores da outra idol aparecem inline na lista.

#### Estado Normal (sem comparação)

```
┌─ STATS & DESENVOLVIMENTO ──────────────────────────────────────────────────┐
│                                                                             │
│ ┌─ ATRIBUTOS (lista) ──────┐ ┌─ RADAR (teia) ──────┐ ┌─ COACH REPORT ──┐ │
│ │                           │ │                      │ │                  │ │
│ │ PERFORMANCE               │ │       Vocal          │ │ Talento Atual    │ │
│ │ Vocal       ▲ 78         │ │    78 /  \ Dança     │ │ ★★★★☆  Tier A   │ │
│ │ Dança       ▲ 55         │ │      / ██ \ 55       │ │                  │ │
│ │ Atuação     ─ 67         │ │ Trab./████ \Atuação  │ │                  │ │
│ │ Variedade   ▲ 52         │ │ Eq.68/██████\67      │ │ Potencial:       │ │
│ │                           │ │    /████████ \       │ │ "Pode ser uma    │ │
│ │ PRESENÇA                  │ │ 74/ ██████████\52   │ │  estrela de      │ │
│ │ Visual      ▲ 88         │ │ Ap\██████████/Vis.  │ │  primeiro nível." │ │
│ │ Carisma     ─ 75         │ │ 65 \████████/ 88    │ │                  │ │
│ │ Comunicação ▲ 58         │ │ Cr. \██████/ Car.   │ │                  │ │
│ │ Aura        ─ 70         │ │  71  \████/ 75      │ │ ✅ Prós (5)     │ │
│ │                           │ │ L.P.  \██/ Com.     │ │ • Vocal...       │ │
│ │ RESILIÊNCIA               │ │   63  Foco  58      │ │ • Natural em...  │ │
│ │ Resistência ▲ 45         │ │   Ment. \ Aura      │ │                  │ │
│ │ Disciplina  ─ 80         │ │    60  Res. 70      │ │ ❌ Contras (3)  │ │
│ │ Mentalidade ─ 60         │ │      45             │ │ • Abaixo no...   │ │
│ │ Foco        ▲ 63         │ │     Disc. 80        │ │ • Resistência... │ │
│ │                           │ │                      │ │ • Improviso...   │ │
│ │ INTELIGÊNCIA              │ │  ● Chave             │ │                  │ │
│ │ L. de Palco ▲ 71         │ │  ● Preferível        │ │                  │ │
│ │ Criatividade─ 65         │ │                      │ │                  │ │
│ │ Aprendizado ▲ 74         │ │ TA: 66 (Tier A)     │ │                  │ │
│ │ Trab. Equipe─ 68         │ │ Cresc: +2.3/sem     │ │                  │ │
│ │                           │ │ No teto: 0/16       │ │                  │ │
│ │            [⇄ Comparar]  │ │                      │ │                  │ │
│ └───────────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│                                                                             │
│ ┌─ DESENVOLVIMENTO ────────────────────────────────┐ ┌─ TREINO ───────────┐ │
│ │                                                   │ │                     │ │
│ │ ESTÁGIO ATUAL                                     │ │ Foco de Treino:     │ │
│ │ Rising  ────▶  Established                        │ │ 🎤 Vocal            │ │
│ │                                                   │ │                     │ │
│ │ Critérios para Established:                       │ │ Intensidade:        │ │
│ │ ☑ Fama Tier B+           (atual: B)              │ │ ● Normal            │ │
│ │ ☑ TA em nível adequado    ████████░░ 78%          │ │                     │ │
│ │ ☐ 2+ anos ativa          (1a 3m)                │ │ Traits em treino:   │ │
│ │ Progresso: ██████████░░ 67%  ETA: ~9 meses       │ │ 🔄 Voz Firme       │ │
│ │                                                   │ │                     │ │
│ │ PLANO TRIMESTRAL — Q2 2026                        │ │ Mentoria:           │ │
│ │ Criado: 01/04  Expira: 30/06                      │ │ 👤 Saito Hana      │ │
│ │                                                   │ │ Vocal +15% cresc.  │ │
│ │ Meta 1 (primária): Vocal → 65                     │ │ Restam: 8 sem.     │ │
│ │ ████████░░ 78%  (atual: 62)                       │ │                     │ │
│ │                                                   │ │ [Alterar Foco]     │ │
│ │ Meta 2 (secundária): 2 aparições em TV            │ └─────────────────────┘ │
│ │ ████░░░░░░ 50%  (1 de 2)                         │                         │
│ │                                                   │ ┌─ CRESCIMENTO ──────┐ │
│ │ Meta 3 (stretch): Readiness para solo debut       │ │                     │ │
│ │ ██░░░░░░░░ 25%                                    │ │ 📈 Gráfico TA      │ │
│ │                                                   │ │ ao longo do tempo   │ │
│ │ [Editar Plano]  [Novo Plano]                      │ │ com marcos          │ │
│ │                                                   │ │                     │ │
│ │ Planos anteriores:                                │ │ TA: 42 → 66        │ │
│ │ Q1 2026  "Dança→55"     ✅ Cumprido              │ │ em 14 meses         │ │
│ │ Q4 2025  "3 shows solo"  ❌ Falhou               │ │ Vel: +1.7/sem       │ │
│ │ Q3 2025  "Tier C+"      ✅ Cumprido              │ │                     │ │
│ └───────────────────────────────────────────────────┘ └─────────────────────┘ │
│                                                                             │
│ ┌─ REPERTÓRIO ─────────────────────────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │ Filtro: [Todas ▼]  [Setlist Atual ▼]  [Ordenar: Mastery ▼]      🔍     │ │
│ │                                                                          │ │
│ │ Música               Mastery    Vocal Fit  Afinidade  Últ. Ensaio  Stat │ │
│ │ ──────────────────── ────────── ───────── ────────── ──────────── ───── │ │
│ │ Starlight            ██████████  92  1.0 ★    0.87      Sem 43    ✅    │ │
│ │ Heartbeat            ████████░░  78  0.85     0.74      Sem 42    ✅    │ │
│ │ Rising Sun           █████░░░░░  61  1.0 ★    0.81      Sem 40    ⚠     │ │
│ │ New Dawn             ████░░░░░░  43  0.65     0.52      Sem 38    ⚠     │ │
│ │ Sakura Dream         ██░░░░░░░░  22  0.85     0.68      Sem 35    🔴    │ │
│ │ Eternal Promise      █░░░░░░░░░  08  1.0 ★    0.79      —         🔴    │ │
│ │                                                                          │ │
│ │ Hover na linha: requisitos da música (vocal/dança/presença/stamina)      │ │
│ │                 vs stats da idol, mostrando gap por atributo             │ │
│ │                                                                          │ │
│ │ READINESS POR SETLIST                                                    │ │
│ │ ─────────────────────                                                    │ │
│ │ 🎤 "Summer Tour"     Média Mastery: 59   Readiness: ⚠ Parcial          │ │
│ │ 📺 "TV Special"      Média Mastery: 85   Readiness: ✅ Pronta           │ │
│ │ 🎪 "Festival Set"    Média Mastery: 44   Readiness: ⚠ Fraca            │ │
│ │                                                                          │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Estado de Comparação (após clicar [⇄ Comparar] e selecionar idol)

Ao ativar comparação, **a mesma tela se adapta** — sem navegar para outra
view. O segundo polígono aparece no radar e os valores da outra idol aparecem
inline na lista de atributos.

```
┌─ STATS & DESENVOLVIMENTO (COMPARAÇÃO ATIVA) ──────────── [✕ Fechar] ──────┐
│                                                                             │
│ ┌─ ATRIBUTOS ──────────────┐ ┌─ RADAR (teia) ──────┐ ┌─ COACH REPORT ──┐ │
│ │        Yamada  vs Tanaka  │ │                      │ │ Yamada   Tanaka  │ │
│ │                           │ │       Vocal          │ │ ★★★★☆   ★★★☆☆  │ │
│ │ PERFORMANCE               │ │    78/62             │ │ Tier A   Tier B  │ │
│ │ Vocal    ▲ 78  ██ 62     │ │      /██ \           │ │                  │ │
│ │ Dança    ▲ 55  ██ 70     │ │     /████ \          │ │                  │ │
│ │ Atuação  ─ 67  ██ 58     │ │    /██████ \         │ │                  │ │
│ │ Variedade▲ 52  ██ 75     │ │   / ████████\        │ │                  │ │
│ │                           │ │  /  ████████ \       │ │                  │ │
│ │ PRESENÇA                  │ │ /████████████ \      │ │ ██ Yamada       │ │
│ │ Visual   ▲ 88  ██ 72     │ │ \████████████ /      │ │ ░░ Tanaka       │ │
│ │ Carisma  ─ 75  ██ 82     │ │  \ ████████ /        │ │                  │ │
│ │ Comunic. ▲ 58  ██ 65     │ │   \████████/         │ │ Receita:         │ │
│ │ Aura     ─ 70  ██ 60     │ │    \██████/          │ │ ¥1.2M vs ¥2.0M  │ │
│ │                           │ │     \████/           │ │                  │ │
│ │ RESILIÊNCIA               │ │      \██/            │ │ ROI:             │ │
│ │ Resist.  ▲ 45  ██ 68     │ │                      │ │ +35% vs +55%     │ │
│ │ Discip.  ─ 80  ██ 55     │ │ ██ Yamada (verde)    │ │                  │ │
│ │ Mental.  ─ 60  ██ 70     │ │ ░░ Tanaka (azul)     │ │ Sucesso:         │ │
│ │ Foco     ▲ 63  ██ 58     │ │                      │ │ 72% vs 81%       │ │
│ │                           │ │ TA: 66 vs 58        │ │                  │ │
│ │ INTELIGÊNCIA              │ │                      │ │                  │ │
│ │ L.Palco  ▲ 71  ██ 55     │ │                      │ │                  │ │
│ │ Criativ. ─ 65  ██ 72     │ │                      │ │                  │ │
│ │ Aprend.  ▲ 74  ██ 60     │ │                      │ │                  │ │
│ │ Trab.Eq. ─ 68  ██ 78     │ │                      │ │                  │ │
│ │                           │ │                      │ │                  │ │
│ │           [⇄ Trocar Idol]│ │                      │ │                  │ │
│ └───────────────────────────┘ └──────────────────────┘ └──────────────────┘ │
```

### Detalhes da Seção Atributos

| Elemento | Descrição |
|---|---|
| **Nome** | Nome do atributo |
| **Seta de tendência** | ▲ subindo (verde), ─ estável (cinza), ▼ descendo (vermelho). Últimas 4 semanas |
| **Valor** | 1-100. Cor: verde ≥70, amarelo 40-69, vermelho <40 |
| **Hover/tooltip** | Valor exato, teto (ceiling), velocidade de crescimento |
| **Destaque de teto** | Atributo no ceiling = fundo dourado + ícone 🔒 |
| **Legenda de arquétipo** | ● Chave (verde) = principal. ● Preferível (azul) = secundário |
| **[⇄ Comparar]** | Abre seletor de idol. Ao selecionar, comparação aparece inline (ver abaixo) |

### Detalhes do Radar (Sempre Visível)

Gráfico de teia com **16 eixos** — um por atributo, agrupados visualmente
por categoria (cor do eixo = cor da categoria).

- **16 eixos** organizados por categoria (cores):
  - 🟢 Performance: Vocal, Dança, Atuação, Variedade (topo-direita)
  - 🔵 Presença: Visual, Carisma, Comunicação, Aura (direita-baixo)
  - 🟠 Resiliência: Resistência, Disciplina, Mentalidade, Foco (baixo-esquerda)
  - 🟣 Inteligência: L. de Palco, Criatividade, Aprendizado, Trab. Equipe (esquerda-topo)
- Polígono preenchido em verde semitransparente
- Valores numéricos nos vértices
- Hover em eixo = tooltip com detalhes do atributo (valor, teto, tendência)
- **Sempre visível** ao lado da lista — não é toggle

### Comportamento da Comparação Inline

| Ação | Resultado |
|---|---|
| **Click [⇄ Comparar]** | Abre dropdown/search para selecionar idol do roster, mercado, ou shortlist |
| **Idol selecionada** | Sem navegar: (1) segundo polígono azul aparece no radar, (2) valores da outra idol aparecem ao lado de cada atributo na lista, (3) coach report mostra TA lado a lado, (4) valor maior em cada atributo ganha **fundo verde claro** |
| **[⇄ Trocar Idol]** | Substitui a idol comparada por outra |
| **[✕ Fechar]** | Remove comparação, volta ao estado normal |
| **Hover no radar** | Tooltip mostra ambos valores no eixo: "Vocal: 78 vs 62" |

### Detalhes da Seção Coach Report

> **FM26 equivalente direto**: Coach Report — CA/PA stars + Pros/Cons list

| Elemento | Descrição |
|---|---|
| **TA em estrelas** | 1-5 estrelas + tier letra. Mapeamento: F-E=★, D-C=★★, B=★★★, A=★★★★, S+=★★★★★ |
| **Potencial (qualitativo)** | Frase do coach que dá pistas sem revelar o valor exato. Exemplos: "Dificilmente vai melhorar" (PT baixo), "Tem espaço para crescer" (PT médio), "Pode ser uma estrela de primeiro nível" (PT alto), "Potencial generacional" (PT SSS). Qualidade da pista depende do skill do coach |
| **Recomendação** | Frase gerada contextualmente (1-2 linhas) |
| **Prós** | Lista de pontos fortes (como FM26: "Passing ability underlines...") |
| **Contras** | Lista de pontos fracos (como FM26: "Has performed below par...") |
| Se sem coach | "Sem relatório — contrate um coach" em cinza |

### Detalhes da Seção Desenvolvimento

| Elemento | Descrição |
|---|---|
| **Estágio Atual** | Estágio → próximo com seta. Checklist de critérios (☑/☐). Barra progresso + ETA |
| **Plano Trimestral** | Até 3 metas (primária/secundária/stretch) com barra de progresso cada |
| **Histórico de Planos** | Planos anteriores com resultado (✅ cumprido / ❌ falhou) |
| **Foco de Treino** | Atributo em foco + intensidade (Light/Normal/Intensive) |
| **Traits em treino** | Trait sendo adicionado/removido |
| **Mentoria** | Mentor ativo (avatar 24 + nome + bônus + tempo restante) |
| **Gráfico de Crescimento** | TA ao longo do tempo com marcos (debut, hit, promoção de tier) |

### Detalhes da Seção Repertório

> Seção nova — não existe no FM26. Equivalente funcional seria o "Match
> Preparation" do FM26, mas aqui é permanente por idol.

| Coluna | Descrição |
|---|---|
| **Música** | Nome da música. Click abre detalhes (music-entities) |
| **Mastery** | 0-100, barra + valor. Progressão logarítmica (ref: setlist-system.md) |
| **Vocal Fit** | 1.0 (★ perfeito) / 0.85 (adjacente) / 0.65 (incompatível). Match tessitura+textura da idol vs requisito da música |
| **Afinidade** | Score composto: `vocal_fit×0.4 + genre_pref×0.3 + mood_match×0.2 + experience×0.1` |
| **Último Ensaio** | Semana do último rehearsal. "—" se nunca ensaiou |
| **Status** | ✅ Pronta (mastery >70), ⚠ OK/Fraca (30-70), 🔴 Crua/Nova (<30) |
| **Hover na linha** | Expande: requisitos da música (vocal/dança/presença/stamina) vs stats da idol com gap visual por atributo |

**Readiness por Setlist**: Resumo por setlist ativa mostrando média de mastery
do grupo e status de prontidão. Permite ao jogador decidir rapidamente se
precisa agendar mais ensaios antes de um show.

**Filtros disponíveis**:
- Por setlist (Todas / setlist específica)
- Por status (✅ Pronta / ⚠ Parcial / 🔴 Crua)
- Ordenação: Mastery (desc), Nome, Vocal Fit, Último Ensaio

---

## Tab: Repertório

> **Sem equivalente FM26 direto.** Esta tab é uma expansão do conceito de
> Match Preparation / Squad Fitness, mas focada em repertório musical. Concentra
> toda a informação sobre o que a idol sabe cantar, como a voz dela se encaixa,
> e a compatibilidade com o catálogo da agência.

Layout vertical com 3 seções: **Vocal Profile (topo)**, **Mastery Table (centro)**,
**Song Compatibility (rodapé)**.

### Seção: Vocal Profile (Perfil Vocal Fixo)

Exibe as características vocais imutáveis da idol. Estes valores são definidos na
criação/scouting e não mudam com treino.

```
┌─ VOCAL PROFILE ────────────────────────────────────────────────────────────────┐
│                                                                                │
│  [ Mezzo-Soprano ]  [ Clear ]  [ Lead ]          Vocal Profile Hybrid Badges  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Tessitura      Mezzo-Soprano     Extensão vocal natural da idol.       │   │
│  │                                  Determina quais músicas pode cantar   │   │
│  │                                  com vocal_fit alto.                    │   │
│  │                                                                         │   │
│  │ Textura        Clear             Qualidade tímbrica da voz.            │   │
│  │                                  Afeta afinidade com gêneros e moods.  │   │
│  │                                                                         │   │
│  │ Papel Vocal    Lead              Função natural em arranjos de grupo.   │   │
│  │                                  Define posição na formação de palco.   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
│  Valores possíveis:                                                            │
│  Tessitura: Soprano / Mezzo-Soprano / Alto / Tenor / Baritone                 │
│  Textura:   Clear / Breathy / Husky / Powerful / Sweet / Raw                  │
│  Papel:     Lead / Harmony / Rap / Spoken                                      │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Seção: Mastery Table (Tabela de Maestria por Música)

Tabela completa mostrando o domínio da idol sobre cada música do catálogo da agência.

```
┌─ MASTERY TABLE ────────────────────────────────────────────────────────────────┐
│                                                                                │
│ Filtro: [Todas ▼]  [Setlist Atual ▼]  [Ordenar: Mastery ▼]  🔍              │
│                                                                                │
│ Música            Mastery        Afinidade   Ensaios  Perfs  Últ. Perf       │
│ ───────────────── ────────────── ────────── ──────── ────── ────────────      │
│ Starlight         ██████████ 92  1.0  🟢     12       8      Sem 44          │
│ Heartbeat         ████████░░ 78  0.85 🟢      9       5      Sem 42          │
│ Rising Sun        █████░░░░░ 61  0.72 🟡      7       3      Sem 40          │
│ New Dawn          ████░░░░░░ 43  0.58 🟠      5       1      Sem 38          │
│ Sakura Dream      ██░░░░░░░░ 22  0.91 🟢      3       0      —               │
│ Eternal Promise   █░░░░░░░░░ 08  1.05 🟢      1       0      —               │
│ Neon Pulse        ░░░░░░░░░░ 00  0.52 🔴      0       0      —               │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Música** | Nome da música. Click abre detalhes (music-entities) |
| **Mastery** | 0-100 com barra de progresso. Progressão logarítmica (ref: setlist-system.md) |
| **Afinidade** | Score 0.5-1.2. Cor por faixa: 🟢 >=0.8 (boa), 🟡 0.65-0.79 (parcial), 🟠 0.5-0.64 (fraca), 🔴 <0.5 (incompatível). Fórmula: `vocal_fit×0.4 + genre_pref×0.3 + mood_match×0.2 + experience×0.1` |
| **Ensaios** | Contagem total de rehearsals realizados para esta música |
| **Performances** | Contagem total de vezes que performou esta música em shows/TV/eventos |
| **Última Performance** | Semana da última performance ao vivo. "—" se nunca performou |

### Seção: Song Compatibility (Compatibilidade com Catálogo)

Para cada música na biblioteca da agência, exibe a porcentagem de compatibilidade
baseada na fórmula `vocal_fit`. Permite ao jogador identificar rapidamente quais
músicas novas a idol deveria ensaiar.

```
┌─ SONG COMPATIBILITY (Catálogo da Agência) ─────────────────────────────────────┐
│                                                                                 │
│ Filtro: [Todos os gêneros ▼]  [Não ensaiadas ▼]  [Ordenar: Match % ▼]  🔍    │
│                                                                                 │
│ Música              Gênero     Match %   Vocal Fit  Tessitura Req.  Status     │
│ ──────────────────  ─────────  ────────  ─────────  ────────────── ─────────   │
│ Eternal Promise     Ballad     96%  🟢   1.05       Mezzo ★        Ensaiando  │
│ Starlight           J-Pop      92%  🟢   1.00       Mezzo ★        Dominada   │
│ Crystal Sky         Ballad     89%  🟢   0.95       Soprano ~      Não ensaiada│
│ Heartbeat           Dance-Pop  78%  🟡   0.85       Mezzo ★        Ensaiando  │
│ Thunder Road        Rock       55%  🟠   0.65       Tenor ✕        Não ensaiada│
│ Neon Pulse          EDM        42%  🔴   0.52       Alto ✕         Não ensaiada│
│                                                                                 │
│ Legenda: ★ Match perfeito de tessitura  ~ Adjacente  ✕ Incompatível           │
│                                                                                 │
│ Match % = vocal_fit×0.4 + genre_pref×0.3 + mood_match×0.2 + stamina_fit×0.1   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Música** | Nome da música do catálogo. Click abre detalhes (music-entities) |
| **Gênero** | Gênero principal da música |
| **Match %** | Porcentagem de compatibilidade geral. Cor: 🟢 >=80%, 🟡 60-79%, 🟠 40-59%, 🔴 <40% |
| **Vocal Fit** | Valor numérico da compatibilidade vocal (tessitura+textura vs requisito da música). 1.0 = perfeito, >1.0 = bônus, <0.65 = incompatível |
| **Tessitura Req.** | Tessitura requerida pela música vs a da idol. ★ = match, ~ = adjacente, ✕ = incompatível |
| **Status** | Dominada (mastery >70) / Ensaiando (mastery 1-70) / Não ensaiada (mastery 0) |

---

## Tab: Performance & Mídia

> **FM26 equivalente**: Career tab (Career Stats) + Personal tab (Media Opinion,
> Player Dynamics) consolidados. "O que fez?" e "Como reagiram?" são causa e efeito.

Layout vertical com 3 zonas: **Jobs (topo)**, **Mídia (centro-esquerda) +
Fãs (centro-direita)**, **Idol Dynamics (rodapé)**.

```
┌─ PERFORMANCE & MÍDIA ──────────────────────────────────────────────────────┐
│                                                                             │
│ ┌─ FILTROS ────────────────────────────────────────────────────────────────┐│
│ │ Tipo: [Todos ▼]  Nota: [Todas ▼]  Período: [Temporada atual ▼]  🔍    ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ ┌─ ESTATÍSTICAS AGREGADAS ────────────────────────────────────────────────┐│
│ │ Jobs: 47   Sucesso: 72% (≥B)   Receita: ¥42M   Média: B+              ││
│ │ 🎤 18  📺 12  🎵 8  🤝 5  📻 4         Melhor: S (Budokan, Sem 44)   ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ ┌─ HISTÓRICO DE JOBS ─────────────────────────────────────────────────────┐│
│ │ Sem   Job                   Tipo         Nota  Receita  Fama     [→]   ││
│ │ ───── ───────────────────── ──────────── ───── ──────── ──────── ───   ││
│ │  44   Show Budokan          🎤 Concerto   S    ¥5M      +250     [→]  ││
│ │  43   Music Monday          📺 TV         D    ¥600K    -80      [→]  ││
│ │  42   Gravação Single #3    🎵 Gravação   A    ¥2M      +120     [→]  ││
│ │  41   Handshake Event       🤝 Fan Meet   B    ¥800K    +40      [→]  ││
│ │  40   Fuji TV Special       📺 TV         A    ¥1.5M    +90      [→]  ││
│ │  39   Festival Summer Sonic 🎤 Festival   S    ¥3M      +200     [→]  ││
│ │  ...                                                                    ││
│ │ Mostrando 1-20 de 47                               [1] [2] [3] [→]    ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ ┌─ COBERTURA DE MÍDIA ──────────────────┐ ┌─ FAN CLUB ──────────────────┐ │
│ │                                         │ │                             │ │
│ │ Tier de Cobertura: Nacional            │ │ Membros: 45,200             │ │
│ │ Opinião da Mídia: Favorável            │ │ Crescimento: ▲ +1,200/sem  │ │
│ │                                         │ │                             │ │
│ │ 📺 "Yamada brilha no Budokan"          │ │ 📊 Composição:              │ │
│ │    NHK · Sem 44 · Positiva             │ │ Casual     ████░ 45%       │ │
│ │ 📰 "Nova sensação do J-pop"            │ │ Dedicado   ███░░ 35%       │ │
│ │    Oricon · Sem 42 · Positiva          │ │ Hardcore   █░░░░ 15%       │ │
│ │ 📱 "Yamada perde passo em TV"          │ │ Anti-fan   ░░░░░  5%       │ │
│ │    Twitter · Sem 43 · Negativa         │ │                             │ │
│ │ 📰 "Rising star da Nova Star"          │ │ Mood: 😊 Satisfeito       │ │
│ │    Music Mag · Sem 40 · Positiva       │ │ Loyalty: ████████░░ 78%   │ │
│ │                                         │ │ Toxicidade: ██░░░░░░ 12%  │ │
│ │ Cobertura (10): +7  =1  -2             │ │                             │ │
│ │ [Ver todas as notícias →]              │ │ Demografia:                 │ │
│ │                                         │ │ 🏠 Doméstico: 82%         │ │
│ └─────────────────────────────────────────┘ │ 🌏 Overseas: 18%           │ │
│                                             │                             │ │
│ ┌─ IDOL DYNAMICS ────────────────────────┐ │ Campanhas Ativas:          │ │
│ │                                         │ │ "Aniversário Yamada" ██ 60%│ │
│ │ Buy-In       Mindset      Hierarquia   │ │                             │ │
│ │ 🟢 Satisfeita 👑 Ambiciosa ⭐ Pilar    │ │ [Gerenciar Fan Club →]     │ │
│ │ ████████░░░░                            │ └─────────────────────────────┘ │
│ │                                         │                                 │
│ │ Recent Buy-In Changes:                 │                                 │
│ │ 🟢 Sem 44: Reagiu bem ao Budokan      │                                 │
│ │ 🔴 Sem 43: Desapontada com nota D     │                                 │
│ │ 🟢 Sem 40: Gostou do plano de treino  │                                 │
│ │ 🔴 Sem 38: Quer palcos maiores        │                                 │
│ │                                         │                                 │
│ └─────────────────────────────────────────┘                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Elementos de Jobs

| Elemento | Descrição |
|---|---|
| **Filtros** | Dropdown por tipo (Concerto, TV, Gravação, Fan Meet, Mídia, Todos), por nota (S-F), por período |
| **Estatísticas agregadas** | Jobs totais, taxa sucesso (≥B), receita total, média, breakdown por tipo, melhor nota |
| **Tabela de histórico** | Colunas: Semana, Nome, Tipo (ícone), Nota (letra+cor), Receita, Fama, [→] detalhes |
| **[→] detalhes** | Click abre post-mortem (breakdown show-system se Performance Event, fórmula job se Job) |
| **Paginação** | 20 por página |
| **Ordenação** | Click em header de coluna ordena |

### Elementos de Mídia

| Elemento | Descrição |
|---|---|
| **Tier de cobertura** | Local / Regional / Nacional / Internacional |
| **Opinião da mídia** | Favorável / Neutra / Controversa / Negativa |
| **Últimas notícias** | 4-5 headlines com fonte (ícone), semana, tom. Click abre completa |
| **Balanço** | Contagem positiva / neutra / negativa |

### Elementos de Fãs

| Elemento | Descrição |
|---|---|
| **Membros** | Total + crescimento semanal com tendência |
| **Composição** | Barras: Casual / Dedicado / Hardcore / Anti-fan (%) |
| **Mood** | Emoji + label (Satisfeito / Neutro / Irritado / Revoltado) |
| **Loyalty** | Barra 0-100% |
| **Toxicidade** | Barra 0-100% (vermelho se >30%) |
| **Demografia** | Split doméstico vs overseas |
| **Campanhas** | Campanhas de fãs ativas com progresso |

### Idol Dynamics

> **FM26 equivalente direto**: Player Dynamics (Buy-In, Mindset, Hierarchy,
> Recent Buy-In Changes — screenshot Personal tab)

| Elemento | Descrição |
|---|---|
| **Buy-In** | Comprometimento da idol com agência/produtor. Barra + label + ícone |
| **Recent Changes** | Timeline de eventos que afetaram buy-in (datas + ícone 🟢/🔴) |
| **Mindset** | Ambiciosa / Leal / Independente / Seguidora |
| **Hierarquia** | Líder / Pilar / Membro / Novata / Isolada |

---

## Tab: Contrato & Carreira

> **FM26 equivalente**: Personal tab (Contract, Transfer Status) + Career tab
> (Country/Region, Career Stats, Milestones, Favoured Clubs/Personnel)
> consolidados. "Quanto custa?" e "O que construiu?" = valor total da idol.

Layout de 2 colunas: **Esquerda (50%)** contrato, **Direita (50%)** carreira.

```
┌─ CONTRATO & CARREIRA ──────────────────────────────────────────────────────┐
│                                                                             │
│ ┌─ CONTRATO ATUAL ───────────────────────┐ ┌─ ORIGEM ────────────────────┐│
│ │                                         │ │                              ││
│ │ Salário           ¥4M / mês            │ │ Cidade: Osaka (Kansai)       ││
│ │                                         │ │ Origem: Coral escolar →      ││
│ │ Duração           7 Abr 24 → 31 Dez 26 │ │         Audição aberta       ││
│ │                   Expira em ⏰ 8 meses  │ │ Idiomas: Japonês (nativo),   ││
│ │                                         │ │          Inglês (básico)     ││
│ │ % de Receita      30% para idol        │ │                              ││
│ │ Exclusividade     ✅ Sim               │ └──────────────────────────────┘│
│ │ Carga Máxima      5 jobs / semana      │                                 │
│ │ Direito de Imagem Parcial              │ ┌─ CAREER STATS ──────────────┐│
│ │ Rescisão          ¥50M                 │ │                              ││
│ │ Restrição Namoro  ❌ Não               │ │ Agências  Jobs  Receita Tot. ││
│ │ Descanso Obrig.   1 dia / semana       │ │ ❤ 2       47    ¥42M        ││
│ │                                         │ │                              ││
│ │ [Renovar Contrato]  [Rescindir]        │ │ Temp  Agência       Jobs  Nt ││
│ └─────────────────────────────────────────┘ │ 25-26 [L] Nova Star  22  B+ ││
│                                             │ 24-25 [L] Nova Star  20  B  ││
│ ┌─ BÔNUS & CLÁUSULAS ────────────────────┐ │ 23-24 [L] Debut Ent   5  C+ ││
│ │                                         │ │                              ││
│ │ Bônus de Lealdade    ¥7.25M restante   │ │ Grupos:                      ││
│ │ Fee de Aparição      ¥900 / evento     │ │ Stellar Seven (24-presente)  ││
│ │ + 3 Mais...                            │ │  Papel: Center · 42 shows    ││
│ │                                         │ │                              ││
│ │ Cláusulas:                             │ └──────────────────────────────┘│
│ │ Promoção de Tier → Salário +25%        │                                 │
│ │ + 1 Mais...                            │ ┌─ VALOR DE MERCADO ──────────┐│
│ └─────────────────────────────────────────┘ │                              ││
│                                             │ 💎 ¥80M  Tendência: ▲       ││
│ ┌─ TRANSFER STATUS ──────────────────────┐ │ Pico: ¥95M   Mín: ¥30M     ││
│ │                                         │ │                              ││
│ │ Status: Não listada                    │ └──────────────────────────────┘│
│ │ Empréstimo: Não disponível             │                                 │
│ │ Agências Interessadas: (0)             │                                 │
│ │ Propostas: (0)                         │                                 │
│ │                                         │                                 │
│ │ [Listar para Transfer]                 │                                 │
│ └─────────────────────────────────────────┘                                 │
│                                                                             │
│ ┌─ HISTÓRICO DE CONTRATOS ──────────────┐ ┌─ MILESTONES & PREMIAÇÕES ───┐ │
│ │                                        │ │                              │ │
│ │ Contrato 2 (atual) Abr24→Dez26 ¥4M/m │ │ 🏆 Rookie of the Year 2024  │ │
│ │ Contrato 1         Jan23→Mar24 ¥1.5M  │ │    Japan Idol Awards         │ │
│ │                                        │ │ 🏆 Best Vocal Perf. 2025    │ │
│ └────────────────────────────────────────┘ │    Music Station Awards      │ │
│                                            │                              │ │
│ ┌─ TIMELINE ─────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │ ──●───────●──────●────────●───────●────────●──────●──────●───────▶     │ │
│ │   │       │      │        │       │        │      │      │             │ │
│ │  Jan23   Mar23  Jul23    Jan24   Abr24    Set24  Jan25  Out25          │ │
│ │  Contrat. Debut 1ºShow   Tier C  Nova     Tier B  Hit   Festival      │ │
│ │                  Solo           Star Ag.         #1    Budokan         │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─ AFINIDADES ─────────────────────────────────────────────────────────────┐│
│ │                                                                          ││
│ │ Ídolos Favoritos: (2)                  Agências Favoritas: (1)          ││
│ │ 👤 [AVT] Sato Miki  · Ex-colega       [L] Debut Entertainment          ││
│ │ 👤 [AVT] Kim Soyeon · Ídolo infância      Primeira agência             ││
│ │                                                                          ││
│ └──────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Elementos de Contrato

| Elemento | Descrição |
|---|---|
| **9 cláusulas** | Listadas com valores atuais. Cláusulas problemáticas (afetando felicidade) em amarelo |
| **Timer de expiração** | ⏰ com semanas/meses restantes. Vermelho se <4 semanas |
| **[Renovar]** | Abre interface de negociação (wireframe futuro: contract-negotiation) |
| **[Rescindir]** | Confirmação com aviso de multa + impacto na felicidade |
| **Bônus/Cláusulas** | Bônus contratuais e cláusulas especiais. "+N Mais" se lista longa |
| **Transfer Status** | Listada/não listada, empréstimo, interessados, propostas |
| **Histórico** | Timeline de contratos anteriores com termos resumidos |

### Elementos de Carreira

| Elemento | Descrição |
|---|---|
| **Origem** | Cidade + região de origem, como entrou na indústria, idiomas |
| **Career Stats** | Total agências + jobs + receita. Tabela por temporada (agência logo 16px, jobs, nota média) |
| **Grupos** | Histórico de grupos com papel e duração |
| **Valor de mercado** | 💎 com tendência, pico e mínimo históricos |
| **Milestones** | Prêmios, marcos por categoria (shows, singles, festivais) |
| **Timeline** | Linha horizontal com pontos em datas significativas. Hover = tooltip. Cores: 🟢 positivo, 🔴 negativo, 🔵 neutro |
| **Afinidades** | Ídolos favoritos (avatar 24 + nome + motivo), agências favoritas (logo 20 + nome + motivo) |

---

## Variações do Perfil

### Idol do Seu Roster (Normal)
- Todos dados visíveis em todas as tabs
- Todas ações disponíveis
- Wellness completo
- Stats com valores exatos

### Idol Rival (Scoutada)

> **FM26 equivalente**: Jogador de outro time com scout completo

- **Header**: Avatar normal, nome, arquétipo. TA em estrelas (se scoutada
  com qualidade suficiente). Valor estimado visível. Sem wellness
- **Stats & Desenvolvimento**: Atributos com **margem de erro** (±5-15).
  Valores em *itálico*. Sem plano/treino/mentoria. Repertório não visível
- **Performance & Mídia**: Apenas jobs públicos (shows, TV). Mídia e fan
  club com dados públicos. Idol Dynamics não visível
- **Contrato & Carreira**: Agência + tempo restante visíveis. Cláusulas não.
  Career stats e timeline completos (informação pública)
- **Ações**: [Fazer Proposta] [Enviar Scout] [Seguir] [Adicionar a Shortlist]

### Idol Rival (Não Scoutada)

> **FM26 equivalente**: Jogador sem scout — dados mínimos

- **Avatar**: Blur leve / silhueta com "?"
- **Header**: Nome e dados públicos apenas (idade, cidade, fama pública)
- **Stats**: "???" em todos atributos. Arquétipo estimado (se famosa)
- **Tabs**: Apenas carreira parcial (dados públicos) + mídia (cobertura pública)
- **Ações**: [Enviar Scout] [Seguir]

### Idol no Mercado (Livre)
- Como Scoutada/Não Scoutada + badge "🟢 Livre"
- **Ações**: [Fazer Proposta] [Seguir] [Adicionar a Shortlist]
- **Contrato**: "Livre" + último salário (se conhecido) + valor estimado

---

## Right-Click (Context Menu — em qualquer tela)

> **FM26 equivalente**: Right-click em qualquer jogador abre context menu

```
┌─ Context Menu ────────────────┐
│ Ver perfil                    │
│ Escalar em job                │
│ Comparar com...               │
│ Adicionar a shortlist         │
│ ──────────────────────────── │
│ Plano de desenvolvimento      │
│ Ver contrato                  │
│ Dar folga                     │
│ ──────────────────────────── │
│ Seguir (News Feed)            │
└───────────────────────────────┘
```

---

## Navegação e Comportamento

| Ação | Resultado |
|---|---|
| **Click em idol** (qualquer tela) | Abre modal 07 (quick view) |
| **Double-click em idol** | Vai direto para este perfil completo |
| **[◀ ▶]** no breadcrumb | Navega entre idols do roster sem voltar à lista |
| **Tabs ← →** | Teclado navega entre tabs |
| **Esc** | Volta para tela anterior (roster ou tela de origem) |
| **Click em tile de overview** | Scrolla para tab relevante |
| **Click em notícia/job** | Abre detalhe inline ou navega para tela dedicada |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Modal 07 → Perfil Completo | Navega | Modal expande → transição suave para tela full |
| Roster → Perfil | Navega | Slide left (250ms) |
| Tab → Tab | Interna | Fade content (150ms), tab indicator slides |
| Perfil → Roster | Voltar | Slide right (250ms) |

---

## Assets Necessários

| Asset | Formato | Tamanho | Uso |
|---|---|---|---|
| Avatar da idol | WebP | 160×200 | Header |
| Logo da agência | SVG | 24×24 | Header, career stats |
| Avatares inline | WebP | 24×24 | Afinidades, mentoria |
| Ícone de tier | SVG | 16 | Badge de tier |
| Stars TA | SVG | 14 | ★★★★☆ rating |
| Emojis de wellness | SVG | 24 | 😊😐😟😡 |
| Ícones de job tipo | SVG | 16 | 🎤📺📸🎵🤝📻 |
| Ícones de trait | SVG | 14 | Badges de traits |
| Gráfico sparkline | Canvas | 80×24 | Valor de mercado, evolução TA |

---

## Acceptance Criteria

1. Header fixo com avatar (160×200, borda de tier), nome kanji+romaji, arquétipo, idade, cidade de origem, agência (logo 24), valor, contrato, wellness (4 pontos), TA em estrelas (sem PT — potencial revelado qualitativamente pelo coach) — não scrolla
2. 4 tiles de overview scaneáveis em 3 segundos (Performance, Receita, Fama, Dev Plan)
3. **5 tabs** navegáveis por teclado (← →): Overview, Stats & Desenvolvimento, Repertório, Performance & Mídia, Contrato & Carreira
4. Tab Stats & Desenvolvimento mostra **16 atributos em 4 categorias** com valores, barras, setas de tendência, e legenda Chave/Preferível
5. Radar de teia (16 eixos, um por atributo, cor por categoria) **sempre visível** ao lado da lista de atributos — sem toggle
6. Comparação **inline**: ao selecionar idol, segundo polígono aparece no radar + valores lado a lado na lista + highlight do maior em verde. Sem navegar para outra tela
7. Tab Stats & Desenvolvimento inclui coach report (TA + potencial qualitativo + Pros/Cons), estágio atual com checklist, plano trimestral com metas, treino (foco + mastery), mentoria, e gráfico de crescimento
8. Tab Stats & Desenvolvimento inclui **Repertório**: tabela de músicas com mastery, vocal fit, afinidade, último ensaio, status de prontidão, e readiness por setlist
9. Tab Performance & Mídia mostra tabela densa filtrável de jobs + stats agregadas, cobertura de mídia, fan club (composição, mood, loyalty, toxicidade, demografia), e Idol Dynamics (buy-in, mindset, hierarquia)
10. Tab Contrato & Carreira mostra 9 cláusulas, bônus, transfer status, valor de mercado, histórico de contratos, career stats por temporada, timeline visual, milestones, premiações, e afinidades
11. Variação para idol rival scoutada (valores ±, itálico, sem wellness/plano/repertório)
12. Variação para idol rival não scoutada (avatar blur, ???, dados públicos apenas)
13. Right-click em qualquer idol em qualquer tela abre context menu padronizado
14. [◀ ▶] no header navega entre idols do roster sem voltar à lista
15. Hover em linha do Repertório expande gap entre requisitos da música e stats da idol
16. Tab Repertório inclui **Vocal Profile** (3 características fixas como badges: Tessitura, Textura, Papel Vocal), **Mastery Table** (música, mastery 0-100 com barra, afinidade 0.5-1.2 com cor, ensaios, performances, última performance), e **Song Compatibility** (match % com cada música do catálogo baseado em vocal_fit)
17. Overview exibe **Vocal Profile Hybrid** como 3 badges coloridos (Tessitura, Textura, Papel Vocal) na zona superior esquerda
