# Wireframe 76 — Rival Agency Profile (Perfil de Agência Rival)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Club Profile / Club Info  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/market/rivals/[id]` ou Modal a partir de Intelligence/Rankings  
> **GDDs**: rival-agency-ai

---

## Conceito

No FM26, o perfil de um clube rival mostra tudo que o seu departamento de scouting conseguiu reunir: elenco, finanças estimadas, filosofia tática, transferências recentes. Mas a precisão dos dados depende do nível de conhecimento que seus scouts têm sobre aquele clube.
No **Star Idol Agency**, o perfil de uma agência rival funciona da mesma forma. Você vê o que a sua rede de inteligência descobriu. Agências com scouting forte mostram dados detalhados; sem scouting, você vê nomes e "???" nos atributos. Acessível via Intelligence, Rankings ou clicando no nome de uma agência rival em qualquer tela.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira | MENU DO JOGO    |
|-------------------------------------------------------------------------------------------------|
| Intelligence | Rankings | PERFIL DE AGÊNCIA RIVAL (Ativo)                                       |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
| [ COL. ESQ 30% - HEADER DA AGÊNCIA ]  | [ COL. CENTRO 40% - ROSTER ]  | [ COL. DIR 30% ]      |
|                                        |                               |                        |
| +------------------------------------+ | +---------------------------+ | +--------------------+ |
| |         [Logo da Agência]          | | | ROSTER CONHECIDO          | | | ESTRATÉGIA         | |
| |                                    | | |                           | | |                    | |
| |  Stellar Rise Entertainment        | | | +---+----------+---+----+ | | | Foco de Mercado:   | |
| |  ★★★★☆  Tier A                     | | | |   | NOME     |AGE|TIER| | | | Mainstream Pop     | |
| |  Região: Tóquio, Japão             | | | +---+----------+---+----+ | | |                    | |
| |                                    | | | |⭐| Mika Aoi  | 19| A  | | | | Direção de Imagem: | |
| |  Presidente: Ryota Yamamoto        | | | |⭐| Sora Hino | 21| A  | | | | Cute + Cool        | |
| |  Personalidade: Agressivo          | | | |⭐| Yui Kaze  | 17| B+ | | | |                    | |
| |  (Expansionista, faz ofertas altas)| | | |  | Ren Mori  | 22| B  | | | | Investimento:      | |
| |                                    | | | |  | Nana ???  | ??| ???| | | | Alto em Marketing  | |
| +------------------------------------+ | | |  | ???       | ??| ???| | | | Médio em Treino    | |
| +------------------------------------+ | | |  | ???       | ??| ???| | | |                    | |
| | FINANÇAS (Estimativa)              | | | +---+----------+---+----+ | | +--------------------+ |
| |                                    | | |                           | | +--------------------+ |
| | Orçamento Estimado:                | | | Idols conhecidas: 4/7     | | | ATIVIDADE RECENTE  | |
| | ¥ 80M ~ ¥ 120M / ano              | | | (Nível de Intel: Médio)    | | |                    | |
| | (Precisão: ±30% — intel média)     | | |                           | | | > Contratou Ren    | |
| |                                    | | | Top 3 Destaques:          | | |   Mori (B) — ¥8M   | |
| | Receita Principal:                 | | | 1. Mika Aoi — Vocal 16,   | | |   há 2 semanas     | |
| | Shows ao vivo (55%)                | | |    Dança 14, Fama 78      | | |                    | |
| | Merchandise (25%)                  | | | 2. Sora Hino — Vocal 15,  | | | > Perdeu Kana Yuki | |
| | Streaming (20%)                    | | |    Visual 17, Fama 85     | | |   (A) — aposentou  | |
| |                                    | | | 3. Yui Kaze — Dança 15,   | | |   há 1 mês         | |
| +------------------------------------+ | |    Carisma 16, Fama 52    | | |                    | |
| +------------------------------------+ | |                           | | | > Lançou single    | |
| | REPUTAÇÃO                          | | +---------------------------+ | |   "Starlight" —    | |
| |                                    | | |                           | | |   Oricon #12       | |
| | Nacional:  [||||||||||| ] 78/100   | | | Arquétipos no Roster:     | | |   há 3 semanas     | |
| | Regional:  [||||||||||||| ] 85/100 | | | Cute: 3 | Cool: 2 |      | | |                    | |
| | Global:    [||||||     ] 45/100    | | | Elegant: 1 | Wild: 1     | | | > Assinou parceria | |
| |                                    | | |                           | | |   com marca de     | |
| +------------------------------------+ | +---------------------------+ | |   cosméticos       | |
|                                        |                               | |   há 1 mês         | |
|                                        |                               | |                    | |
|                                        |                               | +--------------------+ |
|                                        |                               | +--------------------+ |
|                                        |                               | | RELAÇÃO COM VOCÊ   | |
|                                        |                               | |                    | |
|                                        |                               | | Status: Rivalidade | |
|                                        |                               | | [|||||||   ] 35/100| |
|                                        |                               | | (Hostil — disputa  | |
|                                        |                               | |  por Mika Aoi no   | |
|                                        |                               | |  último mercado)   | |
|                                        |                               | |                    | |
|                                        |                               | | Histórico:         | |
|                                        |                               | | - Você roubou Yui  | |
|                                        |                               | |   Kaze deles (S1)  | |
|                                        |                               | | - Eles tentaram    | |
|                                        |                               | |   roubar sua Hana  | |
|                                        |                               | |   (S2, recusado)   | |
|                                        |                               | +--------------------+ |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Fog of War (Dados Limitados por Inteligência)
No FM26, se você não tem scout cobrindo a liga portuguesa, os atributos dos jogadores aparecem como "?". Aqui, idols de agências rivais que você não monitorou mostram "???" em atributos e tier. Quanto maior seu investimento em scouting/intelligence, mais dados aparecem.

### 2. Três Colunas de Informação (Club Profile)
O FM26 usa exatamente este layout para perfis de clube: identidade à esquerda, elenco no centro, contexto à direita. A familiaridade do layout reduz a curva de aprendizado para jogadores que vêm do Football Manager.

### 3. Personalidade do Rival como Fator de Gameplay
O FM26 mostra a filosofia do treinador rival (possessivo, direto, etc.). Aqui, a personalidade do presidente rival (Agressivo, Conservador, Oportunista) informa ao jogador como o rival vai se comportar no mercado. Um rival "Agressivo" vai fazer ofertas altas pelas suas idols.

### 4. Relationship Tracker
Inspirado no FM26 onde clubes têm relações (parceria, rivalidade). O histórico de interações com a agência rival afeta futuras negociações — um rival hostil recusa empréstimos; um neutro pode aceitar trocas.

---

## Acceptance Criteria

1. Layout em 3 colunas (30/40/30) seguindo o padrão FM26 de perfil de clube.
2. Header da agência com logo, nome, tier badge (estrelas), região e presidente com personalidade.
3. Estimativa financeira com range (ex: ¥80M~¥120M) e margem de erro proporcional ao nível de intelligence.
4. Barras de reputação (Nacional, Regional, Global) exibidas com valores numéricos.
5. Tabela de roster com dados condicionais: idols conhecidas mostram nome/idade/tier/atributos; desconhecidas mostram "???".
6. Top 3 idols destacadas com atributos detalhados (quando intel suficiente).
7. Distribuição de arquétipos do roster visível (Cute, Cool, Elegant, Wild).
8. Painel de estratégia com foco de mercado, direção de imagem e prioridades de investimento.
9. Feed de atividade recente mostrando últimas 5 ações públicas da agência (transferências, lançamentos, parcerias).
10. Status de relacionamento com o jogador (Amigável/Neutro/Rivalidade) com barra visual e histórico de interações.
11. Acessível via clique no nome da agência em qualquer tela, Rankings ou Intelligence.
