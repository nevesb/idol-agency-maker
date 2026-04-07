# Wireframe 75 — Tutorial & Tooltip System (Sistema de Onboarding)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Contextual Hints / In-Game Editor Tooltips  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: Overlay system (sem rota dedicada — sobrepõe qualquer tela)  
> **GDDs**: tutorial-onboarding

---

## Conceito

No FM26, o sistema de dicas contextuais aparece quando o jogador encontra uma tela ou mecânica pela primeira vez. Não é um tutorial linear — é um sistema reativo que detecta contexto e oferece explicação no momento certo, sem bloquear a interação.
No **Star Idol Agency**, o sistema de onboarding funciona com 3 camadas de tooltip: **Highlight Tooltip** (dica pontual em elemento da UI), **Welcome Card** (introdução a features maiores), e **Assistant Suggestion** (conselhos do staff durante gameplay). O jogador pode desativar tudo via Settings (Wireframe 74).

---

## Estrutura da Tela (Layout FM26)

### Estilo 1: Highlight Tooltip (Dica Pontual)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                  |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
|   Orçamento Mensal: ¥ 12.000.000                                                               |
|                        ↑                                                                        |
|              +--------------------------+                                                       |
|              | Este é o seu orçamento   |                                                       |
|              | mensal total. Inclui     |                                                       |
|              | salários, treino e       |                                                       |
|              | operações.               |                                                       |
|              |                          |                                                       |
|              | [Entendi]  [Saiba mais →]|                                                       |
|              +--------------------------+                                                       |
|                                                                                                 |
|   (Fundo da tela escurecido com destaque no elemento alvo)                                      |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

- Seta apontando para o elemento da UI relevante
- Texto curto (máximo 2-3 linhas)
- Botões: "Entendi" (dismiss) e "Saiba mais" (abre detalhes ou próxima dica da sequência)
- Fundo semi-transparente escurece o resto da tela, destacando o elemento

### Estilo 2: Welcome Card (Introdução de Feature)

```text
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   (Fundo escurecido — overlay completo)                                                         |
|                                                                                                 |
|              +------------------------------------------+                                       |
|              |          [Ícone: Microfone]               |                                       |
|              |                                          |                                       |
|              |    Bem-vindo ao Dia de Show!              |                                       |
|              |                                          |                                       |
|              |    Aqui você monta o setlist, escala      |                                       |
|              |    as idols e define a estratégia de      |                                       |
|              |    palco. O resultado depende do treino,  |                                       |
|              |    da química do grupo e da escolha de    |                                       |
|              |    músicas certas para o público.         |                                       |
|              |                                          |                                       |
|              |    Dica: comece com músicas que seu       |                                       |
|              |    grupo domina antes de arriscar.        |                                       |
|              |                                          |                                       |
|              |         [ Próximo → ]  [ Pular Tudo ]    |                                       |
|              +------------------------------------------+                                       |
|              (Card centralizado ~400×250px)                                                      |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

- Card centralizado na tela (400×250px aproximadamente)
- Ícone temático no topo (relacionado à feature)
- Título + descrição de 2-3 linhas + dica prática
- Botões: "Próximo" (avança sequência) e "Pular Tudo" (dismiss todas as dicas restantes)
- Usado na primeira vez que o jogador acessa uma feature importante

### Estilo 3: Assistant Suggestion (Conselho do Staff)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                  |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
|   (Tela normal do jogo — NÃO bloqueia interação)                                               |
|                                                                                                 |
|                                                                                                 |
|                                                                                                 |
|                                                                                                 |
|                                                                       +-----------------------+ |
|                                                                       | [Avatar: Yumi Tanaka] | |
|                                                                       | "Hana está com moral  | |
|                                                                       |  baixo. Considere dar  | |
|                                                                       |  um dia de folga."     | |
|                                                                       |                       | |
|                                                                       | [Aplicar] [Dispensar] | |
|                                                                       +-----------------------+ |
|                                                                       (300×80px, bottom-right)   |
+-------------------------------------------------------------------------------------------------+
```

- Notification card no canto inferior direito (300×80px)
- Avatar do membro do staff que sugere a ação
- Texto curto e acionável (1-2 linhas)
- Botões: "Aplicar" (executa a ação sugerida) e "Dispensar" (fecha)
- Não bloqueia a interação — o jogador pode ignorar e continuar jogando
- Desaparece automaticamente após 15 segundos se não interagido

---

## Cronograma Progressivo de Onboarding

| Semana | Trigger | Tipo | Conteúdo |
|--------|---------|------|----------|
| 1 | Primeiro acesso ao jogo | Welcome Card | Introdução geral: "Bem-vindo à sua agência" |
| 1 | Acessa Plantel pela primeira vez | Highlight Tooltip | Explica atributos das idols e níveis de habilidade |
| 1 | Acessa Staff pela primeira vez | Highlight Tooltip | Explica funções dos funcionários e vagas |
| 2 | Primeiro treino agendado | Welcome Card | Introdução ao sistema de treino e calendário |
| 2 | Primeiro show disponível | Welcome Card | Introdução ao Dia de Show e preparação |
| 3 | Orçamento abaixo de 50% | Assistant Suggestion | Staff financeiro alerta sobre fluxo de caixa |
| 3 | Idol com moral < 40 | Assistant Suggestion | Treinador sugere ação de moral |
| 4 | Janela de transferências abre | Welcome Card | Introdução ao mercado de idols |
| 4 | Rival faz oferta por sua idol | Assistant Suggestion | Produtor Assistente avisa e sugere resposta |

---

## Comportamento de Dismiss

- **Highlight Tooltip**: dismiss individual; não reaparece para aquele elemento.
- **Welcome Card**: "Pular Tudo" desativa todos os Welcome Cards restantes da sequência. Cards individuais não reaparecem após dismiss.
- **Assistant Suggestion**: dismiss individual; sugestões similares podem reaparecer em contextos futuros (cooldown de 4 semanas in-game).
- **Reset via Settings**: o botão "Resetar Tutorial" (Wireframe 74) limpa todos os flags de dismiss e reinicia o cronograma.
- **Persistência**: flags de dismiss salvos no save file do jogador.

---

## Componentes FM26 Aplicados

### 1. Dicas Contextuais Não-Bloqueantes
O FM26 nunca para o jogo para ensinar. As dicas aparecem quando relevante e o jogador pode ignorar. O Assistant Suggestion segue esse princípio — aparece, sugere, desaparece.

### 2. Progressividade
O FM26 não despeja 50 tooltips na primeira hora. O sistema revela complexidade conforme o jogador avança. Semana 1 foca no básico; semana 4 introduz mercado e rivalidades.

### 3. Staff como Voz do Tutorial
No FM, o assistente técnico "fala" com o jogador sobre táticas. Aqui, os membros do staff ganham voz através das Assistant Suggestions — o treinador vocal avisa sobre moral, o financeiro alerta sobre orçamento. Isso humaniza o tutorial e reforça o papel do staff.

---

## Acceptance Criteria

1. Três estilos de tooltip implementados: Highlight Tooltip, Welcome Card e Assistant Suggestion.
2. Highlight Tooltip escurece o fundo e destaca o elemento alvo com seta direcional.
3. Welcome Card centralizado com overlay completo; suporta sequência multi-card com "Próximo".
4. Assistant Suggestion aparece no canto inferior direito sem bloquear interação; auto-dismiss após 15s.
5. Cronograma progressivo disparando dicas conforme semana in-game e ações do jogador.
6. Flags de dismiss persistidos no save file; "Pular Tudo" desativa Welcome Cards restantes.
7. Integração com Settings (Wireframe 74): toggle de Tutorial Mode e botão Reset Tutorial funcionais.
8. Botão "Aplicar" em Assistant Suggestions executa a ação sugerida diretamente (ex: agendar folga).
9. Sistema desativável completamente via Settings sem resíduos visuais.
