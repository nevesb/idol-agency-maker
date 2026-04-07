# Análise: Sistema de Atributos — FM26 como Referência vs Star Idol Agency

> **Status**: Documento de análise (não implementar ainda)
> **Autor**: Claude (agente)
> **Data**: 2026-04-04
> **Objetivo**: Comparar nosso sistema de atributos com o do FM26, identificar
> gaps, propor ajustes e pensar como isso afeta o gameplay final.
> **Ação**: Discutir com o usuário antes de alterar qualquer GDD.

---

## 1. Diagnóstico: O Que Temos Hoje vs O Que o FM26 Faz

### 1.1 Estrutura Comparativa

| Aspecto | FM26 | Star Idol Agency | Gap |
|---|---|---|---|
| **Atributos visíveis** | ~35 (14 Tech + 14 Mental + 8 Physical) | 12 (4 Perf + 4 Presença + 4 Resiliência) | FM tem 3× mais granularidade |
| **Atributos ocultos** | ~8 (Consistency, Important Matches, Injury Proneness, Professionalism, Ambition, Loyalty, Pressure, Sportsmanship) | 5 (Consistência, Ambição, Lealdade, Temperamento, Vida Pessoal) | Similar em número, diferente em escopo |
| **Escala visíveis** | 1-20 | 1-100 | Nós temos mais granularidade numérica, FM tem range mais compacto |
| **Escala ocultos** | 1-20 | 1-20 | Igual |
| **Meta-valores** | CA/PA (1-200) | TA/PT (1-100) | Estruturalmente idêntico |
| **Roles/Papéis** | ~50 roles com atributos chave/preferível por role | 12 arquétipos dinâmicos | FM tem muito mais papéis |
| **Traits/PPMs** | ~40+ traits que canalizam comportamento | Nenhum sistema de traits | **Gap crítico** |
| **Staff attributes** | ~25 atributos por cargo | Não detalhado no GDD | **Gap grande** |
| **Interações entre atributos** | Cadeias complexas (percepção→decisão→execução→sustentação) | Impacto direto por job type | **Gap conceitual importante** |

### 1.2 Onde Estamos Bem

1. **Meta-valores (TA/PT)**: Nosso sistema CA/PA é estruturalmente sólido e
   já espelha o FM26. Funciona.

2. **Atributos ocultos**: Boa seleção. Consistência, Ambição e Lealdade
   mapeiam diretamente. Temperamento e Vida Pessoal são adaptações inteligentes
   para o domínio idol.

3. **Curva de idade**: Já temos multiplicadores por faixa etária. Bom.

4. **Crescimento multicanal**: Treino + jobs + crescimento natural.
   Estruturalmente análogo ao FM26.

5. **Tiers (F→SSS)**: Mais granulares que FM26 (que usa estrelas 1-5).
   Vantagem nossa.

### 1.3 Onde Temos Gaps Sérios

1. **Granularidade de atributos**: 12 é pouco para o nível de simulação
   que queremos. O FM26 não tem 35 atributos por acaso — cada um existe
   porque governa um tipo específico de evento no match engine. Nossos 12
   tentam cobrir tudo mas são genéricos demais.

2. **Sem sistema de Traits**: O FM26 deixa claro que **atributos dizem o
   que a idol CONSEGUE fazer; traits dizem o que ela TENDE A TENTAR fazer**.
   Não temos nada disso. Uma idol com Vocal 80 e outra com Vocal 80 se
   comportam exatamente igual — não há personalidade mecânica.

3. **Sem cadeias de atributos**: No FM26, uma finalização envolve 5-6
   atributos em cadeia (percepção→decisão→execução). No nosso sistema,
   um show ao vivo basicamente checa Vocal + Dança + Aura isoladamente.
   Isso mata a profundidade.

4. **Staff sem atributos**: O FM26 tem um sistema completo de atributos
   de staff que afeta treino, scouting, relatórios, desenvolvimento. Nosso
   GDD menciona staff mas não detalha seus atributos mecânicos.

5. **Sem conceito de "Professionalism" oculto**: No FM26, Professionalism é
   um dos hidden mais importantes — afeta diretamente o desenvolvimento.
   Nosso "Disciplina" é visível (diferente) e "Vida Pessoal" não cobre
   exatamente o mesmo conceito.

---

## 2. Lições Centrais do FM26 Para o Nosso Jogo

### 2.1 "Atributos são capacidades contextuais, não notas gerais"

O FM26 insiste: um atributo não é uma nota de qualidade. É uma medida de
competência **num tipo específico de ação**. Finishing não é "bom de ataque"
— é "precisão ao concluir em zona de finalização".

**Nosso problema**: "Vocal" no nosso jogo é vago demais. Significa o quê
exatamente? Afinação? Extensão? Potência? Interpretação emocional?
Habilidade de cantar ao vivo vs em estúdio? Cada uma dessas coisas seria
relevante em jobs diferentes.

**Proposta**: Não precisamos ir a 35 atributos, mas precisamos de mais
granularidade nas áreas que o gameplay realmente testa. Sugiro algo na
faixa de **18-24 atributos visíveis** (ver seção 3).

### 2.2 "O jogo combina atributos — nunca usa um isolado"

No FM26, uma chance de gol envolve:
1. Percepção do espaço (Anticipation, Off the Ball)
2. Escolha da ação (Decisions)
3. Preparação técnica (First Touch)
4. Execução sob pressão (Composure, Finishing, Technique)

**Nosso equivalente para um show ao vivo deveria ser:**
1. Leitura do público (equivalente a Anticipation)
2. Decisão de improviso vs coreografia (equivalente a Decisions)
3. Execução técnica (Vocal, Dança)
4. Sustentação sob pressão (equivalente a Composure)
5. Resistência física (Stamina ao longo do show)
6. Modulação por traits (tende a improvisar? tende a seguir o roteiro?)

**Isso é fundamentalmente diferente** de "somar Vocal + Dança + Aura e
dividir por 3". Precisamos de um **modelo de cadeia** como o FM26 usa.

### 2.3 "Traits canalizam o uso dos atributos"

FM26: "atributos dizem o que ele consegue; traits dizem o que ele tenta."

Uma idol com Vocal 80 e trait **"improvisa no palco"** vai se comportar
de forma totalmente diferente de uma idol com Vocal 80 e trait **"segue
o setlist à risca"**. A primeira tem mais upside e mais risco. A segunda
é mais previsível.

**Traits são essenciais** para que as idols tenham personalidade mecânica,
não só cosmética. Sem traits, todas as idols do mesmo nível são
intercambiáveis — e isso mata a fantasia do produtor.

### 2.4 "Staff afeta qualidade operacional E qualidade da informação"

No FM26, o coach não dá apenas "+X% de treino". Ele também:
- Melhora a qualidade dos relatórios
- Afeta a confiabilidade das estrelas de avaliação
- Influencia desenvolvimento de jovens
- Dá advice tático mais ou menos útil

**No nosso jogo**, o staff deveria:
- Afetar velocidade e qualidade do treino (Coach)
- Afetar precisão do scouting (Scout)
- Afetar qualidade das previsões de sucesso em jobs (Manager/Analista)
- Afetar eficácia da resposta a escândalos (PR)
- Afetar qualidade do diagnóstico de wellness (Psicólogo)

### 2.5 "Nem toda influência é igualmente visível"

FM26 não mostra tudo ao jogador. Hidden attributes existem porque descobrir
quem o jogador realmente é **é parte do jogo**. Nós já fazemos isso. Mas
podemos ir mais fundo.

---

---

## 3. Proposta: Reestruturação dos Atributos Visíveis

### 3.1 Princípio: Cada Atributo Deve Governar Um Tipo Específico de Evento

No FM26, Finishing ≠ Long Shots ≠ Heading. Todos são "finalização", mas cada
um governa um evento diferente. Precisamos do mesmo.

"Vocal" é genérico demais. Em que contexto? Uma idol pode ser excelente em
estúdio (controle técnico, gravação limpa) e medíocre ao vivo (falta de
projeção, não segura 2 horas de show). Essas são habilidades diferentes
que o gameplay testa em momentos diferentes.

### 3.2 Proposta: 20 Atributos Visíveis (5 categorias × 4)

De 12 para 20. Mais granular sem ser overwhelming. Cada atributo tem um
evento claro que governa.

**PERFORMANCE (5)** — habilidades técnicas de palco e produção:

| Atributo | O que governa | Evento/Job |
|---|---|---|
| **Vocal** | Qualidade de canto: afinação, extensão, técnica vocal | Gravações, shows ao vivo, dublagem musical |
| **Dança** | Coreografia, ritmo, expressão corporal | Performances coreografadas, MVs, shows |
| **Atuação** | Expressividade dramática, range emocional | Dramas, filmes, dublagem, comerciais narrativos |
| **Variedade** | Humor, improviso, timing de comédia | Talk shows, variety shows, rádio, eventos |
| **Musicalidade** | Composição, leitura musical, harmonia | Composição própria, arranjos, collabs musicais |

**Justificativa do novo "Musicalidade"**: No mundo idol, saber compor é um
diferencial enorme (como o "First Touch" do FM26 — um preparador invisível
mas impactante). Idols que compõem geram receita de royalties e têm
trajetória mais sustentável. O GDD de music-charts.md já prevê composição
como mecânica.

**PRESENÇA (5)** — impacto pessoal e público:

| Atributo | O que governa | Evento/Job |
|---|---|---|
| **Visual** | Aparência, fotogenia, estilo | Sessões de fotos, endorsements, MVs |
| **Carisma** | Magnetismo pessoal, capacidade de cativar | Modificador universal (como Technique no FM26) |
| **Comunicação** | Articulação, entrevistas, MC | Rádio, podcasts, press conferences, fan meetings |
| **Aura** | Presença de palco, "it factor" | Shows ao vivo, festivais, grandes eventos |
| **Redes Sociais** | Habilidade em plataformas digitais, engajamento | Streaming, conteúdo online, campanhas digitais |

**Justificativa do novo "Redes Sociais"**: O mundo idol atual é inseparável
das redes. Uma idol pode ser medíocre ao vivo mas viral online (como o
"Long Shots" do FM26 — não é central, mas em certos papéis é decisivo).
O GDD já tem mecânicas de fã club e campanhas online. Precisamos de um
atributo que governe isso.

**RESILIÊNCIA (5)** — capacidade de suportar a indústria:

| Atributo | O que governa | Evento/Job |
|---|---|---|
| **Resistência** | Stamina física, agenda pesada | Turnês, shows consecutivos, carga de trabalho |
| **Disciplina** | Pontualidade, profissionalismo, segue regras | Velocidade de treino, confiabilidade |
| **Mentalidade** | Lida com pressão, críticas, escândalos | Recuperação de crises, performance sob pressão |
| **Adaptabilidade** | Aprende rápido, encaixa em contextos novos | Novos tipos de job, mudança de grupo, rebranding |
| **Foco** | Concentração sustentada, consistência no esforço | Gravações longas, ensaios, jobs técnicos |

**Justificativa do novo "Foco"**: Equivalente ao "Concentration" do FM26.
Sem ele, não temos como diferenciar uma idol que mantém qualidade
consistente durante 3h de gravação de uma que começa bem mas desmorona.
Também afeta treino (idol com foco alto aproveita melhor cada sessão).

**INTELIGÊNCIA (5)** — nova categoria, equivalente aos "Mental" do FM26:

| Atributo | O que governa | Evento/Job |
|---|---|---|
| **Leitura de Público** | Entender o que a audiência quer, ler a sala | Shows ao vivo, fan meetings, variety |
| **Decisão** | Escolher a ação certa no momento certo | Improviso vs roteiro, reação a imprevistos |
| **Criatividade** | Soluções originais, expressão artística única | Composição, performances únicas, conteúdo |
| **Trabalho em Equipe** | Cooperação, sinergia com grupo, cede espaço | Performances de grupo, collabs, sinergia |
| **Consciência de Imagem** | Gestão da própria imagem pública | Prevenção de escândalos, PR pessoal, branding |

**Justificativa da categoria inteira**: Esta é a maior lacuna do nosso
sistema. O FM26 tem 14 atributos mentais porque são eles que separam
o bom do excelente. No nosso jogo, uma idol pode ter Vocal 90 e ser
burra no palco — mas hoje não temos como representar isso. "Inteligência"
é a camada que transforma habilidade bruta em performance real.

Mapeamento FM26 → Nosso:
- Anticipation → **Leitura de Público**
- Decisions → **Decisão**
- Flair/Vision → **Criatividade**
- Teamwork → **Trabalho em Equipe**
- Composure → parte de **Mentalidade** (já existia)
- Concentration → **Foco** (movido para Resiliência)
- Off the Ball → **Consciência de Imagem** (adaptado)

### 3.3 Atributos Removidos/Reorganizados

Nenhum atributo atual é removido — todos os 12 originais estão presentes.
Os 8 novos são adições que cobrem os gaps identificados:

| Novo Atributo | Gap que cobre | FM26 equivalente |
|---|---|---|
| Musicalidade | Composição como skill separada | First Touch (preparador) |
| Redes Sociais | Mundo digital como arena de performance | Long Shots (nicho valioso) |
| Foco | Consistência em tarefas longas | Concentration |
| Leitura de Público | Percepção do contexto | Anticipation |
| Decisão | Escolha correta no momento | Decisions |
| Criatividade | Originalidade artística | Flair + Vision |
| Trabalho em Equipe | Sinergia de grupo | Teamwork |
| Consciência de Imagem | Autogestão de imagem | Off the Ball (adaptado) |

### 3.4 Impacto na Escala

Com 20 atributos na escala 1-100, temos 2000 pontos de data por idol.
FM26 tem ~35 na escala 1-20 = 700 pontos. Nossa granularidade é maior,
o que é bom para a simulação mas requer UI cuidadosa (ver modal da idol).

**Sugestão**: Manter 1-100 internamente mas considerar mostrar como
barras + valor numérico (como já fazemos). Para scouts/mercado, mostrar
como estrelas (1-5) com margem de erro (como FM26).

---

## 4. Proposta: Sistema de Traits (Novo)

### 4.1 O Que São Traits

Traits são **tendências comportamentais** que canalizam como os atributos
são usados. Diferente dos atributos ocultos (que são fixos e governam
personalidade), traits são:

- **Adquiridos**: Podem ser ganhos com experiência e treino
- **Perdidos**: Podem ser removidos com treino específico
- **Visíveis**: O jogador vê os traits da idol (após scouting adequado)
- **Canalizadores**: Não mudam o que a idol PODE fazer, mas mudam o que ela TENTA fazer

### 4.2 Catálogo de Traits (Proposta Inicial)

**Traits de Performance:**

| Trait | Efeito | FM26 equivalente |
|---|---|---|
| **Improvisa no Palco** | +15% chance de momento especial, +10% chance de erro | Tries killer balls often |
| **Segue o Setlist à Risca** | -5% chance de erro, -10% chance de momento especial | Plays short simple passes |
| **Potência Vocal** | Prefere músicas que mostram extensão, +impacto em shows grandes | Shoots with power |
| **Voz Suave** | Prefere baladas, +impacto em gravações íntimas | Places shots |
| **Performer Nato** | Tenta moves chamativos na coreografia | Tries tricks |
| **Dançarina Técnica** | Prioriza precisão sobre espetáculo | Plays it safe |
| **Comediante Natural** | Tenta humor em qualquer contexto (pode ser inapropriado) | Tries to dribble past opponents |
| **Compositora** | Tenta compor próprias músicas quando possível | Dictates tempo |
| **Expressão Emocional** | Canaliza emoção real nas performances (+drama, +autenticidade) | Moves into channels |

**Traits de Presença:**

| Trait | Efeito | FM26 equivalente |
|---|---|---|
| **Selfie Queen** | +engajamento em redes sociais, +chance de foto inoportuna | — |
| **Misteriosa** | -exposição pública, +aura, -redes sociais | — |
| **Camera Friendly** | Melhor em sessões de fotos e MVs | — |
| **MC Natural** | Assume papel de MC em eventos de grupo | — |
| **Líder Vocal** | Naturalmente lidera o grupo no palco | Gets forward whenever possible |

**Traits de Mentalidade:**

| Trait | Efeito | FM26 equivalente |
|---|---|---|
| **Perfeccionista** | Treina mais, mais stress, melhor qualidade | — |
| **Despreocupada** | Menos stress, crescimento mais lento | — |
| **Competitiva** | +performance contra rivais, +conflito interno | — |
| **Mentora** | Acelera crescimento de idols juniores no mesmo grupo | — |
| **Clutch** | +performance em eventos grandes (equivalente a Important Matches) | — |
| **Ansiosa no Palco** | -performance em grandes audiências, +performance em intimistas | — |

**Traits de Carreira:**

| Trait | Efeito | FM26 equivalente |
|---|---|---|
| **Solo por Natureza** | Bônus solo, penalidade em grupo | — |
| **Jogadora de Equipe** | Bônus em grupo, penalidade solo | Team player |
| **Versátil** | Menos penalidade ao mudar de tipo de job | Versatile |
| **Especialista** | +performance no tipo de job mais feito, -nos outros | — |
| **Idol Idol** | Abraça o papel de idol completamente (regras, imagem, dedicação) | Professional |
| **Artista Rebelde** | Rejeita convenções, +autenticidade, +risco de escândalo | — |

### 4.3 Regras dos Traits

| Regra | Descrição |
|---|---|
| **Máximo por idol** | 5 traits ativos simultaneamente |
| **Aquisição** | Ganhos por experiência (20+ jobs de um tipo), treino específico, ou eventos |
| **Remoção** | Coach pode tentar remover trait (50% chance, 1 trimestre) |
| **Conflito** | Traits contraditórios não coexistem (ex: Improvisa + Segue Setlist) |
| **Visibilidade** | Visíveis para idols contratadas. Scouts revelam 1-3 traits dependendo do skill |
| **Interação com atributos** | Trait só é eficaz se atributo base é adequado. "Potência Vocal" com Vocal 30 causa erros, não impacto |

### 4.4 Por Que Traits Mudam Tudo

Sem traits, duas idols com stats iguais são intercambiáveis. Com traits:

- **Idol A**: Vocal 80, trait "Improvisa no Palco", trait "Clutch"
  → Estrela de show ao vivo. Explosiva nos grandes momentos, imprevisível.

- **Idol B**: Vocal 80, trait "Segue o Setlist", trait "Perfeccionista"
  → Máquina de estúdio. Gravações impecáveis, shows seguros mas sem surpresa.

O produtor agora tem uma **decisão real**: quem escalar para o festival
de 50.000 pessoas? Quem escalar para a gravação do single? Mesmo com o
mesmo Vocal, a resposta é diferente. **Isso é profundidade**.

---

---

## 5. Proposta: Reestruturação dos Atributos Ocultos

### 5.1 Diagnóstico Atual

Temos 5 ocultos: Consistência, Ambição, Lealdade, Temperamento, Vida Pessoal.

FM26 tem ~8: Consistency, Important Matches, Injury Proneness,
Professionalism, Ambition, Loyalty, Pressure, Sportsmanship/Dirtiness.

### 5.2 Proposta: 8 Atributos Ocultos

| Oculto | Escala | O que governa | FM26 equivalente | Status |
|---|---|---|---|---|
| **Consistência** | 1-20 | Regularidade de performance entre jobs | Consistency | Manter |
| **Ambição** | 1-20 | Desejo de crescer, alcançar topo | Ambition | Manter |
| **Lealdade** | 1-20 | Vínculo com agência/produtor | Loyalty | Manter |
| **Temperamento** | 1-20 | Estabilidade emocional, controle | Sportsmanship (adaptado) | Manter |
| **Profissionalismo** | 1-20 | Dedicação, seriedade, ética de trabalho | Professionalism | **NOVO** |
| **Pressão** | 1-20 | Performance em momentos de alta pressão | Pressure / Important Matches | **NOVO** (fundir 2 FM26 em 1) |
| **Vida Pessoal** | 1-20 | Atividade fora do trabalho, exposição | — (original nosso) | Manter |
| **Predisposição a Lesão** | 1-20 | Tendência a problemas físicos/burnout | Injury Proneness | **NOVO** |

### 5.3 Justificativa dos Novos

**Profissionalismo (NOVO)**:
No FM26, é um dos hidden mais impactantes — afeta diretamente o
desenvolvimento. Um wonderkid com Professionalism baixo desperdiça
potencial. No nosso jogo, uma trainee tier SSS com Profissionalismo 4
vai treinar mal, chegar atrasada, e nunca atingir o potencial. O produtor
percebe isso ao longo de meses e precisa decidir: investir mais tempo
ou cortar perdas?

Hoje "Disciplina" é visível e cobre parcialmente isso, mas Disciplina é
sobre seguir regras. Profissionalismo é sobre **atitude interna**, e
é mais profundo. Sugestão: manter Disciplina visível (skill) e adicionar
Profissionalismo oculto (atitude).

**Pressão (NOVO)**:
Fundir "Important Matches" e "Pressure" do FM26 em um conceito: como a
idol performa em momentos grandes. O festival de 50K pessoas. A final
do concurso. O show de Budokan. Uma idol com Pressão 3 vai tremer. Uma
com Pressão 18 vai brilhar. O jogador descobre isso gradualmente — e é
uma informação valiosa que muda decisões de escalação.

**Predisposição a Lesão/Burnout (NOVO)**:
No nosso mundo não há "lesão" como no futebol, mas há **burnout**. Algumas
idols aguentam carga pesada; outras quebram com agenda moderada. Esse
oculto governa a velocidade com que o stress sobe e a chance de burnout
— sem o jogador saber exatamente o valor. Ele percebe ao longo do tempo:
"Suzuki sempre entra em burnout antes das outras. Preciso pegá-la mais
leve."

### 5.4 Remoção: Nenhuma

Os 5 originais permanecem. 3 novos adicionados = 8 total.

---

## 6. Sistema de Staff: O Que Precisamos

### 6.1 O Que o FM26 Ensina Sobre Staff

O FM26 trata staff como **subsistema mecânico**, não cosmético:
- Coach afeta velocidade e qualidade do treino (por área)
- Scout afeta precisão da avaliação (TA e PT)
- Assistant afeta qualidade do advice
- Physio/Sports Scientist afeta recuperação e prevenção
- HoYD afeta qualidade dos jovens que entram na base

**No nosso jogo, staff é mencionada nos GDDs mas não tem atributos mecânicos.**
Isso é um gap que precisa ser fechado.

### 6.2 Proposta: Atributos de Staff (Escala Textual como FM26)

Inspirado no FM26: apresentar atributos de staff como **palavras** (Elite,
Muito Bom, Bom, Mediano, Fraco) em vez de números. Internamente usar 1-20.

**Atributos de Staff por Área:**

| Atributo | Descrição | Quem usa |
|---|---|---|
| **Vocal Coaching** | Treinar canto | Coach |
| **Dance Coaching** | Treinar dança/coreografia | Coach |
| **Acting Coaching** | Treinar atuação | Coach |
| **Variety Coaching** | Treinar variety/improviso | Coach |
| **Image Coaching** | Treinar presença/visual/comunicação | Coach |
| **Physical Training** | Treinar resistência/físico | Coach |
| **Mental Training** | Treinar mentalidade/foco | Coach |
| **Trabalho com Jovens** | Eficácia com trainees | Coach, HoYD |
| **Avaliação de Talento** | Precisão ao julgar TA | Scout, Coach |
| **Avaliação de Potencial** | Precisão ao julgar PT | Scout, HoYD |
| **Gestão de Pessoas** | Lidar com conflitos, moral, relações | Manager, Coach, PR |
| **Motivação** | Inspirar e energizar idols | Coach, Manager |
| **Disciplina** | Impor padrões e rotina | Coach, Manager |
| **Tático** | Entender estratégia de mercado/agenda/grupos | Manager, Analista |
| **Análise de Dados** | Interpretar estatísticas e métricas | Analista |
| **Relações Públicas** | Gestão de imagem e mídia | PR |
| **Tratamento** | Recuperação de burnout/stress | Psicólogo |
| **Prevenção** | Monitoramento de wellness/riscos | Psicólogo, Sports Scientist |
| **Adaptabilidade** | Funcionar bem fora do contexto habitual | Todos |
| **Determinação** | Robustez profissional | Todos |

### 6.3 Mapeamento Staff → FM26

| Nosso Cargo | FM26 Equivalente | Atributos Chave |
|---|---|---|
| **Coach (Vocal)** | Coach (Attacking) | Vocal Coaching + Motivação + Disciplina |
| **Coach (Dança)** | Coach (Technical) | Dance Coaching + Motivação + Trabalho com Jovens |
| **Coach (Geral)** | Coach (generalista) | Melhor atributo da área + Motivação |
| **Scout** | Scout | Avaliação Talento + Avaliação Potencial + Adaptabilidade |
| **Manager** | Assistant Manager | Tático + Gestão de Pessoas + Motivação + Disciplina |
| **PR Manager** | — | Relações Públicas + Gestão de Pessoas + Tático |
| **Psicólogo** | Physio/Sports Scientist | Tratamento + Prevenção + Gestão de Pessoas |
| **Analista** | Performance Analyst | Análise de Dados + Tático |
| **HoYD** | Head of Youth Dev | Trabalho com Jovens + Avaliação Potencial + Gestão de Pessoas |

### 6.4 Impacto Mecânico do Staff

| Cargo | O que afeta mecanicamente |
|---|---|
| **Coach** | Velocidade de crescimento de atributos na área treinada |
| **Scout** | Precisão dos valores mostrados ao jogador (margem de erro TA/PT/atributos) |
| **Manager** | Qualidade do advice, eficácia das delegações, moral do roster |
| **PR** | Eficácia da mitigação de escândalos, prevenção, gestão de imagem |
| **Psicólogo** | Velocidade de recuperação de burnout, precisão dos alertas de wellness |
| **Analista** | Qualidade dos relatórios de intelligence, previsão de sucesso em jobs |
| **HoYD** | Qualidade das trainees que aparecem, desenvolvimento acelerado de jovens |

---

## 7. Cadeias de Cálculo: Como Atributos Devem Interagir

### 7.1 O Modelo FM26 (Percepção → Decisão → Execução → Sustentação)

O FM26 calcula eventos em **fases**:

```
Fase 1: PERCEPÇÃO — o jogador lê o contexto
Fase 2: DECISÃO — escolhe a ação
Fase 3: EXECUÇÃO — realiza a ação
Fase 4: SUSTENTAÇÃO — mantém a qualidade ao longo do tempo
Fase 5: MODULAÇÃO — hidden attributes e traits ajustam o resultado
```

### 7.2 Nosso Equivalente: Cadeia de Show ao Vivo

Em vez de calcular `nota = (Vocal + Dança + Aura) / 3`, devemos fazer:

```
Fase 1: LEITURA DO PÚBLICO
  Atributos: Leitura de Público + Comunicação
  → Determina se a idol percebe o que a audiência quer

Fase 2: DECISÃO DE PERFORMANCE
  Atributos: Decisão + Criatividade
  Traits: "Improvisa no Palco" vs "Segue o Setlist"
  → Determina se a idol tenta algo ousado ou seguro

Fase 3: EXECUÇÃO
  Atributos: Vocal + Dança + Aura + Atuação (conforme o que foi decidido)
  → Qualidade técnica do que foi tentado

Fase 4: SUSTENTAÇÃO
  Atributos: Resistência + Foco
  → Mantém qualidade do 1º ao último minuto

Fase 5: MODULAÇÃO
  Ocultos: Consistência (variância), Pressão (tamanho da audiência),
           Profissionalismo (preparação prévia)
  Traits: "Clutch" (bônus em eventos grandes), "Ansiosa" (penalidade)
  Wellness: Stress atual, Motivação atual
```

**Resultado**: Nota do show = produto das 5 fases, não média simples.
Isso significa que uma idol pode ter Vocal 90 mas tirar nota C porque
a Leitura de Público é 30 e ela cantou as músicas erradas para aquele
público. **Isso é profundidade real.**

### 7.3 Cadeias por Tipo de Job

| Job | Fase 1 (Percepção) | Fase 2 (Decisão) | Fase 3 (Execução) | Fase 4 (Sustentação) |
|---|---|---|---|---|
| **Show ao vivo** | Leitura Público, Aura | Decisão, Criatividade | Vocal, Dança | Resistência, Foco |
| **Gravação estúdio** | — (ambiente controlado) | Decisão | Vocal, Musicalidade | Foco, Disciplina |
| **TV Variety** | Leitura Público, Comunicação | Decisão, Criatividade | Variedade, Comunicação | Foco |
| **Sessão de fotos** | — | Decisão | Visual, Aura | Foco, Disciplina |
| **Drama/Filme** | — | Decisão | Atuação, Comunicação | Foco, Mentalidade |
| **Fan Meeting** | Leitura Público, Comunicação | Decisão | Carisma, Comunicação | Resistência |
| **Streaming** | Leitura Público | Decisão, Criatividade | Redes Sociais, Comunicação | Foco |
| **Endorsement** | — | Consciência Imagem | Visual, Carisma | Disciplina |
| **Festival (grande)** | Leitura Público, Aura | Decisão | Vocal, Dança, Aura | Resistência, Mentalidade |
| **Performance Grupo** | Trabalho Equipe | Decisão | Skills técnicas | Foco + Trabalho Equipe |

### 7.4 Vantagem Deste Modelo

1. **Não existe "dump stat"**: Mesmo uma idol com Vocal 95 precisa de
   Leitura de Público decente para render ao vivo. Cada contexto exige
   combinações diferentes.

2. **Traits criam identidade**: A mesma idol no mesmo job rende diferente
   dependendo dos traits. Decisão real para o produtor.

3. **Hidden attributes criam surpresa**: Consistência, Pressão e
   Profissionalismo modulam tudo sem o jogador ver exatamente como.
   Descoberta emergente.

4. **Staff afeta a cadeia**: Coach bom → atributos crescem mais rápido.
   Analista bom → previsão de nota mais precisa. Scout bom → traits
   revelados antes de contratar.

---

## 8. O Que NÃO Mudar

### 8.1 Coisas Que Funcionam e Devem Permanecer

| Sistema | Motivo |
|---|---|
| **TA/PT (1-100)** | Sólido, bem calibrado, funciona como CA/PA |
| **Tiers F→SSS** | Mais expressivo que estrelas 1-5. Identidade do jogo |
| **Curva de idade** | Multiplicadores por faixa já estão bons |
| **Background narrativo** | Excelente ideia que o FM26 não tem |
| **Ocultos nunca revelados numericamente** | Core do design, preservar |
| **Rótulo de personalidade** | "Estrela Disciplinada", "Bomba-Relógio" — excelente |
| **Crescimento por treino + jobs + natural** | 3 canais como FM26 |
| **12 Arquétipos dinâmicos** | Boa quantidade, boa cobertura |

### 8.2 Riscos de Mudança

| Risco | Mitigação |
|---|---|
| 20 atributos pode ser overwhelming para o jogador | Mostrar em 4 categorias claras na UI. Stars para simplificar no scouting |
| Traits adicionam complexidade | Começar com ~25 traits. Mostrar max 5 por idol. Crescimento orgânico |
| Cadeias de cálculo são complexas de implementar | Implementar em fases. MVP: cadeia simples (3 fases). Expandir depois |
| Staff com atributos requer mais conteúdo | Usar escala textual (FM26) para reduzir overhead visual |

---

## 9. Resumo Executivo

### O que mudaria (8 ações):

1. **Expandir de 12 para 20 atributos visíveis** (adicionar 8: Musicalidade,
   Redes Sociais, Foco, Leitura de Público, Decisão, Criatividade,
   Trabalho em Equipe, Consciência de Imagem)

2. **Reorganizar em 4 categorias** (Performance, Presença, Resiliência,
   Inteligência) em vez de 3

3. **Expandir de 5 para 8 atributos ocultos** (adicionar Profissionalismo,
   Pressão, Predisposição a Burnout)

4. **Criar sistema de Traits** (~25 traits em 4 categorias: Performance,
   Presença, Mentalidade, Carreira)

5. **Implementar cadeias de cálculo** (Percepção → Decisão → Execução →
   Sustentação → Modulação) em vez de médias simples

6. **Criar atributos de Staff** (~20 atributos em escala textual)

7. **Definir impacto mecânico do Staff** por cargo

8. **Atualizar Arquétipos** para considerar os novos atributos nos
   thresholds de classificação

### O que NÃO mudaria:
- TA/PT, Tiers, Curva de Idade, Background, Rótulos de Personalidade,
  Ocultos nunca revelados, Arquétipos dinâmicos (ajustar thresholds apenas)

### Nível de confiança (usando escala FM26):
- **Nível A**: Precisamos de traits e cadeias de cálculo (seguro, fundamental)
- **Nível B**: 20 atributos é o número certo (forte, pode ser 18-22)
- **Nível C**: Catálogo de traits pode mudar bastante com playtesting

---

## 10. Próximos Passos (Após Discussão)

Se aprovado:
1. Atualizar `idol-attribute-stats.md` com 20 atributos + 8 ocultos
2. Criar `idol-traits.md` com catálogo de traits
3. Criar `staff-attributes.md` com sistema de staff
4. Atualizar `idol-archetypes-roles.md` com novos thresholds
5. Atualizar `job-assignment.md` com cadeias de cálculo
6. Atualizar wireframe 07 (modal da idol) para 4 categorias × 5 atributos
7. Revisar todos GDDs que referenciam atributos
