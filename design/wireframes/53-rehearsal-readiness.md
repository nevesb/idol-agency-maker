# Wireframe 53 — Rehearsal & Readiness (Ensaios Pré-Show)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Match Preparation / Training Feedback  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/rehearsal`  
> **GDDs**: show-system, training-system

---

## Conceito

No FM, os 3 dias antes de um clássico são dedicados a treinar "Defesa de Bolas Paradas".
No **Star Idol Agency**, esta é a tela de **Preparação e Ensaio**. Você tem 5 dias antes do Show do Tokyo Dome. Você focará o ensaio na Dança Sincronizada (evita erros da Aiko), nos Vocais Ao Vivo, ou dará folga pra recuperar a estamina (Fadiga) das meninas?

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Formações | Setlist | Palco e Figurino | ENSAIOS (Ativo) | Operações         |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Preparação Pré-Show > Celestial Nine                                              |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - FOCO DO ENSAIO ]            | [ COLUNA CENTRO/DIR - IMPACTO DA PREPARAÇÃO ]       |
|                                            |                                                     |
| OBJETIVO DO ENSAIO (Restam 4 Dias)         | NÍVEL DE "SHOW READINESS" (Prontidão)               |
| [ Dropdown: Foco em Dança (Sincronia) v ]  | [ ||||||||||||||------ ] 70% (Competente)           |
|                                            |                                                     |
| OUTRAS OPÇÕES DE FOCO:                     | EXPECTATIVA DE PERFORMANCE                          |
| ( ) Foco em Vocal Ao Vivo                  | > Risco de Falha Vocal: Alto                        |
| ( ) Foco em MC (Interação com Público)     | > Risco de Falha na Dança: Muito Baixo (Focado)     |
| ( ) Repouso Absoluto (Recuperar Fadiga)    | > Coesão do Grupo: Excelente                        |
|                                            |                                                     |
| AVALIAÇÃO DA EQUIPE (COACHES)              |-----------------------------------------------------|
| Treinador de Dança:                        | IMPACTO FÍSICO (FADIGA NO DIA DO SHOW)              |
| "Excelente escolha. A coreografia da música|                                                     |
| 'Celestial Dance' estava terrível ontem.   | Yumi:     [=========| ] (Quase Exausta no Início!)  |
| Isso vai garantir que não caiam no palco." | Sakura:   [====      ] (Fadiga Normal)              |
|                                            | Aiko:     [===       ] (Fadiga Normal)              |
| Treinador Vocal:                           |                                                     |
| "Atenção: Aiko tem tendência a desafinar ao| [ ALERTA MEDICO ]                                   |
| vivo. Ignorar o ensaio vocal pode custar   | O foco intenso em Dança deixará Yumi vulnerável a   |
| caro na segunda música do setlist."        | lesões. Sugiro mudar o foco ou dar-lhe repouso.     |
|                                            |                                                     |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Match Preparation Focus (Objetivo de Jogo)
Uma mecânica vital do FM onde você sacrifica treino geral para um "boost" num atributo específico válido só por 90 minutos. Aqui, treinar Dança zera a chance de queda no palco, mas engessa os vocais.

### 2. Readiness Metric (Prontidão da Tática)
A familiar barra do FM que diz o quanto a equipe entende a tática. No jogo, é o "Show Readiness". Um grupo verde com 10% de readiness será um desastre desordenado.

### 3. Medical Warnings (Alerta Médico)
Um painel no canto inferior direito cruzando os dados do Ensaio com a Barra de Fadiga Física do Roster. Forçar ensaio de dança quando a Yumi está esgotada gera um aviso agressivo do Médico/Fisioterapeuta do clube.

---

## Acceptance Criteria

1. Painel de seleção de "Foco de Ensaio" que atua como um modificador global temporário para os atributos da equipe no dia do evento.
2. Indicador central de "Show Readiness" influenciado pela quantidade de dias investidos em ensaio desde a marcação do evento.
3. Exibição cruzada do nível de Fadiga esperado para o dia do show em contraste com a carga do ensaio selecionado.