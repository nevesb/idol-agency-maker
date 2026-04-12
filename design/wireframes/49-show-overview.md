# Wireframe 49 — Show Overview (Visão Geral do Show/Evento)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Match Preview / Fixture Overview  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/overview`  
> **GDDs**: show-system, agency-growth, staff-functional  

---

## Conceito

No Football Manager, antes de cada jogo você abre a tela de "Pré-Jogo" (Match Preview). Lá você vê a importância da partida, o histórico contra o adversário e a escalação provável.  
No **Star Idol Agency**, esta é a tela de **Visão Geral do Show/Evento** (Concerto, Festival, Live de TV). É onde você sente o peso do momento: um show lotado no Tokyo Dome é diferente de uma apresentação íntima num café de Shibuya. Aqui você decide se ajusta a coreografia de última hora ou se mantém o setlist seguro.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Planejamento | SETLIST (Ativo) | Ensaios | Operações | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Visão Geral > Celestial Nine: TOUR FINAL TOKYO DOME                               |
+-------------------------------------------------------------------------------------------------+
| [ CABEÇALHO DO SHOW ]                                                                           |
| [Poster/Banner do Show] | CELESTIAL NINE: TOUR FINAL - TOKYO DOME                               |
| Data: Sábado, 16/04/2026 | Horário: 18:00 | Local: Tokyo Dome (Capacidade: 55.000)            |
| Status da Bilheteria: 98% Vendido (54.000 ingressos) | Hype Médio: [★★★★☆] Nacional           |
|                                                                                                 |
| [ Botões de Ação: ] [ Ver Detalhes da Produção ] [ Ajustar Setlist ] [ Ver Feedback da Imprensa ]|
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - INFORMAÇÕES DO SHOW ]       | [ COLUNA CENTRO/DIR - IMPACTO ESPERADO ]            |
|                                            |                                                     |
| ESCALAÇÃO DO GRUPO (LINEUP)                | EXPECTATIVA DE RECEITA FINANCEIRA                   |
| Center: Sakura                             | Bilheteria (54k x ¥8.000): ¥ 432.000.000          |
| Main Vocal: Aiko                           | Merchandising (Estim.):    ¥ 50.000.000           |
| Lead Dancer: Yumi | Dancer: Miku            | Streaming ao Vivo:         ¥ 10.000.000           |
| Sub Vocal: Haruka | Trainee: Kaho           | Total Esperado:            ¥ 492.000.000        |
|                                            |                                                     |
| CONDIÇÃO DO ELENÇO                         | IMPACTO NA CARREIRA (HYPE E FAMA)                   |
| [Verde] Sakura: Pronta para o Show         | Se o show for Excelente:                              |
| [Verde] Aiko: Treinada e Confiante         | + Fama Nacional massiva para cada membro            |
| [Amarelo] Yumi: Fadiga Alta (Risco!)       | + Bônus de contrato para renovações futuras         |
| [Verde] Outras: OK                         | + Chance de Trending Topics Globais                 |
|                                            |                                                     |
| RIVALIDADE / CONCORRÊNCIA NA DATA          | Se o show for Ruim (Falha Técnica):                   |
| "A agência Titan lançará um single de      | - Queda abrupta de Fama                             |
| última hora na sexta-feira anterior.      | - Críticas da Imprensa                              |
| Isso pode roubar alguma atenção da mídia  | - Perda de Contratos de Publicidade                 |
| especializada no sábado."                  |                                                     |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Match Preview Header (Cabeçalho de Pré-Jogo)  
O FM26 trata cada jogo como um evento único. Você vê a capacidade do estádio, o clima e a bilheteria. No Idol Agency, isso traduz para: "O Tokyo Dome está 98% cheio, o público está hypado, esse é o momento de ouro".

### 2. Escalação (Squad Selection Preview)  
Na esquerda, a "Lineup" do grupo. Assim como o FM mostra quem está titular e quem está no banco, aqui você vê quem é Center, quem está de fora por fadiga, e qual a condição mental de cada integrante antes de subir ao palco.

### 3. Projeção de Resultados (Direita)  
O FM calcula "Changes of Winning". Aqui calculamos "Expectativa de Retorno Financeiro e de Fama". O painel direito diz o quanto você vai ganhar/lucrar e o quanto o "Hype" vai subir se o show for um sucesso esmagador vs um fiasco técnico.

---

## Aba: Atribuição de Staff do Show (Merged from WF-16)

> This sub-view is accessed within Show Overview when preparing a specific show (e.g. clicking "Ver Detalhes da Produção" or navigating to the staff assignment step in the show preparation flow). It replaces the standalone route `/agency/events/assignments` from WF-16.

```text
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - REQUISITOS DO SHOW ]   | [ CENTRO - STAFF DISPONÍVEL ]     | [ DIR - O EVENTO ]  |
|                                       |                                   |                     |
| EXIGÊNCIAS DO EVENTO                  | STAFF (Arraste ou Selecione)      | TOKYO DOME LIVE     |
| (Tokyo Dome Live - 50.000 pessoas)    |                                   | Data: Sáb, 18:00    |
|                                       | [Drop: Filtrar por Função v]      | Local: Tokyo Dome   |
| [ ] Direção de Palco (Obrigatório)    |                                   | Tipo: Grande Show   |
|     (Vazio)                           | [Avatar] Sr. Tanaka (Segurança)   |                     |
|     + Clicar para adicionar           | Nível: 16 | Custo: ¥50k/evento    | EXPECTATIVAS        |
|                                       |                                   | Figurino: [★★★★☆]   |
| [X] Road Manager                      | [Avatar] Miki (Stylist)           | Palco:    [★★★★★]   |
|     [Avatar] Você (Produtor)          | Nível: 14 | Custo: Fixa (Mês)     | Segurança:[★★★☆☆]   |
|                                       |                                   |                     |
| [X] Stylist Principal                 | [Avatar] Koji (Stage Director)    | IMPACTO ATUAL STAFF |
|     [Avatar] Miki                     | Nível: 19 | Custo: ¥120k/evento   | Bônus Estética: +15 |
|                                       |                                   | Risco de Furo: 2%   |
| [ ] Equipe de Segurança (Recomendado) | [Avatar] Sakura (Makeup)          |                     |
|     (Vazio)                           | Nível: 12 | Custo: Fixa (Mês)     | [ Botão: Auto-Fill] |
|     + Clicar para adicionar           |                                   |                     |
|                                       | [Avatar] Kenji (Road Manager)     |                     |
| CUSTO ESTIMADO DO STAFF: ¥0           | Nível: 10 | Custo: Fixa (Mês)     |                     |
+-------------------------------------------------------------------------------------------------+
```

### Coluna Esquerda — Checklist de Requisitos do Show

Lista as funções de staff necessárias para o evento, com status de preenchimento:

- **Direção de Palco** (Obrigatório) — vazio por padrão, clicar para atribuir da lista central
- **Road Manager** — pode ser o próprio Produtor ou um staff dedicado
- **Stylist Principal** — impacta a nota de Figurino no painel de Expectativas
- **Equipe de Segurança** (Recomendado) — afeta a nota de Segurança e risco de incidentes

Checkbox marcado (`[X]`) indica atribuição feita. Caixa vazia (`[ ]`) indica pendência.  
**CUSTO ESTIMADO DO STAFF** é atualizado em tempo real conforme as atribuições são feitas.

### Coluna Central — Painel de Seleção de Staff Disponível

Lista de cards verticais (Avatar, Nome, Função, Nível, Custo). O jogador arrasta ou clica para mover um staff da lista central para uma das posições da coluna esquerda. Suporta filtro por função via dropdown.

- Staffs com contrato fixo (mês) aparecem com "Custo: Fixa (Mês)"
- Staffs freelancers aparecem com custo por evento (ex.: ¥50k/evento)
- Esta distinção impacta diretamente o orçamento do show

### Coluna Direita — Painel de Impacto do Evento

Resume o evento e mostra o impacto em tempo real conforme o staff é atribuído:

- **Expectativas** (estrelas): Figurino, Palco, Segurança — sobem com staffs de maior nível
- **Impacto Atual do Staff**: Bônus de Estética e Risco de Furo em % calculados dinamicamente

### Botão Auto-Fill

Presente no painel direito. Delega a escolha de staff para a IA/Assistente do jogo, que seleciona automaticamente a combinação de melhor custo-benefício dentro do orçamento disponível.

---

## Acceptance Criteria

1. Cabeçalho rico em informações do evento (Data, Local, Lotação, Status de Bilheteria).
2. Painel esquerdo com lineup/escalação e condição física/mental das participantes.
3. Painel direito projetando ganhos financeiros e impacto reputacional baseado na qualidade esperada do show.
4. Avisos contextuais de concorrência de mídia ou conflitos de datas que possam roubar holofotes.
5. Top menu unificado reflete a nova aba "Match Day" do FM26, mas como "Dia de Show".
6. Estrutura 3-colunas na sub-view de staff que facilita a leitura "Requisito -> Seleção -> Impacto Geral".
7. Visualização clara entre staffs que ganham "por evento" (freelancers) vs staff "fixo/mês", impactando as finanças diretas do show.
8. Auto-Fill presente para delegar a escolha de staff para a IA/Assistente do jogo.