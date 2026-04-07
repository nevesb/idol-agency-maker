# Wireframe 36 — Market Activity (Central de Transferências)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Transfer Centre
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/activity`
> **GDDs**: contract-system, finance-economy, agency-growth

---

## Conceito

No FM, o Transfer Centre é a central onde você negocia ativamente compras (comprar jogadores de outros times) e vendas. 

No **Star Idol Agency**, esta é a **Central do Mercado (Transferências/Negociações)**. Quando você acha uma Idol talentosa numa agência rival, você tem que pagar uma "Transferência/Quebra de Contrato" (Buyout Clause). O mesmo acontece quando uma agência gigante quer comprar/roubar uma Idol promissora da sua garagem.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | Shortlists | ATIVIDADE (Ativo) | Contratos                 |
|-------------------------------------------------------------------------------------------------|
| Recrutamento > Central de Negociações                                                           |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - EM NEGOCIAÇÃO (INCOMING) ]  | [ COLUNA DIR - SAÍDAS E RUMORES (OUTGOING) ]       |
|                                            |                                                    |
| NEGOCIAÇÕES PARA ASSINAR (ENTRADAS)        | OFERTAS RECEBIDAS (SAÍDAS)                         |
|                                            |                                                    |
| [Avatar] Kanna (15) - Agente Livre         | [Avatar] Sakura (21) - Star Idol Agency            |
| Status: Oferecido Contrato (Aguardando)    | A Agência "Titan" fez uma oferta oficial de:       |
| Prazo de resposta: 2 a 3 dias              | ¥ 150.000.000 para quebrar o contrato de Sakura.   |
| [ Botão: Cancelar Oferta ]                 |                                                    |
|                                            | Opções:                                            |
| [Avatar] Emi (18) - Agência "RedMoon"      | [ Aceitar ]   [ Negociar Valor ]   [ Rejeitar ]    |
| Status: Oferta de Transferência Rejeitada  |                                                    |
| "A RedMoon não quer vender Emi por menos   | (Alerta: Rejeitar pode deixar Sakura frustrada por |
| de ¥ 50.000.000. Sua oferta foi de 30M."   |  perder a chance de ir para uma agência maior).    |
| [ Botão: Fazer Nova Oferta ]               |                                                    |
|                                            |----------------------------------------------------|
|--------------------------------------------| RUMORES DA MÍDIA / INTERESSE EXTERNO               |
| AUDIÇÕES AGENDADAS (TRYOUTS)               |                                                    |
| 3 candidatas têm audições marcadas para    | - A revista "Idol Weekly" afirma que Aiko está no  |
| o dia 15 de Outubro.                       | radar de grandes produtores e pode sair em breve.  |
| [ Ver Agendamentos ]                       | - Reina não deve renovar seu contrato.             |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Dividida (In/Out)
Em vez de listas complexas misturadas, o FM26 Transfer Hub divide a tela limpidamente. A coluna da esquerda mostra tudo o que **você quer trazer** para dentro da agência (Ofertas que você fez pra meninas sem agência, audições marcadas, ofertas financeiras por artistas de agências rivais). A coluna da direita mostra **ameaças** (agências maiores oferecendo milhões pra levar sua melhor Center embora) ou propostas por idols que você quer dispensar.

### 2. Status Transparente (Waiting / Rejected)
Toda oferta tem um *card*. O Card mostra em que fase da novela a contratação está. Se você ofereceu o dinheiro pra agência dela e eles aceitaram, o próximo card diz "Discutindo termos de salário com a Idol".

### 3. Consequências de Rejeição de Propostas
FM26 avisa explicitamente (como o texto do Alerta debaixo de "Sakura") que segurar talento à força destrói a "Coesão" e "Dinâmica" do grupo se a garota for muito ambiciosa e quiser ir para uma empresa de Elite.

---

## Acceptance Criteria

1. Tela modular, particionada visivelmente entre "Incoming" (tentativas de contratação/audições) e "Outgoing" (propostas recebidas pelo seu plantel).
2. Status dinâmico por *card* com os botões de ação ("Negociar", "Aceitar", "Cancelar Oferta").
3. Alerta dinâmico avisando o risco de moral caso uma oferta vantajosa para a Idol seja sumariamente rejeitada pelo Produtor.