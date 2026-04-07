# Wireframe 22 — Staff Quick Profile Modal (Mini-Perfil)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Pop-up Profile Overlay
> **Resolução alvo**: Pop-up sobreposto
> **Rota**: Modal/Overlay (Disparado via clique ou hover demorado)
> **GDDs**: staff-functional, operations

---

## Conceito

Durante a atribuição de tarefas (como no *Wireframe 14* ou *15*), o jogador não quer sair da tela principal para ver se aquele treinador é bom para a função. No FM, clica-se no ícone de "informação" ao lado do nome do staff e um modal/pop-up compacto se abre sobrepondo a tela atual.

No **Star Idol Agency**, esta é a visualização instantânea de um membro da equipe de bastidores.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
TELA DE FUNDO (EX: ATRIBUIÇÃO DE TREINO - ESCURECIDA/DESFOCADA)
===================================================================================================
|                                                                                                 |
|   +-----------------------------------------------------------------------------------------+   |
|   | [X] Fechar (Canto superior direito)                                                     |   |
|   |                                                                                         |   |
|   | [ CABEÇALHO DO POP-UP ]                                                                 |   |
|   | [Avatar] | Yuka Nakamura (34) - Head Vocal Coach                                        |   |
|   | Mini     | ¥ 450.000 / mês (Vínculo: 1 ano)                                             |   |
|   |                                                                                         |   |
|   |-----------------------------------------------------------------------------------------|   |
|   |                                                                                         |   |
|   | MELHORES ATRIBUTOS (Top 3)                  | PONTOS DE ATENÇÃO (Cons)                  |   |
|   | [Verde] Técnica Vocal: Elite                | [Vermelho] Foco em Dança: Poor            |   |
|   | [Verde] Determinação: Elite                 | [Amarelo]  Gestão de Pessoas: Competent   |   |
|   | [Verde] Poder Vocal: Very Good              |                                           |   |
|   |                                             |                                           |   |
|   |-----------------------------------------------------------------------------------------|   |
|   |                                                                                         |   |
|   | ADEQUAÇÃO À TAREFA ATUAL                    | AÇÕES                                     |   |
|   | Tarefa Selecionada: Treinador Vocal Líder   |                                           |   |
|   | Classificação Prevista: [★★★★☆] 4.5 Estrelas| [ Botão: Ver Perfil Completo ]            |   |
|   | Carga de Trabalho Base: Alta                | [ Botão: Promover/Alterar Função ]        |   |
|   |                                                                                         |   |
|   +-----------------------------------------------------------------------------------------+   |
|                                                                                                 |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. Modal Overlay (Foco Rápido)
A interface de sobreposição do FM26 permite checar os "Stats" sem perder o contexto. Fechar o modal devolve o usuário exatamente à matriz que ele estava editando.

### 2. Destaque de Pros & Cons
Ao invés de carregar a lista de todos os atributos qualitativos (que tomam espaço), o modal destaca apenas as "forças" (Top 3 atributos verdes) e as "fraquezas" críticas (vermelho/amarelo) para rápida tomada de decisão (ex: "Ela canta muito bem, mas briga com a equipe").

### 3. Context-Awareness (Adequação à Tarefa)
O detalhe principal da UI inteligente do FM: se você abriu o modal a partir da tela de "Treino Vocal", o modal já cruza os dados do staff e diz quantas estrelas ele vai render se for alocado naquela tarefa específica.

---

## Acceptance Criteria

1. Renderiza como overlay sobre qualquer tabela que possua listas de Staff.
2. Mostra apenas os pontos focais (Top 3 Pros e Cons) usando as tags qualitativas (Elite, Poor, etc).
3. Apresenta o rating contextual do staff baseado na tarefa em que o modal foi disparado.
4. Botão de "Ver Perfil Completo" leva para o `/agency/staff/profile/:id` (Wireframe 21).