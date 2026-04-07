# Wireframe 13 — Staff (Corpo Técnico)

> **Status**: Revised (FM26 UI Standard)  
> **Referência visual**: FM26 Staff List / Backroom Staff Overview  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/staff`  

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE (Ativo) | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Instalações | CORPO TÉCNICO (Ativo) | Histórico                                   |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - RESUMO DO STAFF ]                                                           |
| Orçamento para Salários do Staff: ¥ 5.000.000 / mês | Margem Disponível: ¥ 1.500.000            |
| Vagas: Treinadores (2/3) | Casting/Scouts (1/2) | Departamento Médico (1/2)                     |
|-------------------------------------------------------------------------------------------------|
| [ TABELA CENTRAL - LISTA DE FUNCIONÁRIOS ]                                                      |
|                                                                                                 |
| +----+----------------------+-------------------+----------+---------+------+--------+--------+ |
| |   | NOME                 | FUNÇÃO PRINCIPAL  | SALÁRIO  | CONTRATO| TREI | SCOUT  | MED    | |
| +----+----------------------+-------------------+----------+---------+------+--------+--------+ |
| |[F]| Kenji Sato           | Assist. Produtor  | ¥ 400k/m | 2 Anos  |  12  |   08   |   --   | |
| |[F]| Yumi Tanaka          | Treinadora Vocal  | ¥ 350k/m | 1 Ano   |  15  |   --   |   --   | |
| |[F]| Akio                 | Treinador Dança   | ¥ 450k/m | 3 Anos  |  16  |   --   |   --   | |
| |[F]| Dr. Honda            | Fisioterapeuta    | ¥ 600k/m | 1 Ano   |  --  |   --   |   18   | |
| |[F]| [ Vaga Aberta ]      | Chefe de Scouting |    --    |    --   |  --  |   --   |   --   | |
| +----+----------------------+-------------------+----------+---------+------+--------+--------+ |
|                                                                                                 |
| [ AÇÕES ABAIXO DA TABELA ]                                                                      |
| [ Botão: Buscar Funcionários (Mercado de Staff) ]                                               |
| [ Botão: Colocar Anúncio de Emprego (Job Advert) ]                                              |
|                                                                                                 |
|-------------------------------------------------------------------------------------------------|
| [ PAINEL INFERIOR - QUALIDADE DA EQUIPE TÉCNICA EM COMPARAÇÃO À INDÚSTRIA ]                     |
| [ Gráfico de Barras FM26 comparando a média do seu staff com agências rivais do mesmo Tier ]    |
| Treino Vocal: [||||||||  ] (Abaixo da Média Nacional)                                           |
| Treino Dança: [||||||||||] (Excelente - Top 3)                                                  |
| Medicina:     [||||||||  ] (Média)                                                              |
+-------------------------------------------------------------------------------------------------+
```

## Revisão FM26

1. **Top Nav**: Substituiu a navegação vertical herdada.
2. **Staff Limits**: Destacando o controle de "vagas abertas" (Board Limits) exigido no Football Manager.
3. **Staff Comparison**: Introduzido o gráfico inferior clássico do FM que diz se os seus treinadores são piores ou melhores que os treinadores dos seus rivais da Oricon.