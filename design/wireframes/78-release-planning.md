# Wireframe 78 — Release Planning (Planejamento de Lançamento)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Transfer Deadline Day / Season Planning  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: Modal/Page from `/agency/music/pipeline` (wireframe 73)  
> **GDDs**: music-production, music-charts

---

## Conceito

No Football Manager, conforme a janela de transferências se aproxima, você planeja quando anunciar contratações, quando vender e como distribuir o orçamento entre salários e agentes. O timing importa: vender cedo dá mais dinheiro, mas comprar cedo infla preços.
No **Star Idol Agency**, o **Release Planning** é a tela onde você decide quando lançar uma música ou álbum e como investir no marketing. Lançar na semana do Hanami (festival da cerejeira) dá +20% de visibilidade, mas se três rivais também lançarem na mesma semana, o público se divide. Alocar ¥50M em TV Spots dá exposição massiva, mas com retornos decrescentes acima de um teto. É a "janela de transferências" da música.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                  |
|-------------------------------------------------------------------------------------------------|
| Música > Pipeline > PLANEJAMENTO DE LANÇAMENTO                                       [X Fechar] |
+-------------------------------------------------------------------------------------------------+
| [ SEÇÃO TOPO - RESUMO DO LANÇAMENTO ]                                                           |
|                                                                                                  |
| Tipo: [Single ▼ | Mini Album | Album]     Artista/Grupo: Celestial Nine                        |
|                                                                                                  |
| FAIXAS INCLUÍDAS (Arrastar para reordenar)                                                      |
| ┌────┬──────────────────────────┬───────────┬──────────┬───────────────┐                        |
| | #  | Título                   | Compositor | Qualidade | Lead Single? |                        |
| |────|──────────────────────────|───────────|──────────|───────────────|                        |
| | 1  | "Neon Pulse"             | Yamamoto   | ★★★★★  | ◉ (Seleção)  |                        |
| | 2  | "Whisper of Spring"      | Mizuki     | ★★★★   | ○            |                        |
| | 3  | "Electric Midnight"      | DJ KENTA   | ★★★    | ○            |                        |
| └────┴──────────────────────────┴───────────┴──────────┴───────────────┘                        |
| [ + Adicionar Faixa de Músicas Completas ]                                                      |
+-------------------------------------------------------------------------------------------------+
| [ SEÇÃO CENTRO - CALENDÁRIO DE LANÇAMENTO (Próximos 3 Meses) ]                                  |
|                                                                                                  |
|  ABR 2027                    MAI 2027                    JUN 2027                               |
|  S1  S2  S3  S4             S1  S2  S3  S4             S1  S2  S3  S4                           |
|  ──  ──  ──  ──             ──  ──  ──  ──             ──  ──  ──  ──                           |
|  .   .   🌸  .              🎌  .   .   .              .   .   .   .                            |
|          +20%               +20%                                                                |
|                                                                                                  |
|  Lançamentos Rivais Conhecidos:                                                                  |
|  S2/Abr: NOVA★RISE (Single)  |  S1/Mai: PRISM (Album)  |  S3/Jun: — nenhum conhecido —         |
|                                                                                                  |
|  Deadline do Board: Resultados esperados até S4/Mai                                              |
|                                                                                                  |
|  ▶ Semana Selecionada: [S3 / Abril] — Bônus Sazonal: Hanami +20%                               |
|    Concorrência nesta semana: Nenhuma conhecida                                                  |
+-------------------------------------------------------------------------------------------------+
| [ SEÇÃO INFERIOR ESQ - ALOCAÇÃO DE MARKETING ]  | [ SEÇÃO INFERIOR DIR - PROJEÇÃO ]              |
|                                                  |                                                |
| ORÇAMENTO DE MARKETING                           | PROJEÇÃO DE LANÇAMENTO                         |
| Budget Total Disponível: ¥120.000.000            |                                                |
|                                                  | Posição Estimada de Entrada: #3 (Oricon)       |
| TV Spots:                                        | Receita Estimada (1º Mês):  ¥ 45.000.000      |
| [████████░░░░░░░░] ¥40.000.000                   | Ganho de Fama Estimado:     +12 pts            |
|                                                  |                                                |
| Rádio Promotion:                                 | ⚠ Retornos decrescentes: TV Spots acima de     |
| [██████░░░░░░░░░░] ¥25.000.000                   |   ¥50M tem eficiência reduzida em 40%.         |
|                                                  |                                                |
| Social Media Campaign:                           | MÍDIA FÍSICA                                   |
| [████░░░░░░░░░░░░] ¥20.000.000                   | Quantidade de CDs:  [50.000 ▼]                 |
|                                                  |   (10K / 25K / 50K / 100K / 250K)             |
| Street/Physical Ads:                             | Vinil:              [✓] (+¥3.500.000)          |
| [██░░░░░░░░░░░░░░] ¥10.000.000                   | Edição Especial:    [✓] (+¥8.000.000)          |
|                                                  |   (photobook + bonus track + photocard)        |
| Fan Club Exclusive:                              |                                                |
| [█████░░░░░░░░░░░] ¥25.000.000                   | Custo Total Mídia Física: ¥ 23.500.000         |
|                                                  | Custo Total Marketing:    ¥120.000.000         |
| TOTAL ALOCADO: ¥120.000.000 / ¥120.000.000      | CUSTO TOTAL LANÇAMENTO:   ¥143.500.000         |
+-------------------------------------------------------------------------------------------------+
|                        [ Confirmar Lançamento ]          [ Salvar Rascunho ]                     |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Transfer Window Timing (Calendar Strip)
No FM, a janela de transferências tem datas limite e você monitora quando rivais contratam. O calendário de lançamento funciona igual: semanas com bônus sazonais (Hanami, Golden Week, Natal) são equivalentes às "datas de deadline", e os lançamentos rivais conhecidos são como as transferências concorrentes que o Intelligence Report revela.

### 2. Budget Allocation Sliders (Wage/Transfer Budget)
O FM divide orçamento entre salários e transferências com barras visuais. Aqui, o marketing se divide em 5 canais com sliders independentes. O aviso de retornos decrescentes imita o FM avisando que pagar salários acima do mercado não melhora linearmente a satisfação do jogador.

### 3. Season Objective Deadline (Board Expectations)
No FM, a diretoria cobra resultados até certa data. O "Deadline do Board" no calendário lembra o jogador que o conselho espera resultados de vendas/chart até uma semana específica, pressionando a escolha da data de lançamento.

### 4. Drag-and-Drop Track List
Igual ao FM permitir reordenar a lista de penalti-takers. As faixas do lançamento são arrastáveis para reordenar, e a seleção do Lead Single é feita por radio button como a escolha do capitão.

---

## Acceptance Criteria

1. Seleção de tipo de lançamento (Single / Mini Album / Album) com lista de faixas arrastável a partir de músicas completas no pipeline.
2. Calendário visual dos próximos 3 meses dividido por semanas, com indicadores de bônus sazonal (Hanami +20%, Golden Week +20%, Christmas +25%), lançamentos rivais conhecidos e deadline do board.
3. Clique em uma semana do calendário define a data de lançamento com exibição do bônus/concorrência daquela semana.
4. Alocação de marketing em 5 canais com sliders de budget independentes e aviso de retornos decrescentes ao ultrapassar limites por canal.
5. Painel de projeção calculando posição estimada de entrada no chart, receita do primeiro mês e ganho de fama com base no investimento alocado e bônus sazonais.
6. Configuração de mídia física com input de quantidade de CDs, toggle de vinil e toggle de edição especial com custos adicionais exibidos.
7. Botões [Confirmar Lançamento] (irreversível) e [Salvar Rascunho] (permite revisitar).
