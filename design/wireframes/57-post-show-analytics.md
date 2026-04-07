# Wireframe 57 — Post-Show Analytics (Relatório Pós-Show)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Post-Match Analytics / Data Hub Match Summary  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/post-match`  
> **GDDs**: show-system, finance-economy

---

## Conceito

No FM, acabou o jogo, o apito final soa e você cai na tela do Data Hub para ver xG (Gols Esperados), mapa de calor e a fofoca do Twitter.
No **Star Idol Agency**, esta é a tela de **Análise Pós-Show (Post-Show Analytics)**. É o fechamento de caixa do evento e a medição do estrago (ou triunfo) cultural. Quantos fãs novos você ganhou? Alguma Idol virou estrela da noite? Quanto dinheiro o caixa retém após pagar as multas do show atrasado?

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (FIM) | Clube | Carreira           |
|-------------------------------------------------------------------------------------------------|
| SHOW CONCLUÍDO: Celestial Nine - TOUR TOKYO DOME                                                |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - RESULTADOS FINANCEIROS ]    | [ COLUNA CENTRO/DIR - ANÁLISE DE PERFORMANCE ]     |
|                                            |                                                    |
| BALANÇO FINANCEIRO DO EVENTO               | NOTAS FINAIS DO ELENCO (RATINGS)                   |
| Receita de Ingressos:   ¥ 432.000.000      | 9.5 (MOTM) Sakura: Dominou o palco.                |
| Receita de Merchandising:¥ 110.000.000 [+] | 8.2        Haruka: Surpreendeu nos vocais altos.   |
| Streaming Online:        ¥ 15.000.000      | 6.5        Aiko: Nervosa, falhou na 2ª música.     |
|                                            | 5.0 [!]    Yumi: Lesionada (Fadiga Extrema).       |
| Custos de Produção (SFX): -¥ 20.500.000    |                                                    |
| Custos Logísticos:        -¥ 10.000.000    | ANÁLISE DO SETLIST (Data Hub Analytics)            |
| Multa por Atraso:         -¥ 5.000.000     | [ Gráfico de Linha do Hype da Platéia ]            |
|                                            | Inicio (Músicas 1-3): Bom (70%)                    |
| LUCRO LÍQUIDO (AGÊNCIA):  ¥ 521.500.000    | Meio (Músicas 4-6): Queda acentuada (Baladas)      |
|--------------------------------------------| Fim (Encore/Música 12): Pico Histórico! (98%)      |
|                                            |                                                    |
| FEEDBACK DAS REDES SOCIAIS (TWEETS)        | REPERCUSSÃO NA MÍDIA                               |
| @IdolFan99: "O choro da Yumi no meio da    | [Jornal] 'Tokyo Idol News': "O Celestial Nine      |
| coreografia cortou meu coração..."         | calou os críticos num show visualmente deslumbrante|
|                                            | graças aos efeitos de palco agressivos."           |
| @PopCultureJP: "A Sakura é o futuro do Pop.|                                                    |
| Ela engoliu o palco inteiro hoje!"         | AVALIAÇÃO DA DIRETORIA (BOARD CONFIDENCE)          |
|                                            | Confiança no Produtor: [ Verde ] Aumentou          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Data Hub (Match Summary)
Em vez de só dar uma nota, o FM26 usa gráficos. O gráfico de linha de "Hype da Platéia" mapeia a reação aos slots do Setlist. Você verá que as 3 baladas que colocou no meio do show quase mataram o público de tédio.

### 2. Social Media Reaction Panel
O painel do Twitter/X do FM. Os fãs reagem às decisões tomadas no Match Engine. Se Yumi colapsar no palco, isso vira "Drama" nas redes (pode até aumentar fama, mas afundar a felicidade dela).

### 3. Financial Settlement
A tela de pós-jogo no FM mostra a renda da bilheteria num cantinho. Aqui o dinheiro é vital. As vendas de camisa/merchandising disparam se o show for épico. Se o Produtor esticou demais o intervalo e atrasou o cronograma da casa, a agência engole uma multa logística pesada ali mesmo.

---

## Acceptance Criteria

1. Gráfico visual (linha) representando a curva de Hype/Atenção do público por música tocada.
2. Lista de notas numéricas finais de 1.0 a 10.0 para cada integrante baseada no Match Engine.
3. Tela consolida as despesas calculadas no Wireframe 51 e desconta do Lucro Bruto arrecadado.
4. Painel de reações da mídia social e manchetes da mídia refletindo eventos do show (como estrelato individual ou acidentes técnicos).