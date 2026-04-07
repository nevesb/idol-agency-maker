# Wireframe 35 — Shortlists (Listas de Alvos)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Shortlists
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/shortlists`
> **GDDs**: scouting-recruitment

---

## Conceito

No FM, Shortlists são as "Listas de Desejos". Você encontra um talento caro demais hoje, coloca na Shortlist, e o jogo te avisa se o contrato dela expirar no futuro.

No **Star Idol Agency**, você pode criar múltiplas Shortlists ("Alvos de Vocal", "Meninas para o Segundo Grupo", "Futuras Compositoras"). As Idols nessa lista sofrem monitoramento passivo pela sua equipe.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | SHORTLISTS (Ativo) | Atividade | Contratos                 |
|-------------------------------------------------------------------------------------------------|
| Recrutamento > Shortlists                                                                       |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQUERDA - GESTOR DE LISTAS ]        | [ CENTRO/DIR - IDOLS MONITORADAS ]              |
|                                               |                                                 |
| MINHAS SHORTLISTS                             | DROPDOWN: [ Alvos de Prioridade (Ativo) v ]     |
|                                               |                                                 |
| > Alvos de Prioridade (12 Idols)              | [ Botão: Exportar/Compartilhar Lista ]          |
| > Meninas Sub-16 (45 Idols)                   |                                                 |
| > Monitoramento de Rivais (8 Idols)           | +-----------------+-----+------+-----+---------+|
| > Possíveis Compositoras (3 Idols)            | | NOME            | ID. | AGÊ. | INT.| VALOR   ||
|                                               | +-----------------+-----+------+-----+---------+|
| [ Botão: Criar Nova Shortlist ]               | | [Foto] Kanna    | 15  | Livre| Sim | ¥0      ||
|                                               | | [Foto] Natsumi  | 19  | Titan| Não | ¥8M     ||
| CONFIGURAÇÕES DE MONITORAMENTO                | | [Foto] Rika     | 17  | Livre| Sim | ¥0      ||
| (Para a lista 'Alvos de Prioridade')          | +-----------------+-----+------+-----+---------+|
|                                               |                                                 |
| [X] Avisar se outra agência fizer oferta      |-------------------------------------------------|
| [X] Avisar se o contrato estiver perto do fim | AÇÕES PARA: NATSUMI (Selecionada)               |
| [ ] Manter olheiros atualizando relatório     |                                                 |
| [ ] Limpar idol da lista após 1 ano           | "Natsumi não tem interesse em entrar na Star    |
|                                               | Idol Agency no momento. Nossa reputação é       |
|                                               | muito baixa em relação à agência Titan."        |
|                                               |                                                 |
|                                               | [ Fazer Oferta de Compra (Locked) ]             |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Indicador de "Interesse"
A grande barreira de mercado do FM: a coluna "INT." (Interesse). O jogo calcula se o talento quer ou não se juntar à sua equipe baseado na sua reputação atual. Natsumi tem 19 anos, tá na agência número 1 ("Titan") e você é uma agência garagem. Ela não vai aceitar seu convite nem por rios de dinheiro. O painel de ação da direita explica isso mastigado (na versão anterior de UI o jogador sofria pra achar por que o botão de comprar estava cinza).

### 2. Gestor de Alertas Automáticos
O painel esquerdo reflete os "Settings" de Shortlists do FM. O jogo não te avisa de tudo sobre essas meninas; ele só te manda um "Alerta no Inbox" se o contrato dela estiver acabando ou se outra agência tentar roubá-la, dependendo de quais caixas de configuração o jogador marcou.

---

## Acceptance Criteria

1. Tela com menus de abas laterais para navegar entre múltiplas listas customizadas de desejos.
2. Coluna central estilo tabela contendo indicador forte de "Interesse" (Sim/Não/Incerto).
3. Configurações de notificação atreladas a cada lista.