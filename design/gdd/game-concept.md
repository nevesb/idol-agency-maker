# Game Concept: Idol Agency

*Created: 2026-03-28*
*Status: Draft*

---

## Elevator Pitch

> É um management sim onde você comanda uma agência de idols japoneses --
> contratando talentos, escalando jobs, gerenciando felicidade e fama, e
> navegando o caos da indústria de entretenimento. Como Football Manager,
> mas seu elenco são idols, e "lesão" é burnout emocional.

---

## Core Identity

| Aspect | Detail |
| ---- | ---- |
| **Genre** | Management Simulation / Strategy |
| **Platform** | PC-first (desktop via Tauri), com port futuro para mobile |
| **Target Audience** | Fãs de management sims (FM, Kairosoft), fãs de cultura idol |
| **Player Count** | Single-player |
| **Session Length** | 1-2h (PC, sessão principal), 15-30 min (sessões rápidas) |
| **Monetization** | Todas features built-in. Sem monetização diferenciada, sem ads, sem assinatura. |
| **Estimated Scope** | Large (12+ meses) |
| **Comparable Titles** | Football Manager, Idol Manager, Kairosoft games |

---

## Core Fantasy

Você é o produtor invisível por trás do sucesso de estrelas. Você toma as
decisões -- quem contratar, quem escalar, quem proteger, quem sacrificar.
As idols recebem os aplausos; você recebe os lucros e o peso das consequências.

A fantasia é dupla: o poder de **construir carreiras do zero** e a tensão de
**gerenciar seres humanos com emoções, limites e vontades próprias** num mercado
implacável. Você pode ser o produtor benevolente que cuida de cada idol ou o
capitalista que espreme talentos até o burnout -- o jogo permite ambos, mas o
mundo reage.

---

## Unique Hook

Como Football Manager, AND ALSO cada "jogador" é um ser humano com felicidade,
ego, fã-clubes opinativos, risco de escândalo, e uma data de validade. No FM
você gerencia performance atlética; aqui você gerencia **vidas, reputações e
emoções** numa indústria onde um namoro flagrado pode destruir uma carreira.

O hook mecânico: **seed fixa de idols** (~5.000+) garante que todo jogador
enfrenta o mesmo mercado, permitindo meta-game, tier lists, e estratégias
compartilhadas pela comunidade -- exatamente como FM com jogadores reais.

---

## Player Experience Analysis (MDA Framework)

### Target Aesthetics (What the player FEELS)

| Aesthetic | Priority | How We Deliver It |
| ---- | ---- | ---- |
| **Sensation** (sensory pleasure) | 6 | Visual otome/VTuber, UI limpa, feedback satisfatório |
| **Fantasy** (make-believe, role-playing) | 2 | Ser o produtor por trás de uma agência real |
| **Narrative** (drama, story arc) | 3 | Histórias emergentes -- escândalos, ascensões, quedas |
| **Challenge** (obstacle course, mastery) | 1 | Otimização estratégica, gestão multi-variável |
| **Fellowship** (social connection) | 7 | Comunidade compartilhando estratégias (meta-game) |
| **Discovery** (exploration, secrets) | 5 | Descobrir idols talentosas, combos de grupo eficientes |
| **Expression** (self-expression, creativity) | 4 | Múltiplos estilos de jogo válidos |
| **Submission** (relaxation, comfort zone) | 8 | Modo casual com skip e auto-fill de contratos |

### Key Dynamics (Emergent player behaviors)

- Jogadores vão desenvolver **estratégias de draft** -- "no mês 14 aparece a idol
  X, preciso ter Y de orçamento pra contratar antes da IA"
- Jogadores vão criar **tier lists** de idols por custo-benefício
- Jogadores vão debater **builds de agência** -- boutique vs. fábrica de talentos
- Jogadores vão compartilhar **histórias emergentes** -- "minha idol SSS foi
  flagrada namorando e perdeu tudo" como no FM
- Jogadores vão otimizar **rotação de agenda** pra maximizar receita vs. felicidade

### Core Mechanics (Systems we build)

1. **Contratação e Scouting** -- Múltiplos pipelines de descoberta de talentos
   com custo, risco e qualidade variáveis
2. **Escalação de Jobs** -- Match de requisitos idol/job com resultados simulados
3. **Gestão de Agenda** -- Alocação semanal balanceando receita, saúde e felicidade
4. **Economia da Agência** -- Orçamento, salários, investimentos, metas do dono
5. **Sistema de Fama e Rankings** -- Ranking individual, de grupo e de agência
   com impacto em oportunidades

---

## Player Motivation Profile

### Primary Psychological Needs Served

| Need | How This Game Satisfies It | Strength |
| ---- | ---- | ---- |
| **Autonomy** (freedom, meaningful choice) | Múltiplos estilos de jogo válidos, liberdade total de estratégia | Core |
| **Competence** (mastery, skill growth) | Rankings crescentes, metas cada vez mais ousadas, otimização de sistemas | Core |
| **Relatedness** (connection, belonging) | Vínculo com idols gerenciadas, comunidade de meta-game | Supporting |

### Player Type Appeal (Bartle Taxonomy)

- [x] **Achievers** (goal completion, collection, progression) — Rankings,
  metas da agência, colecionar idols de tier alto, atingir #1
- [x] **Explorers** (discovery, understanding systems, finding secrets) —
  Descobrir combos de grupo eficientes, idols escondidas no banco,
  entender interações entre sistemas
- [ ] **Socializers** (relationships, cooperation, community) — Secundário:
  comunidade externa de meta-game, não social in-game
- [x] **Killers/Competitors** (domination, PvP, leaderboards) — Rankings de
  agência, competir contra IAs rivais, roubar idols da concorrência

### Flow State Design

- **Onboarding curve**: Começa com agência pequena, 2-3 idols, jobs simples.
  Contratos auto-preenchidos. Complexidade revelada gradualmente
- **Difficulty scaling**: Metas do dono escalam com sucesso. Mais idols = mais
  variáveis. Mercado fica mais competitivo conforme agência cresce
- **Feedback clarity**: Rankings numéricos, barras de status visíveis, feed de
  notícias mostrando impacto das decisões
- **Recovery from failure**: Falhar metas = perder bônus, não game over. Idol
  em crise pode ser recuperada. Agência nunca "morre" forçadamente

---

## Core Loop

### Moment-to-Moment (30 seconds)

**Avaliar e decidir.** O jogador olha um job disponível, checa requisitos,
compara com idols disponíveis, escala. A satisfação vem de encaixar a peça
certa no lugar certo e da tensão de não ter a idol perfeita -- arriscar ou
esperar? Aceitar o job medíocre ou guardar a idol pra oportunidade melhor?

A ação base é intrinsecamente satisfatória porque envolve **decisão com
informação imperfeita** -- você vê stats, mas o resultado tem variância.
A idol com stats perfeitos pode falhar; a underdog pode surpreender.

### Short-Term (5-15 minutes = 1 Semana in-game)

Uma semana é o ciclo fundamental:

1. **Início da semana**: Novos jobs aparecem, convites chegam, mercado de
   transferências atualiza, resultados de castings agendados
2. **Escalação**: Alocar idols em jobs da semana (shows, gravações, meets,
   dublagens, aparições em TV, sessões de fotos)
3. **Gestão ativa**: Investir em mídias sociais, agendar castings futuros,
   criar eventos próprios, negociar contratos, enviar olheiros
4. **Simulação**: Rodar a semana (Live/Skip) -- resultados de cada job,
   eventos aleatórios, mudanças de humor, notícias
5. **Resultados**: Dinheiro ganho, fama alterada, felicidade impactada,
   rankings atualizados, feed de notícias preenchido
6. **Consequências**: Idol cansada, contrato vencendo, escândalo, proposta
   de rival, oportunidade urgente

**Modos de simulação:**
- **Live**: Vê os dias passando com resultados aparecendo em tempo real
- **Pause**: Para tudo pra lidar com emergência ou reorganizar
- **Skip**: Pula pra segunda-feira seguinte e lida com o relatório

### Session-Level (1-2h PC = 1 Mês in-game)

Uma sessão PC cobre ~4 semanas (~1 mês in-game):

- Metas mensais do dono da agência como objetivo de curto prazo
- Relatório financeiro mensal: receita, despesas, lucro
- Atualização de rankings: individual, grupo, agência
- Renovações e vencimentos de contratos
- **Ponto de parada natural**: fim do mês com resumo claro
- **Hook pra voltar**: "Mês que vem tem o Anime Expo e você ainda não
  escalou ninguém", "Contrato da sua idol #1 vence em 2 meses"

### Long-Term Progression

**Horizonte temporal de eventos:**
- **Curto prazo** (1-2 semanas): Jobs do dia-a-dia, emergências
- **Médio prazo** (1-2 meses): Shows, gravações, castings agendados
- **Longo prazo** (3-6 meses): Turnês, festivais, grandes eventos sazonais

**Temporadas** (trimestres/semestres):
- Grandes eventos sazonais, premiações anuais, temporada de castings
- Ranking da agência sobe → desbloqueia jobs melhores, acesso a idols de
  tier mais alto, propostas de agências maiores

**Arco das idols:**
- Idols envelhecem, debutam (aposentam), novas gerações surgem
- Grupos se formam e dissolvem
- Ex-idols viram apresentadoras, produtoras, mentoras -- e geram novos
  jobs emergentes (convites pra programas, mentorias)

**Progressão do jogador:**
- Pode trocar de agência (como trocar de time no FM) levando afinidade
  com idols que já gerenciou
- Idols que trabalharam com você antes são mais fáceis de recontratar
  se você cuidou bem delas

**Sem fim definido.** O jogo é sandbox infinito como FM. 20 anos de jogo
≈ 100 horas no ritmo normal. O jogador joga até cansar ou até dominar
todos os rankings.

### Retention Hooks

- **Curiosity**: Quais idols novas aparecem mês que vem? Aquele casting
  vai trazer alguém boa? O que a agência rival está planejando?
- **Investment**: Idol que você treinou do rank F ao rank S. Grupo que
  você montou do zero. Agência que cresceu de garagem a potência
- **Social**: Comunidade compartilhando estratégias, tier lists, draft
  guides, histórias emergentes
- **Mastery**: Rankings a escalar, estratégias a otimizar, meta-game a
  dominar

---

## Game Pillars

### Pilar 1: Simulação com Profundidade Real

Cada sistema do jogo modela a realidade da indústria idol com regras
consistentes e interconectadas. Stats, requisitos de jobs, economia,
contratos -- tudo tem lógica interna. O casual joga na superfície; o
hardcore mergulha nas planilhas.

*Design test*: "Devemos simplificar o sistema de contratos ou manter
cláusulas detalhadas?" → Manter. O contrato vem pré-preenchido pra
ser acessível, mas a profundidade está lá pra quem quiser negociar.

### Pilar 2: Suas Decisões, Suas Consequências

Toda ação do jogador tem repercussões em cadeia. Escalar uma idol
cansada num show pode render dinheiro hoje e custar uma crise amanhã.
Nenhuma decisão é isolada. O jogo mostra barras e indicadores
claramente -- a decisão de ignorar é do jogador.

*Design test*: "Devemos avisar o jogador que a idol vai quebrar?" →
Dar sinais visíveis (barras, ícones), nunca avisos explícitos de texto.
O jogador aprende a ler os sinais como um produtor real.

### Pilar 3: Múltiplos Caminhos ao Topo

Não existe uma estratégia ótima única. Agência boutique com 3 idols
premium, fábrica de talentos com 50 novatas, especialista em grupos,
foco em dublagem -- todos são viáveis e o jogo suporta todos.

*Design test*: "Devemos dar bônus por ter agência grande?" → Não. Dar
vantagens E desvantagens para cada estilo, mantendo diversidade
estratégica.

### Pilar 4: O Drama Nasce das Mecânicas

Narrativa emergente, não scriptada. Escândalos, rivalidades, ascensões
e quedas acontecem porque os sistemas permitem, não porque um script
determinou. Zero eventos de história fixos.

*Design test*: "Devemos criar eventos de história fixos?" → Não. Todo
drama vem dos sistemas. Uma idol sem restrição de namoro + tempo livre
+ paparazzi = escândalo emergente, não programado.

### Anti-Pillars (What This Game Is NOT)

- **NOT a visual novel**: Sem rotas de história pré-escritas, romance
  com idols, ou narrativa linear. O jogador é o PRODUTOR, não o
  protagonista
- **NOT gacha**: Idols não são obtidos por sorteio aleatório pago. O
  banco de dados é fixo, a contratação é estratégica via scouting
- **NOT idle/clicker**: O jogador toma decisões ativas. Sem "deixar
  rodando sozinho". A simulação avança com input do jogador
- **NOT rhythm game**: Embora lide com idols e música, o gameplay é
  gestão estratégica, não apertar botões no ritmo

---

## Key Systems Overview

### 1. Scouting & Recruitment

Cinco pipelines de descoberta de talentos:

| Método | Custo | Pool | Risco | Mecânica |
| ---- | ---- | ---- | ---- | ---- |
| **Olheiro de rua** | Baixo-médio | Raw talent, aleatório | Alto RNG | Envia pra distrito (Harajuku, Shibuya, Akiba, Osaka, etc.) |
| **Open audition** (casting) | Médio | Filtrado por requisitos | Médio | Agenda casting pra semana seguinte, avalia candidatos |
| **Festival/Evento** | Alto | Idols indie já ativas | Baixo | Presença em TIF, @JAM, live houses |
| **Online scouting** | Baixo | Virais, streamers | Médio-alto | Monitora redes sociais e plataformas de streaming |
| **Transfer (roubar de rival)** | Muito alto | Idols já formadas | Baixo | Buyout de contrato, negociação direta |

**Regiões afetam stats:**
- Tokyo: Polimento, bem-rounded
- Kansai (Osaka): Carisma/Humor alto
- Fukuoka: Visual alto
- Akihabara: Otaku appeal
- Regionais/Locodols: Stats baixos mas custo baixo e lealdade alta

Agências ricas podem enviar olheiros para múltiplas cidades simultaneamente.

### 2. Contract System

Contratos são **auto-preenchidos com preferências da idol** para acessibilidade.
O casual aceita e segue. O hardcore negocia cada cláusula.

**Cláusulas negociáveis:**

| Cláusula | Efeito | Trade-off |
| ---- | ---- | ---- |
| Duração (6m / 1a / 2a) | Estabilidade vs. flexibilidade | Longo prende se idol decair |
| Salário fixo | Custo mensal | Alto = feliz, mas pesa no orçamento |
| % de receita | Divisão de ganhos por job | Famosa exige mais %, come margem |
| Exclusividade | Trabalha só pela agência | Sem = pode aceitar jobs por fora |
| Carga máxima | Limite de jobs por período | Menos receita, mais saúde |
| Direito de imagem | Uso em merch/publicidade | Algumas idols recusam certos usos |
| Cláusula de rescisão | Multa por quebra | Alta protege, mas afasta na negociação |
| Restrição de namoro | Proíbe relacionamento público | ON = infeliz mas protegida; OFF = feliz mas vulnerável |
| Descanso obrigatório | Dias de folga mínimos | Mais folga = menos jobs, mais risco de exposição pessoal |

**Dinâmica emergente dos contratos:**
- Restrição de namoro OFF + tempo livre na agenda = risco de escândalo
- Agenda cheia = sem tempo pra namorar, mas risco de burnout
- Idol de rank alto exige melhores termos nas renovações
- Idol famosa e lucrativa cobra mais e aceita menos agenda cheia

### 3. Job Assignment & Simulation

Jobs têm requisitos (stats mínimos, tier, gênero, grupo/solo) e o jogador
escala as idols mais adequadas. Resultados são simulados com variância:

- Idol que atende todos requisitos: alta chance de sucesso, pequena de falha
- Idol parcialmente qualificada: resultado imprevisível
- Idol sub-qualificada: provável falha, possível surpresa

**Tipos de jobs** (pesquisados no mercado real):
- Shows e concertos (solo, grupo, festival)
- Programas de TV (variedades, talk shows, dramas)
- Gravações (singles, álbuns, colaborações)
- Dublagem (anime, games, narração)
- Sessões de fotos e publicidade
- Meet & greet e eventos de fãs
- Eventos de anime/cultura pop
- Parcerias com marcas e endorsements
- Turnês (regionais, nacionais, internacionais)
- Streaming e conteúdo online
- Rádio e podcasts

**Eventos criados pelo jogador:**
- Festivais próprios -- pode convidar grupos externos (que podem recusar
  se o evento for de nível baixo demais pra eles)
- Eventos de promoção para idol ou grupo específico
- Convidar artistas maiores tem custo de cachê proporcional ao tier

### 4. Happiness & Wellness System

Cada idol tem barras visíveis de:
- **Saúde física**: Impactada por carga de trabalho, descanso, idade
- **Felicidade**: Impactada por salário, cláusulas, sucesso, relações
- **Stress**: Acumula com agenda cheia, escândalos, pressão
- **Motivação**: Afetada por sucesso recente, rank, tratamento

Agenda com código de cores: verde (ok), amarelo (pesado), vermelho (overwork).
O jogo MOSTRA tudo. A decisão de ignorar é do jogador.

### 5. Fame & Rankings

**Três rankings paralelos:**
- **Individual**: Tier F → E → D → C → B → A → S → SS → SSS
- **Grupo**: Ranking separado pra grupos formados
- **Agência**: Ranking da agência entre todas as agências do mercado

**Investimentos ativos em popularidade:**
- Mídias sociais (posts, campanhas, virais)
- Aparições estratégicas
- Turnês e eventos
- Parcerias e endorsements

**Curva de popularidade por idade (feminina):**
- 12-15: Subindo (novidade, potencial)
- 16-22: Pico (prime)
- 23-28: Platô/declínio gradual
- 29-35: Declínio acelerado, pressão pra debutar

**Masculina:** Mesma curva esticada ~10 anos.

### 6. News Feed & Media System

Feed de notícias em camadas proporcional ao tier da idol:

| Tier Idol | Veículo | Exemplo |
| ---- | ---- | ---- |
| SSS-S | TV nacional, grandes portais | "Idol X anuncia turnê nacional no NHK" |
| A-B | Revistas, jornais | "Grupo Y fecha contrato com marca de cosméticos" |
| C-D | Jornais locais, sites de nicho | "Nova idol de Osaka ganha destaque em festival" |
| E-F | Blogs, redes sociais, fóruns | "Fãs elogiam novata em live house de Akihabara" |

**Funções do feed:**
- Scouting passivo (notícias de idols viralizando)
- Escândalos e crises (suas idols e de rivais)
- Movimentos de mercado (agências rivais expandindo)
- Resultados de jobs (audiência, vendas, recepção)
- Ex-idols gerando oportunidades (programas, convites)

### 7. Agency Meta-Game

**Metas do dono (escaláveis):**
- Metas mensais proporcionais ao nível da agência
- Falhar = perder bônus/recompensas, não game over
- Cumprir = mais orçamento, melhor sede, acesso a eventos premium
- Metas variadas: financeiras, de ranking, de felicidade média

**Troca de agência:**
- O jogador pode aceitar propostas de agências maiores (como trocar
  de time no FM)
- Leva consigo afinidade com idols que já gerenciou
- Agência nova = novo orçamento, novas metas, novos desafios

### 8. Idol Lifecycle & Ecosystem

**Ecossistema vivo calibrado com dados reais:**

| Parâmetro | Valor |
| ---- | ---- |
| Idols ativas no mercado | ~3.000 a qualquer momento |
| Agências rivais (IA) | ~50 (5-8 grandes, 15-20 médias, 25+ pequenas) |
| Novas idols por mês | ~15-25 |
| Idade de entrada | 12-17 anos |
| Debut (aposentadoria) feminina | 25-35 anos |
| Debut (aposentadoria) masculina | 35-40 anos |
| Total no banco (20 anos) | ~5.000+ idols |
| Seed fixa | Sim -- mesmas idols em todo playthrough |

**Ciclo de vida:**
- Aspirante → Contratada → Ativa → Veterana → Debutada (aposentada)
- Pós-debut: não desaparece. Pode virar apresentadora, produtora, mentora
- Ex-idols geram jobs emergentes (convites pra programas, mentorias)
- Idol decide debutar quando popularidade cai abaixo de limiar + infelicidade
- Se contratada e feliz, aguenta mais tempo

**Gerador de personagens:**
- Visual estilo otome/VTuber, gerado proceduralmente
- Baseado em geradores de VTuber básicos
- Cada idol tem: nome, região de origem, idade, gênero, stats, personalidade,
  preferências de contrato, limitações, potencial de crescimento
- Seed fixa garante reprodutibilidade entre playthroughs

**Agências rivais são IAs ativas:**
- Competem pelas mesmas idols
- Fazem propostas de contratação
- Podem roubar suas idols
- Criam eventos e competem em rankings
- São fixas na seed (mesmas agências todo playthrough)

---

## Inspiration and References

| Reference | What We Take From It | What We Do Differently | Why It Matters |
| ---- | ---- | ---- | ---- |
| Football Manager | Simulação profunda, seed fixa, drama emergente, sandbox infinito | Seres humanos com emoções vs. atletas, indústria entertainment vs. esporte | Valida o modelo core: management sim profundo com rejogabilidade infinita |
| Idol Manager | Temática idol, gestão de agência | Muito mais profundidade de simulação, sem visual novel, mercado realista | Prova que o nicho existe mas está mal servido |
| Kairosoft games | Loops de gestão satisfatórios, acessibilidade | Profundidade FM-like vs. casual simplificado | Referência de loop design pra management sim |
| Oshi no Ko | Drama da indústria idol, bastidores, lado sombrio | Interativo vs. consumo passivo, emergente vs. scriptado | Tom e contexto cultural, apelo ao público-alvo |

**Non-game inspirations**: A indústria real de idols japoneses -- sistemas de
ranking (Senbatsu Election), scouting em Harajuku, escândalos de namoro,
cultura de fã-clubs, local idols, carreira pós-debut. Documentários e
reportagens sobre condições de trabalho na indústria.

---

## Target Player Profile

| Attribute | Detail |
| ---- | ---- |
| **Age range** | 18-35 |
| **Gaming experience** | Mid-core a hardcore |
| **Time availability** | 1-2h no PC (sessões longas), 15-30 min (sessões rápidas) |
| **Platform preference** | PC (primário), mobile (futuro) |
| **Current games they play** | Football Manager, Kairosoft games, Project Sekai, management sims |
| **What they're looking for** | Management sim profundo com temática idol, sem gacha, sem visual novel |
| **What would turn them away** | Gacha, idle mechanics, narrativa linear forçada, P2W |

---

## Technical Considerations

| Consideration | Assessment |
| ---- | ---- |
| **Recommended Engine** | SvelteKit + Tauri 2 -- web stack moderno, desktop nativo, ideal pra UI-heavy management sim |
| **Key Technical Challenges** | Gerador procedural de personagens visuais, simulação de ~3.000 idols ativas, IA de agências rivais |
| **Art Style** | Otome/VTuber -- personagens 2D gerados proceduralmente, UI limpa e moderna |
| **Art Pipeline Complexity** | Médio -- sistema modular de partes (cabelo, rosto, corpo, roupas) pra gerar combinações |
| **Audio Needs** | Moderado -- BGM ambiente, SFX de UI, jingles de eventos |
| **Networking** | None (single-player) -- possível leaderboard online futuro |
| **Content Volume** | ~5.000+ fichas de idols, ~50 agências, centenas de tipos de jobs, 20 anos de jogo |
| **Procedural Systems** | Gerador de visuais de idols, gerador de eventos/escândalos, simulação de mercado |

---

## Risks and Open Questions

### Design Risks
- Core loop de "avaliar job → escalar idol → ver resultado" pode ficar
  repetitivo após muitas horas sem variação suficiente nos tipos de decisão
- Balancear casual (skip tudo) vs. hardcore (micro-gerenciar) sem que
  nenhum dos dois se sinta punido ou entediado

### Technical Risks
- Gerador procedural de personagens visuais com qualidade suficiente pra
  o jogador se apegar (estilo otome/VTuber) é tecnicamente desafiador
- Simular ~3.000 idols ativas + 50 agências IA em background no PC
  sem impactar performance (Web Workers)
- Banco de dados de ~5.000+ idols com seed fixa requer sistema de geração
  determinística robusto

### Market Risks
- Nicho "management sim de idols" pode ser pequeno demais pra
  sustentabilidade financeira
- Concorrência com jogos de idols estabelecidos (mesmo sendo gêneros
  diferentes -- gacha, rhythm)
- Público de FM pode não se interessar por temática idol e vice-versa

### Scope Risks
- Volume de conteúdo (5.000+ idols, centenas de jobs, 20 anos) pode
  exceder capacidade de desenvolvimento solo
- Sistema de contratos com múltiplas cláusulas interconectadas é
  complexo de balancear
- IA de agências rivais precisa ser convincente sem ser computacionalmente
  cara

### Open Questions
- **RESOLVIDO**: Modelo de monetização: todas as features built-in para todos os jogadores. Sem tier premium, sem distinção free/premium, sem ads.
- **RESOLVIDO**: Multiplayer: Não. Jogo é single-player, sem modo online
- **RESOLVIDO**: Gerador visual: MVP básico (placeholder art), Alpha com
  sistema modular de partes (cabelo, rosto, corpo, roupas)
- **DEFERIDO**: Balanceamento dos 9 tiers de ranking: Precisa de planilha
  de simulação quando protótipo estiver pronto

---

## MVP Definition

**Core hypothesis**: Jogadores acham o loop de contratar idols → escalar
em jobs → gerenciar consequências engajante por 30+ minutos por sessão.

**Required for MVP**:
1. 50-100 idols no banco com stats e geração visual básica
2. Sistema de jobs com requisitos e resultados simulados
3. Sistema de agenda semanal com barras de saúde/felicidade
4. Contrato básico (duração + salário)
5. Ranking individual simples (subir/descer de tier)
6. 3-5 agências IA rivais competindo por idols

**Explicitly NOT in MVP** (defer to later):
- Grupos de idols (foco em individual primeiro)
- Eventos criados pelo jogador (festivais, turnês)
- Sistema de notícias em camadas
- Todas as cláusulas de contrato (começa só com básicas)
- Gerador visual completo (placeholder art no MVP)
- Pós-debut de idols (ex-idols gerando jobs)
- Troca de agência pelo jogador

### Scope Tiers

| Tier | Content | Features | Timeline |
| ---- | ---- | ---- | ---- |
| **MVP** | 50-100 idols, 10 tipos de job | Core loop, contrato básico, ranking simples | 8-12 semanas |
| **Vertical Slice** | 500 idols, 20+ tipos de job | Grupos, contratos completos, scouting, notícias | 16-20 semanas |
| **Alpha** | 2.000 idols, todas features | IA de agências completa, eventos do jogador, gerador visual | 30-40 semanas |
| **Full Vision** | 5.000+ idols, 50 agências, 20 anos | Tudo polido, balanceado, PC + port mobile | 50-70 semanas |

---

## Next Steps

- [ ] Get concept approval from creative-director
- [ ] Configure engine with `/setup-engine godot 4.6`
- [ ] Validate this document with `/design-review design/gdd/game-concept.md`
- [ ] Decompose concept into systems with `/map-systems`
- [ ] Create first architecture decision record (`/architecture-decision`)
- [ ] Prototype core loop with `/prototype job-assignment`
- [ ] Validate core loop with playtest (`/playtest-report`)
- [ ] Plan first milestone (`/sprint-plan new`)
