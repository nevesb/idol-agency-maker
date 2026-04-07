# News Feed UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-03
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Wireframe**: [`docs/design/wireframes/03-news-feed.md`](../design/wireframes/03-news-feed.md)

## Overview

Duas camadas de UI: **Feed** (lista scrollable de notícias) e **Artigo Expandido**
(overlay fullscreen ao clicar numa notícia, estilo FM26). Cada card de notícia
exibe obrigatoriamente avatar(s) da(s) pessoa(s) citada(s) e logo(s) da(s)
agência(s) envolvida(s), seguindo o Design Principle #6 (Visual Identity).

Feed é fonte de informação estratégica — jogadores atentos ganham vantagem.

## Detailed Design

### Camada 1 — Feed (Lista)

Layout completo no wireframe. Resumo:

- **Tabs**: `[Todas]` `[Minhas Idols]` `[Mercado]` `[Seguidas]`
- **Filtros**: Tipo, veículo, região, data, busca textual
- **Scroll infinito** com histórico de 3 meses

#### Card de Notícia no Feed

Cada card DEVE conter:

| Elemento | Posição | Tamanho | Regra |
|---|---|---|---|
| **Ícone de veículo** | Topo esquerda | Emoji + label | 📺 TV, 📰 Revista, 📱 Redes, 💼 Business |
| **Avatar(s) da(s) pessoa(s)** | Abaixo do veículo, esquerda | 40×40px circular | Toda pessoa citada na headline. Borda de cor do tier |
| **Logo da agência** | Ao lado dos avatars | 32×32px | Se notícia envolve agência. Fundo com cor da agência |
| **Headline** | Centro | Texto bold | 1-2 linhas, estilo manchete |
| **Metadata** | Rodapé | Texto small | Categoria + data + cor de severidade |
| **Cor de severidade** | Direita | Badge/dot | 🔵 Info, 🟡 Atenção, 🔴 Crítico |

**Se a notícia menciona 2+ idols** (grupo, conflito): múltiplos avatars empilhados.
**Se a notícia é sobre agência sem idol**: só o logo.
**Idols não scoutadas**: avatar blur/silhueta com "?".

#### Botões Contextuais

- **"Seguir Idol"**: Em notícias de idols fora do roster. Adiciona à tab "Seguidas"
- **"Ver Perfil"**: Navega para perfil da idol (se já scoutada/contratada)

### Camada 2 — Artigo Expandido (Overlay Fullscreen)

Ao clicar numa notícia, abre overlay escuro sobre o jogo (como FM26):

- **Background**: jogo desfocado (blur 8px + overlay escuro 60%)
- **Fechar**: Esc, click fora, ou botão [✕ Fechar]

#### Estrutura do Artigo

| Seção | Conteúdo | Visual |
|---|---|---|
| **Header bar** | Logo da agência principal + nome + região + reputação | Barra escura no topo |
| **Headline** | Título da notícia em destaque | Texto grande, bold |
| **Avatars** | Pessoas citadas + logos de agências | 48×48px, canto direito da headline, empilhados |
| **Metadata** | Categoria + data | Abaixo da headline, fonte pequena |
| **Corpo** | 2-3 parágrafos de texto narrativo | Fonte legível, espaçamento generoso |

#### Regras Visuais

1. **Avatars SEMPRE presentes**: idol citada → avatar 48×48 (borda tier) no canto superior direito da headline. 2+ idols → empilham
2. **Logo da agência SEMPRE presente**: se envolve agência → logo 48×48 ao lado dos avatars
3. **Header bar contextual**: agência principal da notícia (logo, nome, região, reputação)
4. **Texto usa placeholders do Producer Profile**: traços e background refletem no tom narrativo (ver news-feed.md template P01)

### Primeira Notícia do Jogo (P01)

Ao iniciar nova campanha, a **primeira coisa no Portal** é a notícia P01
(contratação do produtor) já expandida em overlay — impossível de perder.

- **Template**: P01 (definido em news-feed.md)
- **Header**: Logo da agência escolhida + nome + região + reputação
- **Headline**: "{AGENCIA} contrata {PRODUTOR_NOME} como novo produtor"
- **Avatars**: Silhueta do produtor + logo da agência
- **Corpo**: 3 parágrafos adaptados por traços, estilo e background do produtor
- **Veículo**: Proporcional à reputação do background (Prodígio = TV, Zero = Blog)
- **Regra**: Gerada automaticamente ao criar campanha. Jogador precisa fechar (click ou Esc) pra ver o Portal pela primeira vez

### Modo Skip — Jornal Semanal

Jogador que dá skip na semana recebe **jornal semanal** com top 5-10 destaques,
usando o mesmo layout de cards mas em modal compacto. "Ver todas" expande lista completa.

## Dependencies

**Hard**: News Feed & Media system (news-feed.md), Fame (tier → veículo), Event Generator
**Soft**: Producer Profile (P01 + tom narrativo), todos sistemas que geram notícias
**Depended on by**: Scouting (passivo via "Seguir Idol"), Market/Transfer (inteligência)

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
11. Botão "Seguir Idol" funcional em notícias de scouting
12. Feed scrollable com scroll infinito e histórico de 3 meses
13. Ícones de veículo correspondem à fama da idol/evento
14. Cor de severidade correta (info/atenção/crítico)
