# Gap Analysis — Wireframes vs GDD (Reavaliação Final)

> **Data**: 2026-04-06
> **Método**: Leitura completa dos 72 wireframes + 56 GDDs, cruzamento de cobertura, verificação direta de cada gap.
> **Nota**: Wireframe 73 (Music Production Pipeline) foi descoberto durante a verificação — não constava no inventário original.

---

## Status Legend

- **CONFIRMADO** — Gap verificado diretamente nos arquivos
- **FALSO POSITIVO** — Gap descartado após verificação
- **PARCIAL** — Existe cobertura, mas incompleta
- **INCONSISTÊNCIA** — Conflito entre documentos

---

## 1. GDDs sem Wireframe

| # | Sistema | Status | Detalhe | Ação |
|---|---|---|---|---|
| G1 | **Settings & Accessibility** | CONFIRMADO | `settings-accessibility.md` lista features (colorblind, font size, etc.) mas sem layout de tela | Criar wireframe `74-settings.md` |
| G2 | **Tutorial/Onboarding** | CONFIRMADO | `tutorial-onboarding.md` define princípios (contextual, skipable) mas sem visual de tooltips/highlights | Criar wireframe `75-tutorial-tooltips.md` |
| G3 | **Award Shows** | CONFIRMADO | Apenas Kouhaku mencionado como evento especial em `media-entities.md`. Nenhum sistema de premiação | Criar GDD `award-shows.md` + wireframe |
| G4 | **Rival Agency Profile** | CONFIRMADO | `rival-agency-ai.md` menciona "Perfil da rival" como visível, mas sem wireframe | Criar wireframe `76-rival-agency-profile.md` |
| G5 | **Post-Debut Career UI** | FALSO POSITIVO | `post-debut-career.md` confirma que ex-idols são **autônomas** — sistema é passivo. Aparecem no ecosystem como NPCs gerando jobs. Player só aceita/rejeita jobs de programas de ex-idols | Nenhuma ação (by design) |
| G6 | **Save/Load Detalhado** | PARCIAL | `save-load.md` define cloud sync e export que vão além do wireframe 01. Mas o fluxo principal está coberto | Considerar expandir wireframe 01 com cloud sync |

---

## 2. Wireframes sem GDD formal (mecânicas não definidas)

| # | Wireframe | Status | O que falta | Prioridade | Ação |
|---|---|---|---|---|---|
| W1 | **51 — Costume & Stage** | CONFIRMADO | Nenhum GDD define: aquisição de figurinos, inventário, custo, buff de carisma/comfort, troca mid-show | Alta | Criar GDD `costume-wardrobe.md` |
| W2 | **52 — Group Chemistry & Formations** | CONFIRMADO | `show-system.md` define roles por música (Center ×1.2, Main Vocal ×1.1), mas NÃO define grid posicional 3×3, bônus/penalidade por posição espacial | Média | Decidir: grid 3×3 é feature real ou simplificar para roles-only? Se real, criar GDD `stage-formations.md` |
| W3 | **54 — Pre-Show Briefing** | CONFIRMADO | ZERO GDD para team talk. Nenhum documento define: seleção de tom, efeitos psicológicos, reações individuais, side talks | Alta | Criar GDD `pre-show-briefing.md` |
| W4 | **56 — Mid-Show Adjustments** | PARCIAL | `show-system.md` cobre remoção forçada por burnout, mas NÃO cobre substituição iniciada pelo jogador, elegibilidade de substitutos, penalidades | Média | Expandir `show-system.md` com seção de substituição mid-show |
| W5 | **64 — Medical Audit** | CONFIRMADO | `happiness-wellness.md` tem barra de Saúde Física mas NÃO define: tipos de lesão, timelines de recuperação, fisioterapeuta, centro médico como facility | Média | Criar GDD `medical-system.md` ou expandir `happiness-wellness.md` |
| W6 | **66 — Merch & Sales** | CONFIRMADO | `fan-club-system.md` e `agency-economy.md` definem fórmulas de RECEITA de merch, mas NÃO definem: pipeline de produção, tiragem, estoque, photoshoots, encomendas | Média | Criar GDD `merchandising-production.md` |
| W7 | **68 — Conversation Modal** | CONFIRMADO | ZERO GDD para sistema de diálogo direto com idols. Nenhum documento define: tópicos, tom, árvore de resposta, impacto por personalidade | Alta | Criar GDD `dialogue-system.md` |

---

## 3. Gap CRÍTICO: Music Production Pipeline

### Descoberta: Wireframe 73 existe!

O wireframe `73-music-production-pipeline.md` foi encontrado durante a verificação. Ele define:
- Kanban 4 estágios: COMPOSIÇÃO → ARRANJO → COREOGRAFIA → GRAVAÇÃO
- Cards de projeto com duração por estágio
- Lista de compositores disponíveis
- Botão "Contratar Compositor Externo"
- Arquivo de músicas lançadas

### O que FALTA (confirmado):

| Componente | Status | Detalhe |
|---|---|---|
| **GDD music-production.md** | CRÍTICO — NÃO EXISTE | Wireframe 73 referencia este GDD mas ele não foi criado |
| **Composer Hiring Flow** | PARCIAL | `music-charts.md` diz "jogador escolhe compositor do pool" mas sem UX de browse/filter/hire |
| **Recording Session Mechanics** | PARCIAL | `job-assignment.md` lista "Gravação" como job type (Vocal + Dança, 1-4 semanas) mas sem conexão com o pipeline Kanban do wireframe 73 |
| **Album Assembly** | NÃO EXISTE | Nenhum GDD define como agrupar músicas em álbum, escolher faixas, ordenar |
| **Release Flow** | NÃO EXISTE | Nenhum GDD define: escolha de data, campanha de marketing, mídia física, pre-release |
| **Physical Media Production** | PARCIAL | `music-charts.md` define custos/preços de CD/vinil mas sem pipeline de decisão (tiragem, gráfica, inventory) |

### Ação necessária:
1. **Criar GDD `music-production.md`** cobrindo: pipeline composição→gravação, hire de compositor, álbum assembly, release flow
2. **Expandir `music-charts.md`** com mecânicas de lançamento (data, marketing, sazonalidade como decisão do jogador)
3. **Expandir wireframe 73** ou criar wireframes adicionais para: composer selection modal, release planning, album assembly

---

## 4. INCONSISTÊNCIA: 16 vs 12 Atributos

### Detecção

| Documento | Atributos Visíveis | Lista |
|---|---|---|
| `idol-attribute-stats.md` | **16** (4 categorias × 4) | Vocal, Dança, Atuação, Variedade, Visual, Carisma, Comunicação, Aura, Resistência, Disciplina, Mentalidade, **Foco**, **Leitura de Palco**, **Criatividade**, **Aprendizado**, **Trabalho em Equipe** |
| `idol-database-generator.md` | **12** | Vocal, Dance, Acting, Variety, Visual, Charisma, Communication, Aura, Stamina, Discipline, Mentality, **Adaptability** |

### Análise

- **Generator tem "Adaptability"** — não existe no sistema de 16 atributos
- **Generator falta**: Foco, Leitura de Palco, Criatividade, Aprendizado, Trabalho em Equipe (toda a categoria "Inteligência")
- **Archetypes (`idol-archetypes-roles.md`) referencia "Adaptabilidade"** como atributo visível (Digital Native: "Adaptabilidade > 14"), alinhando com o Generator mas divergindo do Stats System
- **Diagnóstico**: `idol-attribute-stats.md` foi atualizado para 16 atributos (v2), mas `idol-database-generator.md` e `idol-archetypes-roles.md` ainda usam o modelo anterior de 12

### Ação necessária:
1. **Decidir**: manter 16 (Stats System) ou reverter para 12 (Generator)?
2. Se 16: **atualizar** `idol-database-generator.md` (adicionar 4 atributos de Inteligência, remover Adaptability)
3. Se 16: **atualizar** `idol-archetypes-roles.md` (recalcular requirements usando novos atributos)
4. Se 12: **reverter** `idol-attribute-stats.md`

### Recomendação:
**Manter 16** — a categoria Inteligência (Leitura de Palco, Criatividade, Aprendizado, Trabalho em Equipe) é referenciada extensivamente nos wireframes e dá profundidade à simulação. "Adaptability" pode ser renomeada para "Aprendizado" que cobre o mesmo conceito.

---

## 5. DIVERGÊNCIA: New Game Wizard (4 steps GDD vs 6 steps wireframe)

### Comparação

| Step | GDD (`main-menu-flow.md`) | Wireframe (`02-new-game-wizard.md`) |
|---|---|---|
| 1 | Criação do Produtor (nome + sexo + aniversário + 2 traços — tudo junto) | Dados Pessoais (nome + sobrenome + pronome + sexo + aniversário) |
| 2 | Seleção de Agência | Background (cidade de origem + reputação prévia) |
| 3 | Confirmação | Estilo de Produção (1-2 de 9 estilos) |
| 4 | Entrada no Jogo | Personalidade (2 de 5 traços) |
| — | — | Seleção de Agência |
| — | — | Confirmação + Entrada |

### Diagnóstico
- `producer-profile.md` (linha 267) **referencia explicitamente o wireframe de 6 steps** como fonte de verdade
- `main-menu-flow.md` está **desatualizado** — usa modelo simplificado de 4 steps
- Wireframe é mais detalhado e implementável

### Ação necessária:
- **Atualizar `main-menu-flow.md`** Seção 2 para referenciar o modelo de 6 steps do wireframe

---

## 6. Outros Gaps Confirmados (menores)

| # | Gap | Detalhe | Ação |
|---|---|---|---|
| M1 | **Fan Club UI** | `fan-club-system.md` define mecânicas completas mas sem tela de gestão. Fans são passivos por design, mas falta dashboard de visualização | Considerar: wireframe de dashboard read-only (tamanho, mood, segmentos, tendências) |
| M2 | **Oricon Music Charts UI** | Wireframe 62 foca em rankings de agência/idol. Falta view dedicada do Oricon (top 100 singles/albums, semanas no chart, vendas) | Expandir wireframe 62 ou criar sub-view |
| M3 | **Graduation Ceremony** | `idol-lifecycle.md` menciona graduação como evento mas sem mecânicas de planejamento da cerimônia | Expandir `idol-lifecycle.md` ou `player-created-events.md` |
| M4 | **Idol Repertoire in Profile** | Wireframe 08 (Idol Profile) não mostra tab de repertório/mastery por música. `setlist-system.md` define mastery 0-100 por idol×música | Adicionar tab "Repertório" ao wireframe 08 |
| M5 | **Vocal Profile no Wireframe** | `music-entities.md` define Vocal Profile Hybrid (tessitura, texture, vocal role) por idol. Não aparece em nenhum wireframe | Adicionar ao wireframe 08 (tab Stats ou Overview) |
| M6 | **Composer Contracts** | `contract-system.md` define contratos transacionais com compositores. Wireframe 37 foca só contratos de idols | Expandir wireframe 37 ou criar sub-view |
| M7 | **Streaming ao Vivo UI** | `music-charts.md` menciona streaming como canal de marketing/job. Sem wireframe detalhado | Avaliar se é job normal no board ou precisa de tela |
| M8 | **Endorsement longo prazo** | `job-assignment.md` lista endorsement como "1 day - 6 months". Sem clareza se são contratos multi-mês com cláusulas | Clarificar em `job-assignment.md` |

---

## 7. Resumo de Ações

### GDDs para CRIAR (novos)

| # | Arquivo | Prioridade | Motivo |
|---|---|---|---|
| 1 | `music-production.md` | **CRÍTICA** | Wireframe 73 referencia, core do game loop |
| 2 | `costume-wardrobe.md` | Alta | Wireframe 51 define UI sem mecânicas |
| 3 | `pre-show-briefing.md` | Alta | Wireframe 54 define FM26-style team talk sem GDD |
| 4 | `dialogue-system.md` | Alta | Wireframe 68 define conversa direta sem mecânicas |
| 5 | `award-shows.md` | Média | Premiações mencionadas mas sem sistema |
| 6 | `merchandising-production.md` | Média | Wireframe 66 define produção sem mecânicas |
| 7 | `medical-system.md` | Média | Wireframe 64 define centro médico sem mecânicas |
| 8 | `stage-formations.md` | Baixa | Wireframe 52 mostra grid 3×3 — avaliar se é feature real |

### GDDs para ATUALIZAR

| # | Arquivo | Mudança |
|---|---|---|
| 1 | `idol-database-generator.md` | Migrar de 12 para 16 atributos, remover Adaptability, adicionar Foco/Leitura de Palco/Criatividade/Aprendizado/Trabalho em Equipe |
| 2 | `idol-archetypes-roles.md` | Recalcular archetype requirements com 16 atributos |
| 3 | `main-menu-flow.md` | Atualizar Seção 2 para modelo de 6 steps (referenciar wireframe 02) |
| 4 | `show-system.md` | Adicionar seção de substituição mid-show (regras, elegibilidade, penalidades) |
| 5 | `music-charts.md` | Expandir com mecânicas de lançamento (release date, marketing campaign) |
| 6 | `idol-lifecycle.md` | Expandir com mecânicas de cerimônia de graduação |

### Wireframes para CRIAR

| # | Arquivo | Prioridade |
|---|---|---|
| 1 | `74-settings.md` | Média |
| 2 | `75-tutorial-tooltips.md` | Baixa |
| 3 | `76-rival-agency-profile.md` | Média |
| 4 | `77-composer-selection.md` | Alta (complementa wireframe 73) |
| 5 | `78-release-planning.md` | Alta (complementa wireframe 73) |
| 6 | `79-award-ceremony.md` | Média |

### Wireframes para ATUALIZAR

| # | Arquivo | Mudança |
|---|---|---|
| 1 | `08-idol-profile.md` | Adicionar tab Repertório (mastery) + Vocal Profile Hybrid |
| 2 | `62-world-rankings.md` | Expandir com view dedicada de Oricon Charts |
| 3 | `37-market-contracts.md` | Adicionar seção de contratos com compositores |

---

## 8. Bases de Dados — Atualização

### Descobertas da reavaliação que impactam o modelo de dados:

1. **Tabela `idol_attributes`**: Precisa ter **16 campos** (não 12) — resolver inconsistência primeiro
2. **Tabela `music_production_pipeline`**: NOVA — projetos em 4 estágios (Composição→Arranjo→Coreografia→Gravação) com status e assignees
3. **Tabela `costumes`**: NOVA — inventário de figurinos com tema, custo, buff, conforto
4. **Tabela `stage_formations`**: Condicional — só se decidir implementar grid 3×3
5. **Tabela `team_talks`**: NOVA — histórico de briefings pré-show com tom e efeitos
6. **Tabela `dialogue_history`**: NOVA — conversas diretas com idols (expandir ou separar de `interaction_history`)
7. **Tabela `merch_inventory`**: NOVA — se implementar pipeline de produção de merch
8. **Tabela `medical_records`**: NOVA — se implementar sistema médico (tipos de lesão, recovery)
9. **Tabela `award_nominations`**: NOVA — se implementar sistema de premiações

### Total estimado: **~55-65 tabelas** (vs 56 estimadas anteriormente)

---

## 9. Conclusão

### O que está BEM:
- **90%+ dos GDDs têm cobertura de wireframe** — excelente alinhamento
- **Os wireframes são mais detalhados que os GDDs** em muitos casos — boa base para implementação
- **Sistemas core** (stats, contracts, economy, scouting, shows, fame, fan clubs, news) estão **sólidos e coerentes**
- **Fórmulas e tuning knobs** estão bem documentados na maioria dos GDDs

### O que precisa de atenção:
- **1 gap CRÍTICO**: Music Production Pipeline (GDD referenciado não existe)
- **1 inconsistência GRAVE**: 16 vs 12 atributos (resolve antes de implementar)
- **1 divergência**: Wizard 4 vs 6 steps (fácil de resolver)
- **7 wireframes sem GDD** formal de mecânicas
- **6 GDDs sem wireframe** (3 confirmados necessários)
- **8 gaps menores** de completude
