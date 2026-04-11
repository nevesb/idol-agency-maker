# Wireframe 65 — Security & Scandals (Segurança e Risco de Imagem)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Board Confidence / Fan Reaction / Press Officer  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings/security`  
> **GDDs**: event-scandal-generator.md, agency-staff-operations.md

---

## Conceito

No FM, jogadores insatisfeitos causam problemas de moral no vestiário e vazam histórias para a imprensa (Player Leaks).
No **Star Idol Agency**, esta é a tela de **Segurança e Relações Públicas (Escândalos)**. A cultura Idol é frágil e obsessiva. Vazamento de fotos namorando (Dating Ban quebrado), brigas internas ou *Sasaengs* (fãs obsessivos) invadindo a privacidade. Esta tela é o termômetro de "crise de RP".

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| Rankings | Finanças Avançadas | Histórico Oricon | Auditoria Médica | SEGURANÇA (Ativo)         |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - NÍVEL DE AMEAÇA DE IMAGEM ]                                                 |
| Risco Global de Escândalo: [ Amarelo ] Moderado | Cobertura da Mídia de Fofoca: ALTA            |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - AMEAÇAS E INVESTIGAÇÕES ]   | [ COLUNA CENTRO/DIR - GESTÃO DE CRISE ]            |
|                                            |                                                    |
| MONITORAMENTO DE COMPORTAMENTO (Idols)     | CRISE ATIVA: "FOTOS VAZADAS DA AIKO"               |
|                                            | Status: A revista "Shukan Bunshun" ameaça publicar |
| [!] SUSPEITA DE QUEBRA DE REGRA (Dating)   | fotos de Aiko num encontro secreto.                |
| Aiko tem sido vista saindo tarde sozinha.  |                                                    |
| O nível de discrição dela é: Muito Baixo.  | AÇÕES DE RELAÇÕES PÚBLICAS (Press Officer)         |
| [ Botão: Contratar Investigador (¥ 100k) ] |                                                    |
| [ Botão: Avisar Aiko Oficialmente ]        | ( ) Negar tudo agressivamente.                     |
|                                            |     (Risco: Perda colossal de reputação se provado)|
| CONFLITOS INTERNOS (Vazamentos)            |                                                    |
| Yumi e Sakura discutiram alto no estúdio.  | ( ) Pagar a revista para não publicar.             |
| Risco de "Leak" (Vazamento para a mídia)   |     Custo: ¥ 5.000.000 (Risco financeiro)          |
| por parte de staff insatisfeito: Médio     |                                                    |
|                                            | ( ) Forçar Aiko a se desculpar publicamente.       |
| SEGURANÇA FÍSICA (Fãs Obsessivos)          |     (Risco: Aiko pode desenvolver Burnout extremo) |
| Nível do Esquema de Segurança: Básico      |                                                    |
| "Recomendamos investir em mais seguranças  | [ Botão Gigante Vermelho: CONFIRMAR ESTRATÉGIA ]   |
| nos eventos ao vivo para evitar stalkers." |                                                    |
| [ Botão: Aumentar Orçamento de Segurança ] |----------------------------------------------------|
|                                            | HISTÓRICO DE CRISES RESOLVIDAS                     |
|                                            | 14/03/2026: Vazamento de música (Abafado)          |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Risk Board (Threat Level)
Igual a tela de "Board Confidence" (Nível de Segurança no Emprego), aqui é o nível de segurança da *Agência*. O jogo roda rolagens de dados (RNG) baseadas na "Discrição" das Idols. Se a Aiko tem Discrição 2 (descuidada) e uma regra de "Dating Ban" ativa, o evento de crise vai estourar na coluna da direita.

### 2. Crisis Resolution (Gestão de Mídia)
Quando um evento ocorre, a UI do FM costuma te dar respostas de múltipla escolha para a imprensa. Na coluna central, o "Press Officer" dá as opções. Cada escolha tem um peso severo: rasgar 5 milhões de ienes para salvar a reputação, ou destruir a mente da garota forçando uma humilhação pública em vídeo.

---

## Acceptance Criteria

1. Tela apresenta um monitoramento passivo de comportamento e riscos físicos (Stalkers/Fãs Obsessivos).
2. Seção de Resolução de Crises ativa (Painel Direito) ativada por eventos RNG gerados pelas falhas comportamentais ou sociais do elenco.
3. Decisões de RP (Relações Públicas) apresentam escolhas de alto impacto que sacrificam ou dinheiro, ou fama, ou a saúde mental da idol.