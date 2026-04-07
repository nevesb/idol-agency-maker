# Wireframe 42 — Job Board (Quadro de Ofertas Comerciais)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Job Board / Affiliations / Scouting List
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/jobs`
> **GDDs**: schedule-agenda, agency-growth

---

## Conceito

No FM, você tem listas de amistosos para marcar ou clubes afilhados.
No **Star Idol Agency**, esta é a central de **Jobs (Ofertas Comerciais)**. Marcas de roupas, canais de TV, programas de rádio e produtoras de Dorama (novela) mandam propostas aqui. O produtor precisa preencher essas vagas com suas Idols para gerar dinheiro extra e, principalmente, "Fama" (Exposure) fora dos palcos musicais.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | Grupos | OPERAÇÕES (Ativo) | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Operações > Quadro de Jobs                                                              |
+-------------------------------------------------------------------------------------------------+
| FILTROS RÁPIDOS: [X] Mostrar Apenas Jobs Adequados para o meu Roster  [ ] Ocultar Jobs Pagos    |
| DROPDOWN DE ORDENAÇÃO: [ Mais Rentáveis Primeiro v ]                                            |
|                                                                                                 |
| [ COLUNA ESQUERDA/CENTRO - TABELA DE OFERTAS ]           | [ COLUNA DIR - DETALHE DA OFERTA ]   |
|                                                          |                                      |
| +---+--------------------+------+-----+-------+--------+ | COMERCIAL DE REFRIGERANTE "SPARK"    |
| | S | CLIENTE/JOB        | TIPO | DURA| PAGA. | FAMA   | | Tipo: Publicidade TV (Nacional)      |
| +---+--------------------+------+-----+-------+--------+ | Cliente: Spark Soda Co.              |
| |[ ]| Spark Soda Co.     | TV   | 2 D | ¥ 2M  | ++++   | |                                      |
| |[X]| Rádio FM Tokyo     | Rád  | 1 D | ¥ 100k| ++     | | EXIGÊNCIAS DO CLIENTE                |
| |[ ]| Revista "Idol Pop" | Foto | 1 D | ¥ 50k | +      | | > Mínimo de Carisma: 15              |
| |[ ]| Drama "Amor Esc."  | Atua | 10D | ¥ 1M  | +++++  | | > Aparência (Visual): 14             |
| |[ ]| Abertura Loja (PR) | Pres | 1 D | ¥ 300k| +      | | > Gênero: Feminino                   |
| +---+--------------------+------+-----+-------+--------+ |                                      |
|                                                          | RECOMPENSAS                          |
|                                                          | > Pagamento: ¥ 2.000.000 à vista     |
| [ Botões de Ação na Base da Tabela ]                     | > Aumento de Fama Nacional: Alto     |
| [ Aceitar e Agendar Idol ]  [ Recusar Oferta ]           | > Custo de Tempo: 2 Dias Seguidos    |
| [ Contraproposta (Pedir mais dinheiro) ]                 |                                      |
|                                                          | CANDIDATAS IDEAIS (DO SEU PLANTEL)   |
|                                                          | [Foto] Sakura (Carisma 18)           |
|                                                          | [Foto] Reina (Carisma 16)            |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Tabela List-View com Contexto (Split View)
Ao estilo clássico das telas de mercado do FM26: uma grande lista interativa na esquerda, com o detalhe super completo na direita. Você varre as ofertas com a seta do teclado e o painel direito pisca as exigências de cada comercial.

### 2. Matching de Candidatas ("Adequação")
A coluna da direita não te deixa sofrendo para adivinhar quem mandar para o Job. A IA de Operações já varre o seu elenco e lista em "Candidatas Ideais" as idols que batem com as exigências daquela marca. Se você não tiver ninguém com Carisma 15, a marca nem te manda a oferta (ou envia um Job pior).

### 3. Negociação Simplificada (Contraproposta)
Adiciona o botão "Contraproposta", usando o atributo mental do Manager (Produtor) para pedir 3 milhões ao invés de 2. Se a marca não gostar, retira o Job da mesa.

---

## Acceptance Criteria

1. Tela listando ofertas em formato de tabela, ordenável por pagamento, fama ou duração.
2. Painel da direita mostra os Requisitos, Recompensas e Custo de Tempo da oferta selecionada.
3. A própria UI sugere quais Idols do plantel cumprem os requisitos (Candidatas Ideais).
4. Integração fluida com o sistema de agendamento (Botão "Aceitar e Agendar Idol").