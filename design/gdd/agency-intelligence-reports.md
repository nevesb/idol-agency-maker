# Agency Intelligence & Reports

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real, Pilar 2 — Suas Decisoes, Suas Consequencias

## Overview

O Agency Intelligence & Reports e o sistema transversal de **observabilidade**
do jogo. Consolida dados de todos os subsistemas em relatorios explicativos,
ferramentas comparativas e alertas preditivos. Vai alem do Financial Reporting
(que cobre so financas) -- cobre performance, wellness, carreira, roster,
midia e sentimento de fas. E o "painel de controle" que transforma dados
brutos em **insight acionavel**.

No FM, isso equivale aos relatorios do analista, comparacoes de jogadores,
tendencias de desempenho e alertas do staff. Sem este sistema, o jogador tem
muitos numeros mas pouca **leitura** -- sabe o que aconteceu mas nao entende
por que.

## Player Fantasy

A fantasia e de **produtor que entende o que esta acontecendo e por que**.
Nao so ver que a idol X caiu de ranking, mas entender que caiu porque a agenda
pesada derrubou a consistencia, que por sua vez reduziu a performance em TV,
que por sua vez perdeu audiencia. O jogador que lê os reports toma decisoes
melhores. E o equivalente do xG e analytics no futebol moderno.

## Detailed Design

### Core Rules

#### 1. Categorias de Relatorios

| Aba | Conteudo | Fonte de Dados | Prioridade |
|---|---|---|---|
| **Performance** | Resultados de jobs, taxa de sucesso, tendencia | Job Assignment, Week Simulation | MVP |
| **Finance** | Receita/despesa por fonte, ROI por idol, projecoes | Agency Economy, Financial Reporting | MVP |
| **Wellness Risk** | Idols em risco de burnout, stress acumulado, alertas | Happiness & Wellness | MVP |
| **Career Trajectory** | Curva de crescimento por idol, projecao de pico | Stats System, Idol Lifecycle | Vertical Slice |
| **Roster Depth** | Cobertura por arquetipo, lacunas, concentracao | Roster Balance, Idol Archetypes | Vertical Slice |
| **Media ROI** | Exposicao vs retorno, eficiencia por tipo de midia | News Feed, Media Entities, Fame | Alpha |
| **Fan Sentiment** | Humor, toxicidade, tendencias por fa-clube | Fan Club System | Alpha |

#### 2. Relatorios Explicativos (Post-Mortem)

Quando uma idol performa **acima ou abaixo do esperado**, o sistema gera
explicacao automatica com fatores contribuintes:

```
Relatorio de Performance: Suzuki Mei — Show no Budokan
Resultado: FRACASSO (performance 0.35)

Fatores negativos:
  - Stress em 78% (-30% performance)        [Wellness]
  - Consistencia baixa (valor oculto)        [Stats ocultos]
  - Primeira vez em arena grande             [Adaptabilidade]
  - Agenda pesada nas ultimas 3 semanas      [Schedule]

Fatores positivos:
  + Carisma 82 (+16% bonus universal)        [Stats]
  + Fa-clube engajado (mood 75)              [Fan Club]

Reacao de midia: "Desempenho abaixo do esperado"  [News Feed]
Reacao de fas: Mood -15, preocupacao              [Fan Club]
Impacto interno: Motivacao -10, Stress +5         [Wellness]
Aprendizado sugerido: Reduzir carga, treinar Aura [Staff/Coach]
```

**Regras:**
- Gerado automaticamente para todo job concluido
- Mostra 2-4 fatores positivos e 2-4 negativos
- Fatores vem de todos os subsistemas relevantes
- Ocultos aparecem como descricoes vagas ("instabilidade emocional" em vez de "Consistencia 3")
- Aprendizado sugerido so aparece se Wellness Advisor ou Coach estiver contratado

#### 3. Ferramentas Comparativas

Permitem ao jogador comparar entidades lado a lado:

| Comparacao | Metricas | Uso |
|---|---|---|
| **Idol A vs Idol B** | Stats, fama, receita gerada, stress, crescimento, custo | Decidir quem escalar, quem renovar |
| **Grupo A vs Grupo B** | Sinergia, fama media, chemistry, receita | Avaliar qual grupo investir |
| **Custo vs Retorno** | Salario + treino + marketing vs receita gerada (por idol) | Identificar idols "deficitarias" |
| **Fama vs Rentabilidade** | Ranking vs receita por idol | Idol famosa que nao da dinheiro |
| **Stress vs Produtividade** | Carga de trabalho vs resultados | Encontrar ponto otimo |
| **Esperado vs Real** | Performance projetada (baseada em stats) vs resultado real | Identificar fatores ocultos |
| **Minha agencia vs Rival X** | Ranking, receita estimada, roster size, foco | Benchmarking |

**Regras:**
- Acessivel via UI dedicada (tela de comparacao)
- Dados de rivais sao **estimados** (nao exatos) -- precisao depende do tier
- Comparacoes salvam historico (pode comparar idol consigo mesma 3 meses atras)

#### 4. Alertas e Predicoes

O sistema monitora tendencias e gera alertas proativos:

| Alerta | Condicao | Acao Sugerida |
|---|---|---|
| **Risco de burnout** | Stress > 70% por 2+ semanas | "Considere dar folga a [idol]" |
| **Risco de escandalo** | Temperamento baixo + tempo livre + sem restricao namoro | "Vulnerabilidade alta para [idol]" |
| **Risco de churn** | Afinidade < 40 + contrato vencendo em < 2 meses | "[Idol] pode nao renovar" |
| **Projecao financeira** | Tendencia de receita negativa por 2+ meses | "Receita em queda. Deficit em ~N meses" |
| **Saturacao de mercado** | Muitas idols no mesmo tipo de job | "Excesso de variety no roster" |
| **Janela de renovacao** | Contrato vence em 4 semanas | "Iniciar renovacao de [idol]" |
| **Patinho feio** | Idol com TA crescendo rapido mas pouca exposicao | "[Idol] esta melhorando sem oportunidades" |
| **Dependencia de estrela** | 1 idol gera > 40% da receita | "Concentracao de receita em [idol]" |
| **Idol subutilizada** | Idol com stats altos mas poucos jobs nas ultimas 4 semanas | "[Idol] esta subutilizada" |
| **Veterana em declinio** | Idol 28+ com stats fisicos caindo > 3/mes | "[Idol] em declinio fisico acelerado" |

**Regras:**
- Alertas aparecem no dashboard principal (icone de atencao)
- Alertas tem 3 niveis: informativo (azul), atencao (amarelo), urgente (vermelho)
- Jogador pode dispensar alertas (nao voltam ate condicao mudar)
- Wellness Advisor contratado melhora precisao de alertas de burnout/churn
- Alertas preditivos sao **estimativas** -- podem estar errados (~80% precisao)

#### 5. Dashboard de Resumo (Command Center)

Tela principal de intelligence mostrando:

```
+------------------------------------------+
|  AGENCY INTELLIGENCE                     |
+------------------------------------------+
|                                          |
|  [!] 3 alertas ativos       [Ver todos]  |
|                                          |
|  TOP PERFORMANCE (semana)                |
|  1. Tanaka Yui - Show S+ (0.92)         |
|  2. Grupo Aurora - TV A  (0.78)         |
|  3. Sato Hana   - Gravacao A (0.76)     |
|                                          |
|  ATENCAO NECESSARIA                      |
|  ! Suzuki Mei - Stress 82% (2 semanas)  |
|  ! Contrato de Yamada vence em 3 sem.   |
|  ? Novata Kimura crescendo rapido       |
|                                          |
|  METRICAS RAPIDAS                        |
|  Receita semanal: ¥2.4M (+8%)          |
|  Taxa de sucesso: 71% (=)               |
|  Wellness medio: 62% (-3%)              |
|  Ranking agencia: #12 (+2)              |
|                                          |
|  [Performance] [Finance] [Wellness]      |
|  [Careers] [Roster] [Media] [Fans]       |
+------------------------------------------+
```

**O jogador precisa sempre saber:**
1. O que exige atencao agora (alertas)
2. Onde esta o risco (wellness, contratos)
3. Onde esta a oportunidade (patinho feio, mercado)
4. Quem esta melhorando ou piorando (tendencias)
5. Onde a agencia esta ganhando/perdendo dinheiro (finance)
6. O que esta perto de explodir (predicoes)

### 6. UX Hierarchy — Orcamento de Informacao

**REGRA CARDINAL: menos e mais. Se o jogador precisa scrollar pra encontrar
o que importa, o sistema falhou.**

Este sistema e o que mais corre risco de matar a experiencia se mal
implementado. Alertas demais = ruido. Reports demais = fadiga. Paineis
demais = paralisia. O design precisa de **budget de informacao brutal**.

#### Hierarquia de Atencao (3 Camadas)

| Camada | O que mostra | Onde | Quando |
|---|---|---|---|
| **Camada 1: Glance** | 1 numero + 1 seta + 1 cor. Nada mais | Widget no Dashboard principal | Sempre visivel |
| **Camada 2: Scan** | Top 3 alertas + top 3 performers + 4 metricas | Tela de Intelligence (resumo) | 1 clique do Dashboard |
| **Camada 3: Drill-down** | Reports completos, comparacoes, historico | Abas dentro de Intelligence | 2 cliques do Dashboard |

**O jogador casual NUNCA precisa ir alem da Camada 2.**
O jogador hardcore vive na Camada 3.

#### Budget de Alertas

```
MAXIMO DE ALERTAS VISIVEIS NO DASHBOARD: 3

Prioridade de corte:
  1. Alertas vermelhos (urgentes) — sempre mostrados (max 2)
  2. Alertas amarelos (atencao) — 1 slot restante
  3. Alertas azuis (informativos) — so na tela de Intelligence
  4. Se > 2 vermelhos: mostrar os 2 mais recentes + "e mais N..."

NUNCA mostrar mais de 3 alertas no dashboard.
Se tudo esta bem: "Sem alertas — agencia saudavel" (1 linha verde)
```

#### Budget de Post-Mortem

```
Post-mortem de job no Week Results:
  - MODO COMPACTO (padrao): Nota + 1 frase resumo
    "Suzuki Mei — Music Monday: B+ (solida mas contida)"
  - MODO EXPANDIDO (clique): Fatores completos + reacao
  - NUNCA expandir automaticamente. Jogador escolhe quais ver

Post-mortems exibidos no resumo semanal: MAX 5 (mais relevantes)
  Prioridade: Nota S, Nota F, maior mudanca vs esperado
  Restante: acessivel via historico, nunca forcado na tela
```

#### Regras Anti-Ruido

1. **Alerta so dispara uma vez** — nao repete toda semana. Marca como
   "ativo" ate ser resolvido ou dispensado
2. **Reports nao geram notificacao** — jogador vai ate eles, eles nao
   vao ate o jogador (exceto alertas vermelhos)
3. **Comparacoes sob demanda** — nunca sugeridas proativamente. O jogador
   pede quando precisa
4. **Predicoes com % de confianca** — "Risco de burnout: 72%" nao
   "Burnout iminente!!!". Tom factual, nao alarmista
5. **Sugestoes de staff aparecem como tooltip** — nao como alerta.
   Mouse-over no dado mostra o que o coach pensa
6. **Dados de rivais SEMPRE marcados como "estimativa"** — nunca
   apresentados como fato. "~¥15M (±30%)" nao "¥15M"

#### O que NAO vai no Dashboard (nunca)

- Historico de mais de 1 semana
- Comparativos de rivais
- Projecoes de longo prazo
- Detalhes de fa-clube
- ROI por idol (so em drill-down)
- Qualquer grafico que precisa mais de 3 segundos pra ler

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Job Assignment** | <- lê resultados | Performance por job, taxa de sucesso |
| **Week Simulation** | <- lê resultados | Dados semanais consolidados |
| **Agency Economy** | <- lê financas | Receita, despesa, lucro, projecoes |
| **Financial Reporting** | <- complementa | Intelligence expande o Financial Reporting com analytics nao-financeiros |
| **Happiness & Wellness** | <- lê barras | Stress, saude, motivacao por idol |
| **Idol Attribute/Stats** | <- lê stats | Crescimento, tendencias, comparacoes |
| **Fame & Rankings** | <- lê rankings | Posicao, tendencias de fama |
| **Fan Club System** | <- lê sentimento | Mood, toxicidade, tamanho |
| **Contract System** | <- lê prazos | Contratos vencendo, clausulas |
| **Idol Archetypes** | <- lê papeis | Cobertura por arquetipo |
| **Roster Balance** | <- lê composicao | Lacunas, concentracao |
| **Agency Staff** | <- lê eficacia | Staff gera insights de maior qualidade |
| **Agency Strategy** | -> sugere | Reports sugerem ajustes estrategicos |
| **News Feed** | <- lê midia | Exposicao mediatica por idol |
| **Player Reputation** | <- lê reputacao | Legado do produtor |

## Formulas

#### Precisao de Predicao

```
precisao_base = 0.65  // 65% sem staff
precisao_com_staff = 0.65 + (wellness_advisor_skill / 20 × 0.20)
// Staff skill 20: 85% de precisao
// Staff skill 10: 75% de precisao

// Alertas falso-positivos = 1 - precisao
```

#### ROI por Idol

```
roi_idol = (receita_gerada_3meses - custo_total_3meses) / custo_total_3meses × 100

custo_total = salario + treino + marketing + parcela_facilities + parcela_staff
receita_gerada = jobs_receita + merch + royalties + endorsements
```

#### Score de Risco de Burnout

```
risco_burnout = (stress / 100 × 0.4)
             + (carga_semanal / carga_max × 0.3)
             + ((100 - resistencia) / 100 × 0.2)
             + (semanas_sem_folga / 8 × 0.1)

Se risco_burnout > 0.7: alerta vermelho
Se risco_burnout > 0.5: alerta amarelo
```

## Edge Cases

- **Agencia sem staff de intelligence**: Reports basicos ainda funcionam
  (dados brutos). Alertas preditivos sao menos precisos (65% vs 85%)
- **Todas metricas boas**: Dashboard mostra "Agencia saudavel" sem
  alertas. Jogador pode relaxar (ate algo mudar)
- **100 alertas simultaneos**: Prioriza por urgencia. Mostra top 5 no
  dashboard, "Ver todos" pra lista completa
- **Comparacao com rival tier muito diferente**: Dados do rival sao
  muito imprecisos. Aviso: "Estimativa de baixa confianca"
- **Idol recém-contratada**: Sem dados historicos. Reports mostram
  "Dados insuficientes (< 4 semanas)" -- sem predicoes
- **Predicao errada**: Alerta de burnout que nao se materializa.
  Normal (15-35% de falso positivo). Jogador aprende a calibrar

## Dependencies

**Hard:**
- Agency Economy -- dados financeiros
- Happiness & Wellness -- dados de wellness
- Week Simulation -- dados semanais
- Job Assignment -- dados de performance

**Soft:**
- Todos sistemas que fornecem dados (Stats, Fame, Fans, etc.)
- Agency Staff -- melhora precisao
- **Producer Profile** (#50): Traço (Carismático) reduz detecção de problemas em -10%. Ver `producer-profile.md` seção 4d.

**Depended on by:**
- Agency Dashboard UI (mostra resumo)
- Agency Strategy (sugere ajustes)
- Agency Planning Board (informa planejamento)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_PREDICTION_ACCURACY` | 0.65 | 0.5-0.8 | Precisao base sem staff |
| `STAFF_ACCURACY_BONUS` | 0.20 | 0.10-0.30 | Bonus maximo de precisao com staff |
| `ALERT_BURNOUT_THRESHOLD` | 0.5/0.7 | ajustavel | Limiares de alerta amarelo/vermelho |
| `REVENUE_CONCENTRATION_ALERT` | 0.40 | 0.3-0.6 | % de receita numa idol pra alertar |
| `UNDERUTILIZED_WEEKS` | 4 | 2-8 | Semanas sem job pra considerar subutilizada |
| `REPORT_HISTORY_MONTHS` | 6 | 3-12 | Meses de historico mantidos em comparacoes |

## Acceptance Criteria

1. 7 categorias de relatorios acessiveis por abas
2. Post-mortem de job mostra 2-4 fatores positivos e negativos
3. Ferramentas comparativas permitem idol vs idol, grupo vs grupo
4. Alertas proativos aparecem no dashboard com 3 niveis de urgencia
5. Predicoes tem precisao base de 65%, melhorada com staff
6. Dashboard command center mostra resumo com metricas rapidas
7. ROI por idol calculado com todos custos e receitas
8. Alertas podem ser dispensados pelo jogador
9. Dados de rivais sao estimados (nao exatos)
10. Reports sugerem acoes quando staff relevante esta contratado

## Open Questions

- Nenhuma pendente
