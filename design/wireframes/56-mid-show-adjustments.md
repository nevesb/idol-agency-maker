# Wireframe 56 — Mid-Show Adjustments (Intervalo e MC)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Half-Time Team Talk / Tactics Change  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/half-time`  
> **GDDs**: show-system, agency-staff-operations

---

## Conceito

No FM, o jogo para no intervalo para você refazer a tática e dar o discurso de meio tempo no vestiário.
No **Star Idol Agency**, shows longos (como Turnês) não são feitos de uma tacada só. Eles possuem os "Interlúdios" (MC Talks - conversas com a platéia, ou momentos em que elas vão pros bastidores trocar de figurino). Esta tela é o **Ajuste de Meio-Tempo (Mid-Show Adjustments)**.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
| [ INTERVALO (MC / TROCA DE FIGURINO) ]                                        TEMPO RESTANTE: 3M|
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - AVALIAÇÃO DO 1º TEMPO ]     | [ COLUNA CENTRO/DIR - AÇÕES DE INTERVALO ]         |
|                                            |                                                    |
| DESEMPENHO ATÉ AQUI (Músicas 1 a 6)        | TROCA DE FIGURINO RÁPIDA                           |
| Hype da Platéia: [||||||    ] 65% (Frio)   | As meninas saíram do palco. Elas vestiriam o traje |
| "A platéia não comprou as baladas lentas." | 'Casual Chic', mas a platéia está fria.            |
|                                            | [ Manter Figurino Original ]                       |
| CONDIÇÃO FÍSICA E MENTAL                   | [ Trocar para 'Neon Rave' (Agressivo) ]            |
| Yumi: 6.2 (Completamente Exausta)          |                                                    |
| Sakura: 7.5 (Tentando carregar o grupo)    | SUBSTITUIÇÃO (PULL OUT)                            |
| Aiko: 6.8 (Nervosa com o microfone)        | Yumi está prestes a colapsar. Deseja retirá-la do  |
|                                            | restante do show? (Isto prejudicará a formação).   |
| DICA DO COREÓGRAFO (ASSISTANT MANAGER)     | [ Substituir Yumi pela Trainee (Kaho) ]            |
| "Aiko está tendo um colapso de nervos. E   | [ Manter Yumi (Risco de Lesão Grave!) ]            |
| a Yumi não aguenta o 2º bloco do setlist.  |                                                    |
| Mude a música 7 para algo acústico ou tire | DISCURSO DE INTERVALO (TEAM TALK)                  |
| a Yumi de lá!"                             | [ Dropdown: Tonalidade (Gritando/Agressivo) v ]    |
|                                            | Fala: "Isso está sendo um vexame! A platéia está   |
|                                            | dormindo. Acordem pra vida no 2º tempo!"           |
|                                            | [ Reações: Aiko começa a chorar (Pressão quebrou) ]|
|                                            |                                                    |
|--------------------------------------------|----------------------------------------------------|
|                                [ CONFIRMAR AJUSTES E VOLTAR PRO PALCO ]                         |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. Half-Time Summary & Assistant Advice
Assim como o adjunto de campo no FM avisa que o seu time está perdendo o meio campo, aqui o Coreógrafo/Assistant Manager dá o raio-X dos primeiros 45 minutos. Ele avisa que a platéia achou ruim e que alguém vai passar mal se você não mexer.

### 2. Tactical Adjustments under Pressure
O produtor tem 3 minutos simulados (o jogador pode pausar, claro) para decidir se troca o figurino programado pra tentar dar um choque no público, e se arranca a Yumi do palco, trocando pela Trainee do banco de reservas.

### 3. Discurso de Vestiário (Metade do Jogo)
O FM permite gritar com o time no intervalo. Bater na mesa no vestiário de garotas cansadas tem um peso enorme: pode injetar adrenalina numa integrante preguiçosa ou despedaçar a cantora nervosa, destruindo a segunda metade do show.

---

## Acceptance Criteria

1. Tela apresenta modal interativo ativado automaticamente no momento de interrupção pré-programada da Setlist (MC/Costume Change).
2. Opções táticas ativas permitindo alterar figurinos, pular músicas ou substituir integrantes colapsando por Trainees.
3. Repetição do sistema de "Team Talk" para correção ou destruição de moral no meio do evento.