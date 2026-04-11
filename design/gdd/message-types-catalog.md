# Catálogo de Tipos de Mensagem (Inbox do Produtor)

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-11
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
| MSG-C07 | Contrato expirou | Sistema | Contrato chegou ao fim | [Ver mercado] | Alerta + Avatar idol + Status (livre/renovação) | contract-system |
| MSG-C08 | Contrato rescindido | Sistema | Rescisão processada | Ler | Confirmação + Multa paga/recebida + Avatar idol | contract-system |
| MSG-C09 | NPC rescindiu contrato | Talent Director | NPC decide rescindir proativamente | [Reverter] ou [Aceitar] | Delegação + Motivo + Dados da idol | contract-system |

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
| MSG-S09 | NPC contratou staff | Head Producer | NPC contrata NPC (delegação) | [Ver perfil] | Texto + Staff card (nome, cargo, skills) | agency-staff-operations |
| MSG-S10 | NPC demitiu staff | Head Producer | NPC demite NPC (delegação) | Ler | Alerta + Staff card + Motivo | agency-staff-operations |
| MSG-S11 | NPC ajustou estratégia | Head Producer | NPC muda foco/postura/imagem | [Reverter] ou [Aceitar] | Delegação + Estratégia anterior vs nova | agency-strategy |
| MSG-S12 | Vice-Producer recomenda ação | Vice-Producer | Situação requer intervenção | [Aceitar sugestão] ou [Ignorar] | Texto + Recomendação + Dados | agency-staff-operations |
| MSG-S13 | Mentor atribuído | Dev Director | NPC atribui mentor a trainee | Ler | Texto + Avatars mentor/mentee + Foco | talent-development-plans |
| MSG-S14 | Timeline de desenvolvimento | Dev Director | Projeção de evolução concluída | Ler + [Ver plano] | Relatório + Curva de crescimento | talent-development-plans |
| MSG-S15 | Wellness: plano de reabilitação | Wellness Advisor | Idol lesionada/burnout | Ler + [Ajustar agenda] | Relatório + Prazo + Recomendações | medical-system |

---

### CAT-4: SCOUTING E RECRUTAMENTO

Remetente: **Scout / Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-SC01 | Relatório de scouting | Scout | Scout completa missão | [Ver Candidatas] | Lista de idols encontradas (avatar blur + stats parciais) | scouting-recruitment |
| MSG-SC02 | Scouting sem resultados | Scout | Região sem idols disponíveis | [Enviar outro →] | Texto + Região scouted | scouting-recruitment |
| MSG-SC03 | Scout subiu de nível | Sistema | Scout ganha XP suficiente | Ler | Notificação + Novas habilidades | scouting-recruitment |
| MSG-SC04 | Scout recomenda contratação | Scout | Scout avalia candidata como excelente | [Contratar] ou [Ver perfil] | Avatar blur + Stats + Recomendação | scouting-recruitment |
| MSG-SC05 | Avaliação do roster | Talent Director | NPC avalia composição do plantel | Ler + [Ver gaps] | Relatório + Gaps identificados + Sugestões | roster-balance |
| MSG-SC06 | Idol listada para transferência | Talent Director | NPC lista idol para venda | [Reverter] ou [Aceitar] | Delegação + Avatar + Motivo + Valor estimado | market-transfer |

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
| MSG-J07 | Job bloqueado | Sistema | Idol indisponível (lesão/burnout/exclusividade) | [Ver agenda] | Alerta + Avatar + Motivo do bloqueio | job-assignment |
| MSG-J08 | Resultado de show | Sistema | Show concluído | Ler + [Ver detalhes] | Relatório: audience, per-idol scores, setlist, revenue, merch vendido | show-system |
| MSG-J09 | Show cancelado | Sistema | Show não pôde ser realizado | Ler | Alerta + Motivo + Custos perdidos | show-system |
| MSG-J10 | Show Director propõe show | Show Director | NPC planeja show (delegação) | [Aprovar] ou [Editar] | Delegação + Venue + Setlist proposta + Budget | show-system |

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
| MSG-M06 | Idol disponível no mercado | Sistema | Idol fica livre (expiração/rescisão/entrada) | [Ver perfil] ou [Fazer proposta] | Alerta + Avatar + Stats resumidos + Histórico | market-transfer |
| MSG-M07 | Prospect perdido | Sistema | Rival fecha com idol que você observava | Ler | Texto + Avatar + Logo rival que contratou | market-transfer |

---

### CAT-7: IDOLS (Comunicação Direta)

Remetente: **Idol**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-I01 | Idol recusa treino intensivo | Idol | Felicidade <40 | [Respeitar] ou [Insistir] | Avatar grande + Motivo + Indicadores wellness | happiness-wellness |
| MSG-I02 | Idol pede carreira solo | Idol | Fama individual >3× média do grupo | [Aceitar] [Recusar] [Negociar] | Avatar + Argumentos + Dados de fama | group-management |
| MSG-I03 | Conflito entre membros | Sistema | Disputa de liderança/ciúme | [Mediar] [Ignorar] | Avatars dos envolvidos + Descrição | group-management |
| MSG-I04 | Crise underperformer | Sistema | Membro fraco no grupo | [Treinar] [Remover] [Ignorar] | Avatars do grupo + Membro em destaque | group-management |
| MSG-I05 | Diálogo desastroso | Sistema | Dialogue outcome = disaster | Ler | Avatar + Consequências + Affinity delta | dialogue-system |
| MSG-I06 | Promessa cumprida | Sistema | Promise fulfilled antes do deadline | Ler | Positivo + Avatar + Affinity +8 | dialogue-system |
| MSG-I07 | Promessa quebrada | Sistema | Promise deadline expirou sem cumprir | Ler | Alerta + Avatar + Affinity -10 | dialogue-system |
| MSG-I08 | Grupo formado | Sistema | Novo grupo criado | Ler + [Ver grupo] | Celebração + Avatars membros + Nome do grupo | group-management |
| MSG-I09 | Grupo dissolvido | Sistema | Grupo encerrado | Ler | Texto + Avatars ex-membros + Motivo | group-management |
| MSG-I10 | Membro adicionado/removido | Sistema | Alteração no roster do grupo | Ler | Avatar membro + Nome grupo + Ação (entrou/saiu) | group-management |
| MSG-I11 | Líder do grupo alterado | Sistema | Liderança transferida | Ler | Avatars líder anterior/novo + Motivo | group-management |
| MSG-I12 | Líder em crise de wellness | Wellness | Líder de grupo com wellness crítico | [Dar folga] ou [Manter] | Alerta + Avatar líder + Indicadores + Impacto no grupo | group-management |
| MSG-I13 | Idol mudou de tier de fama | Sistema | `fame:tierChange` | Ler | Avatar + Tier anterior → novo + Consequências (jobs, contratos) | fame-rankings |
| MSG-I14 | Idol sofreu lesão | Sistema | `medical:injuryOccurred` | [Ajustar agenda] | Urgente + Avatar + Tipo lesão + Semanas de recuperação | medical-system |
| MSG-I15 | Idol recuperou de lesão | Sistema | `medical:recoveryComplete` | Ler + [Ver agenda] | Positivo + Avatar + "Pronta para voltar" | medical-system |
| MSG-I16 | Dano permanente | Sistema | `medical:permanentDamage` | Ler | Urgente + Avatar + Stat afetado + Perda (-5) | medical-system |
| MSG-I17 | Carga de treino crítica | Wellness | `medical:trainingLoadCritical` | [Reduzir carga] ou [Manter] | Alerta + Avatar + Load % + Risco de lesão | medical-system |

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
| MSG-F08 | Mudança de estado de dívida | Contador | Agência entra/sai de dívida | Ler | Alerta + Estado anterior → novo + Projeção | agency-economy |
| MSG-F09 | Facility upgraded | Sistema | Upgrade de instalação concluído | Ler | Positivo + Facility + Nível novo + Benefícios | agency-economy |
| MSG-F10 | CFO alerta risco financeiro | CFO | Indicadores financeiros negativos | [Ver relatório] | Alerta + Indicadores + Recomendação | financial-reporting |
| MSG-F11 | CFO recomenda upgrade facility | CFO | NPC identifica necessidade de upgrade | [Aprovar] ou [Adiar] | Delegação + Facility + Custo + ROI estimado | agency-economy |
| MSG-F12 | Resultado negociação de budget | Board | NPC negocia budget com dono | Ler | Texto + Budget aprovado vs pedido | agency-economy |
| MSG-F13 | Alerta cash runway | Contador | Projeção cash < 0 em 3 meses | [Cortar custos] ou [Ver relatório] | Urgente + Projeção gráfica + Meses restantes | financial-reporting |
| MSG-F14 | Idol com ROI negativo | Contador | ROI negativo por 3+ meses | Ler + [Ver detalhes] | Alerta + Avatar + Revenue vs Cost + Sugestões | financial-reporting |
| MSG-F15 | Idol em crise de dívida pessoal | Sistema | Dívida idol > 3× renda anual | Ler | Alerta + Avatar + Living standard downgrade | idol-personal-finance |
| MSG-F16 | Idol completou life goal | Idol | Meta pessoal cumprida | Ler | Positivo + Avatar + Goal + Stat/happiness bonus | idol-personal-finance |
| MSG-F17 | Agência promovida/rebaixada | Dono | Tier da agência mudou | Ler | Celebração/Alerta + Tier anterior → novo | agency-meta-game |

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
| MSG-E06 | PR lançou campanha proativa | PR | NPC lança campanha de PR | Ler | Texto + Idol/grupo alvo + Budget + Previsão | event-scandal-generator |
| MSG-E07 | Relatório de fan clubs | PR | NPC analisa fan clubs mensalmente | Ler + [Ver detalhes] | Relatório + Segmentos + Recomendações | fan-club-system |
| MSG-E08 | Risco materializado | Sistema | Risco do planning board ocorreu | [Responder] | Alerta + Descrição do risco + Impacto | agency-planning-board |
| MSG-E09 | Milestone atingido/perdido | Sistema | Deadline do planning board | Ler | Status + Consequência + Próximo milestone | agency-planning-board |

---

### CAT-10: INTELLIGENCE E ANÁLISES

Remetente: **Sistema / Analista**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-A01 | Post-mortem de job | Sistema | Após cada job | Ler | Análise: fatores, previsão vs real, aprendizado | agency-intelligence-reports |
| MSG-A02 | Alerta preditivo | Sistema | Risco >70% de evento negativo | [Prevenir →] | Alerta + % confiança + Recomendação | agency-intelligence-reports |
| MSG-A03 | Comparação solicitada | Sistema | Jogador pede comparação | Ler | Side-by-side de idols/grupos | agency-intelligence-reports |
| MSG-A04 | Relatório de inteligência rival | Analista | NPC monitora rivais | Ler | Relatório + Rival + Ações + Estimativas | agency-intelligence-reports |
| MSG-A05 | Relatório semanal de KPIs | Analista | Fim da semana | Ler | Dashboard: KPIs + Tendências + Alertas | agency-intelligence-reports |

---

### CAT-11: CARREIRA DO PRODUTOR

Remetente: **Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-P01 | Título de legado conquistado | Sistema | Condições do título cumpridas | Ler | Celebração + Título + Descrição | player-reputation-affinity |
| MSG-P02 | Memória com ex-idol | Sistema | Aniversário de evento marcante | Ler | Nostálgico + Avatar + Memória | player-reputation-affinity |
| MSG-P03 | Proposta de outra agência | Rival | Reputação alta + agência maior | [Aceitar] [Recusar] | Proposta + Logo rival + Termos | agency-economy |
| MSG-P04 | Idol graduou | Sistema | Cerimônia de graduação realizada | Ler | Celebração + Avatar + Tipo cerimônia + Fame boost | post-debut-career |
| MSG-P05 | Ex-idol seguiu carreira | Sistema | Career type determinado na graduação | Ler | Avatar + Carreira escolhida + Disponibilidade NPC | post-debut-career |
| MSG-P06 | Ex-idol disponível como NPC | Sistema | Ex-idol com créditos de compositor/coreógrafo | [Contratar] | Avatar + Tipo (compositor/coreógrafo) + Skills | post-debut-career |

---

### CAT-12: MÚSICA E PRODUÇÃO

Remetente: **Music Producer / Sistema**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-MU01 | Música lançada | Sistema | Release processado | Ler + [Ver charts] | Celebração + Capa + Artistas + Previsão de charts | music-production |
| MSG-MU02 | Entrada no chart | Sistema | Música entra em chart pela primeira vez | Ler | Positivo + Posição + Semanas no chart | music-charts |
| MSG-MU03 | Pipeline de produção travou | Music Producer | Etapa da produção stalled | [Resolver] ou [Esperar] | Alerta + Música + Etapa + Motivo | music-production |
| MSG-MU04 | NPC encomendou música | Music Producer | NPC decide encomendar composição | [Aprovar] ou [Editar] | Delegação + Compositor + Estilo + Budget | music-production |
| MSG-MU05 | Pipeline stall resolvido | Music Producer | NPC resolve stall | Ler | Texto + Solução aplicada + Nova previsão | music-production |
| MSG-MU06 | Plano de release proposto | Music Producer | NPC planeja release | [Aprovar] ou [Editar] | Delegação + Música + Data + Tipo release + MV | music-production |

---

### CAT-13: MERCHANDISING E MÍDIA

Remetente: **CFO / Sistema / Manager**

| ID | Tipo | Remetente | Trigger | Ação do Produtor | Layout | GDD Fonte |
|---|---|---|---|---|---|---|
| MSG-MR01 | Stock de merch esgotado | Sistema | Demanda > estoque durante show/semana | [Produzir mais] | Alerta + Produto + Demanda perdida + Revenue perdida | merchandising-production |
| MSG-MR02 | Batch de merch pronto | Sistema | Produção concluiu batch | Ler | Positivo + Produto + Quantidade + Estoque atual | merchandising-production |
| MSG-MR03 | Oferta de programa de TV | Rede de TV | Slot de mídia disponível | [Aceitar] ou [Recusar] | Proposta + Nome programa + Cachê + Audiência | media-entities |
| MSG-MR04 | NPC decidiu produzir merch | CFO | NPC cria linha de merchandising | [Aprovar] ou [Editar] | Delegação + Produto + Idol/grupo + Quantidade + Custo | merchandising-production |
| MSG-MR05 | NPC lançou campanha de mkt | CFO | NPC inicia campanha de marketing | Ler | Texto + Idol/grupo alvo + Budget + Duração | agency-economy |
| MSG-MR06 | NPC planejou evento custom | CFO | NPC planeja festival/tour/live | [Aprovar] ou [Editar] | Delegação + Tipo + Venue + Budget + Guest list | player-created-events |

---

## Resumo por Layout

Cada categoria tem um **layout visual distinto** no inbox:

| Layout | Categorias | Características |
|---|---|---|
| **Texto + Anexos** | W01-W07, F01 | Corpo de texto + cards de anexo (perfil, dados) |
| **Alerta + Ação** | C01, C04, C07, S04-S05, M01, E01-E02, F05, F13, I14, I16-I17, MR01 | Borda colorida + botões de ação proeminentes |
| **Relatório** | SC01, SC05, J01-J02, J05, J08, F01, F10, A01, A04-A05, E07 | Dados estruturados + gráficos mini + resumo |
| **Proposta** | C03, C05, M01-M07, MSG-P03, MR03 | Comparação lado a lado + botões aceitar/recusar |
| **Delegação** | S01-S03, S06-S07, S09-S15, SC04, SC06, C09, J10, F11-F12, MU04, MU06, MR04-MR06 | Preview da ação proposta + [Aprovar]/[Editar] |
| **Celebração** | F03, F09, F16-F17 (promo), MU01, MSG-P01, MSG-P04, E04, I06, I08, I13 (promo) | Visual positivo + confetti sutil + conquista |
| **Comunicação Idol** | I01-I17, C04 | Avatar grande + tom emocional + indicadores |

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
| Contratos | 9 | 5 |
| Staff | 15 | 9 |
| Scouting | 6 | 3 |
| Jobs/Shows | 10 | 2 |
| Mercado | 7 | 5 |
| Idols | 17 | 7 |
| Finanças/Metas | 17 | 5 |
| Escândalos/Eventos | 9 | 4 |
| Intelligence | 5 | 1 |
| Carreira | 6 | 1 |
| Música | 6 | 3 |
| Merchandising/Mídia | 6 | 4 |
| **Total** | **120** | **49** |

---

## Dependencies

**Hard**: Todos GDDs de sistemas (geram os triggers)
**Soft**: Producer Profile (tom das mensagens), Agency Staff (remetentes disponíveis)
**Depended on by**: UI Inbox (wireframe 05), Tutorial/Onboarding (sequência W01-W07)

## Resolved Questions

- **Templates**: Gerados em tempo de desenvolvimento por string generator (ADR-021).
  Sem LLM em produção. Generator produz locale files tipados a partir deste catálogo.
- **Personalidade**: Não na v1. Todas mensagens usam templates fixos parametrizáveis.
- **Limite**: 3 meses de retenção (12 semanas). Mensagens starred são isentas.
  Definido em ADR-014.
