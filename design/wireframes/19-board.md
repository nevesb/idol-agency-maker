# Wireframe 19 — Board (A Diretoria / Investidores)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Board / Make Board Request
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/board`
> **GDDs**: board-expectations, agency-growth

---

## Conceito

A tela de interação com os "Donos do Dinheiro" (Investidores ou Presidente da Agência). No FM, é aqui que você visualiza a confiança que eles têm no seu trabalho e, mais importante, **onde você faz pedidos** (aumentar orçamentos, melhorar instalações, expandir staff).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Instalações | Finanças | Visão e Estratégia | A DIRETORIA (Ativo)                 |
|-------------------------------------------------------------------------------------------------|
| Clube > A Diretoria                                                                             |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQUERDA - STATUS DOS INVESTIDORES ] | [ COLUNA DIREITA - PEDIDOS À DIRETORIA ]        |
|                                               |                                                 |
| PRESIDENTE / CEO                              | FAZER UM PEDIDO (Dropdown Interativo)           |
| [Avatar] Sr. Yorihiro                         |                                                 |
| Status: Muito Feliz                           | > FINANÇAS                                      |
|                                               |   - Aumentar Orçamento Salarial                 |
| CONFIANÇA ATUAL                               |   - Aumentar Orçamento de Recrutamento          |
| Global: [==================  ] 85%            |   - Reter mais % das vendas de ingressos        |
|                                               |                                                 |
| ÚLTIMOS FEEDBACKS                             | > INSTALAÇÕES                                   |
| [Ícone Verde] Satisfeitos com o lucro do      |   - Expandir Sala de Dança                      |
| show no Tokyo Dome. (+15%)                    |   - Expandir Estúdio de Gravação                |
| [Ícone Vermelho] Decepcionados com o          |   - Melhorar Alojamentos das Idols              |
| escândalo da Trainee Yui. (-5%)               |                                                 |
|                                               | > STAFF                                         |
|                                               |   - Aumentar número máximo de Produtores        |
|                                               |   - Aumentar número máximo de Olheiros          |
|                                               |                                                 |
|                                               |-------------------------------------------------|
|                                               | PEDIDOS EM ANDAMENTO / HISTÓRICO                |
|                                               | [ 12/08 ] Expandir Estúdio: APROVADO            |
|                                               | [ 05/04 ] Aumentar Salários: REJEITADO          |
+-------------------------------------------------------------------------------------------------+

===================================================================================================
EXEMPLOS DE FLUXO DE PEDIDOS (INBOX & OVERLAY)
===================================================================================================

CENÁRIO A: APROVAÇÃO DIRETA (Mensagem na Inbox)
---------------------------------------------------------------------------------------------------
| DE: Sr. Yorihiro (CEO)                                                                          |
| ASSUNTO: Pedido de Expansão do Estúdio Aprovado                                                 |
|                                                                                                 |
| "Após analisarmos o seu pedido e o excelente retorno financeiro do último trimestre, a          |
| diretoria concorda que expandir o Estúdio de Gravação é o passo certo para a agência.           |
|                                                                                                 |
| Os fundos (¥ 20.000.000) já foram deduzidos do balanço e a obra começará no próximo mês."       |
|                                                                                                 |
| [ Botão: Agradecer à Diretoria ]                                                                |
---------------------------------------------------------------------------------------------------

CENÁRIO B: REJEIÇÃO & NEGOCIAÇÃO (Modal Interativo na tela do Board)
---------------------------------------------------------------------------------------------------
| [ Modal Flutuante Centralizado ]                                                                |
|                                                                                                 |
| Tópico: Aumentar Orçamento Salarial                                                             |
|                                                                                                 |
| DIRETORIA (Sr. Yorihiro):                                                                       |
| "Acreditamos que o orçamento atual é mais do que suficiente para as ambições que temos          |
| para esta época. A agência não está em posição de inflar a folha de pagamento agora. Por        |
| que deveríamos liberar mais fundos?"                                                            |
|                                                                                                 |
| SUAS RESPOSTAS (Escolha uma para tentar convencer):                                             |
| ( ) "Precisamos de salários maiores para não perder nosso melhor coreógrafo para a rival."      |
| ( ) "Se queremos alcançar o Top 10 da Oricon, precisamos investir mais em talentos."            |
| ( ) "Deixe pra lá, concordo que não é o momento." (Desistir)                                    |
| ( ) "Se não me derem os fundos, não poderei continuar neste cargo." (Ultimato - ALTO RISCO)     |
|                                                                                                 |
| [ Botão: Confirmar Resposta ]                                                                   |
---------------------------------------------------------------------------------------------------

CENÁRIO C: RESULTADO DO ULTIMATO (Mensagem na Inbox)
---------------------------------------------------------------------------------------------------
| DE: Sr. Yorihiro (CEO)                                                                          |
| ASSUNTO: Rescisão de Contrato                                                                   |
|                                                                                                 |
| "Nesta agência, ninguém é maior que a instituição. Visto que você nos deu um ultimato           |
| inaceitável durante as negociações de orçamento, a diretoria decidiu encerrar seu contrato      |
| com efeito imediato. Por favor, devolva o seu crachá de Produtor."                              |
|                                                                                                 |
| [ Botão: Menu Principal (Game Over) ]                                                           |
---------------------------------------------------------------------------------------------------
```

## Componentes FM26 Aplicados

### 1. Painel de Pedidos (Right Column)
Uma lista sanfonada (accordion) agrupando os tipos de pedidos possíveis. Em vez de menus escondidos, o jogador vê todas as possibilidades de investimento na agência diretamente na tela do Board.

### 2. Histórico de Pedidos
Mostra o que foi pedido recentemente. O FM bloqueia *spam* de pedidos (você não pode pedir a mesma coisa duas vezes no mesmo mês se foi rejeitado), e o histórico deixa isso claro.

### 3. Modal Conversacional (Negociação)
O "Board Interaction". Quando um pedido é feito (ex: clicou em "Expandir Sala de Dança"), se o Board não aprovar de imediato, abre-se este modal clássico de diálogo onde o jogador usa seu atributo de persuasão e o desempenho atual para tentar convencer a diretoria, com risco de ser demitido se der um "Ultimato" ("Leak to Press" / "Ultimatum").

---

## Acceptance Criteria

1. Interface de pedidos organizada em categorias lógicas (Finanças, Instalações, Staff).
2. Indicador claro do humor/confiança atual do CEO/Investidores.
3. Inclusão do clássico modal de diálogo do FM para aprovação/rejeição de pedidos, amarrando a narrativa do jogo às limitações financeiras.