# Wireframe 29 — Social Groups & Dynamics (Dinâmica de Grupo)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Dynamics / Hierarchy & Social Groups
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/roster/dynamics`
> **GDDs**: happiness-wellness, roster-balance, idol-archetypes-roles

---

## Conceito

No FM, "Dynamics" é onde o jogo cobra o preço das suas decisões humanas. Se você irritar o capitão do time, o balneário inteiro se volta contra você. 

No **Star Idol Agency**, esta é a tela de **Clima, Hierarquia e Panelinhas**. Se você promover uma Trainee impopular para ser a *Center* de um grupo no lugar de uma Veterana adorada pelas outras Idols, a coesão do grupo vai desabar, gerando performances ruins e até escândalos de bullying (panelinhas isolando a novata).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Táticas/Grupos | Treino | DINÂMICA (Ativo) | Relatórios | Inscrição             |
|-------------------------------------------------------------------------------------------------|
| Plantel > Dinâmica > Visão Geral                                                                |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO MACRO (WIDGETS) ]     | [ CENTRO - A HIERARQUIA ]  | [ DIR - PANELINHAS ]  |
|                                            |                            |                       |
| COESÃO DO GRUPO                            | LÍDERES DA AGÊNCIA         | GRUPO SOCIAL PRINCIPAL|
| [Barra Verde: Excelente]                   | [Avatar] Sakura (G1)       | (12 Membros)          |
| "As idols estão super entrosadas após a    | [Avatar] Reina (Solo)      | Líder: Sakura         |
| última turnê de sucesso."                  |                            | Clima: Muito Bom      |
|                                            |----------------------------|                       |
| AMBIENTE DA AGÊNCIA                        | ALTAMENTE INFLUENTES       | GRUPO SECUNDÁRIO A    |
| [Barra Amarela: Bom]                       | [Avatar] Aiko (G1)         | (5 Membros)           |
| "Algumas trainees estão insatisfeitas com  | [Avatar] Yumi (G1)         | Líder: Yumi           |
| a falta de atenção do corpo técnico."      | [Avatar] Kaho (Trainee)    | Clima: Moderado       |
|                                            |                            | [!] Yumi está infeliz |
| APOIO AO PRODUTOR (Você)                   |----------------------------|     e influenciando   |
| [Barra Verde: Excelente]                   | JOGADORAS INFLUENTES       |     este grupo contra |
| "A maioria do plantel respeita muito a sua | (8 Idols listadas...)      |     você.             |
| liderança e histórico de sucessos."        |                            |                       |
|                                            |----------------------------| GRUPOS ISOLADOS       |
| PROMESSAS QUEBRADAS                        | OUTRAS IDOLS / NOVATAS     | [Avatar] Haruka (Nova)|
| Nenhuma promessa pendente ou quebrada.     | (14 Idols listadas...)     | Sofrendo para se      |
|                                            |                            | entrosar com o resto. |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Painel de Status Triplo (Esquerda)
FM26 consolida o "Match Cohesion", "Club Atmosphere" e "Managerial Support" nestes três widgets claros. Coesão alta afeta a performance dos shows (sincronia de dança). Ambiente afeta o treino. Apoio afeta a sua chance de ser demitido.

### 2. A Pirâmide de Hierarquia (Centro)
Uma visualização em árvore/lista de quem manda. Se uma "Líder da Agência" (Top Tier) fica com o status Moral vermelho (infeliz), ela arrasta o "Apoio ao Produtor" pra baixo. Tocar o contrato delas exige muito cuidado.

### 3. Social Groups / Panelinhas (Direita)
O vestiário não é unido. O painel da direita agrupa as Idols em blocos baseados em idade, tempo de agência e personalidade. Identificar "Outcasts" (Grupos Isolados) é essencial para o Produtor intervir antes que a Idol sofra burnout social ou *graduate* (peça demissão) precocemente.

---

## Acceptance Criteria

1. Painéis esquerdo com barras indicadoras de nível de Coesão, Ambiente e Apoio.
2. Coluna central apresentando uma estrutura de árvore hierárquica (Líderes no topo, Novatas na base).
3. Coluna direita evidenciando sub-grupos (panelinhas), destacando se alguma líder de sub-grupo está criando um motim (Efeito cascata de Moral).