# Wireframe 39 — Talent Board (Quadro de Alvos)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Recruitment Board / Director of Football Targets
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/board`
> **GDDs**: scouting-recruitment, roster-balance

---

## Conceito

No Football Manager, você não precisa fazer a busca suja de jogadores. Você vai no "Recruitment Board" e diz pro Diretor de Futebol: "Compre um Atacante Jovem de até 10 Milhões."
No **Star Idol Agency**, esta é a **Diretoria de Casting (Talent Board)**. Você delega a burocracia das audições e compras para o Chefe de Casting (Head Scout/Director). É um painel Kanban de quem a sua equipe executiva acha que seria perfeito para suprir a falta de Dançarinas.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Pesquisa de Talentos | Shortlists | Atividade | Contratos | QUADRO (Ativo)        |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - DEFINIR NECESSIDADE (NOVO TARGET) ]                                         |
|                                                                                                 |
| [ Botão: + Sugerir Alvo ao Diretor de Casting ]                                                 |
| O que você quer? [Dropdown: Dançarina Principal v]  Idade Máxima: [18 v]  Orçamento: [¥5M v]    |
| [ Botão: Criar Missão ]                                                                         |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQUERDA - SUGESTÕES ]             | [ COLUNA CENTRO - EM NEGOCIAÇÃO ]                 |
|                                             |                                                   |
| MISSÃO 1: "DANÇARINA PRINCIPAL"             | [Foto] Yuki (18)                                  |
| Status: Procurando...                       | Status: Oferecendo Contrato (Dir. Casting)        |
|                                             | O Diretor acha que pode fechar por ¥ 2.500.000    |
| Recomendação do Diretor:                    | [ Botão: Cancelar e Negociar Eu Mesmo ]           |
| [Foto] Kanna (17)                           |                                                   |
| "Kanna é a dançarina mais habilidosa livre  |                                                   |
| no mercado de Osaka. Acha que devemos       |                                                   |
| fazer uma oferta?"                          |                                                   |
|                                             |                                                   |
| Ações: [ Iniciar Negociação (Diretor) ]     |                                                   |
|        [ Rejeitar Sugestão ]                | [ COLUNA DIREITA - FECHADOS ]                     |
|                                             |                                                   |
|---------------------------------------------| [Foto] Mio (14)                                   |
|                                             | Contratada por ¥ 1.000.000 como Trainee           |
| MISSÃO 2: "MAIN VOCAL (URGENTE)"            | "O Diretor fechou o negócio dentro do orçamento.  |
| "Ainda não encontrei ninguém neste valor."  | A Idol junta-se ao plantel em 01/Jan."            |
| [ Ajustar Missão ]                          |                                                   |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Kanban (Transfer Targets)
FM26 introduziu esse estilo quadro (Sugerido -> Negociando -> Assinado) quando você delega as compras pro Diretor de Futebol. Simplifica a vida do produtor que não quer brincar na tela do `37-market-contracts.md` com a barrinha de paciência e os sliders.

### 2. Gestão Indireta de Talentos
A "Missão 2" (Vocal urgente) retorna o erro padrão da IA do jogo se o jogador colocar restrições muito grandes no topo ("Quero a Beyoncé japonesa por 10 mil Ienes"). O botão de "Ajustar" permite subir o orçamento.

### 3. Take Control
No centro, se o Diretor estiver fazendo besteira (oferecendo um contrato gigante pra uma Idol ok), o produtor clica em `[ Cancelar e Negociar Eu Mesmo ]` e a IA devolve o controle manual do contrato pra ele.

---

## Acceptance Criteria

1. Tela organizada como um quadro Kanban (board visual) das necessidades de elenco.
2. Interação primária é de "Delegar", permitindo que o Diretor conduza a compra e exiba os cards mudando de coluna.
3. Ações rápidas para aprovar ou rejeitar uma Idol sugerida pelo *Head de Casting* (Esquerda).