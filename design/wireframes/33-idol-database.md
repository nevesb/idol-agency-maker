# Wireframe 33 — Idol Database (Banco de Talentos / Scouting)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Player Search / Scouting Hub
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/market/database`
> **GDDs**: scouting-recruitment

---

## Conceito

No FM, o "Player Search" é o motor de busca do mundo do futebol. 
No **Star Idol Agency**, esta é a aba principal do **Market / Recruitment Domain**. Aqui você tem o banco de dados de todas as cantoras, atrizes e idols amadoras do Japão (e exterior). É aqui que você busca por talentos usando filtros pesados.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | RECRUTAMENTO (Ativo) | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | PESQUISA DE TALENTOS (Ativo) | Shortlists | Atividade | Contratos                 |
|-------------------------------------------------------------------------------------------------|
| Recrutamento > Pesquisa de Talentos                                                             |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - FILTROS AVANÇADOS (EXPANSÍVEL) ]                                            |
|                                                                                                 |
| [ ] Ocultar alvos não interessados em assinar  [ ] Mostrar apenas Agentes Livres                |
|                                                                                                 |
| [ + Adicionar Condição v ] (Idade, Potencial, Atributo Vocal > 15, Reputação...)                |
|                                                                                                 |
| Filtros Ativos: Idade (14 a 18) [X] | Potencial Analisado (Mín. 4 Estrelas) [X]                 |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ/CENTRO - RESULTADOS DA BUSCA ]     | [ COLUNA DIR - RESUMO DO OLHEIRO ]            |
|                                                 |                                               |
| Visão: [ Relatórios de Olheiro v ]              | CHIKA (16)                                    |
| +----+----------------+------+----+-----+-------+ [Avatar] Sem Agência (Amadora)                |
| | Inf| NOME           | IDAD | VOZ| DAN | POT.  |                                               |
| +----+----------------+------+----+-----+-------+ RECOMENDAÇÃO DO OLHEIRO (A)                   |
| | [I]| [Foto] Chika   | 16   | 14 | 8   | 4.5*  | "Excelente contratação. Tem um vocal nato."   |
| | [I]| [Foto] Mai     | 15   | 9  | 15  | 4.0*  | [ Barra de Conhecimento: 100% ]               |
| | [?]| [Foto] Hina    | 18   | ?? | ??  | 3-5*  |                                               |
| | [I]| [Foto] Asuka   | 14   | 11 | 11  | 3.5*  | PRÓS                          CONTRAS         |
| +----+----------------+------+----+-----+-------+ [Verde] Potencial Alto      [Vermelho] Caro   |
|                                                 | [Verde] Jovem                 [Amarelo] Foco  |
| [ Botões de Ação na Base da Tabela ]            |                                               |
| [ Enviar Olheiro ] [ Adicionar à Shortlist ]    | AÇÕES RÁPIDAS                                 |
| [ Convidar para Audição ]                       | [ Abordar para Assinar ] [ Convidar Audição ] |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Novo Hub de Recrutamento
A aba de navegação superior muda para "Recrutamento" (novo Navbar do FM26 que consolida Scouting e Transfers). 

### 2. Filtros Compactos e Modulares
O botão "Adicionar Condição" (Add Condition) abre menus de dropdown para construir a query exata do tipo de garota que o produtor procura (ex: quero uma garota de 15 anos com no mínimo 15 de carisma).

### 3. Névoa de Guerra ("Fog of War")
Como no FM, os atributos não são abertos de graça. Observe a idol "Hina" na tabela: os atributos de voz e dança mostram "??", e o potencial é uma faixa (3 a 5 estrelas) porque a barra de conhecimento do olheiro está baixa. A coluna da direita tem o botão "[ Enviar Olheiro ]" para investigar e abrir os atributos reais.

---

## Acceptance Criteria

1. Tela apresenta lista massiva e paginada de personagens com filtros dinâmicos.
2. Atributos ocultos (??) para idols não observadas pelos *Scouts*.
3. Coluna da direita renderiza o resumo instantâneo da recomendação do Scout sem precisar abrir o perfil completo da idol.