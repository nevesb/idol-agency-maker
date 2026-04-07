# Wireframe 03 — News Feed UI

> **Status**: Draft
> **Referência**: FM26 News Article (foto anexa — Guarani FC contratação)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/news` (src/routes/(game)/noticias/+page.svelte → futuro /news)
> **Domínio**: Portal (tecla 1) > Notícias

---

## Conceito

Duas camadas:
1. **Feed** — lista scrollable de notícias (como hoje no GDD)
2. **Artigo Expandido** — overlay fullscreen ao clicar numa notícia (como FM26)

A diferença do FM26: **visuais obrigatórios**. Toda notícia expandida mostra
avatar da idol/pessoa citada + logo da agência envolvida.

---

## Camada 1 — Feed (Lista)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Portal > Notícias                                                            │
│                                                                              │
│ ┌─ TABS + FILTROS ───────────────────────────────────────────────────────┐   │
│ │ [Todas] [Minhas Idols] [Mercado] [Seguidas ▼]       [Filtros ▼] [🔍]  │   │
│ └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│ ┌─ NOTÍCIA (card no feed) ───────────────────────────────────────────────┐  │
│ │                                                                         │  │
│ │  📺 TV NACIONAL                                    Semana 1, Ano 1  🔵 │  │
│ │                                                                         │  │
│ │  [AVT Produtor]  [LOGO Agência]                                        │  │
│ │                                                                         │  │
│ │  "Nova Star Agency contrata Yamada Kenji                               │  │
│ │   como novo produtor"                                                   │  │
│ │                                                                         │  │
│ │  Indústria Idol | Agora mesmo                                          │  │
│ │                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─ NOTÍCIA ──────────────────────────────────────────────────────────────┐  │
│ │                                                                         │  │
│ │  📰 REVISTA                                        Semana 1, Ano 1  🔵 │  │
│ │                                                                         │  │
│ │  [AVT Suzuki]  [LOGO Nova Star]                                        │  │
│ │                                                                         │  │
│ │  "Suzuki Mei, nova contratação da Nova Star,                           │  │
│ │   promete surpreender na próxima temporada"                             │  │
│ │                                                                         │  │
│ │  Contratação | Semana 1                                                │  │
│ │                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─ NOTÍCIA ──────────────────────────────────────────────────────────────┐  │
│ │                                                                         │  │
│ │  📱 REDES SOCIAIS                                  Semana 1, Ano 1  🔵 │  │
│ │                                                                         │  │
│ │  [AVT Idol X]                                                          │  │
│ │                                                                         │  │
│ │  "Nova idol promissora surge em live house                             │  │
│ │   de Akihabara. Fãs elogiam"                                           │  │
│ │                                                                         │  │
│ │  [Seguir Idol]  Scouting | Semana 1                                    │  │
│ │                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ... (scroll infinito)                                                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Regras Visuais do Feed

Cada card de notícia no feed DEVE conter:

| Elemento | Posição | Tamanho | Regra |
|---|---|---|---|
| **Ícone de veículo** | Topo esquerda | Emoji + label | 📺 TV, 📰 Revista, 📱 Redes, 💼 Business |
| **Avatar(s) da(s) pessoa(s)** | Abaixo do veículo, esquerda | 40×40px circular | Toda pessoa citada na headline. Borda de cor do tier |
| **Logo da agência** | Ao lado dos avatars | 32×32px | Se notícia envolve agência. Fundo com cor da agência |
| **Headline** | Centro | Texto bold | 1-2 linhas, estilo manchete |
| **Metadata** | Rodapé | Texto small | Categoria + data + cor de severidade |
| **Cor de severidade** | Direita | Badge/dot | 🔵 Info, 🟡 Atenção, 🔴 Crítico |

**Se a notícia menciona 2+ idols** (grupo, conflito): mostrar múltiplos avatars empilhados.
**Se a notícia é sobre agência sem idol**: mostrar só o logo.

### Tab "Seguidas" e Grupos de Watchlist

A tab **[Seguidas ▼]** tem um dropdown que filtra por grupo de idols seguidas:

```
┌─ Seguidas ▼ ──────────────────┐
│ ☑ Todas as Seguidas           │
│ ──────────────────────────── │
│ ○ Roster (automático)         │
│ ○ Rivais Diretas              │
│ ○ Alvos de Transferência      │
│ ○ Promessas (Scouting)        │
└───────────────────────────────┘
```

| Regra | Descrição |
|---|---|
| **Roster (automático)** | Idols do próprio roster são automaticamente seguidas neste grupo. Não é possível removê-las — sair do roster remove do grupo |
| **Grupos do jogador** | O jogador cria quantos quiser via Actions > Seguir no perfil de qualquer idol (wireframe 08). Exemplos: "Rivais Diretas", "Alvos de Transferência", "Promessas" |
| **Múltiplos grupos** | Uma idol pode pertencer a vários grupos simultaneamente |
| **Seguir sem grupo** | Seguir uma idol sem atribuir a nenhum grupo = ela aparece em "Todas as Seguidas" mas não em nenhum grupo específico |
| **Filtro** | Selecionar um grupo mostra apenas notícias sobre idols daquele grupo |

---

## Camada 2 — Artigo Expandido (Overlay Fullscreen)

Ao clicar numa notícia, abre overlay escuro sobre o jogo (como FM26).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│         ═══ BACKGROUND: JOGO DESFOCADO (blur 8px + overlay 60%) ═══         │
│                                                                              │
│     ┌─ HEADER DA NOTÍCIA ─────────────────────────────────────────────┐     │
│     │                                                                  │     │
│     │  [LOGO 40×40]  Nova Star Agency             Região    Reputação │     │
│     │               Agência jogável               📍 Tokyo  🟢 Média  │     │
│     │                                                                  │     │
│     └──────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│     ┌─ ARTIGO ────────────────────────────────────────────────────────┐     │
│     │                                                                  │     │
│     │  ┌─ HEADLINE ─────────────────────────────────────────────────┐ │     │
│     │  │                                                             │ │     │
│     │  │  "Nova Star Agency contrata Yamada Kenji      [AVT 48×48]  │ │     │
│     │  │   como novo produtor"                         [LOGO 48×48] │ │     │
│     │  │                                                             │ │     │
│     │  │  Indústria Idol | Agora mesmo                               │ │     │
│     │  │                                                             │ │     │
│     │  └─────────────────────────────────────────────────────────────┘ │     │
│     │                                                                  │     │
│     │  Mudanças à vista na Nova Star Agency, uma vez que a pequena    │     │
│     │  agência de Shibuya está prestes a anunciar a nomeação do       │     │
│     │  produtor Yamada Kenji como seu novo comandante.                │     │
│     │                                                                  │     │
│     │  Como figura {TRACO_1} que aposta forte na {TRACO_2},          │     │
│     │  Yamada-san junta-se à Nova Star numa transferência que irá     │     │
│     │  intrigar muitas pessoas da indústria. Fontes internas          │     │
│     │  mostram-se confiantes que as características dele sejam        │     │
│     │  adequadas para criar o tipo de cultura que se espera.          │     │
│     │                                                                  │     │
│     │  {BACKGROUND_TEXT} — ele aproveita agora esta oportunidade      │     │
│     │  para construir algo do zero.                                   │     │
│     │                                                                  │     │
│     └──────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│                                                        [✕ Fechar]           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Estrutura do Artigo Expandido

| Seção | Conteúdo | Visual |
|---|---|---|
| **Header bar** | Logo da agência + nome + região + reputação | Barra escura no topo, como FM26 |
| **Headline** | Título da notícia em destaque | Texto grande, bold |
| **Avatars** | Pessoas citadas + logos de agências | 48×48px, canto direito da headline, empilhados |
| **Metadata** | Categoria + data | Abaixo da headline, fonte pequena |
| **Corpo** | 2-3 parágrafos de texto narrativo | Fonte legível, espaçamento generoso |
| **Fechar** | Botão ou click fora | Esc ou click no overlay |

### Regras Visuais do Artigo

1. **Avatars SEMPRE presentes**: Se a notícia cita uma idol, seu avatar (48×48, borda tier) aparece no canto superior direito da headline. Se cita 2+, empilham
2. **Logo da agência SEMPRE presente**: Se envolve agência, logo (48×48) aparece ao lado dos avatars
3. **Header bar contextual**: Mostra a agência principal da notícia (como FM26 mostra o time). Inclui: logo, nome, região, reputação
4. **Texto usa placeholders do Producer Profile**: Traços e background do produtor refletem no texto da notícia (ex: "produtor agressivo" ou "produtor cauteloso")
5. **Background do jogo fica visível mas desfocado** (blur 8px + overlay escuro 60%)

### Exemplos de Artigos com Visuais

**Notícia de contratação de idol:**
```
Header: [LOGO sua agência] + nome + região + reputação
Headline: "[AVT Idol] [LOGO agência] Nova Star contrata Tanaka Yui"
Corpo: texto sobre a contratação
```

**Notícia de escândalo:**
```
Header: [LOGO agência da idol] + nome + região
Headline: "[AVT Idol] Suzuki Mei flagrada em restaurante..."
Corpo: texto do escândalo
```

**Notícia de mercado (buyout):**
```
Header: [LOGO agência compradora] + nome + região
Headline: "[AVT Idol] [LOGO origem] [LOGO destino] Crown compra ace da Heartbeat"
Corpo: texto da transferência
```

**Notícia de resultado de job:**
```
Header: [LOGO sua agência] + nome
Headline: "[AVT Idol] Tanaka Yui recebe ovação no Budokan"
Corpo: texto do resultado
```

---

## Primeira Notícia do Jogo

Ao iniciar uma nova campanha, a **primeira coisa que o jogador vê no Portal**
é esta notícia já expandida (overlay), impossível de perder:

**Tipo**: Contratação de produtor (template especial `P01`)

**Header**: Logo da agência escolhida + nome + região + reputação

**Headline**: "{AGENCIA} contrata {PRODUTOR_NOME} como novo produtor"

**Avatars**: Avatar/silhueta do produtor + logo da agência

**Corpo** (3 parágrafos, adaptado por traços):

> Parágrafo 1: Anuncia a contratação factualmente.
> "Mudanças à vista na {AGENCIA}. A agência de {REGIAO} está prestes a
> anunciar a nomeação de {PRONOME}, {PRODUTOR_NOME_COMPLETO}, como novo
> produtor."
>
> Parágrafo 2: Descreve o estilo do produtor usando traços e estilo.
> "Como figura {TRACO_1_DESC} que aposta forte em {TRACO_2_DESC},
> {PRONOME} junta-se à {AGENCIA} numa transferência que irá intrigar
> muitas pessoas da indústria."
>
> Parágrafo 3: Referencia o background.
> Template varia conforme o background:
> - Prodígio: "Com uma carreira lendária no entretenimento..."
> - Hitmaker: "Acumulando sucessos e respeitado por lapidar potencial..."
> - Zero: "Sem uma carreira prévia como referência, ele aproveita..."

**Regra**: Esta notícia é **gerada automaticamente** ao criar campanha e
aparece expandida (overlay) na primeira entrada no Portal. O jogador precisa
fechar (click ou Esc) pra ver o Portal pela primeira vez.

### Template Especial P01

```
ID: P01
Tipo: Contratação de produtor (início de jogo)
Placeholders: {AGENCIA}, {AGENCIA_REGIAO}, {PRODUTOR_NOME},
              {PRODUTOR_SOBRENOME}, {PRONOME}, {TRACO_1_DESC},
              {TRACO_2_DESC}, {BACKGROUND_DESC}, {ESTILO_DESC}
Veículos: Proporcional à reputação do background escolhido
  - Prodígio/Ícone: TV Nacional
  - Hitmaker/Especialista: Revista
  - Promessa/Veterano: Jornal Local
  - Zero: Blog/Redes Sociais
Variações: 3 por veículo (mudança de tom)
```

---

## Assets Necessários

| Asset | Formato | Tamanho | Descrição |
|---|---|---|---|
| Avatars de idols | WebP | 48×48, 80×80 | Usados no feed e artigo expandido |
| Logos de agências | SVG | 40×40, 48×48 | Header do artigo e inline |
| Avatars de staff/NPCs | WebP | 48×48 | Quando citados em notícias |
| Silhueta do produtor | SVG | 48×48 | Usado na notícia P01 (sem avatar real) |
| Ícones de veículo | SVG | 24×24 | 📺📰📱💼 em formato vetorial |

---

## Acceptance Criteria

1. Feed mostra avatar da idol + logo da agência em TODO card de notícia
2. Click numa notícia abre overlay fullscreen com artigo expandido
3. Artigo expandido tem header bar (logo + agência + região + reputação)
4. Avatars 48×48 no canto da headline do artigo expandido
5. Background do jogo desfocado (blur 8px + overlay 60%)
6. Fechar com Esc ou click fora
7. Primeira notícia (P01) aparece expandida ao iniciar campanha
8. P01 adapta texto conforme traços, estilo e background do produtor
9. Veículo da P01 proporcional à reputação do background
10. Filtros e tabs funcionam no feed
