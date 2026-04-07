# Wireframe 34 — Scouting Center (Central de Olheiros)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Scouting Centre / Recruitment Focus
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/scouting`
> **GDDs**: scouting-recruitment

---

## Conceito

No FM, você não clica individualmente em jogadores o tempo todo; você cria "Focos de Recrutamento" (Scouting Focus) mandando um olheiro ir para o Brasil caçar laterais esquerdos. 

No **Star Idol Agency**, esta é a **Central de Olheiros**. Você envia seus *Scouts* para as ruas de Harajuku, para escolas de arte em Osaka ou até para a Coreia do Sul caçar trainees com alto potencial de dança. A inteligência artificial da sua equipe vai preenchendo a sua lista de recomendados automaticamente.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| VISÃO GERAL (Ativo) | Pesquisa de Talentos | Shortlists | Atividade | Contratos                 |
|-------------------------------------------------------------------------------------------------|
| Recrutamento > Visão Geral                                                                      |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQUERDA - FOCOS DE BUSCA (ASSIGNMENTS) ] | [ CENTRO/DIR - FEED DE RECOMENDAÇÕES ]     |
|                                                    |                                            |
| FOCOS ATIVOS (3/5 Olheiros Ocupados)               | RECOMENDAÇÃO PRINCIPAL DO DIA              |
|                                                    | [Card Gigante com destaque visual]         |
| > Foco: "Projeto Vocal"                            | [Avatar Grande] Kanna (15 anos)            |
|   Local: Tóquio (Ruas de Harajuku)                 | Potencial: [★★★★★] Elite                     |
|   Tipo: Qualquer idade, Vocal >= 15                | "Kanna foi encontrada cantando numa praça  |
|   Resultados: 12 novas Idols encontradas.          | de Quioto. Sua voz é absurda."             |
|   [ Botão: Editar ] [ Botão: Encerrar ]            |                                            |
|                                                    | [ Ver Relatório Completo ] [ Convidar ]    |
| > Foco: "A Nova Dançarina"                         |--------------------------------------------|
|   Local: Coreia do Sul (Academias de Dança)        | FEED DO DIRETOR DE CASTING                 |
|   Tipo: Trainee (< 16), Dança >= 16                | (Lista com as garotas encontradas nos      |
|   Resultados: 2 novas Idols encontradas.           |  últimos dias)                             |
|                                                    |                                            |
| [ Botão: Criar Novo Foco de Recrutamento ]         | [Foto] Mio (14) - Nota: A (Comprar agora)  |
|                                                    | [Foto] Yuki (18) - Nota: B (Manter de olho)|
|                                                    | [Foto] Hana (16) - Nota: D (Ignorar)       |
|                                                    |                                            |
|                                                    | [ Botão: Marcar todas como lidas ]         |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Focos de Recrutamento (Esquerda)
Mecanismo direto importado do FM moderno: você não controla os movimentos passo a passo do olheiro. Você cria uma "Missão" (Assignment). A barra da esquerda funciona como um gerenciador dessas missões.

### 2. Inbox de Recomendações em Cards (Direita)
O FM26 apresenta o jogador descoberto numa interface estilo "Feed" (ou como um app de namoro, mas para contratos). O Head Scout joga a carta na mesa: "Achei essa Kanna, nota A+". Você tem botões de ação imediata (Convidar para Agência, Descartar, Adicionar na Shortlist).

### 3. Sistema de Graus (A a F)
Junto das estrelas, a recomendação final de um Scout vem com um grau (Grade) literal. Isso tira a complexidade do produtor iniciante, que só precisa seguir as recomendações "A" e ignorar as "D".

---

## Acceptance Criteria

1. Painel esquerdo gerencia as missões ativas dos *Scouts* (com limite ditado pela diretoria/board).
2. Painel direito funciona como um feed contínuo de descobertas a serem revisadas ("Tinder" de talentos).
3. Botão claro para "Criar novo Foco", abrindo modal de configuração de parâmetros (Idade, Skill, Região).