# Wireframe 37 — Market Contracts (Negociação de Contrato)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Contract Negotiation (Modal/Screen)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/contracts/negotiation/:id`
> **GDDs**: contract-system

---

## Conceito

No FM, a negociação de contrato é uma batalha contra o agente do jogador, envolvendo Promessas (Tempo de Jogo) e Cláusulas Financeiras. 
No **Star Idol Agency**, esta é a tela onde você discute os termos com a Idol (ou os pais dela/agente). Envolve fechar Salário Fixo, Porcentagem de Royalties, Bônus por posição na Oricon e Promessas de Status (ex: "Prometo que você será a *Center* do próximo grupo").

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | Shortlists | Atividade | CONTRATOS (Ativo)               |
+-------------------------------------------------------------------------------------------------+
| NEGOCIAÇÃO DE CONTRATO: KANNA (15 Anos)                                                         |
| [ Barra de Paciência do Agente: ■■■■■■■■□□ (Boa) ]                                              |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - PROMESSAS E EXIGÊNCIAS ]     | [ COLUNA CENTRO/DIR - TERMOS FINANCEIROS ]        |
|                                             |                                                   |
| PROMESSAS DE STATUS                         | TIPO DE CONTRATO E DURAÇÃO                        |
| > Papel Esperado no Grupo                   | Tipo: [ Tempo Integral (Ídolo) v ]                |
|   [ Dropdown: Center/Face of the Group v ]  | Duração: [ 3 Anos (Expira Fim de 2029) v ]        |
|   (O Agente exige Status de Liderança)      |                                                   |
|                                             | SALÁRIO E ROYALTIES                               |
| > Garantia de Lançamentos                   | Salário Fixo Mensal:     [ - ] ¥ 45.000 [ + ]     |
|   [ Dropdown: 2 Singles no 1º Ano v ]       | Repasse de Shows (Share):[ - ] 5%       [ + ]     |
|                                             | Repasse de Merch:        [ - ] 10%      [ + ]     |
| CLÁUSULAS COMPORTAMENTAIS                   |                                                   |
| > Proibição de Namoro (Dating Ban)          | BÔNUS (Adicionar Cláusula)                        |
|   [ Toggle: OFF (O agente RECUSA essa) ]    | [ Dropdown: Bônus Top 10 Oricon v ] -> ¥ 1.000.000|
| > Uso Livre de Redes Sociais                | [ Dropdown: Bônus de Debut v ]      -> ¥ 500.000  |
|   [ Toggle: ON ]                            |                                                   |
|                                             |---------------------------------------------------|
| AVALIAÇÃO DA DIRETORIA (BOARD LIMITS)       | RESUMO DA PROPOSTA vs EXIGÊNCIA                   |
| Teto Salarial Atual: ¥ 150.000 / mês        | Pacote Atual Oferecido: ¥ 45k + 15% Shares        |
| Margem Disponível: "OK"                     | Exigência do Agente:    ¥ 60k + 10% Shares        |
|                                             |                                                   |
|                                             | [ Sugerir Termos ] [ Aceitar Exigências ] [ Sair ]|
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Barra de Paciência
O medidor de tensão do FM26 (Paciência do Agente) no topo da tela dita o ritmo. Faça muitas ofertas "lowball" (mesquinhas) e a barra cai. Se zerar, eles levantam da mesa e a negociação é cancelada.

### 2. Edição Direta e "Lock" de Cláusulas
O jogador usa botões de `[ - ]` e `[ + ]` para ajustar valores ou digita diretamente. O agente pode "trancar" (cadeado vermelho na interface do FM) uma exigência inegociável, como "Recuso a Proibição de Namoro". Tentar mudar isso quebra a negociação instantaneamente.

---

---

## Seção: Contratos de Compositor

> **FM26 equivalente**: Staff Contracts / Backroom Staff — gerenciar contratos
> de profissionais que não são jogadores mas impactam diretamente o resultado.
> Aqui, compositores são os "staff" que produzem as músicas que suas idols performam.

Acessível via tab **"Contratos de Compositor"** na barra de sub-navegação da tela
de Contracts, ao lado da negociação de idol.

### Composer Contract Card

Cada compositor contratado aparece como um card resumido:

```
┌─ CONTRATOS DE COMPOSITOR ──────────────────────────────────────────────────────┐
│                                                                                │
│ [Contratos de Idol]  [CONTRATOS DE COMPOSITOR (Ativo)]                        │
│                                                                                │
│ ┌─ CARD: Tanaka Yuki ──────────────────────────────────────────────────────┐  │
│ │                                                                          │  │
│ │  👤 Tanaka Yuki          Tier: A        Especialidade: Ballad / J-Pop   │  │
│ │  Fee Pago: ¥2.5M        Royalty Rate: 8%                                │  │
│ │  Músicas Encomendadas: 5   Em Produção: 2   Royalties Pagos: ¥12.3M    │  │
│ │                                                                          │  │
│ │  [Nova Encomenda]  [Ver Histórico]  [Rescindir]                         │  │
│ │                                                                          │  │
│ └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│ ┌─ CARD: Suzuki Ren ──────────────────────────────────────────────────────┐   │
│ │                                                                          │  │
│ │  👤 Suzuki Ren           Tier: B        Especialidade: Dance-Pop / EDM  │  │
│ │  Fee Pago: ¥1.2M        Royalty Rate: 5%                                │  │
│ │  Músicas Encomendadas: 3   Em Produção: 1   Royalties Pagos: ¥4.1M     │  │
│ │                                                                          │  │
│ │  [Nova Encomenda]  [Ver Histórico]  [Rescindir]                         │  │
│ └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Composer Name** | Nome do compositor |
| **Tier** | Tier de qualidade (F-SSS). Afeta qualidade base das composições |
| **Especialidade** | Gêneros em que o compositor é especializado (até 2) |
| **Fee Pago** | Valor pago pelo contrato/encomenda |
| **Royalty Rate (%)** | Percentual de royalties que o compositor recebe sobre vendas das músicas |
| **Músicas Encomendadas** | Total de músicas já encomendadas a este compositor |
| **Em Produção** | Músicas atualmente em produção |
| **Royalties Pagos** | Total acumulado de royalties já pagos a este compositor |

### Active Commissions (Encomendas Ativas)

Tabela expandível dentro de cada card mostrando encomendas em andamento:

```
┌─ ENCOMENDAS ATIVAS — Tanaka Yuki ──────────────────────────────────────────────┐
│                                                                                 │
│ Projeto              Estágio            Entrega Est.    Custo Pago              │
│ ──────────────────── ────────────────── ─────────────── ──────────              │
│ "Eternal Promise"    ████████░░ Arranjo  Sem 18 (~3sem)  ¥2.5M                 │
│ "Crystal Sky"        ███░░░░░░ Composição Sem 22 (~7sem) ¥2.5M                 │
│                                                                                 │
│ Estágios: Composição → Arranjo → Mixagem → Demo → Entregue                    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Projeto** | Nome do projeto/música em produção |
| **Estágio** | Barra de progresso + label: Composição / Arranjo / Mixagem / Demo / Entregue |
| **Entrega Estimada** | Semana estimada de entrega + tempo restante |
| **Custo Pago** | Valor já pago pela encomenda |

### Composer History (Histórico do Compositor)

Expandível via **[Ver Histórico]** — mostra músicas passadas com resultado comercial:

```
┌─ HISTÓRICO — Tanaka Yuki ──────────────────────────────────────────────────────┐
│                                                                                 │
│ Música               Entregue   Pico Oricon   Vendas Total   Royalties Gerados │
│ ──────────────────── ────────── ──────────── ────────────── ─────────────────── │
│ Starlight Melody      Sem 10     #2           320.000         ¥6.4M            │
│ Heartbeat Anthem      Sem 04     #8           180.000         ¥3.6M            │
│ Rising Sun            Q3 2025    #15          95.000          ¥1.9M            │
│                                                                                 │
│ Total Royalties Gerados: ¥11.9M  |  Média Pico: #8.3  |  Taxa de Hit (Top20): 100% │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Música** | Nome da música entregue |
| **Entregue** | Semana ou trimestre de entrega |
| **Pico Oricon** | Melhor posição alcançada no chart |
| **Vendas Total** | Total de cópias/streams vendidos |
| **Royalties Gerados** | Total de royalties pagos ao compositor por esta música |

### Actions

| Ação | Descrição |
|---|---|
| **[Nova Encomenda]** | Abre Wireframe 77 (Composer Selection) para iniciar nova encomenda com este compositor |
| **[Ver Histórico]** | Expande/colapsa seção de histórico com músicas passadas |
| **[Rescindir]** | Encerra contrato com compositor. Confirmação com aviso de encomendas ativas pendentes |

---

## Acceptance Criteria

1. Tela dividida entre as "Promessas/Regras" (esquerda) e "Dinheiro/Duração" (direita).
2. Interação de "Sugerir Termos": o sistema calcula a resposta do agente e atualiza a barra de paciência.
3. Alerta visual de limites do Board para garantir que o produtor não ofereça contratos que não pode pagar.
4. Tab **"Contratos de Compositor"** com cards por compositor mostrando: nome, tier, especialidade, fee, royalty rate, músicas encomendadas, em produção, e royalties totais pagos
5. Encomendas ativas por compositor com: nome do projeto, estágio (Composição/Arranjo/Mixagem/Demo/Entregue), entrega estimada, custo pago
6. Histórico do compositor com: músicas entregues, pico Oricon, vendas totais, royalties gerados
7. Ação **[Nova Encomenda]** abre Wireframe 77 (Composer Selection)