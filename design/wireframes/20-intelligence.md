# Wireframe 20 — Intelligence & Data (Centro de Inteligência)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Data Hub
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/intelligence`
> **GDDs**: intelligence-reports, agency-strategy

---

## Conceito

No FM, o "Data Hub" (Centro de Dados) é onde você analisa o desempenho da equipe através de gráficos avançados (mapas de calor, radares, xG). 

No **Star Idol Agency**, esta é a central de Inteligência de Mercado. Aqui o produtor consome gráficos de engajamento, tendências musicais da Oricon, mapa de calor de fãs no Japão e a performance dos singles lançados.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Instalações | Finanças | Visão e Estratégia | A Diretoria | INTELIGÊNCIA (Ativo)  |
|-------------------------------------------------------------------------------------------------|
| Clube > Inteligência > Visão Geral                                                              |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - RELATÓRIOS DO ANALISTA ]      | [ CENTRO/DIR - DASHBOARD DE GRÁFICOS (GRID) ]    |
|                                              |                                                  |
| ÚLTIMAS ANÁLISES (Por: Head de Marketing)    | [ GRÁFICO 1: MAPA DE CALOR DE FÃS ]              |
|                                              | Visualização do Japão. Forte concentração em     |
| [Ícone Tendência] O gênero "Synth-Pop" está  | Tóquio (Vermelho) e Osaka (Laranja). Baixa na    |
| em alta nas paradas este mês.                | região de Hokkaido (Azul).                       |
|                                              | Ação recomendada: Turnê em Hokkaido para crescer.|
| [Ícone Queda] As vendas do nosso último      |                                                  |
| álbum físico caíram 12% na 2ª semana.        |--------------------------------------------------|
|                                              | [ GRÁFICO 2: PERFORMANCE DOS SINGLES ]           |
|                                              |                                                  |
| SOLICITAR RELATÓRIOS ESPECÍFICOS             | Eixo Y: Posição na Chart (Oricon)                |
| > Tendência Musical Mensal                   | Eixo X: Semanas após o Lançamento                |
| > Análise de Agências Rivais                 |                                                  |
| > Análise de Demografia de Fãs               | [Gráfico de Linhas comparando Single A vs B]     |
|                                              |                                                  |
|                                              |--------------------------------------------------|
| ANÁLISE DE RIVAIS (Agência "Titan")          | [ GRÁFICO 3: POLÍGONO DE TALENTOS (RADAR) ]      |
| Os grupos deles dominam a TV, enquanto nós   | Comparativo: Nosso Grupo Principal vs Média Oricon|
| dominamos Streaming.                         | (Vocal, Dança, Carisma, Visual, Variedade)       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Layout de Gráficos em Grid
O Data Hub do FM é famoso pelo seu mural customizável de gráficos. Aqui usamos a mesma linguagem: blocos de dados contendo Radares, Linhas e Mapas de Calor, que podem ser filtrados e alterados na hora.

### 2. Painel de Insight do Analista (Esquerda)
O "Ask Analyst" do FM. O Head de Marketing gera manchetes textuais mastigadas (ex: "Synth-Pop está em alta") para que o jogador não precise ler os gráficos cruamente se não quiser.

---

## Acceptance Criteria

1. Tela modular, permitindo que o Produtor "fixe" gráficos favoritos no mural.
2. Uso de Polígonos (Radar Charts) para comparar o roster da agência com a média do mercado.
3. Inclusão do "Analyst Insight" (textos curtos gerados pela IA ou Head de Marketing) na coluna da esquerda.