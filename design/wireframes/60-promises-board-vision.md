# Wireframe 60 — Promises & Board Vision (Promessas)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Promises / Board Vision Tracker  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/producer/promises`  
> **GDDs**: dialogue-system.md

---

## Conceito

A mecânica que destrói mais carreiras no Football Manager: "Você prometeu que eu jogaria na minha posição favorita". Falhou? O jogador exige transferência.
No **Star Idol Agency**, esta é a tela de **Acompanhamento de Promessas**. Se você convenceu uma Idol famosa a assinar jurando que faria um Solo pra ela em 6 meses, a bomba relógio está armada aqui. Falhe, e ela arruinará o moral do grupo ou romperá contrato.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | CARREIRA (Ativo)         |
|-------------------------------------------------------------------------------------------------|
| Meu Perfil | Relacionamentos | PROMESSAS (Ativo) | Histórico                                    |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - PROMESSAS ÀS IDOLS (PLANTEL) ]| [ COLUNA CENTRO/DIR - PROMESSAS À DIRETORIA ]    |
|                                            |                                                    |
| STATUS DAS PROMESSAS PESSOAIS              | VISÃO DO CLUBE (BOARD VISION)                      |
|                                            |                                                    |
| [Avatar] Reina                             | CULTURA DA AGÊNCIA (Promessas Contratuais)         |
| Promessa: "Garantir 2 lançamentos solos    | > Contratar apenas jovens com menos de 16 anos.    |
| até o final da temporada atual."           |   Status: [Verde] Cumprindo Rigorosamente          |
| Status: [Amarelo] Tempo Acabando! (2 Meses)|                                                    |
| Progresso: 1/2 lançados.                   | > Focar em Shows ao vivo em vez de Mídia/TV.       |
| Consequência: Pedido de Transferência.     |   Status: [Verde] Cumprindo (70% da receita)       |
|                                            |                                                    |
| [Avatar] Miku                              | PLANO DE 5 ANOS (Exigências em Andamento)          |
| Promessa: "Torná-la a Center do G.A"       |                                                    |
| Status: [Vermelho] QUEBRADA!               | Fim desta Temporada:                               |
| Reação: Extremamente infeliz. Falando mal  | > Alcançar o Top 5 Nacional de Reputação.          |
| de você para o resto do elenco.            |   Status Atual: Top 12 (Abaixo do esperado)        |
|                                            |                                                    |
| [Avatar] Kaho (Trainee)                    | Fim de 2028:                                       |
| Promessa: "Promover ao Grupo Principal     | > Fazer um Show de Estádio (Dome).                 |
| em menos de um ano."                       |   Status: Planejando...                            |
| Status: [Verde] Em progresso tranquilo.    |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. The Promise Tracker (Contador de Prazo)
Assim como no FM a UI alerta que faltam "2 Months" para provar algo, a coluna esquerda mantém o produtor acordado. Se a linha ficar Vermelha, a mecânica foi quebrada e a relação (Wireframe 59) entra em colapso.

### 2. Board Vision & Culture (Cultura do Clube)
A direita rastreia as Promessas Institucionais que você assumiu na entrevista de emprego (New Game Wizard). A agência quer "Só Jovens Sub-16". Se você contratar uma veterana de 24 anos, a diretoria te avisa ("Status Falhando") que você quebrou a cultura da empresa, podendo ser demitido mesmo se der lucro.

---

## Acceptance Criteria

1. Painel esquerdo dedicado às promessas contratuais e de negociação feitas fisicamente às integrantes do plantel.
2. Contadores regressivos explícitos (Status Verde/Amarelo/Vermelho) associados ao tempo limite da promessa.
3. Painel direito ancorado na visão de diretoria (Board Vision), rastreando a cultura exigida pela presidência e metas de longo prazo (5 anos).