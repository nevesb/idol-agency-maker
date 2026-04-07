# Wireframe 07 — Modal de Idol (Quick View)

> **Status**: Draft
> **Referência**: FM26 modal de jogador (screenshot: click em qualquer jogador abre overlay com resumo)
> **Resolução alvo**: ~900×650px (modal centralizado sobre o jogo)
> **Comportamento**: Modal overlay, NÃO é tela cheia. Aparece sobre qualquer tela.
> **GDDs**: idol-attribute-stats, idol-archetypes-roles, happiness-wellness, contract-system, idol-lifecycle

---

## Conceito

A qualquer momento que uma idol aparece no programa — tabela, card, headline,
mensagem, agenda, ranking — **click no avatar ou nome** abre este modal.
É um **resumo rápido** sem sair da tela atual. Para detalhes completos,
o botão "Ver Perfil Completo →" navega para a tela dedicada.

**Regra universal**: Se o nome ou avatar de uma idol é clicável em qualquer
lugar do jogo, o primeiro click abre este modal. Double-click abre o perfil
completo diretamente.

---

## Layout do Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                    [✕]     │
│  ┌──────────┐                                                              │
│  │          │  Tanaka Yui                                                   │
│  │  [AVT    │  センター (The Face)  ·  19 anos (3/1/2007)                  │
│  │  160×200 │  Osaka (Kansai)  ·  0 escândalos / 12 jobs                  │
│  │  borda S │                                                              │
│  │          │  [LOGO 24] Nova Star Agency     💎 ¥80M - ¥300M             │
│  │          │  Ativa · Contrato até 31/12/2026    ¥4M p/m                  │
│  │          │                                                              │
│  └──────────┘                                                              │
│                                                                             │
│  ┌─ PERFORMANCE (4) ────┐ ┌─ PRESENÇA (4) ──────┐ ┌─ RESILIÊNCIA (4) ──┐ │
│  │                       │ │                      │ │                     │ │
│  │ Vocal          78 ███ │ │ Visual         85 ██ │ │ Resistência  72 ██ │ │
│  │ Dança          65 ██░ │ │ Carisma        91 ██ │ │ Disciplina   68 ██ │ │
│  │ Atuação        55 ██░ │ │ Comunicação    74 ██ │ │ Mentalidade  80 ██ │ │
│  │ Variedade      60 ██░ │ │ Aura           88 ██ │ │ Foco         70 ██ │ │
│  │                       │ │                      │ │                     │ │
│  └───────────────────────┘ └──────────────────────┘ └─────────────────────┘ │
│                                                                             │
│  ┌─ INTELIGÊNCIA (4) ──┐                                                   │
│  │                      │                                                   │
│  │ L. de Palco   71 ██ │                                                   │
│  │ Criatividade  65 ██ │                                                   │
│  │ Aprendizado   74 ██ │                                                   │
│  │ Trab. Equipe  68 ██ │                                                   │
│  │                      │                                                   │
│  └──────────────────────┘                                                   │
│                                                                             │
│  ● Chave   ● Preferível                          ┌─ INFO ────────────────┐ │
│                                                   │ Altura: 162cm         │ │
│  ┌─ RELATÓRIO DO COACH ──┐ ┌─ WELLNESS ─────────┐│ Personalidade:        │ │
│  │                        │ │                     ││ Determinada           │ │
│  │ Talento Atual          │ │ 😊 Feliz            ││                      │ │
│  │ ★★★★☆  Tier S         │ │                     ││ Foco Atual:           │ │
│  │                        │ │ Saúde     85% █████ ││ Vocal +2/sem         │ │
│  │ Potencial:             │ │ Felicidade 78% ████ ││                      │ │
│  │ "Pode ser estrela      │ │ Stress    35% ██░░░ ││ Grupo:               │ │
│  │  de 1º nível."         │ │                     ││                      │ │
│  │                        │ │ Motivação 82% ████░ ││ Stellar Seven        │ │
│  │ "Futuro brilhante.     │ │                     ││ (Center)             │ │
│  │  Pronta para grandes   │ │ A Favor:  3         ││                      │ │
│  │  palcos."              │ │ Contra:   0         ││ 1 característica     │ │
│  └────────────────────────┘ └─────────────────────┘└──────────────────────┘ │
│                                                                             │
│  [Ver Perfil Completo →]   [Escalar em Job]   [Desenvolvimento]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Elementos Detalhados

### Header (Topo)

| Elemento | Posição | Descrição |
|---|---|---|
| **Avatar** | Esquerda, 160×200px | Imagem grande da idol. Borda colorida do tier (S=dourado) |
| **Nome** | Direita do avatar, grande bold | Nome completo |
| **Arquétipo** | Abaixo do nome | Nome diegético + tradução. Ex: "センター (The Face)" |
| **Idade** | Inline | Anos + data nascimento |
| **Cidade de Origem** | Texto inline | Cidade + região. Ex: "Osaka (Kansai)". Todos são japoneses — o que muda é a cidade |
| **Histórico** | Inline | Escândalos + jobs realizados |
| **Agência** | Logo 24×24 + nome | Agência atual |
| **Valor estimado** | 💎 + range | ¥80M - ¥300M (como FM26) |
| **Estado** | Badge | Ativa / Em Treino / Overwork / Burnout / etc. |
| **Contrato** | Texto | Data expiração + salário mensal |
| **[✕]** | Canto superior direito | Fechar modal. Também Esc ou click fora |

### Atributos (4 Categorias × 4 atributos = 16)

Mapeamento direto do FM26 (Técnicos/Mentais/Físicos → Performance/Presença/Resiliência/Inteligência).
Referência: idol-attribute-stats v2 (16 atributos).

**Performance (4 atributos):**

| Atributo | Valor | Barra | Cor |
|---|---|---|---|
| Vocal | 0-100 | Barra proporcional | Verde >70, Amarelo 40-70, Vermelho <40 |
| Dança | 0-100 | Barra proporcional | Idem |
| Atuação | 0-100 | Barra proporcional | Idem |
| Variedade | 0-100 | Barra proporcional | Idem |

**Presença (4 atributos):**

| Atributo | Valor | Barra | Cor |
|---|---|---|---|
| Visual | 0-100 | Barra proporcional | Idem |
| Carisma | 0-100 | Barra proporcional | Idem |
| Comunicação | 0-100 | Barra proporcional | Idem |
| Aura | 0-100 | Barra proporcional | Idem |

**Resiliência (4 atributos):**

| Atributo | Valor | Barra | Cor |
|---|---|---|---|
| Resistência | 0-100 | Barra proporcional | Idem |
| Disciplina | 0-100 | Barra proporcional | Idem |
| Mentalidade | 0-100 | Barra proporcional | Idem |
| Foco | 0-100 | Barra proporcional | Idem |

**Inteligência (4 atributos):**

| Atributo | Valor | Barra | Cor |
|---|---|---|---|
| Leitura de Palco | 0-100 | Barra proporcional | Idem |
| Criatividade | 0-100 | Barra proporcional | Idem |
| Aprendizado | 0-100 | Barra proporcional | Idem |
| Trabalho em Equipe | 0-100 | Barra proporcional | Idem |

**Legenda** (como FM26):
- ● **Chave** (verde): atributo principal do arquétipo (determina o papel)
- ● **Preferível** (azul): atributo secundário do arquétipo

### Card: Relatório do Coach (Inferior Esquerda)

> **FM26 equivalente**: Relatório do Preparador (Capacidade ★ + Potencial qualitativo)

```
┌─ RELATÓRIO DO COACH ─────────────┐
│                                   │
│ Talento Atual                     │
│ ★★★★☆  Tier S                    │
│                                   │
│ Potencial:                        │
│ "Pode ser uma estrela de          │
│  primeiro nível."                 │
│                                   │
│ "Futuro brilhante. Pronta para    │
│  grandes palcos."                 │
│                                   │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **TA em estrelas** | 1-5 estrelas + tier letra. Mapeamento: F-E=★, D-C=★★, B=★★★, A=★★★★, S+=★★★★★ |
| **Potencial (qualitativo)** | Frase do coach que dá pistas sem revelar valor exato. Ex: "Dificilmente vai melhorar" (baixo), "Tem espaço" (médio), "Pode ser estrela" (alto), "Potencial generacional" (SSS). Precisão depende do skill do coach |
| **Frase do coach** | 1-2 linhas geradas baseadas em TA e estágio |

**Se não tem coach contratado**: mostra "Sem relatório (contrate um coach)" em cinza.

### Card: Wellness (Inferior Centro)

> **FM26 equivalente**: Felicidade (emoji + status + A Favor/Contra)

```
┌─ WELLNESS ───────────────────────┐
│                                   │
│ 😊 Feliz                         │
│                                   │
│ Saúde      85% █████████░        │
│ Felicidade 78% ████████░░        │
│ Stress     35% ████░░░░░░        │
│ Motivação  82% ████████░░        │
│                                   │
│ A Favor: 3    Contra: 0          │
│                                   │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Emoji + Label** | 😊 Feliz / 😐 Normal / 😟 Insatisfeita / 😡 Em Crise. Baseado na felicidade |
| **4 barras** | Saúde, Felicidade, Stress, Motivação. Cor: verde >60, amarelo 40-60, vermelho <40. Stress invertido (alto = ruim = vermelho) |
| **A Favor / Contra** | Contagem de fatores positivos vs negativos que afetam a felicidade. Hover mostra lista |

### Card: Info (Inferior Direita)

> **FM26 equivalente**: Info (altura, reputação, personalidade, pé preferido, característica)

```
┌─ INFO ───────────────────────────┐
│                                   │
│ Altura: 162cm                     │
│                                   │
│ Personalidade:                    │
│ Determinada                       │
│                                   │
│ Foco Atual:                       │
│ Vocal +2/sem                      │
│                                   │
│ Grupo:                            │
│ Stellar Seven (Center)            │
│                                   │
│ 1 característica                  │
│                                   │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Altura** | Valor em cm |
| **Personalidade** | Label qualitativa baseada nos atributos hidden |
| **Foco Atual** | Stat sendo treinada + crescimento semanal |
| **Grupo** | Nome + papel no grupo. Se sem grupo: "Solo" |
| **Característica** | Traço especial (se houver). Hover mostra detalhes |

---

## Botões de Ação (Rodapé do Modal)

```
[Ver Perfil Completo →]   [Escalar em Job]   [Desenvolvimento]
```

| Botão | Ação |
|---|---|
| **Ver Perfil Completo →** | Fecha modal + navega para tela de perfil da idol |
| **Escalar em Job** | Abre Job Board filtrado para essa idol |
| **Desenvolvimento** | Abre plano de desenvolvimento da idol |

Botões adicionais via "..." menu:
- Ver Contrato
- Comparar com outra idol
- Dar Folga
- Seguir (se idol de outra agência, no mercado)

---

## Variações do Modal

### Idol do Seu Roster (Normal)
- Todos dados visíveis (16 atributos em 4 categorias com valores)
- Wellness completo
- Relatório do coach
- Botões de ação completos

### Idol Rival (Scoutada)
- Atributos visíveis mas com **margem de erro** (valores ±5-15 dependendo do scout)
- Valores em itálico para indicar estimativa
- Sem wellness (informação interna da rival)
- Botão "Seguir" em vez de "Escalar"
- Valor estimado visível

### Idol Rival (Não Scoutada)
- **Avatar blur/silhueta** com "?"
- Atributos: "???" ou range muito amplo (ex: "40-80")
- Apenas dados públicos: nome, idade, nação, arquétipo (se famosa), fama/ranking
- Botão "Enviar Scout" em vez de ações

### Idol no Mercado (Livre)
- Como scoutada/não scoutada + indicação "Livre"
- Botão "Fazer Proposta" + "Seguir"

---

## Comportamento

| Ação | Resultado |
|---|---|
| **Click em avatar/nome** (qualquer tela) | Abre modal sobre a tela atual |
| **Double-click em avatar/nome** | Skip modal → vai direto pro perfil completo |
| **Esc** | Fecha modal |
| **Click fora do modal** | Fecha modal |
| **[✕]** | Fecha modal |
| **Click em "Ver Perfil Completo"** | Fecha modal + navega |
| **Right-click no modal** | Context menu padrão (perfil, escalar, desenvolver, contrato) |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Qualquer tela (click idol) | Modal aparece | Fade in (200ms) + scale from 0.95 to 1.0 |
| Modal (fechar) | Volta à tela anterior | Fade out (150ms) |
| Modal → Perfil Completo | Navega | Modal expande → transição para tela full |

---

## Assets Necessários

| Asset | Formato | Tamanho | Uso |
|---|---|---|---|
| Avatar da idol | WebP | 160×200 | Header do modal |
| Logo da agência | SVG | 24×24 | Header |
| Ícone de tier | SVG | 16 | Badge de tier |
| Stars TA | SVG | 14 | ★★★★☆ rating |
| Emojis de wellness | SVG | 24 | 😊😐😟😡 |
| Ícone de arquétipo | SVG | 16 | Badge no header |

---

## Acceptance Criteria

1. Click em avatar/nome de qualquer idol em qualquer tela abre o modal
2. Double-click skip modal e vai direto ao perfil completo
3. Modal mostra: avatar grande (160×200), nome, arquétipo, idade, nação, agência, valor, contrato
4. 16 atributos em 4 categorias (Performance/Presença/Resiliência/Inteligência) com barras e valores
5. Legenda Chave/Preferível para atributos do arquétipo
6. Relatório do Coach com TA em estrelas + potencial qualitativo + frase
7. Wellness com emoji + 4 barras + A Favor/Contra
8. Info com altura, personalidade, foco, grupo, característica
9. Botões de ação: Ver Perfil, Escalar, Desenvolvimento
10. Variação visual para idol rival (scoutada vs não scoutada)
11. Idol não scoutada: avatar blur, atributos ???, dados públicos apenas
12. Esc, click fora, ou [✕] fecha o modal
13. Modal é overlay (não tela cheia) — tela abaixo continua visível
