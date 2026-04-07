# Wireframe 04 — Portal (Command Center / Dashboard)

> **Status**: Draft v2
> **Referência**: FM26 Portal (screenshots anexos — 3 colunas)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/portal` (src/routes/(game)/portal/+page.svelte)
> **Domínio**: Portal (tecla 1) > Visão Geral
> **GDD**: ui-dashboard.md

---

## Conceito

O Portal é o **hub central** — onde o jogador começa e volta após qualquer ação.
Responde em 5 segundos: "o que precisa da minha atenção?", "como está a agência?",
"o que vem a seguir?". Cabe tudo **sem scroll** em 1920×1080.

**Estrutura de 3 colunas** (como FM26):
- **Esquerda (25%)**: Mensagens (inbox preview)
- **Centro (45%)**: Notícias destaque (carrossel) + Calendário
- **Direita (30%)**: Agenda + Rankings (3 abas)

**Diferença do FM26**: visuais obrigatórios (Design Principle #6). Toda idol
mencionada tem avatar, toda agência tem logo. Nunca texto puro.

**Importante**: Notícias ≠ Mensagens. Notícias são artigos do mundo (news-feed.md).
Mensagens são comunicações diretas ao produtor (propostas, relatórios, lembretes).

---

## Submenu do Portal

Abaixo da nav bar, submenu horizontal com as sub-seções do domínio Portal:

```
  Visão Geral   Mensagens   Calendário   Site de Notícias   Relatórios
  ───────────
```

- **Visão Geral**: esta tela (dashboard)
- **Mensagens**: inbox completo (wireframe 05)
- **Calendário**: calendário expandido
- **Site de Notícias**: news feed completo (wireframe 03)
- **Relatórios**: intelligence reports

---

## Layout Completo (1920×1080)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [★ LOGO 32] Portal▾ | Roster | Mercado | Operações | Agência | Produtor         │
│                  [Sem 45 / Ano 3 / Nov]            [🔍 Ctrl+K] [📑 BM]          │
│   Visão Geral   Mensagens   Calendário   Site de Notícias   Relatórios           │
│   ───────────                                                                     │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│ ┌─ ESQUERDA (25%) ──────┐ ┌─ CENTRO (45%) ──────────────────┐ ┌─ DIREITA (30%)─┐│
│ │                        │ │                                  │ │                 ││
│ │  MENSAGENS             │ │  VER TODAS AS NOTÍCIAS →         │ │  AGENDA         ││
│ │  [Tudo][Novo][Tarefas] │ │                                  │ │                 ││
│ │  [Por Ler (10)]        │ │  ┌────────────────────────────┐ │ │  (próx. jobs)   ││
│ │                        │ │  │ 🏷 POPULAR                 │ │ │                 ││
│ │  ─── Seg 9 de Dez ──  │ │  │                             │ │ │                 ││
│ │                        │ │  │ [AVT Idol 80]              │ │ │ ─────────────   ││
│ │  [AVT 24] Remetente    │ │  │ "Headline da notícia       │ │ │                 ││
│ │  Título da mensagem    │ │  │  destaque..."              │ │ │  RANKINGS        ││
│ │                08:55   │ │  │                             │ │ │  [Hits][Idols]  ││
│ │                        │ │  │ preview texto...            │ │ │  [Grupos]       ││
│ │  [AVT 24] Remetente    │ │  │                             │ │ │                 ││
│ │  Título da mensagem    │ │  │ ● ● ○ ○ ○ ○ (carrossel)   │ │ │  (tabela top10) ││
│ │                08:35   │ │  └────────────────────────────┘ │ │                 ││
│ │                        │ │                                  │ │                 ││
│ │  [AVT 24] Remetente    │ │  CALENDÁRIO                     │ │                 ││
│ │  Título da mensagem    │ │  ┌────────────────────────────┐ │ │                 ││
│ │                08:24   │ │  │ Seg Ter Qua Qui Sex Sab Dom│ │ │                 ││
│ │                        │ │  │  9  10  11  12  13  14  15 │ │ │                 ││
│ │  ... (scroll)          │ │  │ 16  17  18  19  20  21  22 │ │ │                 ││
│ │                        │ │  └────────────────────────────┘ │ │                 ││
│ └────────────────────────┘ └──────────────────────────────────┘ └─────────────────┘│
│                                                                                   │
│ ┌── STATUS BAR ──────────────────────────────────────────────────────────────────┐│
│ │ [LOGO 20] Nova Star Agency    Saldo: ¥12.8M     [▶ Continuar]   [⚠ Alertas] ││
│ └────────────────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## CARD 1 — Mensagens (Coluna Esquerda, 25%)

> **Referência FM26**: Painel de mensagens à esquerda com lista scrollable,
> tabs de filtro, avatar do remetente, título e hora.

### Tabs de Filtro

```
[Tudo] [Novo] [Tarefas (4)] [Por Ler (10)] [☆] [🔍] [✓] [...]
```

| Tab | Função |
|---|---|
| **Tudo** | Todas mensagens (default) |
| **Novo** | Apenas não lidas |
| **Tarefas** | Mensagens que requerem ação do jogador (badge com contagem) |
| **Por Ler** | Mensagens marcadas para leitura posterior (badge) |
| **☆** | Favoritas / marcadas com estrela |
| **🔍** | Busca textual dentro das mensagens |
| **✓** | Marcar todas como lidas |
| **...** | Menu: excluir lidas, configurar notificações |

### Item de Mensagem na Lista

Cada mensagem na lista mostra:

```
┌──────────────────────────────┐
│ [AVT Remetente 24] Nome      │
│ Título da mensagem   🟢 08:55│
│                              │
├──────────────────────────────┤
```

| Elemento | Regra |
|---|---|
| **Avatar remetente** | 24×24 circular. Staff = avatar staff. Agência rival = logo. Dono = avatar dono. Sistema = ícone do sistema |
| **Nome do remetente** | Bold. Ex: "Leandro Uffermann", "André Marconatto" |
| **Título** | 1 linha, truncado com ellipsis se longo |
| **Indicador prioridade** | 🔴 Urgente, 🟡 Importante, 🟢 Normal, 🔵 Info |
| **Hora/data** | HH:MM se hoje, "Ontem", ou data |
| **Não lida** | Background levemente highlight + texto bold |
| **Lida** | Background normal + texto regular |

### Agrupamento por Data

Mensagens agrupadas por data com separador:

```
─── Seg 9 de Dez ───
[mensagem 1]
[mensagem 2]
─── Dom 8 de Dez ───
[mensagem 3]
```

### Comportamento

- **Click** em uma mensagem: navega para **Portal > Mensagens** (wireframe 05)
  com a mensagem selecionada aberta
- **Scroll infinito** na lista
- **Badge na tab Portal > Mensagens** mostra total de não lidas
- **Primeira sessão**: mensagem de boas-vindas do dono no topo (como FM26)

---

---

## CARD 2 — Notícias Destaque (Centro Superior, 45%)

> **Referência FM26**: "Ver Todas as Notícias >" com card grande em destaque,
> tag POPULAR, headline, preview, avatar grande, indicadores de carrossel.

### Header

```
Ver Todas as Notícias →
```

Link clicável que abre **Portal > Site de Notícias** (wireframe 03).

### Carrossel de Notícias (Max 6)

Card grande central mostrando **1 notícia por vez** com navegação por dots:

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  🏷 POPULAR                                        │
│                                                     │
│  "Headline da notícia destaque         [AVT 80×80] │
│   que pode ocupar até 2 linhas"         ★★ borda   │
│                                          tier      │
│  Preview do texto da notícia em 2-3 linhas.        │
│  Resumo do que aconteceu no mundo...               │
│                                                     │
│  [LOGO agência 20] Agência  |  Categoria  |  Agora │
│                                                     │
│              ● ● ○ ○ ○ ○  (6 dots de carrossel)   │
│                                                     │
└────────────────────────────────────────────────────┘
```

| Elemento | Regra |
|---|---|
| **Tag** | `POPULAR` (mais comentada), `URGENTE` (escândalo), `EXCLUSIVA` (scouting), `RESULTADO` (job) |
| **Headline** | 1-2 linhas, texto grande bold |
| **Avatar** | 80×80 circular da idol/pessoa principal da notícia. Borda colorida do tier |
| **Preview** | 2-3 linhas de texto resumo |
| **Metadata** | Logo agência (20×20) + nome agência + categoria + tempo relativo |
| **Carrossel dots** | ● preenchido = ativo, ○ vazio = inativo. Max 6 notícias |
| **Auto-rotate** | Troca a cada 8 segundos. Pausa no hover |
| **Click** | Abre artigo expandido (overlay fullscreen, wireframe 03) |
| **Swipe/setas** | ← → para navegar manualmente entre notícias |

### Tags de Notícia

| Tag | Cor | Quando |
|---|---|---|
| `POPULAR` | Roxo | Notícia com mais repercussão da semana |
| `URGENTE` | Vermelho | Escândalo, burnout, evento grave |
| `EXCLUSIVA` | Dourado | Pista de scouting, oportunidade rara |
| `RESULTADO` | Azul | Resultado de job (sucesso/fracasso) |
| `MERCADO` | Verde | Transferência, contratação, buyout |
| `MÚSICA` | Rosa | Chart, lançamento, hit |

### Regras Visuais

- **Avatar SEMPRE presente**: se notícia cita idol → avatar 80×80 no canto direito
- **Se 2+ idols**: avatar principal (80×80) + stack de avatares menores (24×24) abaixo
- **Se sobre agência sem idol**: logo da agência 80×80
- **Se idol não scoutada**: avatar blur/silhueta com "?"
- **Logo da agência**: sempre no metadata inferior (20×20)

---

## CARD 3 — Calendário (Centro Inferior, 45%)

> **Referência FM26**: Calendário semanal com grid de dias mostrando
> atividades por dia (ícones de treino, jogos, eventos).

### Layout do Calendário

```
Calendário 2025
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ Seg  │ Ter  │ Qua  │ Qui  │ Sex  │ Sáb  │ Dom  │
│  9   │ 10   │ 11   │ 12   │ 13   │ 14   │ 15   │
│╔════╗│      │      │      │      │      │      │
│║HOJE║│🎤🎤  │📺    │🎤📸  │      │🎵🎵  │🎤🎵  │
│║    ║│      │      │      │      │      │      │
│║3job║│      │      │      │      │      │      │
│║    ║│      │      │      │      │      │      │
│╚════╝│      │      │      │      │      │      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 16   │ 17   │ 18   │ 19   │ 20   │ 21   │ 22   │
│🎤📸  │🎤🎤  │📺📺  │🎤    │      │🎵    │      │
│      │      │      │      │ FOLGA│      │      │
│      │Campo │Campo │Campo │Campo │Campo │Campo │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

| Elemento | Visual |
|---|---|
| **Hoje** | Borda highlight (accent color) |
| **Ícones de job** | 🎤 Show, 📺 TV, 📸 Foto, 🎵 Gravação, 🤝 Meet&Greet, 💼 Endorsement |
| **Avatars de idol** | Mini (16×16) empilhados quando há escalação definida |
| **Eventos sazonais** | Badge colorido: "📅 TIF", "🏆 Awards" |
| **Folga programada** | Texto "FOLGA" no dia |
| **Contrato vencendo** | ⚠ ícone no dia do vencimento |
| **Treino/campo** | Label "Campo" no rodapé do dia (se aplicável) |

### Comportamento

- **Click no dia**: abre a **Agenda Semanal** (Operações > Agenda) focada nesse dia
- **Hover no ícone**: tooltip com nome do job + idol(s) escalada(s)
- **2 semanas visíveis**: semana atual + próxima semana
- **Scroll horizontal**: pode navegar para semanas futuras

---

---

## CARD 4 — Agenda (Direita Superior, 30%)

> **Referência FM26**: Painel "Agenda" à direita mostrando próximos jogos
> com logos dos times, competição, data e horário.

### Layout da Agenda

Mostra os **próximos 4-5 jobs agendados** em formato compacto:

```
AGENDA
┌──────────────────────────────────────────┐
│                                           │
│  Seg 9/12  🎤 Show Budokan               │
│            [AVT Tanaka 20] Tanaka Yui     │
│            📍 Tokyo        ★ Nota prev: A │
│                                           │
│  Qua 11/12 📺 Music Monday               │
│            [AVT Suzuki 20] Suzuki Mei     │
│            📍 TV Tokyo     ★ Nota prev: B │
│                                           │
│  Qui 12/12 📸 Sessão revista VOGUE        │
│            [AVT Kimura 20] Kimura Aoi     │
│            📍 Osaka        ★ Nota prev: C │
│                                           │
│  Sab 14/12 🎵 Gravação single             │
│            [AVT Tanaka 20] Tanaka Yui     │
│            📍 Estúdio Nova  ★ —           │
│                                           │
│  Dom 15/12 🎤 Live House Shibuya          │
│            [AVT Yamada 20] Yamada K.      │
│            📍 Shibuya      ★ Nota prev: B │
│                                           │
└──────────────────────────────────────────┘
```

| Elemento | Regra |
|---|---|
| **Data** | Dia da semana + DD/MM |
| **Ícone do tipo** | 🎤📺📸🎵🤝💼 — tipo do job |
| **Nome do job** | Bold, 1 linha |
| **Avatar da idol** | 20×20 circular com borda tier |
| **Nome da idol** | Ao lado do avatar. Se grupo: múltiplos avatars |
| **Local** | 📍 + nome do local/emissora/estúdio |
| **Nota previsão** | ★ + nota esperada (A-F) baseada no match. "—" se não calculada |
| **Job sem escalação** | ⚠ "Sem idol" em vermelho, clicável → Job Board |

### Comportamento

- **Click no job**: abre detalhes do job (painel de escalação)
- **Click no avatar/nome**: abre perfil da idol
- Se não há jobs: "Nenhum job agendado. [Ir ao Job Board →]"
- Mostra **max 5 jobs** mais próximos. "Ver agenda completa →" no rodapé

---

## CARD 5 — Rankings (Direita Inferior, 30%)

> **Referência FM26**: Painel "Fases" à direita mostrando tabela de
> classificação com logos, posições, estatísticas. No nosso caso:
> **3 abas** (Hits, Idols, Grupos).

### Tabs de Rankings

```
RANKINGS DA TEMPORADA
[Hits] [Idols] [Grupos]
─────
```

### Tab 1 — Hits (Charts Musicais)

Top 10 do chart semanal da Oricon:

```
┌─────────────────────────────────────────┐
│  RANKINGS DA TEMPORADA                   │
│  [Hits] [Idols] [Grupos]                 │
│  ─────                                   │
│                                          │
│  #  Música                Artista   Sem  │
│  ──────────────────────────────────────  │
│  1  ▲ "Starlight Dream"              3  │
│     [AVT 16] Tanaka Yui  ★              │
│                                          │
│  2  ▼ "Neon Nights"                  8  │
│     [AVT 16] Idol Rival                 │
│     [LOGO 16] Crown Ent.                │
│                                          │
│  3  — "Sakura no Kaze"               12 │
│     [AVT 16] Suzuki Mei  ★              │
│                                          │
│  4  ▲ "Electric Heart"               1  │
│     [AVT 16] Idol X                     │
│     [LOGO 16] Starlight                 │
│                                          │
│  5  ▲ "Moonrise"                     2  │
│     [AVT 16] Idol Y                     │
│                                          │
│  ...                                     │
│  10 ▼ "Summer Blaze"                 5  │
│     [AVT 16] Idol Z                     │
│                                          │
│  [Ver ranking completo →]                │
│                                          │
└─────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **#** | Posição no chart (1-10 visíveis) |
| **Movimento** | ▲ verde (subiu), ▼ vermelho (desceu), — cinza (manteve) |
| **Música** | Nome da música entre aspas |
| **Avatar** | 16×16 do artista |
| **Artista** | Nome da idol. ★ = sua idol (destaque accent) |
| **Logo** | 16×16 da agência (se rival, mostra logo) |
| **Sem** | Semanas no chart |

### Tab 2 — Idols (Fame Rankings)

Top 10 idols por fama:

```
│  #  Idol                 Fama   Tier    │
│  ──────────────────────────────────────  │
│  1  — [AVT 16] Mega Star  9,800  SSS   │
│       [LOGO 16] Crown                   │
│                                          │
│  2  ▲ [AVT 16] Tanaka Y.  5,200  S  ★  │
│       [LOGO 16] Nova Star               │
│                                          │
│  3  ▼ [AVT 16] Idol Rival 5,100  S     │
│       [LOGO 16] Heartbeat               │
│  ...                                     │
```

| Coluna | Descrição |
|---|---|
| **#** | Posição no ranking de fama |
| **Avatar** | 16×16 com borda tier |
| **Nome** | Bold. ★ se sua idol |
| **Fama** | Valor numérico (0-10,000) |
| **Tier** | SSS/SS/S/A/B/C/D/E/F com cor correspondente |
| **Logo agência** | 16×16 abaixo do nome |

### Tab 3 — Grupos (Group Rankings)

Top 10 grupos de idols por fama de grupo:

```
│  #  Grupo                Fama   Membros │
│  ──────────────────────────────────────  │
│  1  — Aurora              7,200  5      │
│     [AVT×5 16] [LOGO 16] Crown         │
│                                          │
│  2  ▲ Stellar Seven       4,800  7   ★  │
│     [AVT×3 16]... [LOGO 16] Nova Star  │
│                                          │
│  3  ▼ Neon5               4,500  5      │
│     [AVT×5 16] [LOGO 16] Heartbeat    │
│  ...                                     │
```

| Coluna | Descrição |
|---|---|
| **#** | Posição no ranking de grupo |
| **Nome grupo** | Bold. ★ se seu grupo |
| **Fama** | Valor numérico do grupo (média × sinergia) |
| **Membros** | Contagem de membros |
| **Avatars** | Stack de 16×16 dos membros (max 5 visíveis, "+N" se mais) |
| **Logo** | 16×16 da agência |

### Comportamento Geral dos Rankings

- **Click na linha**: abre perfil da idol/grupo/música
- **Click "Ver ranking completo →"**: navega para tela de Rankings (Agência > ?)
- **★ marcador**: suas idols/grupos sempre destacados com cor accent
- **Atualização**: rankings recalculados mensalmente, charts semanalmente
- **Hover na linha**: tooltip com detalhes extras (variação, melhor posição, semanas)

---

---

## CARD 6 — Status Bar (Rodapé Fixo)

> **Referência FM26**: Barra superior direita com data, botão "Continuar"
> e alerta. No nosso caso: rodapé fixo global.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LOGO 20] Nova Star Agency  │  Saldo: ¥12.8M  │  [▶ Continuar]  [⚠ 3]    │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Posição | Elemento | Descrição |
|---|---|---|
| Esquerda | [LOGO 20] + Nome da agência | Identidade visual constante |
| Centro-esquerda | Saldo: ¥XX.XM | Saldo atual com cor (verde se positivo, vermelho se negativo) |
| Centro-direita | **[▶ Continuar]** | Botão principal de avançar semana. Destaque accent (como FM26). Atalho: Space |
| Direita | **[⚠ N]** | Badge de alertas pendentes. Click abre painel de alertas |

### Alertas (Expansão do Badge ⚠)

Click no badge ⚠ abre painel dropdown acima da status bar:

```
┌──────────────────────────────────────────┐
│ ALERTAS (5)                    [✕ Fechar]│
├──────────────────────────────────────────┤
│ 🔴 [AVT 24] Suzuki Mei — Stress 82%.    │
│    Considere folga.      [Dar Folga →]   │
│                                          │
│ 🟡 [AVT 24] Yamada K. — Contrato        │
│    vence em 3 semanas.   [Renovar →]     │
│                                          │
│ 🔵 [AVT 24] Kimura — Crescendo          │
│    rápido, promover?     [Ver Perfil →]  │
│                                          │
│ 🟡 [LOGO 20] Crown fez casting em       │
│    Osaka. Ficar atento.  [Ver →]         │
│                                          │
│ 🔵 2 jobs sem escalar.   [Job Board →]   │
│                                          │
└──────────────────────────────────────────┘
```

| Cor | Nível | Exemplos |
|---|---|---|
| 🔴 | Urgente | Burnout, escândalo ativo, contrato esta semana |
| 🟡 | Atenção | Contrato breve, queda performance, wellness baixo |
| 🔵 | Info | Oportunidade, sugestão, novata crescendo |

**Regras:**
- Max visíveis no dropdown: 5 (scroll se mais)
- Cada alerta: avatar/logo (24/20) + texto + botão de ação rápida
- Dismissar alerta: não retorna até condição mudar
- Prioridade: 🔴 > 🟡 > 🔵
- Badge ⚠ na status bar mostra contagem total, cor do mais grave

---

## Right-Click Context Menu

Em qualquer entidade do Portal, right-click abre menu contextual:

**Em nome/avatar de idol:**
- Ver perfil
- Ver contrato
- Escalar em job
- Iniciar plano de desenvolvimento

**Em logo/nome de agência rival:**
- Ver perfil da agência
- Comparar com minha agência

**Em notícia/headline:**
- Ver artigo completo
- Ver idol envolvida
- Dispensar

**Em mensagem:**
- Abrir mensagem
- Marcar como lida/não lida
- Marcar como tarefa

**Em job na agenda:**
- Ver detalhes do job
- Mudar escalação
- Ver perfil da idol escalada

---

## Estados do Portal

| Estado | O que muda |
|---|---|
| **Normal** | Layout padrão com estado atual da agência |
| **Pós-Simulação** | Notícias frescas no carrossel, calendário atualizado, rankings recalculados |
| **Evento Urgente** | Badge ⚠ pulsa em vermelho. Notícia urgente no carrossel |
| **Início de Sessão** | Resume desde última sessão. Mensagem de resumo no inbox |
| **Primeira Vez (pós-P01)** | Portal aparece pela 1ª vez. Mensagem de boas-vindas do dono no inbox. Rankings com posição inicial |
| **0 Mensagens** | Painel esquerdo mostra "Nenhuma mensagem nova" |
| **0 Jobs na Agenda** | Agenda mostra "Nenhum job agendado. [Ir ao Job Board →]" |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Login/Title | Portal | Fade in (400ms) → colunas slide up (300ms, stagger) |
| Fechar P01 | Portal | Overlay P01 fade out → Portal fade in |
| Week Sim completa | Portal atualizado | Carrossel atualiza (slide-in). Rankings fazem number count-up |
| Click notícia | Artigo Expandido | Blur 8px + overlay 60% (300ms, wireframe 03) |
| Click mensagem | Inbox (wireframe 05) | Slide right → inbox com msg aberta |
| Click [▶ Continuar] | Week Simulation | Fade → tela de simulação |
| Click job na agenda | Detalhes do job | Slide right → painel de escalação |
| Click ranking | Ranking completo | Slide right → tela de rankings |

---

## Diferenças do FM26

| FM26 | Star Idol Agency | Motivo |
|---|---|---|
| 3 colunas (msg/news+cal/agenda+fases) | **Mesma estrutura 3 colunas** | Layout provado, funciona |
| "Continuar" no topo direito | **"Continuar" na status bar** | Rodapé fixo, sempre acessível |
| "Fases" = tabela de classificação (1 tab) | **Rankings = 3 abas** (Hits, Idols, Grupos) | 3 rankings distintos no jogo |
| Sem avatars inline em notícias | **Avatars em todo carrossel/agenda** | Design Principle #6 |
| Relatório de adversário no centro | **Não temos** (vai para Intelligence) | Separação de responsabilidades |
| Sem mood/emoção | **Agency Mood** embutido na primeira notícia ou contexto | Pilar narrativo |

---

## Responsividade

- **1920×1080**: Layout 3 colunas (25%/45%/30%) como descrito
- **1366×768**: Colunas comprimem. Agenda mostra 3 jobs. Rankings mostra top 5
- **<1280**: Coluna esquerda (mensagens) vira drawer retrátil. 2 colunas visíveis

---

## Assets Necessários

| Asset | Formato | Tamanhos | Uso |
|---|---|---|---|
| Avatars de idols | WebP | 16, 20, 24, 80 | Rankings, agenda, mensagens, notícias |
| Logos de agências | SVG | 16, 20, 32 | Rankings, agenda, mensagens, mood |
| Avatars de staff/NPCs | WebP | 20, 24 | Mensagens, alertas |
| Ícones de job | SVG | 16 | 🎤📺📸🎵🤝💼 Calendário, agenda |
| Ícones de ranking | SVG | 16 | ▲▼— movimento |
| Badge de tier | SVG | 12 | SSS-F cores para borda de avatar |
| Background pattern | SVG | tile | Fundo sutil do portal |

---

## Acceptance Criteria

1. Layout 3 colunas sem scroll vertical em 1920×1080
2. Mensagens: lista scrollable com avatar remetente, tabs de filtro, agrupamento por data
3. Notícias: carrossel max 6 com tag, headline, avatar 80×80, preview, auto-rotate 8s
4. Calendário: grid 2 semanas com ícones de job, hoje highlighted, hover com tooltip
5. Agenda: 4-5 próximos jobs com avatar idol, tipo, local, nota previsão
6. Rankings: 3 abas (Hits/Idols/Grupos), top 10, avatars 16×16, ★ para seus
7. Status bar: logo agência, saldo, [▶ Continuar], badge alertas
8. Click notícia → overlay fullscreen (wireframe 03)
9. Click mensagem → inbox (wireframe 05) com msg aberta
10. Right-click em entidades → context menu
11. Primeira vez pós-P01: mensagem de boas-vindas + estado inicial
12. Alertas via dropdown no badge ⚠ com prioridade por cor
