# Wireframe 71 — Game Setup & Rules (Configurações da Liga)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Competition Rules / Game Setup Info  
> **Resolução alvo**: 1920×1080 (PC-first) ou Modal/Sidebar  
> **Rota**: `/game/rules`  
> **GDDs**: finance-economy, agency-growth

---

## Conceito

No FM, você tem uma tela escondida chamada "Regras da Competição". Ela diz quantos estrangeiros você pode escalar, o limite de teto salarial da MLS, e as premiações da liga.
No **Star Idol Agency**, esta é a tela de **Regras da Indústria e Ambiente**. Uma consulta técnica de como o universo do seu *save* funciona. Quais os limites de idade para assinar com a TV? Qual o imposto sobre venda de merchandise que o governo asiático cobra?

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira | MENU DO JOGO(V) |
|-------------------------------------------------------------------------------------------------|
| Salvar Jogo | Preferências | REGRAS DA INDÚSTRIA (Ativo) | Adicionar Produtor                   |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - CONTEXTO DO SAVE ]                                                          |
| País: Japão | Ano: 2026 | Dificuldade Econômica: Realista | Moeda: JPY (Iene) ¥               |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - REGRAS DE CONTRATAÇÃO ]     | [ COLUNA CENTRO/DIR - REGULAÇÕES DE MÍDIA E TAXAS ]|
|                                            |                                                    |
| REGULAMENTAÇÃO DE IDADE E TRABALHO         | REGRAS DE RADIODIFUSÃO E TELEVISÃO                 |
|                                            |                                                    |
| > Sub-15: Limite de Carga Horária          | > Restrição Noturna: Idols abaixo de 18 anos não   |
| Idols com 15 anos ou menos não podem fazer |   podem aparecer em programas de TV ao vivo ou     |
| ensaios ou shows após as 20h00.            |   shows de rádio após as 22h00.                    |
|                                            |                                                    |
| > Idade Mínima de Estreia:                 | PREMIAÇÕES DO MERCADO (Música)                     |
| 12 anos completos (Trainees).              | > Oricon #1 Single: Premiação de ¥ 50.000.000      |
|                                            | > Oricon #1 Álbum: Premiação de ¥ 100.000.000      |
| REGRAS DE CONTRATO (MERCADO INTERNO)       | > Japan Record Awards (Vencedor): ¥ 250.000.000    |
|                                            |                                                    |
| > Proteção de Base: Não é possível roubar  | IMPOSTOS E FATURAMENTO (TAXES)                     |
|   trainees sem contrato profissional sem   | > Imposto de Renda Corporativo Anual: 30% sobre o  |
|   pagar a Taxa de Compensação de Treino.   |   Lucro Líquido no fechamento de Dezembro.         |
| > Duração Máxima de Contrato: 5 Anos.      | > Porcentagem de Distribuidora Física (CDs): 15%   |
|                                            | > Distribuição de Streaming (Spotify/Apple): 30%   |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Hardcore Technical Transparency
O jogador de management adora saber a matemática por trás do universo. O FM diz exatamente a porcentagem de retenção de impostos. Se o produtor vender 1 milhão de álbuns físicos, esta tela avisa que a Distribuidora vai comer 15% antes do dinheiro cair no cofre da agência.

### 2. Constraints de Idade (Realismo)
O mercado idol coreano/japonês real tem limitações estritas de trabalho noturno para menores. A exibição dessa regra impede o jogador de tentar escalar a Kaho (13 anos) para o show da meia-noite, avisando que a lei in-game bloqueará a ação.

---

## Acceptance Criteria

1. Painel fixo de referência (não editável durante a campanha) exibindo as regras econômicas e sociais do save atual.
2. Descrição detalhada dos impostos, taxas de distribuição e premiações exatas das tabelas de sucesso.
3. Listagem das limitações laborais atreladas às idades das idols (simulando regulamentações da vida real asiática).