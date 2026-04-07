# Wireframe 38 — Market Budgets & Scouting Costs (Orçamentos de Mercado)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Scouting Budget / Transfer Obligations
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/budgets`
> **GDDs**: finance-economy, scouting-recruitment

---

## Conceito

No FM, enviar olheiros para o outro lado do mundo e comprar talentos a prazo consome seu orçamento de formas invisíveis. 
No **Star Idol Agency**, esta é a tela de **Gestão do Custo de Aquisição**. Aqui o jogador controla o Pacote de Olheiros (Scouting Network) e visualiza a dívida acumulada de multas rescisórias pagas a longo prazo para agências rivais.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | Shortlists | Atividade | Contratos | ORÇAMENTOS (Ativo)  |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - ORÇAMENTO GERAL ]            | [ COLUNA CENTRO/DIR - DETALHAMENTO ]              |
|                                             |                                                   |
| RESUMO FINANCEIRO DE RECRUTAMENTO           | ALCANCE DA REDE DE OLHEIROS (SCOUTING PACKAGE)    |
| Orçamento Atual (Restante): ¥ 25.000.000    | [ Dropdown: Pacote Nacional Avançado v ]          |
| [ Botão: Pedir mais fundos à Diretoria ]    |                                                   |
|                                             | O Pacote Nacional permite encontrar talentos em   |
| (Gráfico de Rosca mostrando o uso)          | todo o Japão instantaneamente.                    |
| > 40% Gasto em Multas de Rescisão           | Custo Mensal: ¥ 1.500.000 (Deduzido do orçamento) |
| > 10% Gasto na Rede de Olheiros             |                                                   |
| > 50% Livre para Gastar                     | [ Botão: Alterar Pacote (Global/Mundial) ]        |
|                                             |---------------------------------------------------|
|                                             | COMPROMISSOS FUTUROS (DÍVIDAS DE MERCADO)         |
|                                             | Histórico de "Quebras de Contrato" parceladas:    |
|                                             |                                                   |
|                                             | > Natsumi (Comprada da Titan Ag.)                 |
|                                             |   Multa Original: ¥ 15.000.000                    |
|                                             |   Parcelas Restantes: ¥ 500k / mês (10 meses)     |
|                                             |                                                   |
|                                             | > Emi (Comprada da RedMoon Ag.)                   |
|                                             |   Multa Original: ¥ 8.000.000                     |
|                                             |   (Paga à Vista) - Encerrado                      |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Scouting Packages (Pacotes de Dados)
A mecânica de UI do FM onde você escolhe se quer uma busca apenas Local, Nacional ou Global. Quanto maior a abrangência do pacote (selecionado no dropdown central), maior o custo mensal deduzido.

### 2. Painel de Dívidas (Transfer Clauses/Obligations)
Uma lista vital que mostra ao jogador para onde o dinheiro está vazando. Comprar uma idol de uma agência rival pagando em 12 parcelas cria um passivo (compromisso futuro) mapeado claramente na direita.

---

## Acceptance Criteria

1. Gráfico de consumo orçamentário na esquerda mostrando Dinheiro Gasto vs Disponível.
2. Controle explícito do "Scouting Package" com impacto financeiro alertado.
3. Lista detalhada de multas rescisórias ou compras parceladas de outras agências.