# Main Menu & Game Flow

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-03
> **Implements Pillar**: (Meta — game shell, não ligado a pilar específico)

## Overview

O Main Menu é o ponto de entrada do jogo. Antes de entrar em qualquer loop
de gameplay, o jogador passa pelo menu principal onde pode iniciar uma nova
campanha, carregar um save existente, ajustar configurações, conectar conta
e escolher idioma. O fluxo de novo jogo inclui criação de personagem (Producer
Profile), seleção de agência, e preparação do mundo antes de entrar no Portal.

Sem este sistema, o jogador cai direto no gameplay sem contexto nem escolha.
Com ele, cada sessão começa com clareza: "o que eu quero fazer agora?"

## Player Fantasy

A fantasia é de **controle total sobre a experiência**. O menu é a sala de
espera antes de entrar no escritório. Dá tempo para o jogador se preparar,
escolher o que fazer, e sentir que está entrando num mundo que ele configurou.

## Detailed Design

### Core Rules

#### 1. Menu Principal (Title Screen)

Ao abrir o jogo, o jogador vê o menu principal com as seguintes opções:

| Opção | Disponibilidade | Ação |
|---|---|---|
| **Continuar** | Se existe autosave | Carrega o save mais recente e vai direto ao Portal |
| **Novo Jogo** | Sempre | Inicia wizard de criação (ver seção 2) |
| **Carregar Jogo** | Se existem saves | Abre lista de slots de save (ver seção 3) |
| **Configurações** | Sempre | Idioma, tema, som, acessibilidade |
| **Conta** | Sempre | Login/logout Supabase (Google/Discord/email) |

**Regras visuais:**
- Fundo: arte temática do jogo (silhueta de palco com luzes)
- Logo "Star Idol Agency" centralizado no topo
- Se não há save, "Continuar" não aparece e "Novo Jogo" é o botão principal
- Idioma selecionável diretamente no menu (bandeiras EN/PT/JA no canto)
- Tema light/dark toggle no canto

#### 2. Fluxo de Novo Jogo (New Game Wizard)

O wizard de novo jogo tem **6 etapas sequenciais** (ver wireframe detalhado:
`docs/design/wireframes/02-new-game-wizard.md` e GDD: `producer-profile.md`):

**Step 1 — Dados Pessoais**
- Nome, sobrenome, pronome de chamamento (default: "[Sobrenome]-san")
- Sexo (masculino/feminino/outro), aniversário (mês + dia)
- Validação: nome e sobrenome 3+ caracteres cada

**Step 2 — Background na Indústria**
- Cidade de origem: dropdown (Tokyo, Osaka, Fukuoka, Nagoya, Sapporo, Okinawa)
- Reputação prévia: 7 opções radio (Prodígio, Ícone, Hitmaker, Especialista,
  Promessa, Veterano, Zero) — cada uma afeta metas iniciais e reputação
- Ver `producer-profile.md` para efeitos mecânicos de cada background

**Step 3 — Estilo de Produção**
- 9 estilos apresentados como cards checkbox: Vocal Maestro, Image Architect,
  Hit Factory, Talent Developer, Variety King, Group Strategist, Digital Pioneer,
  Event Producer, All-Rounder
- Selecionar 1-2 estilos (1 estilo = bônus ×1.5, 2 estilos = bônus normal cada)

**Step 4 — Personalidade**
- 5 traços apresentados como cards: Agressivo, Cauteloso, Visionário, Pragmático,
  Carismático
- Selecionar exatamente 2 traços
- Cada traço afeta interações com idols e mecânicas (ver `producer-profile.md`)

**Step 5 — Seleção de Agência**
- Lista de 5 agências jogáveis (selecionadas do World Pack)
- Cada card mostra: nome, tier, região, orçamento inicial, tamanho do roster, especialidade/foco
- Para MVP: 5 agências fixas com variedade (1 garagem tier, 2 small, 1 medium, 1 nicho)

| Agência Exemplo | Tier | Região | Roster | Orçamento | Especialidade |
|---|---|---|---|---|---|
| Nova Star | Garagem | Tokyo | 2 idols | ¥500K | Generalista |
| Sakura Talent | Small | Osaka | 4 idols | ¥1.5M | Mainstream |
| Hikari Agency | Small | Tokyo | 3 idols | ¥1.2M | Vocal |
| Crescent Moon | Medium | Fukuoka | 5 idols | ¥3M | Variety |
| Echo Studio | Small | Sapporo | 3 idols | ¥1M | Digital-First |

(Nomes e dados reais vêm do World Pack enriquecido por LLM)

**Regras de seleção:**
- Jogador clica numa agência para ver detalhes expandidos (roster, estratégia, dono NPC)
- Ao confirmar, os dados da agência são usados como estado inicial
- As 4 agências não selecionadas + mais do pack viram rivais
- Idols do roster da agência viram `idols[]` do jogador com contratos default

**Step 6 — Confirmação**
- Resumo completo: produtor + agência + efeitos combinados (▲ bônus / ▼ penalidades)
- Mostra roster inicial e orçamento
- Botão "Iniciar Campanha"
- Transição para o Portal (dashboard). Se tutorial ativo: primeira hint aparece

#### 3. Carregar Jogo

Todos os jogadores têm acesso completo aos recursos de save:

- 1 slot de autosave (leitura/escrita)
- 3 slots de save manual
- Cloud sync (requer conta)

**UI de carregamento:**
- Lista de slots com: nome da agência, tier, semana atual, data do save
- Slot vazio mostra "—"
- Se houver conflito local/cloud: modal de resolução (já implementado)

#### 4. Lista de Jogadores (Player Profiles)

Após criar o primeiro personagem, o jogo mostra uma tela de "perfis de jogador":
- Player 1: [nome] — [agência] — Semana [X]
- Botão "Novo Jogador" (desabilitado no MVP, tooltip "Disponível em breve")

**Regras:**
- MVP: apenas 1 jogador (1 save = 1 jogador)
- Futuro: múltiplos jogadores compartilham o mesmo mundo/save
- A lista é o ponto de entrada após o menu — clicar no jogador entra no Portal

#### 5. Configurações (Pre-Game)

Configurações acessíveis no menu principal (antes de entrar no jogo):

| Setting | Opções | Persistência |
|---|---|---|
| Idioma | EN / PT / JA | localStorage |
| Tema | Light / Dark | localStorage |
| Volume | 0-100 (placeholder para futuro áudio) | localStorage |
| Cloud Save | On / Off | localStorage |
| Notificações | On / Off (placeholder) | localStorage |

### States and Transitions

```
MENU_PRINCIPAL
  ├─ CONTINUAR → PORTAL (se autosave)
  ├─ NOVO_JOGO
  │   ├─ STEP_1_DADOS_PESSOAIS
  │   ├─ STEP_2_BACKGROUND
  │   ├─ STEP_3_ESTILO_PRODUCAO
  │   ├─ STEP_4_PERSONALIDADE
  │   ├─ STEP_5_AGENCIA
  │   └─ STEP_6_CONFIRMACAO → PORTAL
  ├─ CARREGAR → LISTA_SLOTS → PORTAL
  ├─ CONFIG → SETTINGS_MODAL
  └─ CONTA → AUTH_FLOW
```

## Dependencies

- **Depende de**: Save/Load System (#13), Producer Profile (#50), i18n, Auth
- **Alimenta**: Todo o jogo (é a porta de entrada)
- **World Pack**: Step 2 usa dados das agências geradas

## UI/UX Implications

- Menu é full-screen, sem nav bar nem time controls (estes só aparecem in-game)
- Usar SvelteKit route groups: `(menu)/` para menu e `(game)/` para gameplay
- Transição menu → jogo: fade ou slide
- Menu deve carregar rápido (sem heavy data loading até o jogador clicar "Novo Jogo")

## Anti-Patterns

- NÃO jogar o jogador direto no gameplay sem contexto
- NÃO forçar login para jogar (conta é opcional para cloud save)
- NÃO bloquear o menu enquanto carrega dados (lazy load)
