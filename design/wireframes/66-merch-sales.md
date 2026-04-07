# Wireframe 66 — Merch & Sales (Loja de Merchandising)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Club Vision / Finance Breakdown / Commercial Overview  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings/merch`  
> **GDDs**: finance-economy

---

## Conceito

No FM, o balanço de "Venda de Camisas" aparece uma vez por mês e você só olha.
No **Star Idol Agency**, esta é a tela de **Gestão de Merchandising**. O lucro com música (Spotify) paga as contas, mas o lucro que enriquece a agência vem da venda de "Lightsticks", toalhas, photocards e CDs físicos (Gacha). Aqui você vê quem é a favorita do público e ajusta a produção.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| Rankings | Finanças | Histórico Oricon | Auditoria Médica | Segurança | MERCHANDISING (Ativo) |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - RECEITA COMERCIAL DA TEMPORADA ]                                            |
| Total Arrecadado: ¥ 250.000.000 | Item mais vendido: Lightstick 'Celestial' (85.000 unid.)      |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - AS MAIS VENDIDAS (RANKING) ]| [ COLUNA CENTRO/DIR - GERENCIAMENTO DE ESTOQUE ]   |
|                                            |                                                    |
| RANKING INTERNO DE POPULARIDADE (Vendas)   | PRODUÇÃO DE ITENS (Lote Mensal)                    |
| O público "vota com a carteira".           |                                                    |
|                                            | [Ícone] PHOTOCARDS ALEATÓRIOS (Gacha)              |
| 1. [Avatar] Sakura (35% das vendas totais) | Tiragem atual: 50.000 pacotes/mês                  |
|    "Os fãs compram qualquer coisa com a    | Margem de Lucro: 85% (Altíssima)                   |
|     cara dela."                            | [ Botão: Aumentar Produção (+20%) ]                |
|                                            |                                                    |
| 2. [Avatar] Aiko (20% das vendas)          | [Ícone] LIGHTSTICKS OFICIAIS                       |
|                                            | Tiragem atual: 10.000 unidades/mês                 |
| 3. [Avatar] Yumi (15% das vendas)          | Margem de Lucro: 40%                               |
|                                            | Status: Esgotado nos últimos 3 shows!              |
| ...                                        | [ Botão: Encomendar Lote de Emergência (Caro) ]    |
|                                            |                                                    |
| 9. [Avatar] Kaho (1% das vendas)           |----------------------------------------------------|
|    "Trainee com pouco apelo comercial."    | DECISÕES COMERCIAIS (Diretor de Marketing)         |
|                                            |                                                    |
| IMPACTO DO ESTOQUE                         | "Sugiro lançar um 'Photobook' especial de Verão da |
| Fãs insatisfeitos porque a toalha da Sakura| Sakura. Custa ¥ 5M para produzir, mas a previsão   |
| acabou no último show.                     | de vendas é de ¥ 30M na primeira semana."          |
|                                            | [ Aprovar Produção Especial ] [ Recusar ]          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Player Popularity Metric (Shirt Sales Ranking)
Igual ao FM dizendo que o Messi é quem mais vende camisa no seu time. No jogo de Idol, a Sakura ser a top vendedora significa que a agência fica refém dela. Se ela sair, 35% do faturamento da loja some.

### 2. Commercial Supply Chain (Ajuste de Tiragem)
Uma pequena camada de *management*. O jogo não te faz fabricar uma a uma, mas você dita "Tiragem". Se você produziu pouco Lightstick (os bastões de luz para shows), eles esgotam e você perde dinheiro (Painel Central). O jogador precisa adequar a produção à fama crescente do grupo.

### 3. Backroom Marketing Advice (Conselhos do Board)
Igual a diretoria do FM sugerindo um patrocínio. O Head de Marketing (ou Diretor Comercial) aparece no rodapé e entrega uma missão comercial "Fogo Rápido" (Fazer um Photobook) pra gerar injeção de caixa rápido, exigindo apenas a aprovação financeira do Produtor.

---

## Acceptance Criteria

1. Painel esquerdo com ranking dinâmico de popularidade individual ditado pelas vendas de merchandising (camisas/photocards).
2. Interface simples de ajuste de tiragem (Lotes) para controlar a oferta vs demanda da loja da agência.
3. Eventos propostos pela IA (Equipe de Marketing) que podem ser aceitos/rejeitados para alavancar a receita a curto prazo.