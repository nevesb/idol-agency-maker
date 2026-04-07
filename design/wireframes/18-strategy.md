# Wireframe 18 — Strategy & Vision (Visão e Estratégia da Agência)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Club Vision / Board Expectations
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/strategy`
> **GDDs**: agency-strategy, board-expectations

---

## Conceito

Toda agência de entretenimento tem investidores (ou um Board de diretores) que colocam o dinheiro inicial. No FM, essa tela se chama "Club Vision". 

No **Star Idol Agency**, esta tela mostra a **Filosofia da Agência** e o **Plano de 5 Anos**. É aqui que o jogador sabe pelo que será demitido se falhar (ex: O investidor quer "Grupos fofos (Cute)" e não "Grupos Edgy").

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Instalações | Finanças | VISÃO E ESTRATÉGIA (Ativo) | Histórico                   |
|-------------------------------------------------------------------------------------------------|
| Clube > Visão e Estratégia                                                                      |
+-------------------------------------------------------------------------------------------------+
| [ CULTURA DA AGÊNCIA ]                                                                          |
| Objetivos obrigatórios ou preferidos pelos Investidores/Diretoria.                              |
|                                                                                                 |
| [Ícone Verde - Requerido] Assinar Idols com alta juventude (Trainees < 16 anos)                 |
| [Ícone Verde - Requerido] Focar na criação de músicas com temática "Pop/Cute"                   |
| [Ícone Amarelo - Preferível] Realizar shows frequentes para engajamento local                   |
|                                                                                                 |
|-------------------------------------------------------------------------------------------------|
| [ PLANO DE 5 ANOS (TIMELINE) ]                                                                  |
|                                                                                                 |
| [ Época Atual (2026) ]                                                                          |
|   - Sobreviver ao primeiro ano fiscal sem dívidas [Importância: Crítica]                        |
|   - Lançar o Single de Debut de um grupo [Importância: Alta]                                    |
|                                                                                                 |
| [ Ano 2 (2027) ]                                                                                |
|   - Crescer reputação para nível Regional [Importância: Média]                                  |
|   - Colocar um single no Top 10 das paradas Oricon [Importância: Média]                         |
|                                                                                                 |
| [ Ano 3 (2028) ]                                                                                |
|   - Realizar Primeira Turnê Nacional [Importância: Alta]                                        |
|                                                                                                 |
| [ Ano 4 (2029) ] -> Expandir instalações do centro de treino.                                   |
| [ Ano 5 (2030) ] -> Estabelecer a agência como "Líder de Mercado" Nacional.                     |
|                                                                                                 |
|-------------------------------------------------------------------------------------------------|
| [ CONFIANÇA DOS INVESTIDORES (BOARD CONFIDENCE) ]                                               |
|                                                                                                 |
| Confiança Global: [Barra verde: 85% - Intocável]                                                |
|                                                                                                 |
| Desempenho Financeiro:     [Barra: 90%] "A diretoria está deliciada com o controle de gastos."  |
| Desempenho dos Lançamentos:[Barra: 75%] "O último single foi ok, mas esperamos mais."           |
| Cultura da Agência:        [Barra: 80%] "Você está seguindo a filosofia de base perfeitamente." |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Cultura e Identidade (Lista de Regras)
Uma lista iconográfica clara. O FM26 deixa explícito o que é **Requerido** (falhar nisso causa demissão), o que é **Preferível** e o que é irrelevante. Na agência de idol, pode envolver o gênero musical a produzir, política de relacionamentos (dating ban), etc.

### 2. Timeline do Plano de 5 Anos
Apresentado no FM como uma linha do tempo vertical ou um fluxo de blocos ano a ano. Serve como o principal guia de longo prazo do jogador. Dá a sensação de que a agência tem um *roadmap* de IPO.

### 3. Painel de Confiança em Barras
Painel direto e reto: o quanto os donos do dinheiro gostam do seu trabalho. Separado em categorias (Finanças, Qualidade dos Shows, Fidelidade à Cultura).

---

## Acceptance Criteria

1. Tela apresenta a Visão/Cultura, Plano de 5 anos e a Confiança da Diretoria na mesma view (com scroll se necessário).
2. Uso do top navigation sob a categoria global `Clube`.
3. Integração com a lógica FM26: expectativas do Board moldam o desafio da run (ex: uma run na agência X é diferente da agência Y por causa do Board).