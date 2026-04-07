# Wireframe 61 — History & Milestones (Histórico da Carreira)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Manager History / Milestones Timeline  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/producer/history`  
> **GDDs**: player-manager-system

---

## Conceito

No Football Manager, você passa décadas no mesmo save. A tela de "Milestones" e "History" conta a sua biografia. "Ganhou a Champions em 2024", "Demitido em 2026".
No **Star Idol Agency**, esta é a **Linha do Tempo do Produtor**. Seus prêmios, seus fiascos, as idols lendárias que você descobriu e os álbuns de platina que você produziu.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | CARREIRA (Ativo)         |
|-------------------------------------------------------------------------------------------------|
| Meu Perfil | Relacionamentos | Promessas | HISTÓRICO (Ativo)                                    |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - ESTATÍSTICAS DA CARREIRA ]                                                  |
| Dias no Cargo: 450 | Shows Realizados: 85 | Vitórias em Premiações: 3 | Singles Lançados: 12  |
| Lucro Gerado na Carreira: ¥ 1.500.000.000 | Ídolos Descobertas: 5                               |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - TROFÉUS E PRÊMIOS ]         | [ COLUNA CENTRO/DIR - TIMELINE DE MILESTONES ]     |
|                                            |                                                    |
| GALERIA DE PRÊMIOS (SALA DE TROFÉUS)       | LINHA DO TEMPO DA CARREIRA                         |
|                                            |                                                    |
| [Ícone Troféu Ouro] Oricon Music Awards    | [ 2026 ]                                           |
| Vencedor: Melhor Grupo Pop (2025)          | * Abril: Primeiro show de Estádio (Tokyo Dome).    |
| (Com: Celestial Nine)                      |                                                    |
|                                            | * Janeiro: Contratação Recorde (Reina por ¥ 50M).  |
| [Ícone Disco Platina] Disco de Platina     |                                                    |
| Vendas > 500k: "Starlight Melody"          | [ 2025 ]                                           |
|                                            | * Dezembro: Ganhou "Melhor Grupo Pop" no OMA.      |
| [Ícone Estrela] Produtor do Ano            |                                                    |
| Revista Tokyo Idol News (2024)             | * Setembro: Estreia na Oricon (Top 10).            |
|                                            |                                                    |
| HISTÓRICO DE EMPREGOS                      | * Maio: Primeira integrante formou-se (Graduation).|
| 2023-Presente: Star Idol Agency            |   (Despedida emocionante de Miku, 20 anos).        |
| 2020-2022: Indie Producer (Desempregado)   |                                                    |
|                                            | * Janeiro: Assinou com a Star Idol Agency.         |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Milestone Timeline
O scroll infinito da glória do treinador. No FM26 é uma linha vertical limpa. Registra não apenas títulos, mas "Maior contratação da história do clube" e "1000 dias no cargo". Aqui os *milestones* incluem as "Graduações" (Despedidas) marcantes de idols e quebras de recordes de vendas.

### 2. Trophy Cabinet (Sala de Troféus)
Representação visual dos discos de ouro, platina e prêmios da indústria na coluna da esquerda, servindo como o "Hall of Fame" definitivo do save do jogador.

---

## Acceptance Criteria

1. Timeline vertical ordenando cronologicamente os eventos marcantes da carreira (Contratações recordes, Prêmios, Shows épicos).
2. Galeria de "Troféus/Discos" persistente independente do grupo de idols com que foram conquistados.
3. Resumo estatístico denso no topo da tela (Lucro Gerado, Dias no Cargo).