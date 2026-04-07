# Wireframe 23 — Roster Main Table (A Tabela Geral de Plantel)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Squad View / Plantel Principal
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster`
> **GDDs**: roster-management, contract-system

---

## Conceito

A clássica tela de "Squad" do Football Manager. No FM26, as listas mortas deram lugar a *Views* altamente customizáveis, muitas vezes dividindo espaço com pequenos painéis de contexto (3-column layout dependendo da aba). 

No **Star Idol Agency**, esta é a tabela mestre de todas as Idols e Trainees sob contrato. É aqui que o Produtor verifica o status moral, físico, contratual e a função (Role) de cada artista.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Táticas/Grupos | Relatórios | Inscrição                                |
|-------------------------------------------------------------------------------------------------|
| Plantel > Visão Geral                                                                           |
+-------------------------------------------------------------------------------------------------+
| FILTROS RÁPIDOS: [X] Esconder Emprestadas/Ausentes  [ ] Mostrar Trainees                        |
| DROPDOWN DE VISÃO: [ Personalizada: "Visão Geral Star Idol" v ]                                 |
|                                                                                                 |
| +---+---+---+------------------+-----+----+-------+-------+---------+--------+------------------+
| | S | M | C | NOME (Info)      | Id. | Gru| Papel | Nível | Moral   | Fadiga | Contrato         |
| +---+---+---+------------------+-----+----+-------+-------+---------+--------+------------------+
| | [ ] | R | + | [Avatar] Sakura  | 21  | G1 | Lider | 4.5*  | Excelente| Baixa | ¥50k/m (2 anos)  |
| | [ ] |   |   | [Avatar] Aiko    | 19  | G1 | Vocal | 4.0*  | Boa      | Alta  | ¥40k/m (1 ano)   |
| | [X] |   | W | [Avatar] Yumi    | 18  | G1 | Dança | 3.5*  | Baixa    | Média | ¥35k/m (3 anos)  |
| | [ ] |   |   | [Avatar] Reina   | 22  | -  | Solo  | 5.0*  | Perfeita | Média | ¥120k/m(6 meses) |
| | [ ] | I |   | [Avatar] Haruka  | 16  | Tr | Tr.   | 2.0*  | Boa      | Leve  | ¥10k/m (Bolsa)   |
| +---+---+---+------------------+-----+----+-------+-------+---------+--------+------------------+
|                                                                                                 |
| [ Botões de Ação na Base (Agem sobre as Idols Selecionadas via Checkbox "S") ]                  |
| [ Oferecer Novo Contrato ]  [ Mover para Grupo ]  [ Enviar para Treino Extra ]  [ Dispensar ]   |
+-------------------------------------------------------------------------------------------------+
| [ WIDGET INFERIOR OU DIREITO (CONTEXTO DA SELEÇÃO ATUAL) ]                                      |
| YUMI (18)                                                                                       |
| Alerta (W): Preocupada com o baixo tempo de tela no último clipe.                               |
| Recomendação do Staff: "Converse com ela ou dê uma linha solo no próximo evento."               |
+-------------------------------------------------------------------------------------------------+
```

## Legenda das Colunas Base (Modo FM)

- **S (Select)**: Checkbox clássico do FM para ações em lote.
- **M (Moral)**: Ícones coloridos. "R" (Vermelho) = Revoltada, "I" (Azul) = Incerta/Preocupada. Vazio = OK/Verde.
- **C (Condição/Fadiga)**: Ícones de bateria ou coração. "+" = Lesionada/Doente. "W" = Warning (Risco de Lesão/Burnout).
- **Nome (Info)**: O tradicional botão `[i]` ou apenas passar o mouse abre o Quick Profile (como no staff).
- **Papel (Role)**: O *Playing Role* do FM. Aqui traduzido para Center, Main Vocal, Lead Dancer, Trainee, etc.

## Componentes FM26 Aplicados

### 1. View Customizável (Tabela Data-Packed)
O FM26 continua honrando a tabela como a melhor forma de visualizar o elenco. A tabela é zebrada, tem ícones compactos nas primeiras colunas para não poluir, e permite salvar diferentes "Visualizações" (Ex: Visão Contratual, Visão de Treino, Visão Médica).

### 2. Status Dinâmico (Moral e Fadiga)
A remoção de barras de 0 a 100% no FM26 deu espaço a "Corações" ou ícones coloridos. Se a idol está exausta, um coração laranja ou vermelho pulsante aparece. Se ela está infeliz, aparece uma carinha frustrada (o equivalente ao `PRC` - Preocupado do FM).

### 3. Painel de Ações Diretas
Ao marcar o Checkbox de 1 ou 3 Idols, o rodapé da tela (ou a coluna da direita, se houver espaço na resolução) acende com ações em lote, sem precisar usar o botão direito do mouse o tempo todo.

---

## Acceptance Criteria

1. Tela reflete uma tabela expansível com customização de colunas (View Dropdown).
2. Usa ícones padronizados (FM-like) para Moral e Condição Física nas colunas da esquerda para leitura rápida.
3. Incorpora checkboxes para ações em massa (ex: Renovar contrato de 3 trainees de uma vez).
4. Possui filtros rápidos na parte superior para esconder Trainees ou Idols Inativas (equivalente ao filtro de "Fora do Clube/Emprestados" do FM).