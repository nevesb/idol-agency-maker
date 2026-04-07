# Wireframe 17 — Finances (Visão Financeira)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Finances Dashboard
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/finances`
> **GDDs**: finance-economy, agency-growth

---

## Conceito

No Football Manager, a tela de finanças deixou de ser um balancete chato de texto para se tornar um **Dashboard interativo**. No *Star Idol Agency*, esta é a central financeira da empresa.

Você gerencia orçamentos macro: quanto tem pra gastar recrutando, quanto tem pra produção de shows/músicas, e quanto de folha salarial (salários do staff + repasses/stipends das Idols).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Instalações | FINANÇAS (Ativo) | Patrocínios | Afiliações                         |
|-------------------------------------------------------------------------------------------------|
| Clube > Finanças > Resumo                                                                       |
+-------------------------------------------------------------------------------------------------+
| [ WIDGET ESQ. - SALDOS E ORÇAMENTOS ] | [ WIDGET CENTRO - GRÁFICO / BALANÇO ]                   |
|                                       |                                                         |
| BALANÇO GERAL                         | EVOLUÇÃO DO BALANÇO (Últimos 12 meses)                  |
| ¥ 450.000.000                         | [Gráfico de Área: linha verde subindo, picos pós-shows] |
| (Lucro esta época: +¥20.000.000)      |                                                         |
|                                       | RECEITAS (Este Mês)       DESPESAS (Este Mês)           |
| ORÇAMENTO DE RECRUTAMENTO             | Merchandising: ¥10M       Salários Staff:   -¥4M        |
| ¥ 50.000.000                          | Vendas de Música: ¥5M     Royalties Idols:  -¥3M        |
| [ Botão: Ajustar Orçamento (Slider) ] | Bilheteria (Shows): ¥8M   Manutenção:       -¥2M        |
| [ Botão: Fazer Pedido à Diretoria ]   | Fã Clube: ¥2M             Produção (Shows): -¥5M        |
|                                       | Patrocínios: ¥1M          Marketing:        -¥1M        |
| ORÇAMENTO SALARIAL                    |                                                         |
| ¥ 15.000.000 / mês                    | TOTAL: ¥26M               TOTAL: -¥15M                  |
| [ Barra de progresso: 80% cheia ]     |                                                         |
|                                       | LUCRO LÍQUIDO DO MÊS: +¥11M                             |
+-------------------------------------------------------------------------------------------------+
| [ WIDGET INFERIOR - PROJEÇÃO FINANCEIRA ]                                                       |
|                                                                                                 |
| (Tabela de projeção para os próximos 3 anos, simulando crescimento de contratos)                |
| Fim da Época 1 (Est): ¥ 600M | Fim da Época 2 (Est): ¥ 850M | Fim da Época 3 (Est): ¥ 1.2B      |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Dashboard em Blocos (Widget System)
Ao invés de listas intermináveis, a tela é fragmentada em *cards* visuais. O *card* da esquerda foca no **dinheiro que você pode gastar agora** (Budgets). O *card* central mostra a saúde financeira atual (Receitas vs Despesas e o Gráfico).

### 2. Barra de Ajuste e Pedidos à Diretoria
Mecânica clássica do FM:
- **[ Ajustar Orçamento ]**: O jogador pode tirar dinheiro do orçamento de "Recrutamento" e jogar para o "Orçamento Salarial" livremente (através de um *slider*), **desde que** fique dentro do teto total já aprovado pelo Board.
- **[ Fazer Pedido à Diretoria ]**: Se o produtor precisar *aumentar* o teto global (quer mais dinheiro injetado), ele deve usar este botão, que inicia um fluxo de aprovação com os investidores (resolvido na tela de Board).

### 3. Projeção Financeira
No FM26, as projeções ficaram muito mais visuais. Isso permite ao produtor entender se ele está indo à falência lentamente ou se, mantendo os custos fixos, a agência se sustenta nos próximos anos.

---

## Acceptance Criteria

1. Tela usa o layout modular (widgets) de Finanças do FM26.
2. Separa claramente o "Saldo em Caixa" (Balanço) dos "Orçamentos" (dinheiro livre para o jogador usar sem o Board bloquear).
3. Despesas e Receitas são adaptadas para o modelo Idol (Merch, Música, Shows, Fã Clube).
4. Slider de "Ajuste de Orçamento" disponível para manejar verbas entre Recrutamento/Produção vs Salários.