# Wireframe 50 — Setlist Builder (Montagem do Repertório)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Tactics / Formation Selection  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/setlist`  
> **GDDs**: show-system, idol-groups

---

## Conceito

No Football Manager, você monta a tática para o jogo. 4-4-2 ou 4-3-3? Pressing alto ou retranca?
No **Star Idol Agency**, esta é a tela de **Setlist Builder**. Aqui você monta o show: quais músicas serão tocadas, em que ordem, e quem canta cada parte. Uma setlist com 5 músicas seguidas de dança intensa pode matar de cansaço suas integrantes, mas uma setlist morno pode decepcionar o público do Tokyo Dome.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Planejamento | SETLIST (Ativo) | Ensaios | Operações | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Setlist > Celestial Nine: TOUR FINAL TOKYO DOME                                   |
+-------------------------------------------------------------------------------------------------+
| [ BARRA DE FADIGA ACUMULADA ]                                                                   |
| Carga Física Total do Show: [|||||||||| 85% ] RISCO DE EXAUSTÃO NA MÚSICA 4                      |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - BIBLIOTECA DE MÚSICAS ]    | [ COLUNA CENTRO/DIR - SETLIST MONTADO (SLOT VIEW) ]  |
|                                            |                                                      |
| MÚSICAS DISPONÍVEIS DO GRUPO               | SLOT 1: "Starlight Melody" (Opener)                   |
| (Arrastável para o Setlist)                | Tipo: Balada/Slow | Duração: 4:30                     |
|                                            | Center: Sakura | Dificuldade Dance: Baixa            |
| ★★★ "Starlight Melody" (Single #1)       | Fadiga Gerada: [||     ] (Leve)                      |
| Tipo: Balada                               |                                                      |
| Dificuldade: ★☆☆                          | SLOT 2: "Celestial Dance"                             |
|                                            | Tipo: Dance/Upbeat | Duração: 3:45                    |
| ★★★ "Celestial Dance" (Single #2)         | Center: Yumi | Dificuldade Dance: Alta               |
| Tipo: Dance                                | Fadiga Gerada: [|||||| ] (Severa)                    |
| Dificuldade: ★★★                          |                                                      |
| ★☆☆ "Future Dream" (B-side)               | SLOT 3: "Pale Moon" (Ballad Interlude)                |
| ...                                        | Tipo: Acústica | Duração: 5:00                       |
|                                            | Center: Aiko | Dificuldade Dance: Baixa              |
| [ Filtros por Tipo: Balada v | Dance v | Upbeat v ]                                             |
|                                            | SLOT 4: "Breaking Point"                              |
|                                            | [ ALERTA: Fadiga Acumulada acima de 80% ]            |
|                                            | A integrante Yumi já estará exausta neste ponto.     |
|                                            | Risco de erro técnico alto.                          |
|                                            |                                                      |
|                                            | [ Botão: Inserir Intervalo (MC/Acústica) ]          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Drag-and-Drop Tactics Board (Visual Formation)
O FM moderno permite arrastar posições. No Setlist Builder, você arrasta músicas da biblioteca (esquerda) para os slots numéricos (direita). O "campo de futebol" do FM vira uma "timeline de slots de música".

### 2. Análise de Carga (Fatigue/Stamina Bar)
Igual ao FM que te avisa se o time vai cansar aos 70 minutos. A "Fatiga Bar" no topo acumula a carga física do show. Após 3 músicas de dança intensa seguidas, o alerta laranja/vermelho aparece.

### 3. Match-up Analysis (Conflitos de Central)
No FM você vê se seu atacante é rápido demais para o zagueiro adversário. Aqui, ao clicar numa música, o sistema mostra se a atribuída como Center tem a técnica necessária para aquele número complexo.

---

## Acceptance Criteria

1. Interface drag-and-drop para montagem da setlist arrastando músicas da biblioteca para slots.
2. Visualização em "slots" simulando a ordem cronológica do show (Slot 1 = Abertura, Slot X = Encerramento).
3. Medidor de fadiga acumulada no topo alertando sobre séries de músicas de alta intensidade.
4. Informações de Dificuldade de Performance e match contra atributos dos Centers designados.