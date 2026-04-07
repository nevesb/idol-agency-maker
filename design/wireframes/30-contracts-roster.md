# Wireframe 30 — Contracts Roster (Visão Contratual)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Squad View (Contracts Filter) + Contract Negotiation
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/contracts`
> **GDDs**: contract-system, finance-economy

---

## Conceito

No FM, o gerenciamento de contratos ocorre numa "View" (Visualização) específica da tela de Squad. No **Star Idol Agency**, gerir contratos não é só sobre o salário (Wage), é também sobre o **Repasse de Lucros (Revenue Share)**, **Cláusulas Comportamentais (Dating Ban, Uso de Redes Sociais)** e o tempo até a expiração.

Renovar com uma estrela prestes a expirar custa muito mais caro do que renovar quando ela ainda tem 2 anos de contrato.

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
| FILTROS RÁPIDOS: [ ] Esconder Trainees   [X] Mostrar Apenas < 12 Meses para Expirar             |
| DROPDOWN DE VISÃO: [ Contratos v ]                                                              |
|                                                                                                 |
| [ COLUNA ESQUERDA/CENTRO - TABELA DE CONTRATOS ]        | [ COLUNA DIREITA - CONTEXTO RÁPIDO ]  |
|                                                         |                                       |
| +---+------------------+---------+---------+----------+ | SAKURA (21)                           |
| | S | NOME             | STATUS  | EXPIRA  | SALÁRIO  | | [Avatar] Líder da Agência             |
| +---+------------------+---------+---------+----------+ |                                       |
| |[ ]| [Avatar] Sakura  | Seguro  | 2 anos  | ¥50k/m   | | RESUMO DO CONTRATO                    |
| |[X]| [Avatar] Aiko    | Alerta  | 6 meses | ¥40k/m   | | Tipo: Tempo Integral (Ídolo)          |
| |[ ]| [Avatar] Yumi    | Seguro  | 3 anos  | ¥35k/m   | | Salário Fixo: ¥50.000 / mês           |
| |[ ]| [Avatar] Reina   | Crítico | 1 mês   | ¥120k/m  | | Share de Shows: 10%                   |
| |[ ]| [Avatar] Haruka  | Trainee | -       | Bolsa    | | Share de Merch: 5%                    |
| +---+------------------+---------+---------+----------+ |                                       |
|                                                         | CLÁUSULAS ESPECIAIS                   |
| [ Botões de Ação - Aiko Selecionada ]                   | [X] Proibição de Relacionamento       |
| [ Oferecer Novo Contrato ] [ Discutir Contrato ]        | [ ] Controle Total de Redes Sociais   |
| [ Dispensar (Pagar Multa) ]                             |                                       |
|                                                         | STATUS DE RENOVAÇÃO                   |
|                                                         | "Aiko está exigindo que a cláusula de |
|                                                         | Proibição de Namoro seja removida     |
|                                                         | antes de iniciar conversas."          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Alternativa da Tabela Principal
Em vez de criar uma "Página" nova do zero, o FM usa a Dropdown "Views" (Visões) para transformar a Tabela de Plantel numa Tabela Financeira. A navegação Breadcrumb e Tab continua a mesma do Wireframe 23, mas as colunas mudam para foco contratual.

### 2. Status Colorido
A coluna de *Status* e *Expira* usa cores cruciais do FM26:
- **Verde**: Seguro (> 1 ano)
- **Amarelo/Laranja**: Alerta (< 6 meses)
- **Vermelho**: Crítico (< 1 mês ou "Unhappy" querendo sair).

### 3. Painel de Contexto Direito
O verdadeiro "Pulo do Gato" da UI moderna do FM. Você clica na Aiko na tabela, e a barra da direita desce um resumo do porquê o contrato dela está empacado (ela quer remover o Dating Ban). No FM antigo você tinha que clicar nela -> ir no perfil -> ir na aba contrato. Aqui, está tudo na *Surface* da UI.

---

## Acceptance Criteria

1. Tela construída em cima da estrutura da `23-roster-main-table` usando o seletor de *View*.
2. Apresentação clara do "Tempo Restante" e "Salário" com tags de urgência coloridas.
3. Painel direito mostrando a quebra do contrato (Fixo + Shares/Royalties) e Cláusulas comportamentais.
4. Call-to-action visível no painel direito apontando o obstáculo principal para uma renovação.