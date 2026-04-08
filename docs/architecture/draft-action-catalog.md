# DRAFT — Complete Action Catalog (v2)

> Working document. Informed by FM26 delegation model, adapted for idol agency.
> Will feed into ADR-009 rewrite once validated.

## Structural Model

```
Papel (Role)  = quem a pessoa É — define a especialidade e os cargos naturais
Cargo (Post)  = responsabilidade delegável — unidade de delegação
Ação (Action) = operação atómica dentro de um cargo — o que aparece no ActionList

Um NPC tem 1 papel → cobre todos os cargos desse papel sem penalidade.
Um NPC pode receber cargos de outro papel → multi-role penalty.
O produtor da agência (player ou NPC) aloca pessoas nos cargos, inclusive a si mesmo.
Qualquer cargo pode ficar vazio → consequências naturais (como no FM: ninguém faz).
```

## Inspiração FM26

No FM, o Manager delega entre 8 categorias de responsabilidade para ~12 papéis
de staff. Cada papel tem atributos que afetam qualidade quando delegado.
O nosso modelo é análogo, mas com domínios de idol agency:

| FM26 | Idol Agency |
|------|-------------|
| Manager | Produtor (player ou NPC Head Producer) |
| Assistant Manager | Vice-Produtor / Braço Direito |
| Director of Football | Diretor de Talentos |
| Chief Scout | Chefe de Scouting |
| Head of Youth Development | Chefe de Desenvolvimento |
| Coaches (fitness, GK, etc.) | Coaches (vocal, dance, acting, etc.) |
| Physio / Sports Scientist | Wellness Advisor / Médico |
| Data Analyst | Analista de Inteligência |
| Technical Director | Diretor de Operações |
| Loan Manager | — (não aplicável) |
| — | Diretor de Shows |
| — | Diretor de Comunicação |
| — | Diretor Musical (A&R) |

---

## Papéis e Cargos

### 1. HEAD PRODUCER (Produtor-Chefe)
> O "manager" do FM. Em agências de garagem, faz tudo. Em agências elite,
> só aloca pessoas e define direção. Pode ser o player ou um NPC.

| Cargo | Ações |
|-------|-------|
| **Alocação de Staff** | Contratar NPC, demitir NPC, atribuir NPC a cargo(s), re-alocar cargos, avaliar performance de NPC, negociar salário de NPC, atribuir-se a cargo |
| **Direção Estratégica** | Definir foco da agência, postura de agenda, direção de imagem, postura de crescimento, visão de longo prazo |
| **Relações com o Board** | Negociar orçamento de staff (trimestral), apresentar resultados, responder a demandas da diretoria, defender investimentos |
| **Relações com Idols** | Conversar com idol (tom, promessas), pep talk, responder a pedidos, mediar conflitos entre idols |

### 2. VICE-PRODUCER (Vice-Produtor)
> Braço direito. Cobre qualquer cargo temporariamente. No FM é o Assistant Manager.
> Substituto automático quando o produtor está sobrecarregado.

| Cargo | Ações |
|-------|-------|
| **Substituição geral** | Assume qualquer cargo não coberto, com qualidade baseada nos seus atributos (generalista) |
| **Conselheiro** | Sugere decisões ao player (como o Assistant Manager do FM dá conselhos), recomenda contratações, alerta para problemas |
| **Supervisão de rotina** | Manter operações diárias quando player não está focado (modo "piloto automático" para funções delegadas) |

### 3. TALENT DIRECTOR (Diretor de Talentos)
> Equivalente ao Director of Football. Quem entra e sai do roster.

| Cargo | Ações |
|-------|-------|
| **Negociação de Contratos** | Propor novo contrato (9 cláusulas), counter-propose, aceitar/rejeitar proposta, iniciar renovação, definir termos de renovação, rescindir contrato, responder a buyout (aceitar/rejeitar/counter), responder a demanda de rescisão de idol |
| **Gestão de Roster** | Avaliar composição do roster (gaps de archetype, distribuição de idade, dependência de star, cobertura de jobs), recomendar alvos de recrutamento, decidir quem é dispensável |
| **Transferências** | Listar idol para transferência, aceitar/rejeitar propostas de compra, iniciar proposta de buyout em idol de rival, negociar preço com agência rival |

### 4. CHIEF SCOUT (Chefe de Scouting)
> Equivalente ao Chief Scout do FM. Olhos e ouvidos para novos talentos.

| Cargo | Ações |
|-------|-------|
| **Gestão de Olheiros** | Contratar scout NPC, demitir scout, atribuir scout a região, avaliar performance de scout |
| **Missões de Scouting** | Enviar scout em missão (região, duração, foco), definir prioridades de scouting (archetype, tier, região), cancelar missão |
| **Avaliação de Candidatos** | Requisitar relatório detalhado de candidato, shortlist de candidatos, comparar candidatos, recomendar contratação ao Talent Director |

### 5. DEVELOPMENT DIRECTOR (Chefe de Desenvolvimento)
> Equivalente ao Head of Youth Development. Crescimento a longo prazo.

| Cargo | Ações |
|-------|-------|
| **Planos de Desenvolvimento** | Criar plano (12 semanas, metas, stats alvo), definir foco de treino, definir lista de proteção, avaliar progresso, ajustar plano, abortar plano, flag idol como pronto para debut/promoção |
| **Mentoria** | Atribuir idol mentor a mentee, definir objetivos de mentoria, avaliar compatibilidade mentor-mentee, encerrar mentoria |
| **Avaliação de Potencial** | Analisar ceiling de cada idol (PT + stats atuais), identificar idols estagnados, recomendar investimento ou desistência, projetar timeline de desenvolvimento |

### 6. VOCAL COACH
> Especialista em treino vocal. Pode acumular com outros coaches (mesmo domínio).

| Cargo | Ações |
|-------|-------|
| **Treino Vocal** | Selecionar stat vocal para treinar, definir intensidade (normal/intensivo), conduzir sessão, avaliar progresso vocal, desenhar rotina de exercícios para fraquezas específicas |

### 7. DANCE COACH
> Especialista em dança e expressão corporal.

| Cargo | Ações |
|-------|-------|
| **Treino de Dança** | Selecionar stat de dança para treinar, definir intensidade, conduzir sessão, avaliar progresso, preparar idols para coreografias de grupo |

### 8. ACTING/VARIETY COACH
> Especialista em atuação, variety shows, comunicação.

| Cargo | Ações |
|-------|-------|
| **Treino de Atuação** | Selecionar stat de atuação/variety/comunicação, definir intensidade, conduzir sessão, avaliar progresso, preparar para programas de TV |

### 9. MUSIC DIRECTOR (Diretor Musical / A&R)
> Quem cuida de TUDO musical: produção, compositores, lançamentos.
> A&R = Artists & Repertoire — termo da indústria musical para quem descobre
> e desenvolve o lado artístico/musical.

| Cargo | Ações |
|-------|-------|
| **Produção Musical** | Encomendar música (selecionar compositor, género, config), selecionar idols para gravação, avançar pipeline Kanban (alocar recursos), resolver stage stalled, cancelar projeto, licenciar cover |
| **Gestão de Compositores** | Avaliar compositores disponíveis (tier, custo, estilo), reservar capacidade, manter relações com compositores top, negociar fees |
| **Planeamento de Lançamento** | Planear álbum/single (data, tracklist, lead single), definir campanha de marketing musical, planear atividades de hype pré-lançamento (teaser, MV, fan exclusive, press listening) |

### 10. SHOW DIRECTOR (Diretor de Shows)
> Tudo sobre performances ao vivo. Combina Stage Manager + Coreógrafo do GDD.

| Cargo | Ações |
|-------|-------|
| **Planeamento de Shows** | Planear show (venue, data, lineup), cancelar show, reagendar show, definir orçamento de produção |
| **Gestão de Palco** | Selecionar pacotes de produção (som, luz, banda, cenografia, FX), coordenar logística, gerir substituições mid-show (max 2-3), ajustar pacing mid-show |
| **Coreografia e Formações** | Desenhar coreografia para música, atribuir roles de formação por idol por música (center, vocal, dance, etc.), criar presets de formação, otimizar pacing via ordem de músicas |
| **Setlist** | Montar setlist (selecionar músicas, definir ordem), otimizar pacing score (fluxo de energia), planear MC/interludes, planear trocas de figurino, definir encore |
| **Figurino e Wardrobe** | Comprar figurinos (tipo, tema, tier), atribuir figurinos a idols por show, planear trocas mid-show, reparar figurinos degradados, encomendar figurinos custom, gerir inventário (limite por facility) |

### 11. COMMUNICATIONS DIRECTOR (Diretor de Comunicação)
> PR + social media + community management.

| Cargo | Ações |
|-------|-------|
| **PR e Gestão de Crise** | Responder a escândalo (negar/desculpar/spin/silêncio), lançar campanha PR proativa (image boost, damage control, viral push), emitir comunicado público, gestão de escalação de crise, relações com media |
| **Social Media** | Postar em nome de idol (engagement), gerir engagement com fãs, gerir trending negativo, planear campanhas de social media, monitorar sentimento online |
| **Fan Club (Community Manager)** | Analisar demandas e mood dos fãs, planear eventos de fãs (fan meetings, signings, online), gerir toxicidade, campanhas de engagement, reportar estado dos fãs à agência, mediar entre segmentos (casual vs hardcore) |

### 12. OPERATIONS DIRECTOR (Diretor de Operações)
> Dinheiro, facilities, merch, eventos, marketing — o lado business.

| Cargo | Ações |
|-------|-------|
| **Gestão Financeira** | Rever income/expense, ajustar alocação de budget, aprovar/rejeitar despesas grandes, flag riscos financeiros, recomendar cortes, projetar cash flow 3 meses, avaliar ROI por idol/staff/facility |
| **Gestão de Facilities** | Upgrade facility (tipo, confirmar custo), downgrade facility, priorizar próximo investimento, avaliar utilização vs custo |
| **Merchandising** | Decidir produtos a produzir (tipo, tema, idol/grupo), definir print-run, definir preço, planear edições especiais, aplicar descontos a stock antigo, write-off stock, planear merch para shows/eventos |
| **Marketing** | Lançar campanha (idol, lançamento, show, evento), definir budget de campanha, ajustar campanha em curso, encerrar campanha, avaliar ROI de campanha |
| **Planeamento de Eventos** | Planear evento custom (concerto, fan meeting, caridade, collab), definir orçamento e logística, convidar artistas externos, gestão de execução, avaliação pós-evento |

### 13. WELLNESS DIRECTOR (Diretor de Bem-estar)
> Equivalente ao Physio + Sports Scientist do FM.

| Cargo | Ações |
|-------|-------|
| **Monitoramento de Wellness** | Monitorar todas as barras das idols, flag idols em risco (stress >threshold, happiness declining), recomendar dias de descanso, agendar sessão de psicólogo, conduzir sessão de wellness (-stress, +happiness) |
| **Gestão de Lesões** | Avaliar risco de lesão (dias consecutivos, idade, saúde), coordenar reabilitação, follow-up pós-lesão, prevenir re-lesão (janela de 2 semanas) |
| **Cuidado Pós-crise** | Plano de recovery de burnout, scheduling gradual de retorno, monitorar ídolos em recuperação |

### 14. INTELLIGENCE ANALYST (Analista de Inteligência)
> Equivalente ao Data Analyst do FM.

| Cargo | Ações |
|-------|-------|
| **Analytics de Performance** | Tendências de performance por idol, análise pós-mortem de jobs/shows, comparativo com expectations |
| **Inteligência Competitiva** | Monitorar atividades de rivais, prever buyouts, tendências de mercado, estimar faturamento rival |
| **Relatórios** | Gerar relatórios semanais/mensais, gerir alertas e prioridades, projeções e previsões |

---

## Resumo

| # | Papel | Cargos | FM26 Equivalente |
|---|-------|--------|-----------------|
| 1 | Head Producer | 4 | Manager |
| 2 | Vice-Producer | 3 | Assistant Manager |
| 3 | Talent Director | 3 | Director of Football |
| 4 | Chief Scout | 3 | Chief Scout |
| 5 | Development Director | 3 | Head of Youth Development |
| 6 | Vocal Coach | 1 | Fitness Coach (specialist) |
| 7 | Dance Coach | 1 | GK Coach (specialist) |
| 8 | Acting/Variety Coach | 1 | — |
| 9 | Music Director | 3 | — |
| 10 | Show Director | 5 | — |
| 11 | Communications Director | 3 | — (FM tem Media mas é mínimo) |
| 12 | Operations Director | 5 | Technical Director (parcial) |
| 13 | Wellness Director | 3 | Physio + Sports Scientist |
| 14 | Intelligence Analyst | 3 | Data Analyst |
| | **Total** | **41 cargos** | |

---

## Regras de Atribuição

### Multi-Role (mesmo domínio = natural, outro domínio = penalidade)

Combinações naturais (sem penalidade):
- Vocal Coach + Dance Coach + Acting Coach (mesmo domínio: treino)
- PR + Social Media + Fan Club (mesmo domínio: comunicação)
- Financeiro + Facilities + Marketing (mesmo domínio: operações)
- Show Planning + Stage Mgmt + Choreography + Setlist + Costume (mesmo domínio: shows)

Cross-domain (com penalidade):
- Vocal Coach + Gestão de Roster → penalidade (treino ≠ talentos)
- Show Director + Scouting → penalidade (shows ≠ scouting)
- Wellness + Financeiro → penalidade (bem-estar ≠ operações)

### Progressão da Agência

| Tier | Staff típico | Produtor cobre | Delegado |
|------|-------------|----------------|----------|
| **Garagem** (3-5 idols) | 0-2 NPCs | Quase tudo (6-8 cargos) | Treino, talvez scouting |
| **Indie** (6-15 idols) | 3-5 NPCs | 3-4 cargos chave | Treino, agenda, scouting, wellness |
| **Regional** (16-30 idols) | 6-8 NPCs | 1-2 cargos estratégicos | Maioria das operações |
| **Nacional** (31-50 idols) | 9-12 NPCs | Só direção/idols | Tudo delegado |
| **Elite** (50+ idols) | 13-18 NPCs | Visão e alocação | Staff dedicado por cargo |

### Cargo Vazio = Consequência Natural

| Cargo vazio | O que acontece |
|-------------|---------------|
| Scheduling | Ninguém monta agenda. Idols ficam ociosas. Player faz manual. |
| Contratos | Contratos expiram sem renovação. Buyouts não são respondidos. |
| Scouting | Sem busca proativa. Só mercado público. |
| Treino (qualquer) | Crescimento natural apenas (×0.3 do normal). |
| Produção Musical | Sem músicas novas. Pipeline parada. |
| Shows | Sem shows planeados. Oportunidades perdidas. |
| PR | Escândalos recebem impacto total. |
| Social Media | Fama online cresce organicamente (lento). |
| Fan Club | Demandas de fãs ignoradas. Mood degrada. |
| Financeiro | Sem alertas. Sem projeções. Gastos descontrolados. |
| Facilities | Sem upgrades sugeridos. Oportunidades perdidas. |
| Merch | Sem produção de merch. Receita perdida. |
| Marketing | Sem campanhas. Lançamentos sem promoção. |
| Eventos | Sem eventos custom. Só os que vêm do board/calendário. |
| Wellness | Sem alertas de burnout. Stress acumula sem intervenção. |
| Lesões | Sem prevenção. Sem coordenação de rehab. |
| Inteligência | Sem relatórios. Decisões às cegas. |
