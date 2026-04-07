# Catálogo de Tipos de Mensagem (Inbox do Produtor)

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Relacionado**: ui-dashboard.md, wireframe 05-inbox.md
> **Diferente de**: news-feed.md (notícias são artigos públicos, mensagens são comunicações diretas)

## Conceito

Mensagens são **comunicações diretas ao produtor**. Diferem de notícias:

| | Mensagens (Inbox) | Notícias (News Feed) |
|---|---|---|
| **Destinatário** | Produtor pessoalmente | Público geral |
| **Remetente** | Staff, dono, idols, rivais, sistema | Veículo (TV, revista, blog) |
| **Ação** | Frequentemente requer decisão | Informação passiva |
| **Exemplo** | "Proposta de buyout: ¥5M por Suzuki" | "Crown compra ace da Heartbeat" |

Cada tipo de mensagem tem **layout específico** no inbox. Layouts são definidos
por categoria para evitar monotonia visual.

---

## Categorias e Tipos

### CAT-1: BOAS-VINDAS E ONBOARDING

Remetente: **Dono da agência / Staff / Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-W01 | Boas-vindas do dono | Dono | Início de campanha | Ler + ver anexos | Texto + Anexos (perfil agência, histórico, orçamento) | agency-economy |
| MSG-W02 | Introdução ao plantel | Coach | Início de campanha | Ler | Texto + Lista de idols (avatar + nome + tier) | tutorial-onboarding |
| MSG-W03 | Regras de seleção | Manager | Início de campanha | Ler | Texto + Regras resumidas | tutorial-onboarding |
| MSG-W04 | Expectativas da temporada | Dono | Início de campanha | Ler | Texto + Metas iniciais | agency-meta-game |
| MSG-W05 | Introdução ao mercado | Scout | Início de campanha | Ler | Texto + Link para scouting | tutorial-onboarding |
| MSG-W06 | Introdução às táticas | Coach | Início de campanha | Ler | Texto + Link para desenvolvimento | tutorial-onboarding |
| MSG-W07 | Perfil dos fãs | PR | Início de campanha | Ler | Texto + Dados de fã base | tutorial-onboarding |

---

### CAT-2: CONTRATOS

Remetente: **Assessoria Jurídica / Idol / Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-C01 | Lembrete contrato vencendo | Sistema | 4 semanas antes do vencimento | [Renovar →] | Alerta + Card contrato (idol, prazo, valor) | contract-system |
| MSG-C02 | Idol aceitou proposta | Assessoria | Idol aceita contrato | Ler | Confirmação + Card contrato assinado | contract-system |
| MSG-C03 | Idol rejeitou proposta | Assessoria | Idol rejeita contrato | [Renegociar →] ou dispensar | Texto + Motivo + Contra-proposta sugerida | contract-system |
| MSG-C04 | Idol exige rescisão | Idol | Felicidade <20 por 4 semanas | [Aceitar] ou [Negociar] | Urgente + Avatar grande + Motivos | contract-system |
| MSG-C05 | Contra-proposta rival | Rival | Rival faz oferta durante negociação | [Cobrir] ou [Desistir] | Alerta + Comparação propostas | contract-system |
| MSG-C06 | Resultado negociação jurídica | Assessoria | Staff jurídico negocia | Ler | Texto + Termos negociados | contract-system |

---

### CAT-3: STAFF

Remetente: **Staff (Coach, PR, Scout, Manager, Wellness)**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-S01 | Delegação: agenda proposta | Manager | Manager propõe agenda semanal | [Aprovar] ou [Editar] | Grid semanal resumida | agency-staff-operations |
| MSG-S02 | Delegação: treino proposto | Coach | Coach propõe foco de treino | [Aprovar] ou [Editar] | Lista idols + foco proposto | agency-staff-operations |
| MSG-S03 | Delegação: resposta escândalo | PR | Escândalo ativo, PR propõe resposta | [Aprovar] ou [Editar] | Estratégia proposta + previsão de resultado | agency-staff-operations |
| MSG-S04 | Staff moral baixo | Staff | Moral <30 | [Conversar] ou [Ignorar] | Alerta + Staff card | agency-staff-operations |
| MSG-S05 | Staff recebeu proposta rival | Staff | Rival tenta recrutar staff | [Contra-proposta] ou [Liberar] | Urgente + Proposta rival detalhada | agency-staff-operations |
| MSG-S06 | Coach: avaliação trimestral | Coach | Fim do trimestre | Ler + [Ajustar plano] | Relatório + Progresso de cada idol | talent-development-plans |
| MSG-S07 | Coach: sugestão de ajuste | Coach | Desempenho inesperado | [Aplicar] ou [Ignorar] | Texto + Sugestão específica | talent-development-plans |
| MSG-S08 | Wellness: alerta burnout | Wellness Advisor | 2 semanas antes do burnout previsto | [Dar Folga] ou [Manter] | Alerta + Idol card + Indicadores | happiness-wellness |

---

### CAT-4: SCOUTING E RECRUTAMENTO

Remetente: **Scout / Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-SC01 | Relatório de scouting | Scout | Scout completa missão | [Ver Candidatas] | Lista de idols encontradas (avatar blur + stats parciais) | scouting-recruitment |
| MSG-SC02 | Scouting sem resultados | Scout | Região sem idols disponíveis | [Enviar outro →] | Texto + Região scouted | scouting-recruitment |
| MSG-SC03 | Scout subiu de nível | Sistema | Scout ganha XP suficiente | Ler | Notificação + Novas habilidades | scouting-recruitment |

---

### CAT-5: JOBS E RESULTADOS

Remetente: **Sistema / Manager**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-J01 | Resultado de job (sucesso) | Sistema | Job concluído com nota A-S | Ler | Card dramatizado: nota, fatores, reações (mídia, fãs, idol) | job-assignment |
| MSG-J02 | Resultado de job (fracasso) | Sistema | Job concluído com nota D-F | Ler + [Ver análise] | Card dramatizado: nota, fatores, consequências | job-assignment |
| MSG-J03 | Rival ganhou job disputado | Sistema | Rival vence job premium | Ler | Alerta + Quem ganhou + Comparação | job-assignment |
| MSG-J04 | Penalidade por cancelamento | Sistema | Idol/jogador cancela job | Ler | Aviso + Multa aplicada | job-assignment |
| MSG-J05 | Resultado de evento criado | Sistema | Evento do jogador concluiu | Ler | Relatório: bilheteria, fama, attendance | player-created-events |
| MSG-J06 | Artista aceitou/recusou convite | Artista | Resposta a convite de evento | Ler | Texto + Avatar do artista | player-created-events |

---

### CAT-6: MERCADO E TRANSFERÊNCIAS

Remetente: **Rival / Sistema / Assessoria**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-M01 | Proposta de buyout recebida | Rival | Rival quer comprar sua idol | [Aceitar] [Recusar] [Contra-proposta] | Urgente + Avatar idol + Proposta detalhada + Logo rival | rival-agency-ai |
| MSG-M02 | Resultado de oferta enviada | Rival | Rival responde à sua proposta | Ler ou [Ajustar oferta] | Texto + Status da negociação | market-transfer |
| MSG-M03 | Convite de colaboração | Rival | Outra agência propõe collab | [Aceitar] [Recusar] [Negociar] | Proposta + Logos das agências + Detalhes | market-transfer |
| MSG-M04 | Idol em negociação com rival | Sistema | Idol livre negocia com outro | [Fazer proposta] ou ignorar | Alerta + Avatar + Logo rival | market-transfer |
| MSG-M05 | Contra-oferta de rival | Rival | Rival cobre sua proposta | [Cobrir] [Desistir] | Comparação de propostas | market-transfer |

---

### CAT-7: IDOLS (Comunicação Direta)

Remetente: **Idol**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-I01 | Idol recusa treino intensivo | Idol | Felicidade <40 | [Respeitar] ou [Insistir] | Avatar grande + Motivo + Indicadores wellness | happiness-wellness |
| MSG-I02 | Idol pede carreira solo | Idol | Fama individual >3× média do grupo | [Aceitar] [Recusar] [Negociar] | Avatar + Argumentos + Dados de fama | group-management |
| MSG-I03 | Conflito entre membros | Sistema | Disputa de liderança/ciúme | [Mediar] [Ignorar] | Avatars dos envolvidos + Descrição | group-management |
| MSG-I04 | Crise "patinho feio" | Sistema | Membro fraco no grupo | [Treinar] [Remover] [Ignorar] | Avatars do grupo + Membro em destaque | group-management |

---

### CAT-8: FINANÇAS E METAS

Remetente: **Dono / Sistema / Contador**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-F01 | Relatório financeiro mensal | Contador | Fim do mês | Ler + [Ver detalhes] | Dashboard mini: receita, despesa, lucro, top 3 idols | financial-reporting |
| MSG-F02 | Metas mensais do dono | Dono | Início do mês | Ler | Lista de metas + Recompensas/consequências | agency-economy |
| MSG-F03 | Meta atingida | Dono | Meta cumprida | Ler | Parabéns + Recompensa desbloqueada | agency-meta-game |
| MSG-F04 | Meta não atingida | Dono | Meta falhou | Ler | Aviso + Consequência aplicada | agency-meta-game |
| MSG-F05 | Intervenção do dono | Dono | Dívida 3+ meses | [Cortar custos] | Urgente + Ultimato + Prazo | agency-economy |
| MSG-F06 | Demissão (game over suave) | Dono | Falha nas metas críticas | [Aceitar proposta de outra agência] | Game over + Opções | agency-economy |
| MSG-F07 | Empréstimo aprovado/rejeitado | Sistema | Resultado pedido de empréstimo | Ler | Valor + Juros + Prazo | agency-economy |

---

### CAT-9: ESCÂNDALOS E EVENTOS

Remetente: **Sistema / PR / Assistente**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-E01 | Escândalo ocorreu | Sistema | Todos triggers ativos | [Responder via PR] | Urgente + Avatar idol + Tipo + Gravidade | event-scandal-generator |
| MSG-E02 | Aviso de risco de escândalo | Assistente | 2/3 triggers ativos | [Prevenir] ou [Ignorar] | Alerta + Avatar + Triggers listados | event-scandal-generator |
| MSG-E03 | Resultado de mitigação PR | PR | PR responde a escândalo | Ler | Relatório: eficácia, impacto residual | event-scandal-generator |
| MSG-E04 | Evento positivo inesperado | Sistema | Viral, oportunidade VIP | Ler + [Aproveitar →] | Positivo + Avatar + Oportunidade | event-scandal-generator |
| MSG-E05 | Conflito interno no grupo | Sistema | Rivalidade, ciúme | [Mediar →] | Avatars envolvidos + Descrição | event-scandal-generator |

---

### CAT-10: INTELLIGENCE E ANÁLISES

Remetente: **Sistema / Analista**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-A01 | Post-mortem de job | Sistema | Após cada job | Ler | Análise: fatores, previsão vs real, aprendizado | agency-intelligence-reports |
| MSG-A02 | Alerta preditivo | Sistema | Risco >70% de evento negativo | [Prevenir →] | Alerta + % confiança + Recomendação | agency-intelligence-reports |
| MSG-A03 | Comparação solicitada | Sistema | Jogador pede comparação | Ler | Side-by-side de idols/grupos | agency-intelligence-reports |

---

### CAT-11: CARREIRA DO PRODUTOR

Remetente: **Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-P01 | Título de legado conquistado | Sistema | Condições do título cumpridas | Ler | Celebração + Título + Descrição | player-reputation-affinity |
| MSG-P02 | Memória com ex-idol | Sistema | Aniversário de evento marcante | Ler | Nostálgico + Avatar + Memória | player-reputation-affinity |
| MSG-P03 | Proposta de outra agência | Rival | Reputação alta + agência maior | [Aceitar] [Recusar] | Proposta + Logo rival + Termos | agency-economy |

---

## Resumo por Layout

Cada categoria tem um **layout visual distinto** no inbox:

| Layout | Categorias | Características |
|---|---|---|
| **Texto + Anexos** | W01-W07, F01 | Corpo de texto + cards de anexo (perfil, dados) |
| **Alerta + Ação** | C01, C04, S04-S05, M01, E01-E02, F05 | Borda colorida + botões de ação proeminentes |
| **Relatório** | SC01, J01-J02, J05, F01, A01 | Dados estruturados + gráficos mini + resumo |
| **Proposta** | C03, C05, M01-M05, MSG-P03 | Comparação lado a lado + botões aceitar/recusar |
| **Delegação** | S01-S03, S06-S07 | Preview da ação proposta + [Aprovar]/[Editar] |
| **Celebração** | F03, MSG-P01, E04 | Visual positivo + confetti sutil + conquista |
| **Comunicação Idol** | I01-I04, C04 | Avatar grande + tom emocional + indicadores |

---

## Prioridade Visual

| Prioridade | Cor | Border | Quando |
|---|---|---|---|
| 🔴 Urgente | Vermelho | Borda esquerda 4px vermelha | Escândalo, buyout, burnout iminente, game over |
| 🟡 Importante | Amarelo | Borda esquerda 4px amarela | Contrato vencendo, meta falhando, staff saindo |
| 🟢 Normal | Verde | Sem borda especial | Resultados, relatórios, sugestões |
| 🔵 Info | Azul | Sem borda especial | Notificações, progressos, memórias |

---

## Totais

| Categoria | Tipos | Requer ação |
|---|---|---|
| Boas-vindas | 7 | 0 |
| Contratos | 6 | 4 |
| Staff | 8 | 6 |
| Scouting | 3 | 1 |
| Jobs/Resultados | 6 | 1 |
| Mercado | 5 | 4 |
| Idols | 4 | 4 |
| Finanças/Metas | 7 | 2 |
| Escândalos/Eventos | 5 | 3 |
| Intelligence | 3 | 1 |
| Carreira | 3 | 1 |
| **Total** | **57** | **27** |

---

## Dependencies

**Hard**: Todos GDDs de sistemas (geram os triggers)
**Soft**: Producer Profile (tom das mensagens), Agency Staff (remetentes disponíveis)
**Depended on by**: UI Inbox (wireframe 05), Tutorial/Onboarding (sequência W01-W07)

## Open Questions

- Templates de texto serão gerados por LLM (como notícias) ou escritos manualmente?
- Mensagens de idols terão "personalidade" baseada nos traços da idol?
- Limite de mensagens armazenadas? (sugestão: 3 meses, como notícias)
