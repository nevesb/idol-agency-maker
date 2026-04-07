# Wireframe 72 — Interaction History (Histórico de Promessas e Relacionamento)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Player History / Interaction Log  
> **Resolução alvo**: Modal Overlay ou Aba Secundária  
> **Rota**: `/agency/roster/idol/:id/interaction-log`  
> **GDDs**: player-manager-system, social-system

---

## Conceito

No FM, se você multar um jogador 3 vezes no ano e ele odiar você, existe um log contando essa história.
No **Star Idol Agency**, esta é a tela de **Log de Interação (Interaction History)**. Ela fica acoplada ao Perfil da Idol (Wireframe 08). É um registro eterno e imutável das promessas feitas, brigas, conversas do Modal 68, multas por atraso e elogios recebidos. Serve como um diário do relacionamento entre Produtor e Idol.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | PLANTEL (Ativo) | Recrutamento | Dia de Show | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Plantel | AIKO | Visão Geral | Treino | Histórico | INTERAÇÕES (Ativo)                          |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - RESUMO DA RELAÇÃO ]                                                         |
| AIKO (16 anos) | Status de Relacionamento Contigo: [Vermelho] Decepcionada                      |
| Nível de Confiança: 20% (Muito Baixo) | Dias desde a última conversa privada: 12                |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ÚNICA - TIMELINE DESCENDENTE DE LOGS ]                                                 |
|                                                                                                 |
| 14/04/2026 - PÓS-SHOW: CONVERSA PRIVADA                                                         |
| Aiko confrontou você sobre a falta de espaço no Setlist.                                        |
| > Sua Resposta (Tonalidade: Assertivo): "O grupo precisava focar na dança desta vez."           |
| > Reação dela: Não aceitou a justificativa e saiu frustrada.                                    |
| [ Impacto no Moral: -15% ]                                                                      |
|                                                                                                 |
| 02/04/2026 - EVENTO DE DISCIPLINA (Vazamento / Quebra de Regra)                                 |
| Aiko foi flagrada por um tabloide.                                                              |
| > Sua Ação (Gestão de Crise): Você a obrigou a gravar um vídeo de desculpas público.            |
| > Reação dela: Humilhada. Começou a desconfiar da sua proteção.                                 |
| [ Impacto na Pressão Mental: +40% ]                                                             |
|                                                                                                 |
| 15/01/2026 - PROMESSA CONTRATUAL QUEBRADA                                                       |
| O prazo para lançar Aiko como Main Vocal expirou.                                               |
| [ Impacto de Confiança: Queda drástica de Status de 'Neutro' para 'Decepcionada' ]              |
|                                                                                                 |
| 12/12/2025 - ELOGIO NO TREINO                                                                   |
| Você elogiou o esforço dela nas aulas de canto durante o fim de semana.                         |
| > Reação dela: Ficou genuinamente feliz com o reconhecimento.                                   |
| [ Impacto no Moral: +5% ]                                                                       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Persistent Log Memory
Os jogos de management modernos guardam a memória das decisões para o jogador não achar que o jogo é "aleatório" ou roubou contra ele. O log serve para mostrar ao produtor: "Você quebrou a promessa dela em Janeiro, humilhou ela em Abril e a ignorou no último show. Por isso ela te odeia".

### 2. Causation and Effect (Transparência de Impacto)
Logo abaixo do texto descritivo (narrativa), a UI do FM embute o dado puro entre colchetes numéricos: `[ Impacto no Moral: -15% ]`. Isso mistura a leitura do RPG com o cérebro matemático de planilhas de quem joga Football Manager.

---

## Acceptance Criteria

1. Lista ordenável (Data) armazenando permanentemente os eventos interativos sociais, promessas, multas e elogios entre o jogador e a entidade.
2. Descrição narrativa do evento combinada com a métrica invisível que foi alterada no backend do jogo (ex: +/- X% Moral).
3. Sumário visual no cabeçalho ditando a consequência de longo prazo dessa cadeia de eventos (Nível de Confiança global).