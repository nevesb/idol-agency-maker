# Wireframe 52 — Group Chemistry & Formations (Formações por Música)

> **Status**: Draft v2 (FM26 UI Standard — modelo de roles por música)  
> **Referência visual**: FM26 Tactics Screen / Player Roles  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/formations`  
> **GDDs**: stage-formations, show-system, group-management

---

## Conceito

No FM, você escala jogadores com roles diferentes em cada esquema tático. O lateral pode ser Wing Back num esquema e Full Back noutro.
No **Star Idol Agency**, cada música da setlist é um "esquema tático" diferente. A idol que é Center na balada de abertura pode ser Support no hit dance. O jogador monta a **escalação de roles por música**, vê a chemistry do grupo, e recebe sugestões do coreógrafo.

A diferença chave vs o modelo anterior (grid 3×3): na indústria idol real, formações rotacionam dezenas de vezes por música. Posição espacial fixa não faz sentido. O que importa é **quem tem qual papel em cada música**.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira           |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Formações e Química (Ativo) | Setlist | Palco e Figurino | Operações             |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Formações > Celestial Nine (6 membros)                                            |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ (35%) - SETLIST & ROLES ]        | [ COLUNA DIR (65%) - CHEMISTRY & STAFF ]        |
|                                                |                                                 |
| SETLIST DO SHOW (5 músicas)                    | CHEMISTRY DO GRUPO                              |
|                                                |                                                 |
| ┌─ Música 1: "Starlight Melody" (Dance) ─────┐| Sincronia Geral: ████████░░ 76% [Verde]         |
| │ Center:     [Riko ▼]    ★                   ||                                                 |
| │ Main Vocal: [Hana ▼]                        || PARES DE DESTAQUE:                              |
| │ Main Dancer:[Sakura ▼]                      || Sakura ←→ Hana    [████████] 0.85 Amigas       |
| │ Support:    [Yumi ▼] [Moe ▼]               || Sakura ←→ Aiko    [███░░░░░] 0.25 Rivalidade   |
| │ Backing:    [Kaho ▼]                        || Riko ←→ Hana      [██████░░] 0.70 Bom          |
| │ Role Fit:   ████████░░ 82% [Verde]          || Yumi ←→ Moe       [████████] 0.90 Excelente    |
| └─────────────────────────────────────────────┘| Moe ←→ Kaho       [█████░░░] 0.55 Neutro       |
|                                                | Aiko ←→ Kaho      [██████░░] 0.65 Bom          |
| ┌─ Música 2: "Pale Moon" (Ballad) ───────────┐|                                                 |
| │ Center:     [Hana ▼]    ★                   || ⚠ ALERTA: Sakura e Aiko no mesmo grupo.         |
| │ Main Vocal: [Sakura ▼]                      ||   Affinity 0.25 = penalidade -3% no show.       |
| │ Support:    [Riko ▼] [Yumi ▼] [Moe ▼]      ||   Sugestão: escalar Aiko como Backing nas        |
| │ Backing:    [Kaho ▼]                        ||   músicas onde Sakura é Center.                  |
| │ Role Fit:   █████████░ 88% [Verde]          ||                                                 |
| └─────────────────────────────────────────────┘|-------------------------------------------------|
|                                                | AVALIAÇÃO DO COREÓGRAFO                         |
| ┌─ Música 3: "Breaking Point" (Hit) ─────────┐|                                                 |
| │ Center:     [Sakura ▼]  ★                   || 🎭 Tanaka-sensei (Skill: 72)                    |
| │ Main Vocal: [Hana ▼]                        || "A formação da Música 1 está boa, mas troque    |
| │ Main Dancer:[Riko ▼]                        ||  Riko para Main Dancer e Sakura para Support.    |
| │ Support:    [Aiko ▼] [Yumi ▼]              ||  Riko tem Dance 82, melhor fit para abertura."   |
| │ Backing:    [Kaho ▼]                        ||                                                 |
| │ Role Fit:   ████████░░ 85% [Verde]          || [ Aplicar Sugestão ]  [ Ignorar ]               |
| └─────────────────────────────────────────────┘||                                                 |
|                                                || SUGESTÃO GLOBAL:                                |
| ┌─ MC (entre músicas 3 e 4) ─────────────────┐|| "Considere dar Center à Hana na balada —         |
| │ MC:         [Moe ▼] (Comunicação: 78)       ||  Vocal 89 é desperdiçado como Support."          |
| │ Fit:        █████████░ 90%                  ||                                                 |
| └─────────────────────────────────────────────┘|| [ Auto-Assign Todas ] [ Salvar como Preset ]    |
|                                                |                                                 |
| ┌─ Música 4: "Celestial Dance" (Encore) ──────┐|-------------------------------------------------|
| │ Center:     [Sakura ▼]  ★                   || IMPACTO ESTIMADO DA FORMAÇÃO                    |
| │ ...                                          ||                                                 |
| └─────────────────────────────────────────────┘|| Fama estimada por idol neste show:               |
|                                                || Sakura: +45 (Center ×3, Support ×1)             |
| [Preset: Salvar] [Preset: Carregar ▼]         || Hana:   +38 (Center ×1, MainVocal ×3)           |
|                                                || Riko:   +30 (Center ×1, MainDancer ×2)          |
| LEGENDA:                                       || Moe:    +20 (Support ×3, MC ×1)                 |
| ★ = Center   ▼ = Dropdown de seleção          || Kaho:   +12 (Backing ×4)                        |
| Role Fit = adequação média dos roles           || Aiko:   +18 (Support ×3, Backing ×1)            |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Per-Match Tactical Setup
No FM, você ajusta a tática antes de cada jogo. Aqui, cada música é uma "partida" com sua própria escalação. O jogador que otimiza cada música individualmente terá shows melhores.

### 2. Partnership Lines (Chemistry)
As linhas de afinidade entre pares (verde/amarelo/vermelho) vêm do FM. A diferença é que aqui elas afetam o grupo inteiro, não pares posicionais — porque na coreografia idol, todos interagem com todos.

### 3. Backroom Advice
O coreógrafo dá sugestões contextuais como o Assistant Manager do FM. Qualidade da sugestão depende do skill do staff. Botão "Aplicar Sugestão" para resolver em 1 clique.

### 4. Role Fit Score
Como o "suitability" do FM que mostra se um jogador está confortável na posição. Aqui mostra se a idol é adequada para o role naquela música específica.

---

## Interações

- **Dropdown por role**: Cada dropdown mostra TODAS idols do grupo, ordenadas por fit para aquele role naquela música. Cor do nome indica fit (verde >0.8, amarelo 0.4-0.8, vermelho <0.4)
- **Clique em par de chemistry**: Expande detalhes da relação (motivo da afinidade, eventos recentes, tendência)
- **Auto-Assign**: Choreographer atribui roles ótimos para todas músicas. Jogador pode ajustar depois
- **Preset**: Salva configuração atual. Útil para shows recorrentes com mesma setlist
- **Arraste entre músicas**: Arrastar idol de uma música para outra copia o role

---

## Acceptance Criteria

1. Cada música da setlist tem atribuição independente de roles (Center, MainVocal, MainDancer, Support, Backing, MC)
2. Dropdowns por role mostram todas idols do grupo ordenadas por fit
3. Role Fit score (%) visível por música com color coding
4. Chemistry do grupo exibida como score geral + pares individuais com barras coloridas
5. Alertas para pares com afinidade baixa (< 0.3) com sugestão de mitigação
6. Coreógrafo sugere formações com botão "Aplicar Sugestão"
7. Auto-Assign atribui roles para todas músicas em 1 clique
8. Presets salvam/carregam configurações de roles
9. Impacto estimado de fama por idol baseado na soma de roles no show
10. MC entre músicas tem atribuição separada com Comunicação como stat principal
