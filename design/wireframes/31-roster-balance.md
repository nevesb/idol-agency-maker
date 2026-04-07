# Wireframe 31 — Roster Balance & Depth (Equilíbrio do Plantel)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Squad Planner / Squad Depth
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/balance`
> **GDDs**: roster-balance, idol-archetypes-roles, scouting-recruitment

---

## Conceito

No FM, o "Squad Planner" / "Squad Depth" é a tela de planejamento de longo prazo. O Manager vê quais posições (Atacante, Lateral) estão bem cobertas e onde precisa contratar.

No **Star Idol Agency**, esta é a tela de **Equilíbrio de Funções (Roles)**. Se a agência tem 8 Idols com a função "Dancer", mas apenas 1 "Main Vocal", você não conseguirá montar bons grupos para lançar músicas difíceis. É o painel definitivo para decidir as prioridades de recrutamento (Scouting).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento (Ativo) | Grupos | Relatórios | Inscrição               |
|-------------------------------------------------------------------------------------------------|
| Plantel > Planejamento > Equilíbrio de Funções                                                  |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - AS FUNÇÕES (ROLES) ]        | [ CENTRO - GRÁFICO DE PROFUNDIDADE (DEPTH) ]       |
|                                            |                                                    |
| FUNÇÕES DE GRUPO                           | MAIN VOCAL (Vocal Principal)                       |
|                                            | Exigência Principal: Técnica Vocal, Poder Vocal    |
| > Center / Visual                 [ Adeq ] |                                                    |
| > Main Vocal (Ativo)              [ Ruim ] | 1ª ESCOLHA (ESTRELA DO ELENCO)                     |
| > Lead Dancer                     [ Bom  ] | [Avatar] Sakura (21)                               |
| > Variety / Charisma              [ Bom  ] | Capacidade: [★★★★☆]  | Potencial: [★★★★★]          |
| > Sub Vocal                       [ Exc. ] |                                                    |
|                                            | 2ª ESCOLHA (RESERVA / SEGUNDO GRUPO)               |
| FILTRO DE TEMPO                            | [Avatar] Aiko (19)                                 |
| [ Época Atual v ]                          | Capacidade: [★★★☆☆]  | Potencial: [★★★☆☆]          |
| Outras opções:                             |                                                    |
| - Próxima Época (Projeta saídas)           | 3ª ESCOLHA (TRAINEE PROMISSORA)                    |
| - Daqui 2 Anos                             | [Avatar] Haruka (16)                               |
|                                            | Capacidade: [★☆☆☆☆]  | Potencial: [★★★★☆]          |
|--------------------------------------------|                                                    |
| RELATÓRIO DO DIRETOR MÚSICAL               | [ Botão: Adicionar ao Alvo de Recrutamento ]       |
| "Estamos perigosamente dependentes de      | (Abre popup do Scout focado em achar Main Vocals)  |
| Sakura para as vocais principais. Se ela   +----------------------------------------------------+
| não renovar, não teremos quem cante no     |                                                    |
| próximo single. Sugiro buscar trainees."   | [ GRÁFICO DE PIZZA: DISTRIBUIÇÃO DO PLANTEL ]      |
|                                            | (Mostra o % de Idols em cada função na agência)    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Sistema Esquerda-Centro de Planejamento
Similar ao Squad Planner do FM26: a esquerda é um menu vertical listando todas as posições do campo (aqui, as *Roles* de K-pop/J-pop). Você clica na *Role*, e o centro se expande revelando quem preenche aquela vaga.

### 2. Status de Adequação ("Ruim", "Bom", "Excelente")
Na própria barra da esquerda há uma etiqueta colorida. Se você não tem nenhuma "Center" boa, a tag ficará Vermelha ("Ruim"). O jogador bate o olho na lista da esquerda e já sabe qual função precisa de contratação urgente.

### 3. Filtro de "Timeline" (Época Atual vs Próxima)
Recurso essencial do FM Squad Planner: você clica no dropdown "Próxima Época", e o sistema remove automaticamente do centro as idols que têm contrato expirando e não querem renovar, mostrando o buraco que vai ficar no elenco no futuro.

---

## Acceptance Criteria

1. Tela apresenta lista de todas as Funções (Roles) na coluna da esquerda com status de adequação colorido.
2. Coluna central mostra uma lista classificada (1ª, 2ª, 3ª escolha) das Idols mais capacitadas para a Função selecionada na esquerda.
3. Filtro de tempo ("Próxima Época") que omite visualmente quem tem contrato no fim para projeção de risco.
4. Botão de integração direta com o sistema de Recrutamento (Scout) na coluna central caso a posição esteja carente.