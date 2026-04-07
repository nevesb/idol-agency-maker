# Wireframe 49 — Show Overview (Visão Geral do Show/Evento)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Match Preview / Fixture Overview  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/overview`  
> **GDDs**: show-system, agency-growth  

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

## Acceptance Criteria

1. Cabeçalho rico em informações do evento (Data, Local, Lotação, Status de Bilheteria).
2. Painel esquerdo com lineup/escalação e condição física/mental das participantes.
3. Painel direito projetando ganhos financeiros e impacto reputacional baseado na qualidade esperada do show.
4. Avisos contextuais de concorrência de mídia ou conflitos de datas que possam roubar holofotes.