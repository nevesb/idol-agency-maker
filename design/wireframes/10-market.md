# Wireframe 10 — Market (Hub de Recrutamento)

> **Status**: Draft
> **Referência visual**: FM26 Recruitment Hub + Player Database + TransferRoom
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/market` (hub) · `/market/database` · `/market/scouting` · `/market/activity` · `/market/shortlists` · `/market/budgets`
> **GDDs**: market-transfer, scouting-recruitment, contract-system, ui-contract-negotiation, agency-economy, idol-archetypes-roles, fame-rankings

---

## Conceito

Hub centralizado de recrutamento — o equivalente ao Recruitment Hub + Player
Database + TransferRoom do FM26, adaptado ao mundo idol. O jogador descobre,
avalia, negocia e contrata idols a partir desta tela. Ao contrário do FM26,
**não existem janelas de transferência** — o mercado está aberto o ano todo
(decisão do GDD: casual-friendly). A tensão vem da **competição com 50
agências IA**, não de deadlines artificiais.

**Inspiração FM26 adaptada**:

| FM26 | Star Idol Agency | Adaptação |
|---|---|---|
| TransferRoom Requirements | **Talent Board (Buscar)** | Publicar necessidades do roster; agências/idols respondem |
| TransferRoom Pitch Opportunities | **Vitrine (Oferecer)** | Ver o que rivais procuram; oferecer idols excedentes |
| Player Database | **Banco de Idols** | Pool com visibilidade parcial (depende de scouting) |
| Scouted Players Only toggle | **Filtro "Somente Scoutadas"** | Mesma mecânica: toggle filtra vs. mostra todas |
| Recruitment Budgets | **Orçamentos** | Transfer + Salários + Scouting (slider como FM26) |
| Player Recommendations | **Recomendações** | Staff + Scout sugerem idols baseado em lacunas |
| Shortlists | **Shortlists** | Listas customizadas de alvos |
| Squad Planner | **Roster Balance** | Análise de lacunas por arquétipo/skill (link) |

---

## Layout Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar — Logo agência | Portal  Roster  Market  Operations  Agency  ⚙]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌── MARKET SUB-NAV ─────────────────────────────────────────────────────┐ │
│ │ Overview · Banco de Idols · Scouting · Talent Board · Vitrine ·      │ │
│ │ Atividade · Shortlists · Contratos · Orçamentos                      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── CONTENT AREA ───────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (conteúdo da sub-page selecionada)                                    │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── BOTTOM BAR (fixo) ──────────────────────────────────────────────────┐ │
│ │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────┐ │ │
│ │ │ Orçamento  │ │ Scouting   │ │ Recomend.  │ │ Shortlists │ │Negoc.│ │ │
│ │ │ ¥120M disp │ │ 🌏 Japão  │ │ 12 idols   │ │ 3 listas   │ │ 2    │ │ │
│ │ │ ¥8M/mês    │ │ ¥350K/mês  │ │ +3 novas   │ │ 18 alvos   │ │ ativas│ │ │
│ │ └────────────┘ └────────────┘ └────────────┘ └────────────┘ └──────┘ │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Sub-nav**: 9 sub-páginas, inspiradas no dropdown de Recruitment do FM26
(screenshot 4). Navegação horizontal, sem dropdown — PC-first, espaço não
é problema.

**Bottom Bar**: 5 tiles fixos (como FM26, screenshot 1 rodapé). Sempre
visíveis, clicáveis — cada um navega para a sub-página relevante.

---

## Sub-nav: Mapeamento

| Sub-página | FM26 equivalente | Função principal |
|---|---|---|
| **Overview** | Recruitment Overview | Dashboard: resumo, alertas, ações rápidas |
| **Banco de Idols** | Player Database | Tabela filtrável de idols no mercado |
| **Scouting** | Scouting Range + Recruitment Focuses | Scouts, missões, regiões, orçamento |
| **Talent Board** | TransferRoom In (Requirements) | Publicar necessidades; receber respostas |
| **Vitrine** | TransferRoom Out (Pitch Opportunities) | Ver demandas de rivais; oferecer idols |
| **Atividade** | Transfer Activity | Negociações em curso, propostas, status |
| **Shortlists** | Shortlists | Listas de alvos curadas pelo jogador |
| **Contratos** | Contracts | Contratos do roster: expiram, renovar, rescindir |
| **Orçamentos** | Recruitment Budgets | Budget de transfer, salários, scouting + slider |

---

## Bottom Bar (Fixo — Todas as Sub-páginas)

Inspirado diretamente nos 5 tiles do rodapé do FM26 (screenshots 1-2).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 💰 Orçamento │  │ 🔍 Scouting  │  │ ⭐ Recomend. │  │ 📋 Shortlists│   │
│  │              │  │              │  │              │  │              │   │
│  │ Transfer:    │  │ Alcance:     │  │ 12 idols     │  │ 3 listas     │   │
│  │  ¥120M disp  │  │  🌏 Nacional │  │ sugeridas    │  │ 18 alvos     │   │
│  │ Salários:    │  │ ¥350K/mês    │  │              │  │              │   │
│  │  ¥8M/mês     │  │ 2 scouts     │  │ Mais recente:│  │ Última add:  │   │
│  │  gastando    │  │ ativos       │  │ Kojima Yuna  │  │ Shimizu Hina │   │
│  │  ¥6.2M/mês   │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐                                                           │
│  │ 📨 Negociaç. │                                                           │
│  │              │                                                           │
│  │ 2 ativas     │                                                           │
│  │ 0 pendentes  │                                                           │
│  │              │                                                           │
│  │ Última:      │                                                           │
│  │ Mori Akane   │                                                           │
│  └──────────────┘                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Tile | Dados | Click |
|---|---|---|
| **Orçamento** | Budget de transfer disponível + salários (total vs gasto) | → Orçamentos |
| **Scouting** | Alcance (regional/nacional/global) + custo mensal + nº scouts ativos | → Scouting |
| **Recomendações** | Nº de idols recomendadas + mais recente | → Overview (seção recomendações) |
| **Shortlists** | Nº de listas + nº total de alvos | → Shortlists |
| **Negociações** | Nº de negociações ativas + pendentes + última | → Atividade |

---

## Sub-página: Overview (Dashboard do Market)

Tela de entrada. Dashboard denso com resumo de tudo. Inspirado no
Recruitment Overview do FM26 (tiles informativos, sem precisar navegar
para outras páginas para decisões rápidas).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Overview                                                           │
│                                                                             │
│ ┌── ROW 1: TILES RÁPIDOS ──────────────────────────────────────────────┐  │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │  │
│ │ │ Lacunas      │ │ Contratos    │ │ Talent Board │ │ Vitrine      │ │  │
│ │ │              │ │              │ │              │ │              │ │  │
│ │ │ Falta:       │ │ Expiram em   │ │ 2 anúncios   │ │ 5 rivais     │ │  │
│ │ │ Dance Ace    │ │ <3 meses:    │ │ ativos       │ │ procuram:    │ │  │
│ │ │ Variety Eng. │ │ Sato Hana    │ │              │ │ Vocal, Dance │ │  │
│ │ │              │ │ Suzuki Rin   │ │ 8 respostas  │ │              │ │  │
│ │ │ [Ver Roster  │ │              │ │ recebidas    │ │ [Ver Vitrine]│ │  │
│ │ │  Balance]    │ │ [Ver Contr.] │ │ [Ver Board]  │ │              │ │  │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│ ┌── ROW 2: RECOMENDAÇÕES DO STAFF ──────────────────────────────────────┐  │
│ │                                                                        │  │
│ │  "Baseado nas lacunas do seu roster e nos scouts ativos:"              │  │
│ │                                                                        │  │
│ │  Avatar  Nome             Tier  Arquétipo      Região    Status        │  │
│ │  ──────────────────────────────────────────────────────────────        │  │
│ │  [AVT]   Kojima Yuna      B+   踊り手 (Dance)  Osaka     Disponível   │  │
│ │  [AVT]   Taniguchi Mei    B    歌姫 (Vocal)    Fukuoka   Disponível   │  │
│ │  [AVT]   Hasegawa Sora    C+   バラエティ       Tokyo     Em negocia.  │  │
│ │                                                                        │  │
│ │  [Ver todas recomendações →]                                           │  │
│ │                                                                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│ ┌── ROW 3: ATIVIDADE RECENTE ───────────────────────────────────────────┐  │
│ │                                                                        │  │
│ │  ● Sem 24  Proposta enviada a Mori Akane (¥3M + 20% rev.) — Pendente │  │
│ │  ● Sem 24  Scout Yamamoto voltou de Osaka — 3 idols encontradas      │  │
│ │  ● Sem 23  Rival "Zenith Ent." fez oferta por sua idol Kimura Riko   │  │
│ │  ● Sem 23  Talent Board: 4 novas respostas ao seu anúncio "Dance Ace"│  │
│ │  ● Sem 22  Contrato de Sato Hana expira em 8 semanas — renovar?      │  │
│ │                                                                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│ ┌── ROW 4: NOTÍCIAS DE MERCADO (do News Feed) ─────────────────────────┐  │
│ │                                                                        │  │
│ │  📰 "Idol promissora fez show em Sapporo — fãs impressionados"       │  │
│ │     Pista: Vocal alta, região Hokkaido. [Enviar Scout →]              │  │
│ │                                                                        │  │
│ │  📰 "Contrato de Watanabe Sakura com Crystal Agency expirou"          │  │
│ │     Disponível no mercado. Tier A-. [Ver Perfil →] [Fazer Proposta →]│  │
│ │                                                                        │  │
│ │  📰 "Idol Rank S+ vista em festival indie em Nagoya"                  │  │
│ │     Pista: Performance excepcional. [Enviar Scout →]                  │  │
│ │                                                                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Seção | Descrição |
|---|---|
| **Lacunas** | Detectadas pelo Roster Balance: que arquetipos/skills faltam. Link para Roster Balance |
| **Contratos** | Idols do roster com contrato expirando em <3 meses. Alerta visual. Link para Contratos |
| **Talent Board** | Resumo dos anúncios publicados + respostas recebidas. Link para Talent Board |
| **Vitrine** | Nº de rivais com necessidades publicadas + match com seus excedentes. Link para Vitrine |
| **Recomendações** | Staff + scouts sugerem idols do pool que preenchem lacunas. Baseado em arquétipo + skill gaps |
| **Atividade Recente** | Timeline compacta: propostas, scouts, ofertas rivais, respostas do Talent Board |
| **Notícias de Mercado** | Filtro do News Feed: apenas notícias com relevância de mercado. Pistas de scouting passivo |

---

## Sub-página: Banco de Idols

Equivalente direto do Player Database do FM26 (screenshots 1-2). Tabela
densa e filtrável com todas as idols visíveis no mercado. A **visibilidade
depende do método de scouting** — o jogador NÃO vê 500 idols livres de
cara. Só vê: idols que se candidataram publicamente (~20%), idols scoutadas,
idols em transferência direta (stats públicos), e idols mencionadas no feed.

### Filtros (topo)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Banco de Idols                                                     │
│                                                                             │
│  [Editar Busca]  [Limpar Tudo]  [Filtros Rápidos ▼]                        │
│                                                                             │
│  Filtros ativos: Tier ≥ C · Idade 16-24 · Disponível/Persuadível          │
│                                                                             │
│  ┌─ TOGGLE ────────────────────────────────────────────────────────────┐   │
│  │ Somente Scoutadas [  ○── ]    Interesse: [Disponível ▼]            │   │
│  │                                                                      │   │
│  │ Tipo: [Todas ▼]  (Livres · Contratadas · Pré-formadas)             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Filtros Rápidos** (dropdown, atalhos):
- "Livres e disponíveis" (sem contrato)
- "Contratos expirando (< 6 meses)"
- "Scoutadas — tier B+"
- "Região: Kansai"
- "Arquétipo: Dance Ace"
- "Recomendadas pelo staff"

**Editar Busca** (abre painel completo):
- Tier range (F → SSS)
- Idade (15-35)
- Região de origem (prefeituras/regiões do Japão)
- Arquétipo (12 opções + "Qualquer")
- Stats mínimos (Vocal ≥ X, Dança ≥ Y, etc.)
- Status contratual (Livre, Contratada, Em negociação)
- Interesse ("Disponível", "Persuadível", "Improvável", "Não disponível")
- Salário pedido (range ¥)
- Valor de mercado (range ¥)
- Grupo/Solo (pertence a grupo? qual?)
- Método de descoberta (Scout, Audição, Festival, Online, Feed)

### Tabela Principal

Duas versões: **não-scoutada** (stats desconhecidos) e **scoutada** (stats visíveis com margem).

#### Estado 1: Somente Scoutadas OFF — Pool completo (com desconhecidas)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  487 idols encontradas                                                      │
│                                                                             │
│  ☐  Inf  Avatar  Nome              Região     Idade  Tier    Tier(PT)      │
│  ────────────────────────────────────────────────────────────────────────   │
│  ☐  ──   [AVT]   Takahashi Miku    Tokyo       22    ???     ???           │
│  ☐  🔍   [AVT]   Endo Haruka       Osaka       19    ???     ???           │
│  ☐  ──   [AVT]   Fujita Noa        Fukuoka     24    ???     ???           │
│  ☐  ──   [AVT]   Inoue Kokoro      Sapporo     17    ???     ???           │
│  ☐  🔍   [AVT]   Hayashi Rin       Nagoya      20    ???     ???           │
│  ...                                                                        │
│                                                                             │
│     Valor       Salário      Status          Recomendação                   │
│  ────────────────────────────────────────────────────────────────────────   │
│     ???         ???          Disponível      ○ Scouting Necessário          │
│     ???         ???          Disponível      ○ Scouting Necessário          │
│     ???         ???          Disponível      ○ Scouting Necessário          │
│     ???         ???          Disponível      ○ Scouting Necessário          │
│     ???         ???          Persuadível     ○ Scouting Necessário          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **☐** | Checkbox para adicionar à shortlist / ação em massa |
| **Inf** | Nível de informação: 🔍 = scout em andamento, ★ = scoutada, 🟢 = contrato público (stats exatos), ── = desconhecida |
| **Avatar** | 32×32 circular. Silhueta genérica se não scoutada |
| **Nome** | Click abre modal (wireframe 07). Double-click abre perfil (wireframe 08) |
| **Região** | Cidade de origem. Afeta tendências de stats (Tokyo=well-rounded, Kansai=carisma, etc.) |
| **Idade** | Numérico |
| **Tier** | ??? se não scoutada. Faixa estimada se scoutada (ex: "B-C"). Exato se contratada/pública |
| **Tier(PT)** | ??? — potencial nunca revelado numericamente (coach hints apenas) |
| **Valor** | Valor de mercado estimado. ??? se desconhecida. Range se scoutada (¥20M-¥35M) |
| **Salário** | Salário pedido. ??? se desconhecida. Range se scoutada |
| **Status** | Disponível / Persuadível / Em negociação / Não disponível |
| **Recomendação** | ○ Scouting Necessário / letra + label (após scouting) |

#### Estado 2: Somente Scoutadas ON — Idols conhecidas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  23 idols encontradas                 Somente Scoutadas [──○ ]             │
│                                                                             │
│  ☐  Inf  Avatar  Nome              Região    Idade  Tier   Vocal  Dança   │
│  ────────────────────────────────────────────────────────────────────────   │
│  ☐  ★    [AVT]   Kojima Yuna       Osaka      19    B+     62±10  78±10  │
│  ☐  ★    [AVT]   Taniguchi Mei     Fukuoka    21    B      75±10  45±15  │
│  ☐  🟢   [AVT]   Watanabe Sakura   Tokyo      24    A-     82     70     │
│  ☐  ★    [AVT]   Hasegawa Sora     Nagoya     18    C+     55±15  50±15  │
│  ☐  🔍   [AVT]   Mori Akane        Kobe       20    B-C    ???    ???    │
│  ...                                                                        │
│                                                                             │
│     Carisma  Aura    Valor           Salário       Recomendação             │
│  ────────────────────────────────────────────────────────────────────────   │
│     70±10   65±10   ¥20M-¥35M       ¥300K-¥500K   A  Excelente            │
│     60±15   55±15   ¥15M-¥25M       ¥200K-¥400K   B+ Muito Bom           │
│     78       84     ¥80M            ¥3.5M          A  Excelente            │
│     45±15   40±15   ¥5M-¥10M        ¥100K-¥200K   B  Bom                  │
│     ???     ???     ¥10M-¥20M       ???            ○  Em scouting...       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Diferenças quando scoutada**:
- Stats visíveis com **margem de erro** (±10 a ±20, depende do skill do scout)
- Tier como faixa ("B-C") ou exato (scout skill 14+)
- Valor e salário como range (não exatos)
- **Recomendação** em letra + label (como FM26: A = Excelente, B+ = Muito Bom, B = Bom, B- = Razoável, C = Fraco)
- Ícone ★ = scoutada, 🟢 = stats públicos (ex-contratada, transferência direta)

**Quando idol é de transferência direta** (contratada por rival):
- Stats **exatos** (são públicos — já contratada)
- Mostra **Valor de Rescisão** em vez de "Valor de Mercado"
- Mostra **Agência atual** e **tempo restante de contrato**
- Status = "Contratada — Buyout: ¥80M"

### Colunas Configuráveis

O jogador pode customizar quais colunas aparecem (como FM26 "Edit View"):

**Colunas disponíveis**:
- 16 atributos individuais (Vocal, Dança, Atuação, Variedade, Visual, Carisma, Comunicação, Aura, Resistência, Disciplina, Mentalidade, Foco, L. de Palco, Criatividade, Aprendizado, Trab. Equipe)
- Arquétipo (primário + secundário)
- Tier / Tier estimado
- Fama / Ranking
- Região de origem
- Idade
- Estágio de carreira (Trainee, Rising, Established, etc.)
- Valor de mercado / Valor de rescisão
- Salário pedido / Salário atual
- Agência atual (se contratada)
- Contrato restante
- Grupo(s)
- Método de descoberta
- Data de disponibilidade (entry_month do World Pack)
- Recomendação (letra + label)
- Perfil vocal (tessitura, textura, vocal_role)

### Ações da Tabela

| Ação | Trigger | Resultado |
|---|---|---|
| **Click no nome** | Click | Abre modal da idol (wireframe 07) |
| **Double-click** | Double-click | Abre perfil completo (wireframe 08) — variação Market |
| **☐ Checkbox** | Click | Seleciona para ação em massa |
| **Right-click** | Context menu | "Fazer proposta", "Enviar scout", "Add à shortlist", "Comparar com..." |
| **Ações em massa** | Toolbar | "Add selecionadas à shortlist", "Enviar scout para selecionadas" |
| **Ordenação** | Click header | Ordena por qualquer coluna (asc/desc) |
| **[Fazer Proposta]** | Botão na row (hover) | Abre negociação de contrato (wireframe existente) |
| **[Enviar Scout]** | Botão na row (hover) | Abre modal de scout assignment |

### Modal: Enviar Scout

```
┌─ ENVIAR SCOUT ──────────────────────────────────────────────┐
│                                                              │
│  Alvo: Kojima Yuna · Osaka · Idade 19 · Tier ???            │
│                                                              │
│  Selecionar Scout:                                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Scout        Nível  Espec.   Status   Custo/sem      │   │
│  │ ─────────────────────────────────────────────────     │   │
│  │ ○ Yamamoto   Lv 14  Vocal    Livre    ¥80K           │   │
│  │ ○ Kobayashi  Lv 8   Dance    Livre    ¥50K           │   │
│  │ ✗ Tanaka     Lv 12  Geral    Em missão (volta sem 26)│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Tipo de missão:                                             │
│  ○ Observar idol específica (1-2 semanas, ¥80K)             │
│  ○ Varrer região Osaka (2-4 semanas, ¥150K — pode achar +) │
│                                                              │
│  Custo estimado: ¥160K (viagem + estadia)                   │
│  Tempo estimado: 2 semanas                                   │
│  Precisão: Stats ±10 (Lv 14 = alta precisão)               │
│                                                              │
│  [Cancelar]                            [Enviar Scout]        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Sub-página: Scouting

Gerenciamento de scouts, missões ativas e alcance de scouting. Equivalente
à combinação de Scouting Range + Recruitment Focuses do FM26 (screenshot 5).

### Layout: 2 zonas

**Zona Esquerda (55%)** — Scouts e Missões | **Zona Direita (45%)** — Mapa + Budget

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Scouting                                                           │
│                                                                             │
│ ┌── SCOUTS (55%) ──────────────────┐ ┌── MAPA + BUDGET (45%) ───────────┐ │
│ │                                   │ │                                   │ │
│ │  MEUS SCOUTS                      │ │  ┌─────────────────────────────┐ │ │
│ │  ┌──────────────────────────────┐ │ │  │                             │ │ │
│ │  │ Scout      Nv  Esp.  Status  │ │ │  │  [MAPA DO JAPÃO]           │ │ │
│ │  │ ─────────────────────────────│ │ │  │                             │ │ │
│ │  │ Yamamoto   14  Vocal  Livre  │ │ │  │  ● Tokyo (base)            │ │ │
│ │  │ ¥200K/mês  XP: 850/1000     │ │ │  │  ◉ Osaka (Yamamoto)        │ │ │
│ │  │                              │ │ │  │  ○ Fukuoka                  │ │ │
│ │  │ Kobayashi   8  Dance  Livre  │ │ │  │  ○ Nagoya                   │ │ │
│ │  │ ¥120K/mês  XP: 340/600      │ │ │  │  ○ Sapporo                  │ │ │
│ │  │                              │ │ │  │  ○ Sendai                   │ │ │
│ │  │ Tanaka     12  Geral  Missão │ │ │  │  ◎ Kobe (Tanaka)           │ │ │
│ │  │ ¥180K/mês  Volta: Sem 26    │ │ │  │                             │ │ │
│ │  └──────────────────────────────┘ │ │  │  Alcance: Nacional 🌏      │ │ │
│ │                                   │ │  │  Custo: ¥350K/mês          │ │ │
│ │  Slots: 3/3 usados               │ │  └─────────────────────────────┘ │ │
│ │  [Contratar Scout] (bloqueado)    │ │                                   │ │
│ │  Tier agência: Standard (3 slots) │ │  ORÇAMENTO DE SCOUTING           │ │
│ │                                   │ │  Restante: ¥390K                 │ │
│ │  ─────────────────────────────    │ │  Gasto este mês: ¥310K          │ │
│ │                                   │ │  Budget total: ¥700K             │ │
│ │  MISSÕES ATIVAS                   │ │                                   │ │
│ │  ┌──────────────────────────────┐ │ │  Gasto por tipo:                 │ │
│ │  │ Missão      Scout   Progres.│ │ │  Salários scouts: ¥500K/mês     │ │
│ │  │ ─────────────────────────── │ │ │  Viagens: ¥150K/mês             │ │
│ │  │ Kobe (varrer)  Tanaka  70%  │ │ │  Audições: ¥50K/mês             │ │
│ │  │ Volta: 2 sem · 1 idol achada│ │ │                                   │ │
│ │  │                              │ │ │  [Ajustar Orçamento Scouting]   │ │
│ │  │ (nenhuma outra missão)       │ │ │                                   │ │
│ │  └──────────────────────────────┘ │ │  HISTÓRICO                       │ │
│ │                                   │ │  ▁▂▃▅▅▃▂▃▅ ¥310K (este mês)    │ │
│ │  [+ Nova Missão]                  │ │  Média: ¥280K/mês               │ │
│ │                                   │ │                                   │ │
│ └───────────────────────────────────┘ └───────────────────────────────────┘ │
│                                                                             │
│ ┌── PRIORIDADES DE SCOUTING ────────────────────────────────────────────┐  │
│ │                                                                        │  │
│ │  [+ Criar Prioridade]                                                  │  │
│ │                                                                        │  │
│ │  ┌─ Prioridade 1 ──────────────────────────────────────────────────┐  │  │
│ │  │ "Dance Ace para grupo Aurora"                                    │  │  │
│ │  │ Filtro: Dança ≥ 70, Resistência ≥ 60, Idade 17-23              │  │  │
│ │  │ Região preferida: qualquer · Scouts atribuídos: Kobayashi       │  │  │
│ │  │ Resultados até agora: 2 candidatas · Melhor: Kojima Yuna (B+)   │  │  │
│ │  │ [Editar] [Remover]                                              │  │  │
│ │  └──────────────────────────────────────────────────────────────────┘  │  │
│ │                                                                        │  │
│ │  ┌─ Prioridade 2 ──────────────────────────────────────────────────┐  │  │
│ │  │ "Vocal para substituir Hana (contrato expirando)"               │  │  │
│ │  │ Filtro: Vocal ≥ 75, Comunicação ≥ 55, Tier ≥ B                 │  │  │
│ │  │ Região preferida: Tokyo, Osaka · Scouts atribuídos: Yamamoto    │  │  │
│ │  │ Resultados até agora: 1 candidata · Melhor: Taniguchi Mei (B)   │  │  │
│ │  │ [Editar] [Remover]                                              │  │  │
│ │  └──────────────────────────────────────────────────────────────────┘  │  │
│ │                                                                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Meus Scouts** | Lista de scouts contratados: nome, nível, especialidade, status (Livre/Em missão), salário, XP/próximo nível |
| **Slots** | Determinado pelo tier da agência (Garage=1, Standard=3, Elite=5+) |
| **Missões Ativas** | Scout em campo: destino, progresso %, prazo de volta, idols encontradas até agora |
| **Mapa** | Japão estilizado. Pontos para scouts em campo (◉), regiões cobertas, base da agência (●) |
| **Alcance** | Regional (só cidade-base) / Nacional (todo Japão) / Global (internacional). Depende do budget |
| **Orçamento** | Budget restante, gastos deste mês, breakdown por tipo (salários, viagens, audições) |
| **Prioridades** | "Recruitment Focuses" do FM26 — o jogador define o que quer e o scout busca ativamente |

---

## Sub-página: Talent Board (Buscar)

Equivalente ao **TransferRoom Requirements** do FM26. O jogador "publica"
o que precisa no roster, e agências/idols livres respondem com propostas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Talent Board                                                       │
│                                                                             │
│ ┌── MEUS ANÚNCIOS ─────────────────────────────────────────────────────┐  │
│ │                                                                        │  │
│ │  [+ Publicar Necessidade]                                              │  │
│ │                                                                        │  │
│ │  ┌─ ANÚNCIO 1 ─────────────────────────────────────────────────────┐  │  │
│ │  │ "Procuro Dance Ace"                                              │  │  │
│ │  │                                                                  │  │  │
│ │  │ Posição: Performance (Dança foco)                                │  │  │
│ │  │ Arquétipo desejado: 踊り手 (Dance Ace)                          │  │  │
│ │  │ Tier mínimo: B · Idade: 17-23                                   │  │  │
│ │  │ Tempo de palco: Titular de grupo                                │  │  │
│ │  │ Tipo: Contratação permanente                                    │  │  │
│ │  │ Publicado: Sem 20 · Status: Ativo                               │  │  │
│ │  │                                                                  │  │  │
│ │  │ RESPOSTAS (5):                                                   │  │  │
│ │  │  Avatar  Nome             Origem    Tier  Quem enviou           │  │  │
│ │  │  ─────────────────────────────────────────────────────────       │  │  │
│ │  │  [AVT]   Kojima Yuna      Idol livre  B+   Própria (candidata) │  │  │
│ │  │  [AVT]   Nishida Saki     Stellar Ent  B   Agência (oferece)   │  │  │
│ │  │  [AVT]   Okada Mio        Idol livre  B    Própria (candidata) │  │  │
│ │  │  [AVT]   Ueda Rina        Phoenix AG  B+   Agência (oferece)   │  │  │
│ │  │  [AVT]   Morimoto Ayu     Idol livre  C+   Própria (candidata) │  │  │
│ │  │                                                                  │  │  │
│ │  │  Staff recomenda: Kojima Yuna (melhor match com necessidade)    │  │  │
│ │  │                                                                  │  │  │
│ │  │  [Ver Perfil] [Enviar Scout] [Fazer Proposta] [Ignorar]         │  │  │
│ │  │                                                                  │  │  │
│ │  │  [Editar Anúncio] [Fechar Anúncio]                              │  │  │
│ │  └──────────────────────────────────────────────────────────────────┘  │  │
│ │                                                                        │  │
│ │  ┌─ ANÚNCIO 2 ─────────────────────────────────────────────────────┐  │  │
│ │  │ "Procuro Vocal para grupo"                                       │  │  │
│ │  │ Tier mínimo: B+ · Idade: 18-25 · Contratação permanente        │  │  │
│ │  │ Respostas: 3 · Staff recomenda: Taniguchi Mei                   │  │  │
│ │  │ [Expandir ▼]                                                     │  │  │
│ │  └──────────────────────────────────────────────────────────────────┘  │  │
│ │                                                                        │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modal: Publicar Necessidade

```
┌─ PUBLICAR NECESSIDADE ─────────────────────────────────────────────────┐
│                                                                         │
│  Descrição: [________________] (ex: "Dance Ace para grupo Aurora")     │
│                                                                         │
│  Categoria de Stats: [Performance ▼]                                   │
│  Arquétipo desejado: [踊り手 (Dance Ace) ▼] (ou "Qualquer")           │
│                                                                         │
│  Tier mínimo: [B ▼]                                                    │
│  Faixa etária: [17] a [23]                                             │
│                                                                         │
│  Tempo de palco esperado:                                               │
│  ○ Estrela do grupo (titular, destaque)                                │
│  ○ Titular regular                                                      │
│  ○ Rotação / backup                                                     │
│  ○ Desenvolvimento (trainee/futura)                                    │
│                                                                         │
│  Tipo de transferência:                                                 │
│  ○ Contratação permanente (livre)                                      │
│  ○ Buyout (de rival)                                                   │
│  ○ Colaboração por projeto                                             │
│                                                                         │
│  Budget máximo: [¥________] (opcional — limita respostas)              │
│                                                                         │
│  [Cancelar]                              [Publicar]                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Mecânica**: Após publicar, agências IA com idols excedentes que encaixam
nos critérios respondem ao longo das semanas. Idols livres também se
candidatam se os termos parecerem atrativos. O staff do jogador filtra e
recomenda as melhores opções.

---

## Sub-página: Vitrine (Oferecer)

Equivalente ao **TransferRoom Out / Pitch Opportunities** do FM26. Mostra
o que rivais estão procurando no mercado. O jogador pode oferecer idols
do seu roster que atendem a essas demandas — especialmente idols excedentes,
caras demais, ou que querem sair.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Vitrine                                                            │
│                                                                             │
│ ┌── DEMANDAS DE RIVAIS ─────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  [Filtro: Match com meu roster ▼]  [Todas ▼]                          │ │
│ │                                                                        │ │
│ │  Agência            Procura         Tier  Tipo       Match no roster  │ │
│ │  ──────────────────────────────────────────────────────────────────   │ │
│ │  Zenith Entert.     歌姫 (Vocal)    B+    Permanente  Sato Hana ★    │ │
│ │  Crystal Agency     センター         B     Permanente  Yamada Moe     │ │
│ │  Nova Star Prod.    バラエティ       C+    Colaboração (nenhum match) │ │
│ │  Apex Talent        踊り手 (Dance)  A     Buyout      (nenhum match) │ │
│ │  Harmony Inc.       万能型           B     Permanente  Suzuki Rin     │ │
│ │                                                                        │ │
│ │  ★ = Staff recomenda oferecer                                          │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── AÇÃO: OFERECER IDOL ────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Oferecer Sato Hana → Zenith Entertainment                            │ │
│ │                                                                        │ │
│ │  Hana: Tier A · Vocal 78 · Contrato: 8 semanas restantes             │ │
│ │  Zenith procura: Vocal B+ ou melhor · Permanente                      │ │
│ │                                                                        │ │
│ │  Tipo de oferta:                                                       │ │
│ │  ○ Transferência (Zenith paga buyout/taxa)                            │ │
│ │  ○ Liberar (Hana sai livre, você economiza salário)                   │ │
│ │  ○ Colaboração (emprestar para projeto, receita dividida)             │ │
│ │                                                                        │ │
│ │  Valor pedido: [¥________] (sugerido: ¥60M-¥80M)                     │ │
│ │                                                                        │ │
│ │  [Cancelar]                           [Enviar Oferta]                  │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── MINHAS OFERTAS ENVIADAS ────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Idol          Para           Tipo        Valor       Status          │ │
│ │  ──────────────────────────────────────────────────────────────────   │ │
│ │  Nakamura Aoi  Phoenix AG     Transfer    ¥15M        Pendente       │ │
│ │  Suzuki Rin    Harmony Inc.   Colaboração ¥0 (rev.)   Aceita ✓      │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── INTERMEDIÁRIOS ─────────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Se nenhuma agência quer sua idol, contrate um intermediário.          │ │
│ │  Ele usa sua rede de contatos para encontrar interessados.             │ │
│ │                                                                        │ │
│ │  Idol "encalhada": Nakamura Aoi (salário alto, tier baixo)            │ │
│ │  [Contratar Intermediário — ¥50K + 5% da taxa]                        │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Demandas** | Tabela de necessidades publicadas por agências rivais. Filtro "Match com meu roster" destaca quem do meu elenco encaixa |
| **Match** | Sistema cruza automaticamente as necessidades do rival com stats/arquétipo das minhas idols |
| **★ Recomendação** | Staff sugere ofertar idols excedentes ou que querem sair |
| **Oferta** | Jogador escolhe tipo (transfer, livre, colaboração) e valor pedido |
| **Ofertas enviadas** | Tracking de ofertas ativas com status (Pendente, Aceita, Recusada, Contra-proposta) |
| **Intermediário** | Para idols "encalhadas" (salário > valor de mercado). Custo fixo + %. Encontra compradores que não estão monitorando |

---

## Sub-página: Atividade

Equivalente ao **Transfer Activity** do FM26. Timeline de todas as
negociações ativas e recentes.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Atividade                                                          │
│                                                                             │
│ ┌── NEGOCIAÇÕES ATIVAS ─────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Idol           Tipo       Fase          Contraparte    Prazo         │ │
│ │  ──────────────────────────────────────────────────────────────────   │ │
│ │  Mori Akane     Contrato   Proposta      Idol livre     —            │ │
│ │   ¥3M + 20% rev · Aceite: 65% 🟡 · Round 1/3                        │ │
│ │   [Ajustar Proposta] [Desistir]                                       │ │
│ │                                                                        │ │
│ │  Kojima Yuna    Contrato   Contraproposta Idol livre    Sem 26       │ │
│ │   Idol pede ¥500K/mês (você ofereceu ¥350K) · Aceite: 42% 🟡        │ │
│ │   [Ver Contraproposta] [Aceitar] [Contra-oferta] [Desistir]          │ │
│ │                                                                        │ │
│ │  ⚠ ALERTA: Zenith Ent. também está negociando com Kojima Yuna!      │ │
│ │    Proposta rival estimada: ¥400K-¥500K/mês                           │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── PROPOSTAS RECEBIDAS (rivais querem suas idols) ─────────────────────┐ │
│ │                                                                        │ │
│ │  Idol           De             Tipo      Valor        Status          │ │
│ │  ──────────────────────────────────────────────────────────────────   │ │
│ │  Kimura Riko    Zenith Ent.    Buyout    ¥45M         Pendente       │ │
│ │   Rescisão: ¥60M · Oferta abaixo da rescisão                        │ │
│ │   [Aceitar] [Rejeitar] [Contra-proposta: ¥___]                       │ │
│ │                                                                        │ │
│ │  Yamada Moe     Crystal AG     Collab    Show conjunto  Pendente     │ │
│ │   Revenue: 50/50 · Duração: 1 show · Fama +exposure                 │ │
│ │   [Aceitar] [Rejeitar] [Negociar termos]                             │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── HISTÓRICO RECENTE ──────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Sem 23  Proposta a Hasegawa Sora → Recusada (pediu ¥600K, limite)   │ │
│ │  Sem 22  Contratação: Watanabe Sakura ✓ (livre, ¥3.5M/mês, 2 anos)  │ │
│ │  Sem 21  Colaboração com Phoenix AG ✓ (idol deles em nosso show)     │ │
│ │  Sem 20  Buyout rival por Endo Haruka → Rival recusou (não à venda)  │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Seção | Descrição |
|---|---|
| **Negociações Ativas** | Cada negociação mostra: fase (Proposta / Contraproposta / Aguardando resposta), probabilidade de aceite (cor), round (1-3), ações |
| **Alerta Rival** | Se rival está negociando com a mesma idol = banner ⚠ com estimativa da proposta deles |
| **Propostas Recebidas** | Rivais querendo suas idols: buyout, colaboração. Mostra valor vs. rescisão |
| **Histórico** | Timeline das últimas negociações concluídas (sucesso/fracasso) |

---

## Sub-página: Shortlists

Listas customizadas de alvos, equivalente às **Shortlists** do FM26.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Shortlists                                                         │
│                                                                             │
│  [+ Criar Nova Shortlist]                                                   │
│                                                                             │
│  ┌─ "Alvos Prioritários" (8 idols) ─────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  Avatar  Nome            Tier  Arq.      Valor       Status    [×]   │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │  [AVT]   Kojima Yuna     B+   踊り手     ¥20M-¥35M  Em negoc.       │ │
│  │  [AVT]   Taniguchi Mei   B    歌姫       ¥15M-¥25M  Disponível      │ │
│  │  [AVT]   Watanabe Sakura A-   センター    Livre      Contratada ✓   │ │
│  │  [AVT]   Nishida Saki    B    踊り手     ¥12M       Contratada(rival)│ │
│  │  ...                                                                  │ │
│  │                                                                        │ │
│  │  [Comparar Selecionadas]  [Enviar Scout para Todas]                   │ │
│  │  [Exportar] [Compartilhar com Staff]                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ "Wonderkids (futuro)" (5 idols) ────────────────────────────────────┐ │
│  │  Idols jovens (16-18) com tier atual baixo mas alto potencial coach  │ │
│  │  ...                                                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─ "Barganhas (contratos expirando)" (4 idols) ────────────────────────┐ │
│  │  Idols com <6 meses de contrato, negociáveis a custo baixo          │ │
│  │  ...                                                                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sub-página: Contratos

Visão centralizada dos contratos do roster. Equivalente ao tile
**Contracts** do FM26 (screenshot 4 menu). Foco em decisões de renovação
e planejamento.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Contratos                                                          │
│                                                                             │
│  [Filtro: Todos ▼]  [Ordenar: Expira em ▼]                                │
│                                                                             │
│  ┌── ALERTAS ────────────────────────────────────────────────────────┐     │
│  │ ⚠ 2 contratos expiram em <3 meses · 1 idol pode ser abordada     │     │
│  │   por rivais (pré-contrato)                                       │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Idol            Salário     Rev%   Excl.  Expira em     Status    Ação    │
│  ──────────────────────────────────────────────────────────────────────    │
│  Tanaka Yui      ¥4M/mês    25%    Sim    14 meses      Estável   ──     │
│  Sato Hana       ¥3.5M/mês  20%    Sim    8 semanas ⚠   Renovar   [R]   │
│  Kimura Riko     ¥2M/mês    30%    Sim    10 meses      Estável   ──     │
│  Yamada Moe      ¥1.5M/mês  25%    Não    6 meses       Atenção   [R]   │
│  Suzuki Rin      ¥800K/mês  20%    Sim    4 semanas ⚠   Urgente!  [R]   │
│                                                                             │
│  [R] = Abrir negociação de renovação                                       │
│                                                                             │
│  ── CUSTO TOTAL ──────────────────────────────────────                     │
│  Salários: ¥11.8M/mês · Revenue share média: 24%                          │
│  Se renovar Hana e Rin com +30%: ¥14.6M/mês (projeção)                    │
│                                                                             │
│  ── GRÁFICO DE EXPIRAÇÃO ──────────────────────                            │
│  Agora    3m    6m    9m    12m   18m   24m                                │
│    ██ Rin  ██ Hana  ████ Moe  ████████ Riko  ████████████ Yui             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sub-página: Orçamentos

Equivalente ao **Recruitment Budgets** do FM26 (screenshot 3, 5). Slider
de redistribuição entre transfer e salários, budget de scouting, projeção.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Market > Orçamentos                                                         │
│                                                                             │
│ ┌── BUDGET DE TRANSFERÊNCIAS ───────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Atual: ¥120M     Gasto esta temporada: ¥0     Original: ¥120M       │ │
│ │                                                                        │ │
│ │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░              │ │
│ │  ¥0                                                    ¥120M          │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── AJUSTE DE ORÇAMENTO ────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Salários                          Transfer                           │ │
│ │  ¥8M/mês  ◄────────────●──────────────────► ¥120M                    │ │
│ │                                                                        │ │
│ │  Gastando atualmente: ¥6.2M/mês em salários                          │ │
│ │  Margem salarial: ¥1.8M/mês disponível                               │ │
│ │                                                                        │ │
│ │  ⚠ Mover slider → converte transfer em margem salarial (ou vice-versa)│ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── BUDGET DE SCOUTING ─────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Budget total: ¥700K/ano                                              │ │
│ │  Restante: ¥390K                                                      │ │
│ │  Gasto este mês: ¥310K                                                │ │
│ │                                                                        │ │
│ │  Breakdown:                                                            │ │
│ │  Salários scouts: ¥500K/mês (fixo enquanto contratados)              │ │
│ │  Viagens: ¥150K/mês (varia com missões)                              │ │
│ │  Audições: ¥50K/mês                                                   │ │
│ │                                                                        │ │
│ │  [Ajustar Budget Scouting]  [Pedir Aumento ao Board]                 │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── PROJEÇÃO FINANCEIRA ────────────────────────────────────────────────┐ │
│ │                                                                        │ │
│ │  Se contratar Kojima Yuna (¥25M + ¥400K/mês):                        │ │
│ │  Transfer restante: ¥95M                                              │ │
│ │  Salários: ¥6.6M/mês (+¥400K) · Margem: ¥1.4M/mês                  │ │
│ │                                                                        │ │
│ │  Se também renovar Hana (+30%): Salários ¥7.65M/mês · Margem: ¥350K │ │
│ │  ⚠ Margem apertada — considere vender ou não renovar uma idol       │ │
│ │                                                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Variações

### Agência Pequena (Garage / Startup)

- 1 scout slot, alcance regional apenas
- Budget de transfer limitado (¥10M-¥30M)
- Talent Board recebe menos respostas (reputação baixa)
- Vitrine mostra poucas demandas (poucos rivais conhecem a agência)
- Foco em idols livres, audições e barganhas

### Agência de Elite

- 5+ scouts, alcance global
- Budget alto (¥500M+)
- Talent Board recebe muitas respostas de alta qualidade
- Vitrine: rivais oferecem suas idols ativamente para você
- Intermediários disponíveis com taxa menor (reputação)

### Início de Temporada

- Overview destaca "Lacunas" e "Contratos expirando"
- Recomendações baseadas em pré-temporada
- Budget recém-alocado (barra cheia)

### Mid-Season (com urgência)

- Idol lesionada → Overview mostra "Substituição urgente"
- Recomendações priorizam disponibilidade imediata
- Empréstimos e colaborações ganham destaque

---

## Comportamento

| Ação | Resultado |
|---|---|
| **Click em nome de idol** (qualquer tabela) | Abre modal da idol (wireframe 07) — variação Market (stats com margem) |
| **Double-click** | Abre perfil completo (wireframe 08) — variação Market |
| **Right-click** | Context menu: "Fazer Proposta", "Enviar Scout", "Add à Shortlist", "Comparar" |
| **Drag idol para shortlist** | Adiciona à shortlist selecionada (sidebar) |
| **Click em tile do Bottom Bar** | Navega para sub-página correspondente |
| **Click em anúncio do Talent Board** | Expande respostas e recomendações |
| **Click em alerta ⚠** | Navega para detalhe da situação (negociação rival, contrato expirando) |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Overview → Sub-página | Click na sub-nav | Conteúdo troca (sem page transition) |
| Tabela → Modal da idol | Click nome | Modal overlay (wireframe 07) |
| Tabela → Perfil completo | Double-click | Slide left (wireframe 08) |
| Negociação → Contrato | "Fazer Proposta" | Modal de negociação (ui-contract-negotiation) |
| Scouting → Missão | "Nova Missão" | Modal de assignment |

---

## Assets Necessários

| Asset | Formato | Tamanho | Uso |
|---|---|---|---|
| Mapa do Japão estilizado | SVG | ~400×500 | Sub-página Scouting |
| Ícones de regiões | SVG | 24×24 | Pins no mapa + tabelas |
| Avatars de scouts | WebP | 48×48 | Lista de scouts |
| Silhueta genérica (idol desconhecida) | SVG | 32×32 | Tabela — idol não scoutada |
| Ícones de status de negociação | SVG | 16×16 | Atividade (pendente, aceita, recusada) |
| Heat map colors (probabilidade) | CSS | — | Probabilidade de aceite (verde/amarelo/vermelho) |
| Gráfico de budget | Canvas/SVG | — | Barra de orçamento, slider de ajuste |

---

## Acceptance Criteria

1. Hub centralizado com 9 sub-páginas acessíveis pela sub-nav
2. Bottom Bar fixo com 5 tiles de resumo em todas as sub-páginas
3. Overview: 4 tiles rápidos + recomendações do staff + atividade recente + notícias de mercado
4. Notícias de mercado integradas do News Feed com ações diretas ("Enviar Scout", "Fazer Proposta")
5. Banco de Idols: tabela filtrável com toggle "Somente Scoutadas" (como FM26)
6. Stats desconhecidos (???) para idols não scoutadas; stats com margem (±) para scoutadas
7. Idols de transferência direta mostram stats exatos + valor de rescisão
8. Colunas configuráveis na tabela (16 atributos + metadados)
9. Modal "Enviar Scout" com seleção de scout, tipo de missão, custo estimado e precisão
10. Scouting: lista de scouts + missões ativas + mapa do Japão + budget + prioridades
11. Prioridades de scouting (Recruitment Focuses): definir perfil desejado e atribuir scout
12. Talent Board: publicar necessidades do roster e receber respostas de idols/agências
13. Staff recomenda melhor match das respostas do Talent Board
14. Vitrine: ver demandas de rivais + oferecer idols excedentes com match automático
15. Intermediário disponível para idols "encalhadas" (salário > valor)
16. Atividade: negociações ativas com fase, probabilidade, rounds + alerta de rival competidor
17. Propostas recebidas (rivais querendo suas idols) com ações de aceitar/rejeitar/contra
18. Shortlists: listas customizadas com ações em massa (comparar, scout, exportar)
19. Contratos: visão centralizada com alertas de expiração + gráfico temporal + custo total
20. Orçamentos: slider Transfer ↔ Salários (como FM26) + budget de scouting + projeção de impacto
21. Variações para agência pequena (menos recursos) e elite (mais recursos)
22. Recomendações de contratação baseadas em lacunas de arquétipo do roster
