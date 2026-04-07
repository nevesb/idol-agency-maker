# Wireframe 73 — Music Production Pipeline (Estúdio Musical)

> **Status**: Draft v2 (Post-Feedback)  
> **Referência visual**: FM26 Staff Assignment + Youth Development Pipeline + Project Management  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/studio/pipeline`  
> **GDD**: GDD-music-production.md

---

## Conceito

O **Estúdio Musical** é o coração criativo da agência. Aqui você transforma ideias em hits, gerencia compositores (NPCs e Idols promovidas), coreógrafos, e acompanha o progresso de cada música desde o conceito até o lançamento. Inspirado no sistema de Youth Development do FM26, mas com múltiplos profissionais trabalhando em paralelo em diferentes projetos.

---

## Estrutura da Tela (Layout FM26)

```text
+--------------------------------------------------------------------------------------------------+
| [Logo] < > Portal | Plantel | Recrutamento | ESTÚDIO (Ativo) | Dia de Show | Clube | Carreira    |
|--------------------------------------------------------------------------------------------------|
| Visão Geral | Pipeline de Músicas | Compositores | Arquivo | Covers                          |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| [ PAINEL SUPERIOR - RESUMO DO ESTÚDIO ]                                                        |
| Projetos Ativos: 4 │ Músicas em Gravação: 2 │ Compositores Disponíveis: 3 │ Orçamento: ¥5M      |
| Alerta: ⏸️ "Starlight Melody" parada - Aguardando Coreógrafo                                    |
|--------------------------------------------------------------------------------------------------|
|                                                                                                  |
| [ COLUNA ESQ - PROJETOS ATIVOS ]        │ [ COLUNA CENTRO - KANBAN DO PIPELINE ]                 │
|                                         │                                                          │
│ FILTROS: [Todas][Em Andamento][Paradas] │ ┌────────────────────────────────────────────────────┐ │
│                                         │ │ KANBAN DO PIPELINE MUSICAL                         │ │
│ ● "Neon Dreams"                         │ │                                                    │ │
│   Estágio: COMPOSIÇÃO 75%               │ │ [COMPOSIÇÃO]  [ARRANJO]   [COREO.]  [GRAVAÇÃO]   │ │
│   Compositor: Sakura ⭐                 │ │                                                    │ │
│   ⏱️ 12 dias restantes                  │ │ ┌─────────┐   ┌─────────┐   ┌─────┐   ┌─────────┐ │ │
│                                         │ │ │●Neon    │ → │ [Vazio] │ → │[Agd]│ → │ [Vazio] │ │ │
│ ● "Rainy Days" ⚠️ STALLED               │ │ │ Dreams  │   │         │   │     │   │         │ │ │
│   ⏸️ PARADA: Falta Coreógrafo           │ │ │Sakura ⭐ │   │         │   │ Agd │   │         │ │ │
│   [Contratar Coreógrafo →]              │ │ └─────────┘   └─────────┘   └─────┘   └─────────┘ │ │
│                                         │ │                                                    │ │
│ ● "Celestial Dance"                     │ │ ┌─────────┐   ┌─────────┐   ┌─────┐   ┌─────────┐ │ │
│   Estágio: GRAVAÇÃO                     │ │ │Rainy    │ → │ [Vazio] │ → │[Vazio]→│ [Vazio] │ │ │
│   Progresso: 40% │ 3 idols gravando      │ │ │ Days ⚠️ │   │         │   │ ⚠️  │   │         │ │ │
│                                         │ │ │Takeda   │   │         │   │Stl  │   │         │ │ │
│ [ + Nova Música ]                       │ │ └─────────┘   └─────────┘   └─────┘   └─────────┘ │ │
│                                         │ │                                                    │ │
│-----------------------------------------│ │ DETALHE DO CARD SELECIONADO:                       │ │
│                                         │ │                                                    │ │
│ COMPOSITORES DISPONÍVEIS                │ │ ┌────────────────────────────────────────────┐     │ │
│                                         │ │ │ "Neon Dreams" - COMPOSIÇÃO (75%)           │     │ │
│ NPCs: [ 3 disponíveis ]                 │ │ │                                            │     │ │
│ ├─ Takeda Yamamoto  │ Skill 16          │ │ │ Compositor: Sakura ⭐ (Idol/Compositora)  │     │ │
│ ├─ Yuki Sato        │ Skill 14 ⚡       │ │ │ └─ Talento: 14 │ Experiência: 3 músicas    │     │ │
│ └─ [Ver Todos →]    │                   │ │ │ └─ Velocidade: +20% (Amiga do Grupo)       │     │ │
│                                         │ │ │                                            │     │ │
│ IDOLS PROMOVIDAS:                       │ │ │ Letrista: NPC - Hikaru │ Skill 12            │     │ │
│ ├─ Sakura ⭐ Comp/Let                  │ │ │                                            │     │ │
│ ├─ Yumi ⭐ Coreografa                  │ │ │ Progresso: ████████░░ 75%                  │     │ │
│ └─ [Promover Nova →]                   │ │ │ Estimado: 4 dias para completar            │     │ │
│                                        │ │ │                                            │     │ │
│ [Contratar Compositor Externo →]       │ │ │ [⏸️ Pausar] [✓ Finalizar Etapa] [🗑️ Cancelar]│    │ │
│                                        │ │ └────────────────────────────────────────────┘     │ │
│----------------------------------------│ └────────────────────────────────────────────────────┘ │
│                                        │                                                          │
│ ARQUIVO & HISTÓRICO                   │                                                          │
│ ├─ Lançadas (12)                      │                                                          │
│ ├─ Em Hiato (2)                       │                                                          │
│ ├─ Rejeitadas (1)                     │                                                          │
│ └─ [Ver Arquivo Completo →]          │                                                          │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Componentes Detalhados

### 1. Kanban do Pipeline (Coluna Centro)

Visual em 4 estágios horizontais:

| Estágio | Descrição | Duração Típica | Pode ser Stall? |
|---------|-----------|----------------|-----------------|
| **COMPOSIÇÃO** | Melodia + Letra + Arranjo inicial | 10-20 dias | Sim - Falta Compositor |
| **ARRANJO** | Instrumentação final | 5-10 dias | Sim - Falta Arranjador |
| **COREOGRAFIA** | Dança da música | 7-15 dias | Sim - Falta Coreógrafo |
| **GRAVAÇÃO** | Idols gravam voz | 5-10 dias | Não - Mas pode ter qualidade baixa |

**Cores de Status:**
- 🟢 Verde: Em andamento normal
- 🟡 Amarelo: Retrasado (ultrapassou estimativa)
- 🔴 Vermelho: PARADO (Stalled) - precisa de ação
- ⏸️ Ícone de Pausa: Aguardando recurso

### 2. Card de Projeto

```
┌─────────────────────┐
│ ● Neon Dreams       │ ← Título
│   [Badge: Dance]    │ ← Conceito/Estilo
│                       │
│ Compositor:         │
│ Sakura ⭐            │ ← ⭐ = Idol promovida
│   Talento 14        │
│   [Foto 32x32]      │
│                       │
│ ████████░░ 75%      │ ← Barra de progresso
│ ⏱️ 4 dias rest.     │ ← Estimativa
│                       │
│ Relacionamento:     │
│ Yumi ❤️ Amiga        │ ← Bônus por amizade
└─────────────────────┘
```

### 3. Stalled State (Parada no Pipeline)

Quando um projeto fica parado:

```
┌─────────────────────┐
│ ⚠️ Rainy Days       │
│ ⏸️ PARADA            │ ← Destaque vermelho
│                       │
│ Motivo:             │
│ Falta Coreógrafo    │
│ há 5 dias           │
│                       │
│ [A