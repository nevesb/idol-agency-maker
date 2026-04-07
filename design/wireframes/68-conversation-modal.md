# Wireframe 68 — Conversation Modal (Conversa Direta)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Player Interaction / Chat Modal  
> **Resolução alvo**: Modal Overlay  
> **Rota**: Modal Global  
> **GDDs**: player-manager-system, social-system

---

## Conceito

No FM, o jogador entra na sua sala furioso porque não foi escalado. Você tem um menu de opções de diálogo (Assertivo, Calmo, Agressivo).
No **Star Idol Agency**, esta é a **Tela de Conversa (Conversation Modal)**. É ativada quando você elogia, pune ou precisa resolver o desespero de uma Idol. Pode ser uma conversa formal no escritório ou um papo no corredor da agência. Suas escolhas definem se ela sai motivada ou pede pra sair do grupo.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
TELA DE FUNDO ESCURECIDA (EX: PORTAL OU PERFIL DA IDOL)
===================================================================================================
|                                                                                                 |
|   +-----------------------------------------------------------------------------------------+   |
|   | CONVERSA PRIVADA: AIKO                                                            [ X ] |   |
|   | Local: Sala do Produtor                                                                 |   |
|   |-----------------------------------------------------------------------------------------|   |
|   | [ COLUNA ESQ - O DIÁLOGO ]                  | [ COLUNA DIR - INFORMAÇÕES DA IDOL ]      |   |
|   |                                             |                                           |   |
|   | AIKO:                                       | [Avatar] AIKO (16 anos)                   |   |
|   | "Você prometeu que eu seria a Center do     |                                           |   |
|   | grupo neste novo single. O que aconteceu?   | RELACIONAMENTO COM VOCÊ                   |   |
|   | Eu não mereço?"                             | [Vermelho] Decepcionada                   |   |
|   |                                             |                                           |   |
|   | VOCÊ (Produtor):                            | PERSONALIDADE (HIDDEN TRAITS)             |   |
|   | Tonalidade: [ Dropdown: Assertivo v ]       | > Ambição: Muito Alta                     |   |
|   |                                             | > Profissionalismo: Baixo                 |   |
|   | OPÇÕES DE RESPOSTA                          | "Reage mal a críticas duras e não aceita  |   |
|   | ( ) "A Sakura treinou mais. Foi mérito."    |  ficar no banco de reservas."             |   |
|   |     [ Risco: Ela odeia a Sakura ]           |                                           |   |
|   |                                             | ESTADO MENTAL ATUAL                       |   |
|   | (*) "O grupo precisava disso para o lucro.  | Moral: Baixa                              |   |
|   |      Sua chance virá no próximo mês."       | Pressão: Moderada                         |   |
|   |                                             |                                           |   |
|   | ( ) "Se não está satisfeita, a porta é      |                                           |   |
|   |      serventia da casa."                    |                                           |   |
|   |                                             |                                           |   |
|   | [ Botão: Confirmar Resposta ]               |                                           |   |
|   +-----------------------------------------------------------------------------------------+   |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. Tone and Body Language Interaction
No FM26 as interações não são apenas texto. O dropdown de "Tom" dita como a frase é dita. Usar "Assertivo" para "Sua chance virá" soa como um chefe firme. Usar "Calmo" soa como um mentor. A resposta de Aiko no próximo balão dependerá do cruzamento entre o seu Tom e a Personalidade dela (coluna da direita).

### 2. Contextual Data Panel (Painel de Apoio)
Um erro grave em jogos antigos era não lembrar com quem você estava falando. A coluna da direita do FM exibe a moral atual do jogador, os traços de personalidade (se você souber) e o nível de relacionamento de vocês. Isso impede o produtor de ameaçar de demissão a idol que é o pilar financeiro da agência.

---

## Acceptance Criteria

1. Modal limpo de diálogo sobreposto (overlay) com foco em balões de chat e múltipla escolha.
2. Menu de Tonalidade influenciando diretamente o peso da resposta.
3. Painel lateral com informações contextuais (Personalidade, Moral, Relacionamento) para embasar a decisão do jogador.