# Portal — Command Center (Dashboard Principal)

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Todos — ponto de entrada do jogo
> **Parent**: ui-information-architecture.md
> **Wireframe**: [`docs/design/wireframes/04-portal-dashboard.md`](../design/wireframes/04-portal-dashboard.md)

## Overview

O Portal e o **hub central** do jogo — inspirado no Portal do FM26 com
layout de **3 colunas** identico. E onde o jogador comeca toda sessao,
e onde retorna apos qualquer acao. Deve responder em 5 segundos:
"o que precisa da minha atencao?", "como esta a agencia?", "o que vem a seguir?"

**PC-First.** Layout otimizado para 1920×1080 com mouse + teclado.

## Submenu do Dominio Portal

```
Visão Geral | Mensagens | Calendário | Site de Notícias | Relatórios
```

- **Visão Geral**: esta tela (dashboard) — wireframe 04
- **Mensagens**: inbox completo — wireframe 05
- **Calendário**: calendario expandido
- **Site de Notícias**: news feed completo — wireframe 03
- **Relatórios**: intelligence reports

## Layout — PC (1920×1080) — 3 Colunas

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [★ LOGO] Portal | Roster | Mercado | Operacoes | Agencia | Produtor [🔍][📑] │
│   Visão Geral  Mensagens  Calendário  Site de Notícias  Relatórios            │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─ ESQUERDA (25%) ─────┐ ┌─ CENTRO (45%) ───────────────┐ ┌─ DIREITA (30%)─┐│
│  │ MENSAGENS             │ │ NOTÍCIAS DESTAQUE (carrossel) │ │ AGENDA          ││
│  │ inbox preview         │ │ + CALENDÁRIO semanal          │ │ + RANKINGS      ││
│  │ scrollable            │ │                               │ │ (3 abas)        ││
│  └───────────────────────┘ └───────────────────────────────┘ └────────────────┘│
│                                                                                │
│  ┌─ STATUS BAR ──────────────────────────────────────────────────────────────┐ │
│  │ [LOGO] Agencia │ Saldo: ¥XX.XM │ [▶ Continuar] │ [⚠ N alertas]         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Importante: Mensagens ≠ Notícias.** Notícias são artigos públicos sobre
eventos do mundo (news-feed.md). Mensagens são comunicações diretas ao
produtor (message-types-catalog.md).

## Elementos do Portal

### Coluna Esquerda (25%) — Mensagens

Preview do inbox do produtor. Lista scrollable de mensagens diretas.

- **Tabs**: `[Tudo] [Novo] [Tarefas (N)] [Por Ler (N)]`
- Cada mensagem: avatar remetente (24×24) + nome + titulo + hora + prioridade
- **Click em mensagem**: navega para Portal > Mensagens (inbox, wireframe 05)
- Agrupadas por data com separadores
- **Primeira sessão**: mensagem de boas-vindas do dono no topo
- Tipos de mensagem detalhados em `message-types-catalog.md`

### Coluna Central (45%) — Notícias + Calendário

**Notícias Destaque (superior):**
Carrossel horizontal de max 6 notícias com:
- Tag de categoria (POPULAR, URGENTE, EXCLUSIVA, RESULTADO, MERCADO, MÚSICA)
- Headline grande (1-2 linhas)
- Avatar principal (80×80, borda tier) da pessoa citada
- Preview do texto (2-3 linhas)
- Logo da agencia (20×20) no metadata
- Dots de navegacao do carrossel (auto-rotate 8s, pausa no hover)
- Click abre artigo expandido (overlay fullscreen, wireframe 03)
- "Ver Todas as Notícias →" linka para feed completo

**Calendário (inferior):**
Grid semanal mostrando 2 semanas:
- 7 colunas (Seg-Dom) × 2 linhas (semana atual + próxima)
- Hoje: borda highlight (accent)
- Icones de job por dia (🎤📺📸🎵🤝💼)
- Avatars mini (16×16) quando escalação definida
- Eventos sazonais: badges coloridos ("📅 TIF", "🏆 Awards")
- Hover no dia: tooltip com detalhes
- Click no dia: abre agenda semanal focada nesse dia

### Coluna Direita (30%) — Agenda + Rankings

**Agenda (superior):**
Proximos 4-5 jobs agendados em formato compacto:
- Data + icone tipo + nome job
- Avatar idol escalada (20×20) + nome
- Local (📍)
- Nota previsao (★ A-F) baseada no match
- Job sem escalacao: ⚠ "Sem idol" em vermelho
- Click no job: abre detalhes/escalacao

**Rankings da Temporada (inferior):**
3 abas de ranking com top 10:

| Aba | Conteudo | Colunas |
|---|---|---|
| **Hits** | Chart musical semanal (Oricon) | #, ▲▼, música, artista (avatar 16), agência (logo 16), semanas |
| **Idols** | Fame ranking individual | #, ▲▼, idol (avatar 16, borda tier), fama, tier, agência (logo 16) |
| **Grupos** | Fame ranking de grupos | #, ▲▼, grupo, fama, membros (avatars stack 16), agência (logo 16) |

- ★ marca suas idols/grupos (cor accent)
- "Ver ranking completo →" navega para tela de rankings
- Rankings atualizam mensalmente; charts semanalmente

### Status Bar (Rodape Fixo)

Barra fina no rodape com:
- [LOGO 20] + nome da agencia
- Saldo atual (verde/vermelho)
- **[▶ Continuar]**: botao principal de avancar semana (accent, destaque). Atalho: Space
- **[⚠ N]**: badge de alertas. Click abre dropdown com max 5 alertas (🔴 > 🟡 > 🔵)

### Alertas (via badge ⚠ na Status Bar)

Nao sao mais barra fixa no topo. Vivem no dropdown do badge ⚠:
- Max 5 visiveis no dropdown
- Cada alerta: cor + avatar/logo (24/20) + 1 frase + botao acao rapida
- Prioridade: 🔴 (urgente) > 🟡 (atencao) > 🔵 (info)
- Badge pulsa vermelho se há alerta 🔴

## Right-Click Context Menu

Em qualquer lugar do Portal, right-click em entidade abre menu:

**Em nome/avatar de idol:** Ver perfil, Ver contrato, Escalar em job, Iniciar dev
**Em logo/nome de agencia rival:** Ver perfil, Comparar
**Em noticia/headline:** Ver artigo completo, Ver idol, Dispensar
**Em mensagem:** Abrir, Marcar lida, Marcar tarefa
**Em job na agenda:** Ver detalhes, Mudar escalação, Ver perfil idol

## States

| Estado | Descricao |
|---|---|
| **Normal** | Portal mostrando estado atual |
| **Pos-Simulacao** | Noticias frescas no carrossel, rankings atualizados |
| **Evento Urgente** | Badge ⚠ pulsa vermelho. Noticia urgente no carrossel |
| **Inicio de Sessao** | Resume desde ultima sessao. Msg de resumo no inbox |
| **Primeira Vez (pos-P01)** | Msg boas-vindas do dono. Rankings com posicao inicial |
| **0 Mensagens** | Painel esquerdo: "Nenhuma mensagem nova" |
| **0 Jobs** | Agenda: "Nenhum job agendado. [Ir ao Job Board →]" |

## Interactions with Other Systems

| Sistema | O que fornece ao Portal |
|---|---|
| **Message Types Catalog** | Mensagens do inbox (120 tipos em 13 categorias) |
| **News Feed** | Noticias para o carrossel |
| **Time/Calendar** | Semana/data, calendario semanal |
| **Job Assignment** | Agenda de jobs, acoes pendentes |
| **Fame & Rankings** | 3 rankings (hits, idols, grupos) |
| **Agency Economy** | Saldo na status bar |
| **Agency Intelligence** | Alertas no badge ⚠ |
| **Week Simulation / Moment Engine** | Atualizacao pos-simulacao |
| **Agency Staff** | Mensagens de delegacao no inbox |
| **Contract System** | Alertas de vencimento, msgs de negociacao |
| **Happiness & Wellness** | Alertas de burnout |
| **Talent Development** | Msgs de avaliacao trimestral |

## Dependencies

**Hard**: News Feed, Message Types Catalog, Fame & Rankings, Time/Calendar
**Soft**: Todos outros sistemas (alimentam mensagens e alertas)
**Depended on by**: Tutorial/Onboarding (primeira sessao)

## Acceptance Criteria

1. Portal carrega em <1s e mostra estado completo sem scroll vertical em 1920×1080
2. Layout 3 colunas (25%/45%/30%) como FM26
3. Mensagens: lista scrollable com avatar remetente + tabs de filtro
4. Noticias: carrossel max 6 com tag, headline, avatar 80×80, auto-rotate 8s
5. Calendario: grid 2 semanas com icones de job, hoje highlighted
6. Agenda: 4-5 proximos jobs com avatar idol, tipo, local, nota previsao
7. Rankings: 3 abas (Hits/Idols/Grupos), top 10, avatars + logos
8. Status bar: logo, saldo, [▶ Continuar], badge alertas [⚠]
9. Click noticia → overlay fullscreen (wireframe 03)
10. Click mensagem → inbox (wireframe 05)
11. Right-click em entidades → context menu
12. Nenhuma informacao critica a mais de 2 cliques

## Open Questions

- Nenhuma pendente
