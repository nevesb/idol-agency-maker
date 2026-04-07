# Wireframe 02 — New Game Wizard (Producer Creation)

> **Status**: Draft
> **Referência**: FM26 Manager Creation (fotos anexas)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/new-game` (src/routes/new-game/+page.svelte)
> **Steps**: 6 (Dados Pessoais → Background → Estilo → Personalidade → Agência → Confirmação)

---

## Estrutura Geral

Inspirado no FM26 Manager Creation:
- **Breadcrumb de steps** no topo (clicável pra voltar)
- **Conteúdo principal** à esquerda (~65%)
- **Preview do produtor** à direita (~35%) — atualiza em tempo real
- **Rodapé** com [< Voltar] e [Próximo >]
- Background escuro sólido (sem ilustração — foco total no formulário)

### Breadcrumb de Steps

```
Criação do Produtor
Dados Pessoais > Background > Estilo > Personalidade > Agência > Confirmação
      ●              ○           ○           ○             ○           ○
```

Step ativo = cor accent + bold. Steps anteriores = clicáveis. Steps futuros = cinza.

### Painel de Preview (Direita, ~35%)

Sempre visível. Atualiza conforme jogador preenche:

```
┌──────────────────────────┐
│                          │
│      [SILHUETA]          │
│      placeholder avatar  │
│      (sem rosto ainda)   │
│                          │
├──────────────────────────┤
│ Reputação ⓘ             │
│ Pendente                 │
│ ──────────────────────── │
│                          │
│ O Produtor               │
│ Nome: —                  │
│ Pronome: —               │
│ Aniversário: —           │
│ Origem: —                │
│                          │
│ Background: —            │
│ Estilo: —                │
│ Traços: —                │
│                          │
└──────────────────────────┘
```

Campos preenchidos aparecem. Campos vazios mostram "—".
Ao avançar steps, preview enriquece progressivamente.

---

## Step 1 — Dados Pessoais

**Pergunta central**: *"Quem é você?"*

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ● Dados Pessoais > ○ Background > ○ Estilo > ○ Personalidade > ○ Agência    │
├────────────────────────────────────────────┬─────────────────────────────────┤
│                                            │                                 │
│  Dados Pessoais                            │  [PREVIEW DO PRODUTOR]          │
│  ─────────────                             │                                 │
│  Conte-nos sobre você.                     │  (atualiza em tempo real)       │
│                                            │                                 │
│  Nome *                                    │                                 │
│  ┌──────────────────────────────────────┐  │                                 │
│  │ Yamada                               │  │                                 │
│  └──────────────────────────────────────┘  │                                 │
│                                            │                                 │
│  Sobrenome *                               │                                 │
│  ┌──────────────────────────────────────┐  │                                 │
│  │ Kenji                                │  │                                 │
│  └──────────────────────────────────────┘  │                                 │
│                                            │                                 │
│  Como quer ser chamado? *                  │                                 │
│  ┌──────────────────────────────────────┐  │                                 │
│  │ Yamada-san                           │  │                                 │
│  └──────────────────────────────────────┘  │                                 │
│  ⓘ Idols, staff e mídia usam este nome.   │                                 │
│                                            │                                 │
│  Sexo                                      │                                 │
│  [Masculino]  [Feminino]  [Outro]          │                                 │
│                                            │                                 │
│  Aniversário                               │                                 │
│  Mês [04 ▼]   Dia [01 ▼]                  │                                 │
│  ⓘ Evento anual in-game (bônus moral).    │                                 │
│                                            │                                 │
├────────────────────────────────────────────┴─────────────────────────────────┤
│  [< Voltar]                                                      [Próximo >] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Regras | Preview |
|---|---|---|---|
| **Nome** | text (3-24 chars) | Obrigatório | Mostra no preview |
| **Sobrenome** | text (3-24 chars) | Obrigatório | Mostra no preview |
| **Pronome de chamamento** | text (3-24 chars) | Obrigatório. Default: "[Sobrenome]-san" | Usado em diálogos, news, contratos |
| **Sexo** | toggle (3 opções) | Default: Outro. Afeta pronomes em textos. Sem efeito mecânico | Mostra no preview |
| **Aniversário** | mês + dia | Default: mês atual. Sem seleção de ano (produtor não envelhece) | Mostra no preview |

### Validação

- Botão "Próximo" desabilitado até nome + sobrenome terem 3+ chars cada
- Pronome auto-preenche com "[Sobrenome]-san" ao digitar sobrenome (editável)

### Diferenças do FM26

| FM26 | Star Idol Agency |
|---|---|
| Nome completo em 1 campo | Nome + Sobrenome separados (cultura japonesa) |
| Sem pronome | Pronome de chamamento ("-san", "-sensei", apelido) |
| Aparência visual (avatar 3D) | Sem avatar customizável (silhueta placeholder) |
| Nacionalidade | Não tem (produtor é japonês por default) |

---

## Step 2 — Background na Indústria

**Pergunta central**: *"Que tipo de nome você já tinha na indústria antes de fundar sua agência?"*

**Subtítulo**: "Diga ao mundo do entretenimento de onde te conhecem e que tipo de desafio você está pronto para encarar."

Referência direta: FM26 "Playing Career" (Step 1 of 3 — Setting your Credentials).

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ✓ Dados Pessoais > ● Background > ○ Estilo > ○ Personalidade > ○ Agência    │
├────────────────────────────────────────────┬─────────────────────────────────┤
│                                            │                                 │
│  Definindo suas Credenciais                │  [PREVIEW DO PRODUTOR]          │
│  ──────────────────────────                │                                 │
│  Que tipo de nome você já tinha na         │  Nome: Yamada Kenji             │
│  indústria antes de fundar sua agência?    │  Chamamento: Yamada-san         │
│                                            │  Origem: —                      │
│  Diga ao mundo do entretenimento de onde   │  Background: —                  │
│  te conhecem.                              │                                 │
│                                            │                                 │
│  Cidade de origem                          │                                 │
│  [Tokyo ▼]                                 │                                 │
│  ⓘ Afeta suas conexões iniciais e rede    │                                 │
│    de contatos na região.                  │                                 │
│                                            │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Prodígio da Indústria            │   │                                 │
│  │    Você já era um nome lendário no  │   │                                 │
│  │    entretenimento — conhecido por   │   │                                 │
│  │    lançar talentos e ditar          │   │                                 │
│  │    tendências.                      │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Ícone de Geração                 │   │                                 │
│  │    Seu trabalho marcou uma era.     │   │                                 │
│  │    Mesmo hoje, seu nome ainda       │   │                                 │
│  │    carrega prestígio e expectativa. │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Hitmaker Consagrado              │   │                                 │
│  │    Você acumulou sucessos e é       │   │                                 │
│  │    respeitado por saber identificar │   │                                 │
│  │    e lapidar potencial.             │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Especialista Reconhecido         │   │                                 │
│  │    Nunca dominou a indústria toda,  │   │                                 │
│  │    mas construiu reputação sólida   │   │                                 │
│  │    em uma área-chave.               │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Promessa do Mercado              │   │                                 │
│  │    Seu nome começou a ganhar força, │   │                                 │
│  │    mas a ascensão ainda estava em   │   │                                 │
│  │    andamento.                       │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Veterano de Bastidores           │   │                                 │
│  │    Anos aprendendo a máquina por    │   │                                 │
│  │    dentro — sem glamour, mas com    │   │                                 │
│  │    experiência real.                │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│  ┌─────────────────────────────────────┐   │                                 │
│  │ ○  Começando do Zero                │   │                                 │
│  │    Sem prestígio prévio. Só visão,  │   │                                 │
│  │    esforço e ousadia.               │   │                                 │
│  └─────────────────────────────────────┘   │                                 │
│                                            │                                 │
│                           0/1 seleção(ões) │                                 │
│                                            │                                 │
├────────────────────────────────────────────┴─────────────────────────────────┤
│  [< Voltar]                                                      [Próximo >] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Opções de Background (Radio — selecionar 1)

| Opção | ID | Reputação Inicial | Efeito Mecânico |
|---|---|---|---|
| **Prodígio da Indústria** | `prodigy` | Lendário | Idols de tier alto aceitam reunião. Expectativas do dono altíssimas. Rivais te respeitam/temem. Custo: metas brutais desde o início |
| **Ícone de Geração** | `icon` | Muito Alto | Prestígio abre portas. Idols veteranas te conhecem. Custo: pressão de "não decepcionar" (metas altas) |
| **Hitmaker Consagrado** | `hitmaker` | Alto | Bom equilíbrio — portas abertas, metas razoáveis. Scouting +5% precisão |
| **Especialista Reconhecido** | `specialist` | Médio-Alto | Bônus em 1 área (revelada no Step 3: Estilo). Metas moderadas |
| **Promessa do Mercado** | `rising` | Médio | Neutro. Sem bônus nem penalidades significativas. Experiência balanceada |
| **Veterano de Bastidores** | `veteran` | Baixo-Médio | Staff loyalty +10% (te respeitam como colega). Idols top ignoram no início. Metas modestas |
| **Começando do Zero** | `zero` | Nenhum | Modo hard. Nenhuma porta aberta. Metas mínimas mas tudo precisa ser conquistado. Recompensa: progressão mais satisfatória |

### Cidade de Origem (Dropdown)

| Cidade | Efeito |
|---|---|
| **Tokyo** | Rede maior, mais conexões. Mercado competitivo |
| **Osaka (Kansai)** | Conexões com cena de humor/variedade. Idols carismáticas |
| **Fukuoka** | Cena menor mas leal. Custo de operação menor |
| **Nagoya** | Equilíbrio entre custo e oportunidade |
| **Sapporo** | Cena digital forte. Scouting online +10% |
| **Okinawa** | Remoto. Custo mínimo, conexões mínimas. Underdog |

### Validação

- Botão "Próximo" desabilitado até selecionar 1 background E 1 cidade
- Counter no rodapé: "0/1 seleção(ões)" → "1/1 ✓"

---

## Step 3 — Estilo de Produção

**Pergunta central**: *"Como você descreveria seu estilo como produtor?"*

**Subtítulo**: "Seu estilo de produção representa sua filosofia de trabalho — como você pensa e sente a indústria. Selecione até 2 estilos. Menos escolhas indicam foco mais forte."

Referência: FM26 "Coaching Style" — grid 3×3 de cards com checkbox.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ✓ Dados > ✓ Background > ● Estilo > ○ Personalidade > ○ Agência             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Como você descreveria seu Estilo como produtor?                             │
│  ──────────────────────────────────────────────                              │
│  Seu estilo representa sua filosofia de trabalho. Selecione até 2.           │
│  Menos escolhas = foco mais forte em uma área.                               │
│                                                                              │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ ☑ Vocal Maestro      │ │ ☐ Image Architect    │ │ ☐ Hit Factory        │ │
│  │ 🎤                   │ │ 🎨                   │ │ 📈                   │ │
│  │ Foco em talento      │ │ Foco em visual,      │ │ Foco em resultados   │ │
│  │ vocal e musical.     │ │ branding e conceito. │ │ comerciais e charts. │ │
│  │ Qualidade acima      │ │ A idol é uma obra    │ │ Números falam mais   │ │
│  │ de quantidade.       │ │ de arte completa.    │ │ alto.                │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                              │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ ☐ Talent Developer   │ │ ☑ Variety King       │ │ ☐ Group Strategist   │ │
│  │ 🌱                   │ │ 🎭                   │ │ 👥                   │ │
│  │ Investe em potencial │ │ Entretenimento é     │ │ Grupos são o core.   │ │
│  │ a longo prazo.       │ │ tudo. TV, humor,     │ │ Sinergia e formação  │ │
│  │ Trainee vira estrela │ │ variedade. A idol    │ │ são sua especialid.  │ │
│  │ na sua mão.          │ │ diverte, não só      │ │                      │ │
│  │                      │ │ canta.               │ │                      │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                              │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ ☐ Digital Pioneer    │ │ ☐ Event Producer     │ │ ☐ All-Rounder        │ │
│  │ 💻                   │ │ 🎪                   │ │ ⚖️                   │ │
│  │ Streaming, redes     │ │ Shows e eventos são  │ │ Sem especialização.  │ │
│  │ sociais, conteúdo    │ │ o palco onde tudo    │ │ Flexível, adaptável. │ │
│  │ online. O futuro é   │ │ acontece. Ao vivo    │ │ Faz de tudo um       │ │
│  │ digital.             │ │ é onde brilham.      │ │ pouco, bem.          │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                              │
│  [↺ Reset]                                                                   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [< Voltar]                                                      [Próximo >] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Opções de Estilo (Checkbox — selecionar 1 ou 2)

| Estilo | ID | Efeito Mecânico |
|---|---|---|
| **Vocal Maestro** | `vocal` | Jobs de gravação/música: +10% nota. Scouting prioriza stat vocal |
| **Image Architect** | `image` | Endorsements/foto: +10% receita. Fama por visual +15% |
| **Hit Factory** | `hits` | Revenue de singles/álbuns: +15%. Stress das idols: +5% |
| **Talent Developer** | `developer` | Taxa de crescimento de stats: +10%. Idols novatas confiam mais |
| **Variety King** | `variety` | Jobs TV/variedade: +10% nota. Carisma cresce +10% mais rápido |
| **Group Strategist** | `groups` | Sinergia de grupo: +15%. Formação de grupo revela combos |
| **Digital Pioneer** | `digital` | Scouting online: +15%. Revenue streaming: +10% |
| **Event Producer** | `events` | Shows ao vivo: +10% nota e receita. Custo de evento: -10% |
| **All-Rounder** | `allrounder` | Sem bônus específico. Nenhuma penalidade. Neutro |

### Regras

- Selecionar 1 = bônus mais forte (×1.5 do efeito)
- Selecionar 2 = bônus normal de cada
- "All-Rounder" é exclusivo: se selecionado, desmarca os outros
- Mínimo 1, máximo 2
- Se "Especialista Reconhecido" foi escolhido no Step 2: o estilo
  escolhido aqui é a "área-chave" do especialista (bônus extra +5%)
- Botão "Reset" limpa seleção

---

## Step 4 — Personalidade (Management Traits)

**Pergunta central**: *"Como você descreveria sua personalidade?"*

**Subtítulo**: "Seus traços de personalidade definem como você interage com as pessoas e que tipo de líder você será. Selecione exatamente 2 traços."

Referência: FM26 "Personality" — grid 3×2 de cards com checkbox, max 2.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ✓ Dados > ✓ Background > ✓ Estilo > ● Personalidade > ○ Agência             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Como você descreveria sua Personalidade?                                    │
│  ────────────────────────────────────────                                    │
│  Seus traços definem como idols, staff e rivais reagem a você.               │
│  Selecione exatamente 2 traços.                                              │
│                                                                              │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐            │
│  │ ☑ Agressivo (攻撃的)        │ │ ☐ Cauteloso (慎重)           │            │
│  │ ⚔️                         │ │ 🛡️                         │            │
│  │ Foco em resultados rápidos, │ │ Planejamento metódico,      │            │
│  │ pressão constante. Idols    │ │ evita riscos. Idols         │            │
│  │ ambiciosas te adoram.       │ │ sensíveis confiam em você.  │            │
│  │ Sensíveis fogem.            │ │ Crescimento mais lento.     │            │
│  └─────────────────────────────┘ └─────────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐            │
│  │ ☐ Visionário (先見)         │ │ ☑ Pragmático (実利的)        │            │
│  │ 🔮                         │ │ 📊                          │            │
│  │ Aposta em potencial de     │ │ Decisões baseadas em        │            │
│  │ longo prazo. Aceita        │ │ números. Eficiência máxima. │            │
│  │ prejuízo agora por         │ │ Idols sentem frieza, mas    │            │
│  │ retorno futuro.            │ │ os números funcionam.       │            │
│  └─────────────────────────────┘ └─────────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────────┐                                            │
│  │ ☐ Carismático (魅力的)      │                                            │
│  │ ✨                          │                                            │
│  │ Relacionamentos pessoais,   │                                            │
│  │ clima positivo. Todos te    │                                            │
│  │ amam. Mas confia demais     │                                            │
│  │ e perde sinais de problema. │                                            │
│  └─────────────────────────────┘                                            │
│                                                                              │
│  [↺ Reset]                                            2/2 seleções ✓        │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [< Voltar]                                                      [Próximo >] │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Opções de Traço (Checkbox — selecionar exatamente 2)

Mantém os 5 traços do GDD `producer-profile.md`:

| Traço | ID | Efeito (resumo na UI) |
|---|---|---|
| **Agressivo** (攻撃的) | `aggressive` | Idols ambiciosas +15%. Sensíveis -10%. Jobs competitivos +10% receita. Stress +5%/sem |
| **Cauteloso** (慎重) | `cautious` | Idols sensíveis +15%. Burnout -20%. Fama -10% velocidade |
| **Visionário** (先見) | `visionary` | Idols F-D: +20% crescimento. Scouting +10%. Custos +10% |
| **Pragmático** (実利的) | `pragmatic` | Salário pedido -10%. Merch +10%. Afinidade +20% mais lenta |
| **Carismático** (魅力的) | `charismatic` | Happiness base +5. Staff loyalty +15%. Intelligence -10% |

### Regras

- Exatamente 2 (não 1, não 3)
- Ao selecionar 2, os outros 3 ficam disabled (opacity 50%)
- Combinações conflitantes permitidas (Agressivo + Cauteloso) — se cancelam parcialmente
- Efeitos mecânicos NÃO aparecem na UI dos cards (só descrição narrativa)
- Tooltip ao hover mostra efeitos detalhados
- Botão "Reset" limpa seleção
- "2/2 seleções ✓" no rodapé quando completo

---

## Step 5 — Seleção de Agência

**Pergunta central**: *"Qual agência você vai liderar?"*

Referência: FM26 "Team Selection" — lista de ligas à esquerda, grid de times à direita.

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ✓ Dados > ✓ Background > ✓ Estilo > ✓ Personalidade > ● Agência             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ INFO BAR ────────────────────────────────────────────────────────────┐   │
│  │  Seleção de Agência              Região: Tokyo    5 agências         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ REGIÕES (esq, ~25%) ─────┐  ┌─ AGÊNCIAS (dir, ~75%) ────────────────┐  │
│  │                            │  │                                        │  │
│  │  [Tokyo ▼]                 │  │  ┌────────────┐ ┌────────────┐        │  │
│  │                            │  │  │ [LOGO]     │ │ [LOGO]     │        │  │
│  │  ● Tokyo         🟢       │  │  │ Nova Star  │ │ Hikari     │        │  │
│  │    5 agências              │  │  │ Agency     │ │ Agency     │        │  │
│  │                            │  │  │            │ │            │        │  │
│  │  ○ Osaka (Kansai) 🟢      │  │  │ Garagem    │ │ Small      │        │  │
│  │    3 agências              │  │  │ Tokyo      │ │ Tokyo      │        │  │
│  │                            │  │  └────────────┘ └────────────┘        │  │
│  │  ○ Fukuoka       🟡       │  │                                        │  │
│  │    2 agências              │  │  ┌────────────┐ ┌────────────┐        │  │
│  │                            │  │  │ [LOGO]     │ │ [LOGO]     │        │  │
│  │  ○ Nagoya        🟡       │  │  │ Sakura     │ │ Crescent   │        │  │
│  │    2 agências              │  │  │ Talent     │ │ Moon       │        │  │
│  │                            │  │  │            │ │            │        │  │
│  │  ○ Sapporo       🟡       │  │  │ Small      │ │ Medium     │        │  │
│  │    1 agência               │  │  │ Osaka      │ │ Fukuoka    │        │  │
│  │                            │  │  └────────────┘ └────────────┘        │  │
│  │                            │  │                                        │  │
│  │  ☐ Desempregado            │  │  ┌────────────┐                       │  │
│  │                            │  │  │ [LOGO]     │                       │  │
│  │                            │  │  │ Echo       │                       │  │
│  │                            │  │  │ Studio     │                       │  │
│  │                            │  │  │            │                       │  │
│  │                            │  │  │ Small      │                       │  │
│  │                            │  │  │ Sapporo    │                       │  │
│  │                            │  │  └────────────┘                       │  │
│  │                            │  │                                        │  │
│  │ Reputação:                 │  │                                        │  │
│  │ 🟢 Alta  🟡 Média 🔴 Baixa│  │                                        │  │
│  │                            │  │                                        │  │
│  └────────────────────────────┘  └────────────────────────────────────────┘  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [< Voltar]                                       [Próximo — Confirmação >]  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Card de Agência (ao selecionar)

Ao clicar num card de agência, ele expande ou abre painel de detalhes:

```
┌────────────────────────────────────────────┐
│                                            │
│  [LOGO 64×64]  Nova Star Agency            │
│               ノヴァスター                 │
│                                            │
│  Tier: Garagem       Região: Tokyo         │
│  Foco: Generalista   Roster: 2 idols       │
│  Orçamento: ¥500K                          │
│                                            │
│  "Uma agência recém-fundada em um          │
│  escritório apertado de Shibuya. Tudo      │
│  está por fazer."                          │
│                                            │
│  Roster inicial:                           │
│  [AVT] Idol A (Tier F, Vocal 45, Visual 52)│
│  [AVT] Idol B (Tier F, Dança 58, Carisma40)│
│                                            │
│  Dono: [AVT] NPC Name — Metas modestas    │
│                                            │
│  [Selecionar esta agência]                 │
└────────────────────────────────────────────┘
```

**Visuais obrigatórios nos cards:**
- **Logo da agência** (64×64px) no topo do card, ao lado do nome
- **Avatar das idols** (40×40px, circular, borda de cor do tier) ao lado de cada idol no roster
- **Avatar do dono NPC** (32×32px) ao lado do nome
- Background do card com gradiente sutil usando a cor da agência (como FM26 faz com as cores dos times)

### Regiões como Filtro

- Lista à esquerda filtra cards à direita (como ligas no FM26)
- Selecionar região mostra só agências daquela região
- "Todas" mostra o grid completo
- Indicador de reputação da região (cor)
- "Desempregado": começa sem agência, aguarda proposta (modo avançado, futuro)

### Dados por Agência

| Campo | Exibido | Visual |
|---|---|---|
| Logo da agência | Card (topo) + detalhe | 32×32 no card grid, 64×64 no detalhe |
| Nome (JP + romaji) | No card | Ao lado do logo |
| Tier | Badge no card | Cor: garagem=cinza, small=bronze, medium=prata |
| Região | Subtítulo | — |
| Foco/Especialidade | Subtítulo | — |
| Orçamento inicial | No detalhe | — |
| Tamanho do roster | No detalhe | — |
| Descrição narrativa | No detalhe expandido | — |
| Roster inicial (idols) | No detalhe expandido | Avatar 40×40 circular + borda tier ao lado de cada idol |
| Dono NPC + nível de metas | No detalhe expandido | Avatar 32×32 do NPC |

---

## Step 6 — Confirmação

**Pergunta central**: *"Tudo pronto. Revise e inicie sua campanha."*

### Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Criação do Produtor                                                          │
│ ✓ Dados > ✓ Background > ✓ Estilo > ✓ Personalidade > ✓ Agência > ● Confirm│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tudo pronto. Revise e inicie sua campanha.                                  │
│  ──────────────────────────────────────────                                  │
│                                                                              │
│  ┌─ O PRODUTOR ──────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  Yamada Kenji                                                          │   │
│  │  Chamamento: "Yamada-san"     Sexo: Masculino     Aniv: 15/Abril      │   │
│  │  Origem: Tokyo                                                         │   │
│  │                                                                        │   │
│  │  Background: Hitmaker Consagrado                                       │   │
│  │  Reputação inicial: Alta                                               │   │
│  │                                                                        │   │
│  │  Estilo: Vocal Maestro + Variety King                                  │   │
│  │                                                                        │   │
│  │  Traços: ⚔️ Agressivo (攻撃的)  +  📊 Pragmático (実利的)             │   │
│  │                                                                        │   │
│  │  [Editar ✎]  ← volta pro step relevante                               │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ A AGÊNCIA ───────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  [LOGO 48×48]  Nova Star Agency  ノヴァスター                         │   │
│  │  Tier: Garagem  │  Região: Tokyo  │  Foco: Generalista                │   │
│  │  Orçamento: ¥500K  │  Roster: [AVT][AVT] 2 idols                     │   │
│  │                                                                        │   │
│  │  [Editar ✎]  ← volta pro step 5                                       │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ RESUMO DE EFEITOS ───────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  Seus bônus combinados:                                                │   │
│  │  ▲ Jobs de gravação/música: +10% nota (Vocal Maestro)                 │   │
│  │  ▲ Jobs TV/variedade: +10% nota (Variety King)                        │   │
│  │  ▲ Idols ambiciosas: +15% aceitar contrato (Agressivo)               │   │
│  │  ▲ Salário pedido: -10% (Pragmático)                                 │   │
│  │  ▼ Idols sensíveis: -10% aceitar (Agressivo)                         │   │
│  │  ▼ Afinidade cresce 20% mais lenta (Pragmático)                      │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [< Voltar]                                          [★ Iniciar Campanha ★]  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Elementos

- **Card do Produtor**: resumo de tudo que foi preenchido nos steps 1-4
- **Card da Agência**: resumo do step 5
- **Resumo de Efeitos**: lista consolidada de todos bônus/penalidades combinados
  - Bônus em verde (▲), penalidades em vermelho (▼)
  - Agrupados por fonte (estilo, traço, background)
- **Botão "Editar"**: cada card tem link pra voltar ao step correto
- **Botão "Iniciar Campanha"**: destaque máximo, accent, glow, tamanho maior
  - Click → fade out → transição pro Portal (dashboard)

### Transição para o Jogo

1. Click em "Iniciar Campanha"
2. Botão faz pulse animation
3. Tela faz fade to black (500ms)
4. Portal carrega em background
5. Fade in do Portal com estado inicial da agência
6. Se tutorial ativo: primeira hint aparece

---

## Resumo dos 6 Steps

| Step | Título | Conteúdo | Validação |
|---|---|---|---|
| 1 | Dados Pessoais | Nome, sobrenome, pronome, sexo, aniversário | Nome + sobrenome 3+ chars |
| 2 | Background | Cidade + reputação na indústria (7 opções) | 1 background + 1 cidade |
| 3 | Estilo | Estilo de produção (9 cards, selecionar 1-2) | Min 1 seleção |
| 4 | Personalidade | Traços (5 cards, selecionar exatamente 2) | Exatamente 2 |
| 5 | Agência | Região → agência (cards com detalhe expandido) | 1 agência selecionada |
| 6 | Confirmação | Resumo + efeitos combinados + iniciar | Click "Iniciar" |

---

## Regras Visuais (aplicáveis a todo o wizard)

Segue o princípio #6 do `ui-information-architecture.md`:
**"Se uma entidade tem identidade visual, ela NUNCA aparece como texto puro."**

| Entidade | Onde aparece no wizard | Visual obrigatório |
|---|---|---|
| **Agências** | Step 5 (grid + detalhe) e Step 6 (resumo) | Logo 32-64px ao lado do nome |
| **Idols do roster** | Step 5 (detalhe expandido) e Step 6 (resumo) | Avatar 40px circular com borda de cor do tier |
| **Dono NPC** | Step 5 (detalhe expandido) | Avatar 32px |
| **Traços** | Step 4 (cards) e Step 6 (resumo) | Ícone emoji/ilustrado no card |
| **Estilos** | Step 3 (cards) e Step 6 (resumo) | Ícone emoji/ilustrado no card |

**Card de agência no grid** (Step 5):
- Background com gradiente usando cor primária da agência (como FM26 com cores dos times)
- Logo da agência centralizado no topo do card (32×32)
- Se selecionado: borda accent + glow

## Assets Necessários

| Asset | Formato | Tamanho | Descrição |
|---|---|---|---|
| `logo-agency-*.svg` | SVG | 64×64 | Logo de cada agência jogável (5 no MVP) |
| `logo-agency-*-sm.svg` | SVG | 32×32 | Versão pequena pra grid |
| `avatar-idol-*.webp` | WebP | 80×80 | Avatar de cada idol do roster inicial |
| `avatar-npc-*.webp` | WebP | 64×64 | Avatar de cada dono NPC |
| `icon-trait-*.svg` | SVG | 48×48 | Ícone de cada traço (5 total) |
| `icon-style-*.svg` | SVG | 48×48 | Ícone de cada estilo (9 total) |

---

## Mapping para Implementação

- **Rota**: `/new-game` (src/routes/new-game/+page.svelte)
- **Tipos novos**: `ProducerBackground`, `ProductionStyle` (adicionar em types/simulation.ts)
- **i18n keys**: `newGame.step1` a `newGame.step6`, backgrounds, estilos
- **Stores**: `currentSaveSlot`, `theme`
- **Componentes**: Step indicator, AgencySelect (já existe), trait cards (já existe)
