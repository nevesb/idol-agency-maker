# Wireframe 01 — Title Screen

> **Status**: Draft
> **Referência**: FM26 Title Screen (foto anexa)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/` (+page.svelte)

---

## Conceito Visual

**Background**: Backstage de show idol em estilo anime/ilustração.
Vista dos bastidores — cases de equipamento, arara de figurinos idol
(vestidos brilhantes, pastel), penteadeiras com espelhos de camarim
(luzes ao redor), e ao fundo o palco visto por trás com luzes de show.
Atmosfera: azul escuro + pontos de luz quente. Sensação de "estamos
prestes a subir ao palco".

**Estilo**: Ilustração anime semi-realista (não fotorrealista como FM26).
Cores dominantes: azul escuro, roxo, rosa pastel, pontos de luz dourada.
Mesma paleta do jogo.

---

## Layout — Wireframe ASCII (1920×1080)

### Estado: Jogador tem save(s) — "Carregar Última Carreira" em destaque

Quando o jogador já jogou antes, o card principal muda de "Iniciar Nova
Carreira" para **"Carregar Última Carreira"** (como FM26 screenshot).
O card mostra dados do último save: nome da agência, logo, data in-game
e data do último save. "Iniciar Nova Carreira" desce para card secundário.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─ MINI NAV (topo, sutil) ────────────────────────────────────────────────┐ │
│  │  v0.1.0                                          [⚙ Settings]  [Sair]  │ │
│  │  [★ LOGO] STAR IDOL AGENCY                                              │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                    ╔═══ BACKGROUND: BACKSTAGE ANIME ═══╗                     │
│                    ║  (ilustração ocupa tela inteira)   ║                     │
│                    ╚════════════════════════════════════╝                     │
│                                                                              │
│  ┌─ CARD PRINCIPAL — "Carregar Última Carreira" (~55%) ─────────────────┐   │
│  │                                                                       │   │
│  │  ┌──────────┐                                                         │   │
│  │  │ [LOGO    │  Nova Star Agency                                       │   │
│  │  │ AGÊNCIA  │                                                         │   │
│  │  │  64×64]  │  Data no jogo: Semana 45, Ano 3                        │   │
│  │  │          │  Último save: 25 de Outubro, 2025                       │   │
│  │  └──────────┘                                                         │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                                 │  │   │
│  │  │  [SCREENSHOT / THUMBNAIL DO ÚLTIMO ESTADO]                     │  │   │
│  │  │  (imagem auto-gerada do Portal Dashboard capturada ao salvar)  │  │   │
│  │  │  Aspecto: 16:9, cantos arredondados, leve overlay escuro       │  │   │
│  │  │                                                                 │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  │  Carregar Última Carreira                                             │   │
│  │  ─────────────────────────                                            │   │
│  │  Retome de onde parou.                                                │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ CARD SEC. 1 (~27%) ────────────┐  ┌─ CARD SEC. 2 (~27%) ────────────┐  │
│  │                                  │  │                                  │  │
│  │  Iniciar Nova Carreira           │  │  Carregar Jogo                   │  │
│  │                                  │  │                                  │  │
│  │  Construa sua agência do zero    │  │  Carregue um save anterior       │  │
│  │  e leve suas idols ao estrelato. │  │  ou importe uma campanha.        │  │
│  │                                  │  │                                  │  │
│  │  ┌──────────────────────────┐    │  │                                  │  │
│  │  │ [IMAGEM: palco idol]     │    │  │                                  │  │
│  │  │ arena, glowsticks, luzes │    │  │                                  │  │
│  │  └──────────────────────────┘    │  │                                  │  │
│  │                                  │  │                                  │  │
│  └──────────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                              │
│  ┌─ RODAPÉ ────────────────────────────────────────────────────────────────┐ │
│  │  © Star Idol Agency                                       [Conta ▸]    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Estado: Primeiro acesso (sem saves) — "Iniciar Nova Carreira" em destaque

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─ MINI NAV (topo, sutil) ────────────────────────────────────────────────┐ │
│  │  v0.1.0                                          [⚙ Settings]  [Sair]  │ │
│  │  [★ LOGO] STAR IDOL AGENCY                                              │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                    ╔═══ BACKGROUND: BACKSTAGE ANIME ═══╗                     │
│                    ║  (ilustração ocupa tela inteira)   ║                     │
│                    ╚════════════════════════════════════╝                     │
│                                                                              │
│  ┌─ CARD PRINCIPAL — "Iniciar Nova Carreira" (~55%) ────────────────────┐   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │                                                                 │  │   │
│  │  │              IMAGEM: FRONTSTAGE / PALCO IDOL                   │  │   │
│  │  │              Arena lotada, glowsticks coloridos,               │  │   │
│  │  │              palco "Starlight Dream Stage" iluminado           │  │   │
│  │  │                                                                 │  │   │
│  │  └─────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  │  Iniciar Nova Carreira                                                │   │
│  │  ─────────────────────                                                │   │
│  │  Construa sua agência do zero e leve suas                            │   │
│  │  idols ao estrelato.                                                  │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ CARD SECUNDÁRIO — "Carregar Jogo" (centralizado, ~55%) ─────────────┐   │
│  │                                                                       │   │
│  │  Carregar Jogo                                                        │   │
│  │  Carregue um save anterior ou importe uma campanha.                   │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ RODAPÉ ────────────────────────────────────────────────────────────────┐ │
│  │  © Star Idol Agency                                       [Conta ▸]    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Elementos Detalhados

### Mini Nav (Topo)

Barra fina e sutil (não é a nav do jogo — essa só aparece in-game).

| Posição | Elemento | Comportamento |
|---|---|---|
| Esquerda | Versão (`v0.1.0`) + Logo texto "STAR IDOL AGENCY" | Estático |
| Direita | `[⚙ Settings]` | Abre tela de configurações (idioma, tema, som, acessibilidade, saves) |
| Direita | `[Sair]` | Fecha o app (Tauri) / volta pra landing |

**O que NÃO aparece aqui:**
- Seletor de idioma (fica dentro do Settings)
- Toggle de tema (fica dentro do Settings)
- Nenhum submenu "Mais"

### Card Principal — Muda conforme estado de saves

#### Quando há saves: "Carregar Última Carreira" (como FM26)

- **Posição**: Esquerda, ocupa ~55% da largura da tela
- **Conteúdo**:
  - **Logo da agência** (64×64) + nome da agência (destaque)
  - Data in-game: "Semana 45, Ano 3"
  - Data do último save: "25 de Outubro, 2025"
  - **Thumbnail/Screenshot**: imagem auto-gerada do Portal Dashboard,
    capturada automaticamente ao salvar. Aspecto 16:9, cantos arredondados,
    leve overlay escuro. Se não houver screenshot, usa imagem genérica do
    frontstage (mesma do estado "sem saves")
  - Título: "Carregar Última Carreira" (i18n: `menu.loadLastCareer`)
  - Subtítulo: "Retome de onde parou."
- **Click**: Carrega o save mais recente → `/portal`
- **Hover**: Leve scale up (1.01) + brilho na borda
- **Borda**: Tracejada em vermelho/accent (como FM26 — contorno de destaque)

#### Quando não há saves: "Iniciar Nova Carreira"

- **Posição**: Mesmo espaço (~55%)
- **Imagem**: Frontstage — arena idol lotada, glowsticks, palco iluminado
  - Estilo anime/ilustração (não fotorrealista)
  - Contraste narrativo: BG = bastidores, card = o sonho/palco
  - Aspecto 16:9, cantos arredondados (8px)
- **Título**: "Iniciar Nova Carreira" (i18n: `menu.newGame`)
- **Subtítulo**: "Construa sua agência do zero e leve suas idols ao estrelato."
- **Click**: Navega para `/new-game` (wizard de criação)

### Cards Secundários — Mudam conforme estado de saves

#### Quando há saves: 2 cards lado a lado (~27% cada)

**Card "Iniciar Nova Carreira"** (esquerda):
- Título: "Iniciar Nova Carreira"
- Subtítulo: "Construa sua agência do zero e leve suas idols ao estrelato."
- Imagem pequena: thumbnail do palco idol (mesma arte, versão reduzida)
- Click: Navega para `/new-game`

**Card "Carregar Jogo"** (direita):
- Título: "Carregar Jogo"
- Subtítulo: "Carregue um save anterior ou importe uma campanha."
- Se múltiplos saves: badge com número de saves
- Click: Abre modal/tela de slots de save
- Sem imagem

#### Quando não há saves: 1 card centralizado (~55%)

**Card "Carregar Jogo"** (centralizado):
- Título: "Carregar Jogo"
- Subtítulo: "Carregue um save anterior ou importe uma campanha."
- Click: Abre modal de importação
- Sem imagem

### Background

- **Imagem**: Ilustração anime do backstage de um show idol
  - Referência visual: segunda foto anexa (backstage real), mas em estilo anime
  - Cases de equipamento empilhados
  - Arara com figurinos (vestidos pastel, brilhantes)
  - Penteadeiras com espelhos de camarim (luzes quentes ao redor)
  - Ao fundo: cortina entreaberta mostrando o palco iluminado
  - Atmosfera: azul escuro dominante, pontos de luz dourada/rosa
- **Tratamento**: Leve blur (2-4px) pra não competir com os cards
  - Overlay escuro semi-transparente (rgba(5,6,8,0.4))
  - Cards têm fundo levemente translúcido (glassmorphism sutil)
- **Parallax**: Não (desnecessário, mantém performance)

### Rodapé

- **Esquerda**: Copyright / créditos
- **Direita**: Link "Conta" (login Supabase — discreto, não é ação principal)

---

## Estados

| Estado | Card Principal | Cards Secundários |
|---|---|---|
| **Sem saves** | "Iniciar Nova Carreira" (imagem frontstage, ~55%) | "Carregar Jogo" centralizado (~55%) |
| **Com 1 save** | "Carregar Última Carreira" (logo agência + screenshot + dados do save) | "Iniciar Nova Carreira" (~27%) + "Carregar Jogo" (~27%) |
| **Com múltiplos saves** | "Carregar Última Carreira" (save mais recente) | "Iniciar" (~27%) + "Carregar Jogo" com badge de nº (~27%) |
| **Tema dark** | Background anime escuro (padrão). Cards com fundo rgba escuro |  |
| **Tema light** | Background anime versão clara. Cards com fundo rgba claro |  |

---

## Diferenças do FM26

| FM26 | Star Idol Agency | Motivo |
|---|---|---|
| Background 3D (vestiário com manager) | Ilustração anime (backstage) | Identidade visual é anime, não 3D |
| Card "Load Most Recent Career" com logo/data | Card "Carregar Última Carreira" com logo agência + screenshot + data | Mesmo conceito, adaptado com thumbnail auto-gerado |
| 3 cards (Load Recent, Start New, Load Game + Online) | 2-3 cards (Última Carreira / Iniciar / Carregar) | Sem multiplayer — "Online" não existe |
| Top nav: FMFC, Preferências, Mais, Sair | Mini nav: versão, settings, sair | Mais limpo |
| Card "Start New Career" com foto de estádio | Card "Iniciar" com ilustração de palco idol | Temática |
| Banner "FMFC JOIN THE SQUAD" no rodapé | Nada (sem marketing externo no MVP) | Limpo |
| Borda tracejada vermelha no card principal | Borda tracejada accent no card principal | Mesma linguagem visual adaptada |

---

## Responsividade

- **1920×1080**: Layout padrão como descrito
- **1366×768**: Cards reduzem proporcionalmente. Imagem do card principal mantém 16:9
- **<1280**: Card principal ocupa 100% largura. Secundários empilham vertical

---

## Transições

- **Entrada**: Fade in do background (300ms) → slide up dos cards (400ms, stagger 100ms)
- **Click em card**: Card faz leve pulse → fade out → navega
- **Hover em card**: Scale 1.01, borda accent glow (200ms ease)

---

## Assets Necessários

| Asset | Formato | Tamanho | Descrição |
|---|---|---|---|
| `logo-star-idol-agency.svg` | SVG | 200×48 | Logo do jogo (nav bar + card) |
| `logo-star-idol-agency-full.svg` | SVG | 400×120 | Logo completo (hero, se usado) |
| `bg-backstage.webp` | WebP | 1920×1080 | Background backstage anime |
| `bg-backstage-light.webp` | WebP | 1920×1080 | Versão light do background |
| `card-frontstage.webp` | WebP | 960×540 | Imagem do palco idol pro card principal |
| `save-thumbnail-[slot].webp` | WebP | 960×540 | Screenshot auto-gerado do Portal ao salvar (por slot) |
| `agency-logo-[id].webp` | WebP | 64×64 | Logo da agência do jogador (exibido no card "Última Carreira") |

---

## Mapping para Implementação

- **Rota**: `/` (src/routes/+page.svelte)
- **i18n keys**: `menu.newGame`, `menu.newGameDesc`, `menu.loadLastCareer`, `menu.loadLastCareerDesc`, `menu.loadGame`, `menu.loadGameDesc`
- **Stores**: `currentSaveSlot`, `theme`, `locale`
- **Componentes**: Reutilizar sistema de tema existente
