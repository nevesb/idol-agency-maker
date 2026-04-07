# Wireframe 77 — Composer Selection (Seleção de Compositor)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Staff Search / Scout Assignments  
> **Resolução alvo**: 1920×1080 (PC-first) ou Modal  
> **Rota**: Modal from `/agency/music/pipeline` (wireframe 73)  
> **GDDs**: music-production, music-charts

---

## Conceito

No Football Manager, quando você precisa de um novo preparador físico ou olheiro, abre a Staff Search: uma lista filtrável de candidatos com atributos, salário, disponibilidade e histórico. Você compara dois nomes lado a lado e contrata.
No **Star Idol Agency**, esta é a tela de **Seleção de Compositor**. Você está procurando alguém para compor a próxima música do seu grupo. Cada compositor tem um Tier (F a S), uma especialidade de gênero, custo, taxa de royalties e um histórico de chart. Um compositor Tier-S de Pop custa uma fortuna mas quase garante um hit; um Tier-C de Variety é barato e imprevisível. A decisão é econômica e criativa ao mesmo tempo.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                  |
|-------------------------------------------------------------------------------------------------|
| Música > Pipeline > SELECIONAR COMPOSITOR                                            [X Fechar] |
+-------------------------------------------------------------------------------------------------+
| [ FILTROS ]                                                                                     |
| Tier: [F ▼] a [S ▼]  | Especialidade: [Todas ▼]  | Custo Máx: [¥________]                      |
| [✓] Apenas Disponíveis | Ordenar por: [Fama ▼ | Custo | Tier]                                  |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ 40% - LISTA DE COMPOSITORES ]  | [ COLUNA DIR 60% - PERFIL DO COMPOSITOR ]         |
|                                              |                                                   |
| NOME           TIER  ESPEC.   CUSTO   DISP. | ┌─────────────────────────────────────────────┐   |
| ─────────────────────────────────────────── | │  TAKESHI YAMAMOTO                            │   |
| ▶ Takeshi Yamamoto  S★  Pop    ¥8.5M  Livre | │  Tier: S ★★★★★  |  Especialidade: Pop       │   |
|   Rena Mizuki       A★  Ballad ¥5.2M  Livre | │  Custo por Música: ¥8.500.000                │   |
|   DJ KENTA          B★  Electr ¥3.1M  Ocup. | │  Taxa de Royalties: 12%                      │   |
|   Haruto Sato       A★  Rock   ¥4.8M  Livre | │  Disponibilidade: LIVRE                      │   |
|   Yui Tanaka        B★  Idol   ¥2.9M  Livre | │  Prazo Estimado de Entrega: 3 semanas        │   |
|   Kota Nishimura    C★  Variet ¥1.2M  Livre | │                                               │   |
|   Miki Aoyama       A★  Pop    ¥5.0M  Ocup. | │  HISTÓRICO DE CHARTS (Últimas 5 Músicas)     │   |
|     (retorna 15/Mai)                         | │  ─────────────────────────────────────────── │   |
|   Sho Watanabe      F★  Ballad ¥0.5M  Livre | │  "Neon Pulse"        → Oricon #1  (12 sem.)  │   |
|   ...                                        | │  "Heartbeat Avenue"  → Oricon #3  (8 sem.)   │   |
|                                              | │  "Sakura no Kaze"    → Oricon #2  (10 sem.)  │   |
| Mostrando 24 de 87 compositores              | │  "Electric Dreams"   → Oricon #5  (6 sem.)   │   |
| [< 1 2 3 4 >]                               | │  "Dawn Protocol"     → Oricon #1  (14 sem.)  │   |
|                                              | │                                               │   |
|                                              | │  Fama: ████████████████░░ 88/100              │   |
|                                              | └─────────────────────────────────────────────┘   |
|                                              |                                                   |
|                                              | [ Encomendar Música ]     [ Comparar ]            |
+-------------------------------------------------------------------------------------------------+
```

### Sub-Modal: Encomendar Música (Brief Form)

```text
+-------------------------------------------------+
| ENCOMENDAR MÚSICA — Takeshi Yamamoto             |
|-------------------------------------------------|
| Preferência de Estilo: [Pop Energético ▼]        |
|   (Pop / Ballad / Dance / Experimental / Livre)  |
|                                                  |
| Prioridade: [Normal ▼]                           |
|   Normal (prazo padrão) / Urgente (+50% custo,   |
|   entrega em metade do tempo)                    |
|                                                  |
| Custo Total: ¥8.500.000                          |
| Royalties: 12% sobre vendas futuras              |
|                                                  |
| [ Confirmar Encomenda ]    [ Cancelar ]          |
+-------------------------------------------------+
```

### Sub-Modal: Comparar Compositores

```text
+-----------------------------------------------------------------------+
| COMPARAR COMPOSITORES                                                  |
|-----------------------------------------------------------------------|
|                    TAKESHI YAMAMOTO       vs     RENA MIZUKI           |
| Tier:              S ★★★★★                      A ★★★★              |
| Especialidade:     Pop                           Ballad               |
| Custo:             ¥8.500.000                    ¥5.200.000           |
| Royalties:         12%                           8%                   |
| Fama:              88/100                        72/100               |
| Melhor Posição:    #1                            #2                   |
| Prazo Entrega:     3 semanas                     4 semanas            |
| Disponibilidade:   LIVRE                         LIVRE                |
|-----------------------------------------------------------------------|
| [ Encomendar Yamamoto ]   [ Encomendar Mizuki ]   [ Fechar ]         |
+-----------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Staff Search Filterable Table
O FM permite filtrar staff por atributos, nacionalidade, salário e disponibilidade. Aqui o jogador filtra compositores por Tier, especialidade, custo máximo e disponibilidade. A tabela à esquerda é compacta e escaneável, como a Staff Search do FM.

### 2. Profile Detail Card (Scouting Report Style)
No FM, ao clicar num jogador na lista, o painel direito mostra o perfil completo com estatísticas, histórico e recomendação do olheiro. Aqui o perfil do compositor mostra o histórico de charts (últimas 5 músicas com posição máxima no Oricon), custo, royalties e prazo de entrega.

### 3. Side-by-Side Comparison
O FM permite comparar dois jogadores lado a lado em atributos. A função Comparar coloca dois compositores em colunas paralelas para o jogador avaliar custo-benefício antes de decidir a contratação.

---

## Acceptance Criteria

1. Lista filtrável de compositores disponíveis no mercado com colunas de Nome, Tier (F-S com estrelas), Especialidade, Custo e Disponibilidade.
2. Filtros funcionais por faixa de Tier, Especialidade (dropdown), Custo máximo (input numérico), toggle "Apenas Disponíveis" e ordenação por Fama/Custo/Tier.
3. Painel de perfil detalhado ao selecionar um compositor, exibindo histórico de charts das últimas 5 músicas com posição máxima e semanas em chart.
4. Botão [Encomendar Música] abre formulário de brief com preferência de estilo e toggle de prioridade (Normal/Urgente com custo adicional).
5. Função [Comparar] permite visualização lado a lado de dois compositores selecionados com todos os atributos relevantes.
