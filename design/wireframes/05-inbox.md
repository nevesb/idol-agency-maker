# Wireframe 05 — Inbox (Mensagens do Produtor)

> **Status**: Draft
> **Referência**: FM26 Portal > Mensagens (screenshot 2 — lista à esquerda, mensagem aberta à direita)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/portal/mensagens` (src/routes/(game)/portal/mensagens/+page.svelte)
> **Domínio**: Portal (tecla 1) > Mensagens
> **GDD**: ui-dashboard.md (seção Mensagens)

---

## Conceito

O Inbox é o sistema de **mensagens diretas ao produtor** — diferente de Notícias
(artigos do mundo sobre eventos públicos). Mensagens são **comunicações pessoais**:
propostas, relatórios, lembretes, resultados, boas-vindas.

**Mensagens ≠ Notícias:**
- **Mensagens**: dirigidas ao produtor. Remetente identificado. Ação possível.
  Ex: "Proposta de collab da Nova Wave", "Resultado do casting em Osaka"
- **Notícias**: artigos sobre o mundo. Veículo público. Informação passiva.
  Ex: "Tanaka brilha no Budokan", "Crown compra ace da Heartbeat"

**Layout 2 painéis** (como FM26):
- **Esquerda (30%)**: Lista de mensagens com filtros
- **Direita (70%)**: Mensagem aberta com conteúdo + anexos

---

## Layout Completo (1920×1080)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [★ LOGO 32] Portal▾ | Roster | Mercado | Operações | Agência | Produtor         │
│                  [Sem 45 / Ano 3 / Nov]            [🔍 Ctrl+K] [📑 BM]          │
│   Visão Geral   Mensagens   Calendário   Site de Notícias   Relatórios           │
│                  ─────────                                                        │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Portal > Mensagens                                                               │
│                                                                                   │
│ ┌─ LISTA (30%) ─────────────┐ ┌─ MENSAGEM ABERTA (70%) ─────────────────────────┐│
│ │                            │ │                                                  ││
│ │ [Tudo][Novo][Tarefas(4)]   │ │  [AVT Remetente 40] Nome do Remetente           ││
│ │ [Por Ler(9)] [☆][🔍][✓]   │ │  Título da Mensagem                             ││
│ │ [...]                      │ │                                                  ││
│ │                            │ │  Corpo da mensagem com texto completo.           ││
│ │ ─── Seg 9 de Dez ───      │ │  Pode ter múltiplos parágrafos...                ││
│ │                            │ │                                                  ││
│ │ [AVT 24] Remetente   08:55│ │  ─────────────────────────────────               ││
│ │ Título mensagem       🟢  │ │                                                  ││
│ │                            │ │  Anexos                                          ││
│ │ [AVT 24] Remetente   08:35│ │  ┌──────────────┐ ┌──────────────┐              ││
│ │ Título mensagem       🟢  │ │  │ Perfil Agência│ │ Histórico    │              ││
│ │                            │ │  │ [LOGO 48]     │ │ do Clube     │              ││
│ │ [AVT 24] Remetente   08:27│ │  │ Nome          │ │ Títulos: 4   │              ││
│ │ Título mensagem       🟢  │ │  │ Região: Tokyo │ │ Melhor: #1   │              ││
│ │                            │ │  └──────────────┘ └──────────────┘              ││
│ │ [AVT 24] Remetente   08:24│ │                                                  ││
│ │ Título mensagem       🟡  │ │  [Responder]  [Marcar Tarefa]  [Dispensar]       ││
│ │                            │ │                                                  ││
│ │ [AVT 24] Remetente   08:19│ │                                                  ││
│ │ Título mensagem       🟢  │ │                                                  ││
│ │                            │ │                                                  ││
│ │ ... (scroll)               │ │                                                  ││
│ │                            │ │                                                  ││
│ │ ▓▓▓▓▓▓░░░ (scrollbar)     │ │                                                  ││
│ └────────────────────────────┘ └──────────────────────────────────────────────────┘│
│                                                                                   │
│ ┌── STATUS BAR ──────────────────────────────────────────────────────────────────┐│
│ │ [LOGO 20] Nova Star Agency  │  Saldo: ¥12.8M  │  [▶ Continuar]  [⚠ 3]       ││
│ └────────────────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## Painel Esquerdo — Lista de Mensagens (30%)

### Tabs de Filtro

```
[Tudo] [Novo] [Tarefas (4)] [Por Ler (9)] [☆] [🔍] [✓] [...]
```

Mesmas tabs do preview no Portal (wireframe 04), mas aqui com funcionalidade completa:

| Tab | Função |
|---|---|
| **Tudo** | Todas mensagens, ordem cronológica inversa (default) |
| **Novo** | Apenas não lidas. Badge desaparece quando todas lidas |
| **Tarefas** | Mensagens marcadas como tarefa pelo jogador. Badge com contagem |
| **Por Ler** | Mensagens bookmarked para leitura posterior. Badge com contagem |
| **☆** | Favoritas / marcadas com estrela |
| **🔍** | Abre campo de busca textual. Filtra em tempo real |
| **✓** | Marcar todas como lidas (com confirmação) |
| **...** | Menu: "Excluir todas lidas", "Configurar notificações" |

### Item de Mensagem na Lista

```
┌──────────────────────────────────────┐
│ [AVT 24] André Marconatto      08:01│
│ 🟢 Bem-vindo ao Guarani FC!    ✓✓   │
│                                      │
├──────────────────────────────────────┤
│ [AVT 24] Leandro Uffermann    08:55│
│ 🟢 Regras de Seleção do Plantel     │
│                                ●     │
├──────────────────────────────────────┤
```

| Elemento | Regra |
|---|---|
| **Avatar** | 24×24 circular. Staff → avatar do staff. Agência → logo. Sistema → ícone |
| **Nome remetente** | Bold se não lida, regular se lida |
| **Hora** | HH:MM se hoje, "Ontem", "DD/MM" se mais antigo |
| **Prioridade** | 🔴 Urgente, 🟡 Importante, 🟢 Normal, 🔵 Info |
| **Título** | 1 linha, truncado. Bold se não lida |
| **Status leitura** | ✓ enviada, ✓✓ lida (como WhatsApp) |
| **● indicador** | Dot azul = não lida |
| **Selecionada** | Background highlight (accent mais claro) |

### Agrupamento

Mensagens agrupadas por data com separador visual:
```
─── Seg 9 de Dez ───
[msg] [msg] [msg]
─── Dom 8 de Dez ───
[msg] [msg]
```

### Interações da Lista

- **Click**: seleciona mensagem → abre no painel direito
- **Right-click**: menu contextual (Marcar como lida, Tarefa, Favorita, Excluir)
- **Scroll**: infinito com lazy loading
- **Keyboard**: ↑/↓ navega entre mensagens, Enter abre, Delete exclui

---

## Painel Direito — Mensagem Aberta (70%)

### Header da Mensagem

```
┌──────────────────────────────────────────────────────────────────┐
│ [AVT Remetente 40] André Marconatto                              │
│ Bem-vindo ao Guarani FC!                                         │
│                                                          08:01   │
└──────────────────────────────────────────────────────────────────┘
```

| Elemento | Regra |
|---|---|
| **Avatar remetente** | 40×40 circular. Maior que na lista |
| **Nome** | Bold, texto grande |
| **Título** | Texto médio, cor accent |
| **Hora/data** | Canto direito |

### Corpo da Mensagem

Texto livre com formatação básica (bold, listas, links internos).
Cada **tipo de mensagem** tem layout específico (ver catálogo abaixo).

### Anexos (Tipo-Específicos)

> **Referência FM26**: Na screenshot 2, a mensagem "Bem-vindo" tem "Anexos"
> com cards: "Perfil do clube" (logo, dados), "Estádio principal",
> "Histórico do Clube", "Infra-estruturas", "Orçamentos de Recrut."

Anexos são **cards interativos** abaixo do corpo:

```
Anexos
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Perfil da Agência│ │ Histórico        │ │ Orçamento        │
│ [LOGO 48]        │ │ 🏆 Títulos: 2    │ │ Transferências   │
│ Nova Star Agency │ │ Melhor pos: #3   │ │ ¥5M              │
│ 📍 Tokyo         │ │ Fundada: 2020    │ │ Salários: ¥8M/m  │
│ Tier: B          │ │                  │ │ Obs: ¥12M        │
│ [Ver Perfil →]   │ │ [Ver Hist →]     │ │ [Ver Finanças →] │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

| Tipo de anexo | Visual | Click |
|---|---|---|
| **Perfil da Agência** | Logo 48 + nome + região + tier | → tela Agência |
| **Perfil de Idol** | Avatar 48 + nome + tier + stats resumo | → perfil da idol |
| **Relatório** | Ícone + título + preview 1 linha | → tela de relatório |
| **Job** | Ícone tipo + nome + reqs resumo | → detalhes do job |
| **Contrato** | 📝 + idol + valor + prazo | → tela de contrato |
| **Ranking** | 🏆 + posição + variação | → tela de rankings |
| **Histórico** | 📊 + métricas resumidas | → tela detalhada |
| **Finanças** | 💰 + resumo orçamentário | → tela financeira |

### Botões de Ação

```
[Responder]  [Marcar Tarefa]  [☆ Favorita]  [Dispensar]
```

| Botão | Função |
|---|---|
| **Responder** | Só em mensagens que permitem resposta (propostas, negociações) |
| **Marcar Tarefa** | Adiciona à tab "Tarefas". Badge atualiza |
| **☆ Favorita** | Adiciona à tab "☆" |
| **Dispensar** | Move para "Lidas", remove da lista "Novo" |

---

---

## Estados do Inbox

| Estado | O que muda |
|---|---|
| **Normal** | Lista com mensagens, última selecionada aberta à direita |
| **Sem mensagens** | "Nenhuma mensagem nova. Volte após a próxima semana." |
| **Msg não lida selecionada** | Marca como lida automaticamente ao abrir no painel direito |
| **Busca ativa** | Campo de busca no topo da lista, filtro em tempo real |
| **Primeira sessão** | Mensagem de boas-vindas do dono no topo, já aberta à direita (como FM26) |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Portal (click msg) | Inbox com msg aberta | Slide right → msg selecionada |
| Portal (submenu "Mensagens") | Inbox (última msg ou primeira não lida) | Slide right |
| Click em anexo | Tela destino (perfil, finanças, etc.) | Slide right |
| Click em [Responder] | Modal de resposta (inline) | Slide down |
| Esc / Breadcrumb "Portal" | Volta ao Portal | Slide left |

---

## Diferenças do FM26

| FM26 | Star Idol Agency | Motivo |
|---|---|---|
| Mensagens de staff do clube | Mensagens de **staff, dono, sistema, rivais** | Mais fontes no jogo |
| Anexos com perfil do clube/estádio | Anexos com **perfil agência, idols, jobs, contratos** | Domínio diferente |
| Sem avatar grande na mensagem | **Avatar 40×40** do remetente no header | Design Principle #6 |
| Mesmos layouts para todos os tipos | **Layout diferente por tipo** de mensagem | Personalidade |

---

## Assets Necessários

| Asset | Formato | Tamanhos | Uso |
|---|---|---|---|
| Avatars de remetentes (staff, NPCs) | WebP | 24, 40 | Lista e header |
| Logos de agências | SVG | 24, 48 | Lista (rival) e anexos |
| Avatars de idols | WebP | 48 | Anexos de perfil |
| Ícones de tipo de mensagem | SVG | 16 | Diferenciação visual |
| Ícones de prioridade | SVG | 12 | 🔴🟡🟢🔵 |
| Ícones de anexo | SVG | 24 | Tipos de card de anexo |

---

## Acceptance Criteria

1. Layout 2 painéis (30% lista / 70% mensagem) sem scroll em 1920×1080
2. Lista com tabs de filtro funcionais: Tudo, Novo, Tarefas, Por Ler, ☆, 🔍
3. Mensagens agrupadas por data com separador visual
4. Avatar do remetente (24×24 na lista, 40×40 no header) presente em toda mensagem
5. Click na mensagem abre no painel direito com corpo + anexos
6. Anexos como cards interativos clicáveis que navegam para telas detalhadas
7. Botões de ação: Responder (quando aplicável), Marcar Tarefa, Favorita, Dispensar
8. Right-click na lista abre context menu
9. Keyboard navigation: ↑/↓ entre mensagens, Enter abre, Delete exclui
10. Primeira sessão: mensagem de boas-vindas do dono aberta automaticamente
11. Layout diferente por tipo de mensagem (definido no catálogo de tipos)
12. Status bar global com [▶ Continuar] e badge de alertas
