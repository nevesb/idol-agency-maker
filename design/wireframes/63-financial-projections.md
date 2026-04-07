# Wireframe 63 — Financial Projections (Finanças Avançadas)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Finances / Projections Graph  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings/finances`  
> **GDDs**: finance-economy

---

## Conceito

No FM, o FFP (Fair Play Financeiro) assombra o jogador. Você tem a tela de finanças para ver a projeção do caixa a 3 anos.
No **Star Idol Agency**, esta é a tela de **Auditoria e Projeções Financeiras**. Você gastou ¥ 150 Milhões num palco para o Tokyo Dome. O contador da agência entra em pânico. Aqui você vê o gráfico de linha prevendo se a agência vai falir em dezembro caso você não diminua a folha salarial ou venda merchandising urgente.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| Rankings | FINANÇAS AVANÇADAS (Ativo) | Histórico Oricon | Auditoria Médica | Segurança         |
+-------------------------------------------------------------------------------------------------+
| [ BARRA DE SAÚDE FINANCEIRA ]                                                                   |
| Saldo Atual em Caixa: ¥ 450.000.000 | Status da Diretoria: [Verde] Rico                         |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - PROJEÇÕES DE CAIXA ]        | [ COLUNA CENTRO/DIR - QUEBRA DE DESPESAS/RECEITAS ]|
|                                            |                                                    |
| GRÁFICO DE PROJEÇÃO (3 ANOS)               | SUMÁRIO DA TEMPORADA ATUAL                         |
|                                            |                                                    |
| [ Gráfico de Linha Crescente ]             | RECEITAS PRINCIPAIS                                |
| Saldo Atual (2026): ¥ 450M                 | > Shows e Turnês:         ¥ 500.000.000          |
| Projeção Fim de 2026: ¥ 600M               | > Venda de Singles:       ¥ 320.000.000          |
| Projeção Fim de 2027: ¥ 550M (Leve queda)  | > Merchandising/Loja:     ¥ 150.000.000          |
| Projeção Fim de 2028: ¥ 800M               | > Jobs de Patrocínio:     ¥ 80.000.000           |
|                                            | Total de Entradas:        ¥ 1.050.000.000        |
| ALERTA DO DIRETOR FINANCEIRO               |                                                    |
| "As renovações contratuais previstas para  | DESPESAS PRINCIPAIS                                |
| 2027 vão inflacionar nossa folha salarial  | > Folha Salarial (Idols): ¥ -200.000.000         |
| em 40%. Precisamos garantir uma grande     | > Folha Salarial (Staff): ¥ -120.000.000         |
| turnê no final do ano para compensar."     | > Multas Rescisórias:     ¥ -50.000.000          |
|                                            | > Custos de Shows/Palcos: ¥ -230.000.000         |
|                                            | Total de Saídas:          ¥ -600.000.000         |
|                                            |                                                    |
| [ Botão: Ajustar Orçamento de Recrutamento]| LUCRO LÍQUIDO NO ANO:     ¥ 450.000.000          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. 3-Year Projection Graph
O FM é um jogo de paciência. A projeção financeira é a ferramenta número 1 para evitar a falência. A UI apresenta o gráfico de linhas claro na esquerda. Se a linha cair para o vermelho no ano 2, a presidência bloqueia novas contratações na hora.

### 2. Income/Expenditure Breakdown (Quebra de Caixa)
No FM é "Gate Receipts vs Player Wages". Aqui temos "Shows e Singles vs Folha Salarial e SFX de Palco". O jogador precisa equilibrar essa equação visual para se manter no azul.

---

## Acceptance Criteria

1. Gráfico visual (linhas ou barras) com projeção de caixa para os próximos 1 a 3 anos.
2. Divisão detalhada (Breakdown) de onde vem o dinheiro (Receitas) e para onde vai (Despesas).
3. Feedback qualitativo/alerta da equipe financeira (IA) indicando gargalos futuros (ex: explosão salarial por fim de contrato).