# Wireframe 46 — Calendar Season Planner (Planejador Sazonal)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Season Calendar / Milestones
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/season`
> **GDDs**: schedule-agenda, agency-growth

---

## Conceito

No FM, o Planejador da Temporada é o seu calendário anual: marca quando a janela de transferências abre/fecha, as finais de campeonatos, férias, etc.
No **Star Idol Agency**, esta é a tela de **Calendário Sazonal**. É o panorama de longo prazo da agência (Janeiro a Dezembro). A Oricon, Eventos Sazonais do Japão (Férias de Golden Week, Festivais de Verão, Kōhaku Uta Gassen no fim do ano) dão ritmo à temporada e influenciam as vendas de singles.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | PLANEJAMENTO (Ativo) | Grupos | Operações | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Planejamento Sazonal                                                                    |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO DO MÊS ]              | [ CENTRO/DIR - TIMELINE DO ANO (EVENTOS MACRO) ]   |
|                                            |                                                    |
| ABRIL DE 2026                              | 2026: EVENTOS CHAVE                                |
| (Calendário miniatura destacando dias 14-20| [ BARRA DE ROLAGEM HORIZONTAL -> ABR A DEZ ]       |
|  como uma turnê da agência)                |                                                    |
|                                            | [MAIO]                                             |
| [ Botão: Adicionar Lançamento (Single) ]   | 01 a 07: [Amarelo] Golden Week (Vendas +20%)       |
| [ Botão: Agendar Turnê Nacional ]          | 20 a 25: [Verde] Período Forte para Lançamentos    |
| [ Botão: Agendar Audicão Aberta ]          |                                                    |
|                                            | [JULHO/AGOSTO]                                     |
| METAS DO BOARD ESTE TRIMESTRE              | 15 a 30: [Laranja] Festivais de Verão              |
| Lançar um Álbum Físico:                    | 18: Lançamento do Single de Verão (Celestial Nine) |
| [ Bar: 0/1 ] (Prazo: 30 de Junho)          |                                                    |
|                                            | [DEZEMBRO]                                         |
|                                            | 25: Lançamento do Single de Natal (Reina)          |
|                                            | 31: [Vermelho] Kōhaku Uta Gassen (TV Nacional)     |
|                                            |                                                    |
| ALERTA DO HEAD DE MARKETING                | CUSTOS PROGRAMADOS DO ANO                          |
| "Recomendamos adiar o single de Reina para | Custos de Turnê Reservados: ¥ 150.000.000          |
| a segunda quinzena de maio; a agência      | Expectativa de Arrecadação: ¥ 500.000.000          |
| rival Titan vai lançar o grupo principal   |                                                    |
| deles na Golden Week, ofuscando a Reina."  |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Scroll Horizontal da Timeline
O planejador de temporada moderna abandona meses em formato de grade vertical pesada em favor de uma timeline linear (ou blocos mensais verticais grandes que você desce fazendo scroll). No Centro/Direita você vê o impacto das estações do Japão e feriados nas vendas (Golden Week, Kōhaku).

### 2. Ações Macros "Top-Down"
Diferente da agenda da semana (treinos e comerciais), aqui você aperta botões pesados (Esquerda): `[Agendar Turnê Nacional]` (custa milhões de Ienes), `[Adicionar Lançamento Single]` (pede meses de antecedência de produção de música e clipe).

### 3. O Alerta Competitivo (Market Analyst)
Igual ao FM quando diz que o Real Madrid vai faturar a Champions. O analista da agência (Head de Marketing) te manda um aviso no rodapé da esquerda: "A Titan Ag. vai lançar na Golden Week, recua seu single se não quiser perder a Oricon #1". Isso insere mecânica de timing estratégico no jogo.

---

## Acceptance Criteria

1. Timeline sazonal cobrindo de Janeiro a Dezembro com destaques visuais nos Feriados/Eventos Reais (ex: Festivais, Golden Week, Kōhaku).
2. Botões de ação macro para agendamento de grandes projetos (Lançamentos de Single/Álbum, Turnês).
3. Painel dinâmico da esquerda refletindo o "Conselho da Semana" do Head de Marketing para balizar as datas de lançamento.