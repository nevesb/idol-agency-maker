# Wireframe 40 — Vitrine (Transfer & Loan List)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Offer to Clubs / Transfer List
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/showcase`
> **GDDs**: contract-system, idol-lifecycle, finance-economy

---

## Conceito

No FM, quando um jogador não serve mais para o time ou você quer que um jovem ganhe experiência, você o coloca na "Transfer List" ou "Loan List".
No **Star Idol Agency**, esta é a tela de **Vitrine (Showcase)**. Aqui ficam as Idols ou Trainees que você quer:
1. **Emprestar (Collabs / Atuar em Dramas / Outras Agências menores)** para ganhar fama sem você pagar o salário todo.
2. **Transferir (Vender Contrato)** para lucrar com uma idol insatisfeita ou que não se encaixa no grupo principal.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | Shortlists | Atividade | Contratos | Quadro | VITRINE      |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - A VITRINE ]                 | [ COLUNA CENTRO/DIR - DETALHES DA OFERTA ]         |
|                                            |                                                    |
| LISTA DE TRANSFERÊNCIA (VENDER CONTRATO)   | AÇÕES: REINA (Em Transferência)                    |
| [ ] [Foto] Reina (22)                      |                                                    |
|     Status: Insatisfeita                   | VALOR DO PASSE (MULTA RESCISÓRIA)                  |
|     Pedindo: ¥ 20.000.000 (Negociável)     | > Valor Atual: ¥ 20.000.000                        |
|                                            |   [ Dropdown: Não Especificado v ]                 |
| [ ] [Foto] Aiko (19)                       |                                                    |
|     Status: Transferência a Pedido dela    | OFERECER ÀS AGÊNCIAS (OFFER TO CLUBS)              |
|     Pedindo: ¥ 50.000.000                  | [ Botão: Sugerir a todas as Agências Grandes ]     |
|                                            | [ Botão: Oferecer via intermediários (Agentes) ]   |
| [ Botão: Oferecer Selecionadas ao Mercado ]|                                                    |
|--------------------------------------------|----------------------------------------------------|
| LISTA DE EMPRÉSTIMO (COLLABS & ATUAÇÃO)    | RESPOSTAS DO MERCADO (REINA)                       |
|                                            |                                                    |
| [X] [Foto] Haruka (16) - Selecionada       | Agência "Titan" tem leve interesse.                |
|     Status: Buscando Fama (Trainee)        | Agência "RedMoon" rejeitou.                        |
|                                            |                                                    |
| [ ] [Foto] Miku (17)                       | [ Botão: Remover da Transfer List ]                |
|     Status: Atuando em Drama (Emprestada)  |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Duas Listas Distintas na Mesma Visão
"Transfer List" e "Loan List" agrupadas numa única aba de Vitrine (Showcase). A barra da esquerda agrupa quem está para ser "vendida" e quem está para ser "emprestada", mantendo a UI limpa e sem modais excessivos.

### 2. Painel de "Oferecer a Clubes" (Offer to Clubs)
O botão clássico do FM de tentar se livrar de um salário alto. No Centro/Direita, se a Reina está selecionada, você define o preço dela (ex: "Não Especificado", ou "Valor Específico = 20 Milhões") e clica no botão de "Oferecer a todas as Agências", mandando um fax (e-mail) geral para o mercado.

### 3. Feedback Imediato do Mercado
Na parte inferior direita, o jogo já te dá um toque: "A agência RedMoon achou 20 milhões muito caro pela Reina". O FM26 te dá esse toque rápido sem fazer você esperar semanas para descobrir que ninguém quer comprar sua jogadora.

---

## Acceptance Criteria

1. Tela dividida entre Lista de Transferência Definitiva e Lista de Empréstimos (Collabs Externos/Atuação).
2. Funcionalidade de seleção única ou múltipla para enviar "ofertas ativas" para o mercado.
3. Precificação do contrato visível e ajustável através de Dropdowns.
4. Feedback do mercado em tempo real (Painel Direito) sobre o interesse das agências concorrentes.