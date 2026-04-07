# Wireframe 27 — Training Intensity (Intensidade de Treino / Modal)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Intensity Overlay Modal (Screenshot "Intensidade de Treino")
> **Resolução alvo**: Modal centralizado sobre a tela de Treino
> **Rota**: Modal sobre `/agency/roster/training`
> **GDDs**: training-development, happiness-wellness

---

## Conceito

No FM26, o controle global de fadiga dos jogadores é feito numa tela flutuante (modal) chamada "Intensidade de Treino". Nela, você programa o comportamento do time inteiro com base em corações de condição (se o coração estiver meio vazio = descansa, se estiver cheio = treina o dobro).

No **Star Idol Agency**, esta é a **Gestão de Burnout Automática**. É a rede de segurança para o produtor não precisar verificar a barra de energia de cada Idol todos os dias.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
[ OVERLAY MODAL: INTENSIDADE DE TREINO ]
===================================================================================================
|                                                                                                 |
| Título: Calendário > Treino > Intensidade de Treino                                       [ X ] |
|                                                                                                 |
| [ INTENSIDADE AUTOMÁTICA ]                                                                      |
| Defina a intensidade de treino que cada membro do grupo terá com base em sua energia atual.     |
|                                                                                                 |
| Energia Restante:  [ ♥ Menos de 50% ]     [ ♥ Entre 50% e 75% ]     [ ♥ Mais de 75% ]           |
| Ação Programada:   [ Sem Treino (Folga) v][ Intensidade Normal v ]  [ Dupla Intensidade v ]     |
|                                                                                                 |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
| [ INTENSIDADE INDIVIDUAL DE IDOL ]                                                              |
|                                                                                                 |
| [ ] [Avatar] Papel   NOME         CONDIÇÃO       RISCO (Burnout)   INTENSIDADE DE TREINO        |
| [ ] [Foto]   Main V. Sakura       [♥♥♥♥♡] Boa    [ ! Alto ]        [ Automático           v ]   |
| [X] [Foto]   Dancer  Yumi         [♥♥♡♡♡] Má     [ !! Severo ]     [ Sem Treino (Descanso)v ]   |
| [ ] [Foto]   Center  Aiko         [♥♥♥♥♥] Ótima  [ Baixo ]         [ Dupla Intensidade    v ]   |
| [ ] [Foto]   Sub V.  Haruka       [♥♥♥♡♡] Média  [ Moderado ]      [ Automático           v ]   |
|                                                                                                 |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
| [ Botão: Confirmar Regras ]                                                                     |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. Modal Dialog de Interface Rica
Exatamente como no FM26, esta configuração de alto nível não ocupa uma tela inteira isolada. Ela abre como um pop-up gigante (Overlay) acima da visualização de treino, mantendo a sensação de fluxo ininterrupto.

### 2. Regras Condicionais com "Corações"
O FM abandonou porcentagens puras em algumas telas em favor de visualização rápida de saúde. Usamos o equivalente (corações de energia ou baterias). O jogador mapeia a regra de "Se coração < X, então faz Y".

### 3. Tabela de Overrides Individuais
A metade de baixo do modal replica a lista de jogadores do FM onde você pode quebrar a regra global. O dropdown em cada Idol permite mudar "Automático" (que segue a regra do topo) para um comportamento fixo ("Descanso Forçado" no caso da Yumi, que está em risco severo de burnout).

---

## Acceptance Criteria

1. Interface apresentada exclusivamente como Modal Overlay.
2. Segmento superior contendo as 3 a 5 faixas de "Saúde/Fadiga" mapeadas em Dropdowns de comportamento automático.
3. Segmento inferior listando o Roster completo com leitura imediata de "Burnout Risk" (Alerta) e opções de override.
4. Identidade visual alinhada com as tabelas de checkboxes do Plantel (Wireframe 23).