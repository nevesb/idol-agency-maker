# Wireframe 55 — Match Engine View (O Show Ao Vivo)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Match Day Experience / 2D-3D Engine  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/live`  
> **GDDs**: show-system, match-engine

---

## Conceito

A alma do Football Manager é ver as "bolinhas" (2D) ou o motor 3D correndo enquanto você grita com a tela.
No **Star Idol Agency**, o **Show Ao Vivo (Match Engine View)** é onde o produtor assiste à execução do Setlist que ele montou. É uma tela focada em UI limpa nas bordas e ação no centro (com "Highlights" da música atual), onde você monitora as notas em tempo real e reage.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
| [ PAINEL SUPERIOR - PLACAR/STATUS ]                                                             |
| CELESTIAL NINE: TOUR TOKYO DOME          [ Tempo de Show: 45:10 ]          HYPE: [||||||||  ]   |
| Música Atual (4/12): "Breaking Point"                                      Público: Extasiado   |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - NOTAS AO VIVO ]           | [ ÁREA CENTRAL - VISÃO DO PALCO (O JOGO) ]           |
|                                          |                                                      |
| DESEMPENHO EM TEMPO REAL                 | [ Vista de Câmera isométrica do palco. Avatares/2D   |
| Sakura: 8.5 (Focada, Dominando)          |   das Idols nas posições que você definiu. ]         |
| Aiko:   7.2 (Garganta levemente seca)    |                                                      |
| Yumi:   6.0 [!] (Cansando Rápido)        | > SAKURA executa o Solo de Dança com perfeição!      |
| Haruka: 6.8                              |   [ O Hype da platéia sobe +5% ]                     |
|                                          |                                                      |
| ESTATÍSTICAS DO SHOW                     | > AIKO hesita na nota alta!                          |
| Sincronia de Dança: 88%                  |   [ O público percebe a falha. Hype cai -2% ]        |
| Acertos Vocais: 92%                      |                                                      |
| Impacto dos Efeitos: Excelente           |                                                      |
|                                          |                                                      |
|------------------------------------------|------------------------------------------------------|
| [ PAINEL INFERIOR - GRITOS DA LATERAL (TOUCHLINE INSTRUCTIONS) E BANCO DE RESERVAS ]            |
|                                                                                                 |
| INSTRUÇÕES DE BEIRA DE PALCO (SHOUTS)                                                           |
| [ Elogiar (Motivar) ]  [ Exigir Mais Sincronia ]  [ Pedir Calma ]  [ Incitar o Público (MC) ]   |
|                                                                                                 |
| [ Botão Rápido: Substituição de Emergência (Acionar Trainee substituta para música 5) ]         |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. The Match Interface (Placar e Jogo)
No FM moderno, a tela inteira é dedicada à grama 3D, com os widgets de informação soltos nas laterais. O centro mostra o texto narrativo clássico (Comentários) do que está dando certo ou errado. Ex: "Aiko hesita na nota alta!".

### 2. Live Ratings (Notas 1 a 10)
A obsessão do jogador de FM é olhar os números 6.0 e surtar. A coluna da esquerda mostra as integrantes do grupo performando. Se a barra de Estamina (Fadiga) da Yumi zerou devido à Setlist pesada, a nota dela começa a cair de 7.0 para 6.0 rapidamente.

### 3. Touchline Shouts (Instruções de Beira de Campo)
No FM, você grita "Demand More" e o time todo reage com um smile vermelho de frustração ou verde de foco. Aqui, os "Shouts" são instruções dadas pelo ponto no ouvido das Idols. Clicar em "Exigir Sincronia" dá um boost temporário em Dança, mas drena a estamina delas.

---

## Acceptance Criteria

1. Tela apresenta layout "Imersivo" com a simulação do evento (visual/texto) no centro.
2. Atualização em tempo real das notas individuais (1.0 a 10.0) de cada participante com base no engine simulado.
3. Disponibilização de ações táticas de intervenção ("Shouts") com tempo de recarga (cooldown) aplicável ao mental das idols.