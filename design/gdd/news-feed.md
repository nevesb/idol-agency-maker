# News Feed & Media System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

O News Feed é o log de notícias do jogo que mostra tudo que acontece no mundo:
resultados de jobs, escândalos, movimentos de mercado, mudanças de ranking,
ações de agências rivais, e oportunidades de scouting. Notícias são filtradas
por tier -- idol SSS aparece na "TV nacional", idol F aparece em "blog local".
Funciona como ferramenta de inteligência passiva: jogadores atentos descobrem
oportunidades antes dos rivais.

## Player Fantasy

A fantasia é de **produtor que lê as notícias do mercado toda manhã**. Scrollar
o feed e ver "Agência Starlight contratou idol rank A de Osaka" e pensar "preciso
reforçar meu roster antes que ela ganhe market share". Serve o **Pilar 1**:
notícias refletem eventos reais do mundo simulado.

## Detailed Design

### Core Rules

#### 1. Veículos por FAMA (não por tier de idol)

Veículos são baseados na **fama da idol**, não no tier de potencial:

| Fama da Idol | Veículo | Visual | % do mercado |
|---|---|---|---|
| Top 3% em fama | TV nacional, grandes portais | Ícone de TV, destaque dourado | SSS-S em fama |
| Top 3-10% | Revistas, jornais nacionais | Ícone de revista | A-B em fama |
| Top 10-30% | Jornais locais, sites de nicho | Ícone de jornal | C-D em fama |
| Bottom 70% | Blogs, redes sociais, fóruns | Ícone de celular | E-F em fama |
| Mercado/Agências | Seção "Business" | Ícone de briefcase | — |

#### 2. Notícias Diárias (sem limite)

Notícias são geradas **todos os dias** sem limite de volume. São o histórico
completo do mundo em notícias. O sistema usa **templates pré-programados
com placeholders** que são substituídos em runtime:

```
Template: "{VEICULO}: {IDOL_NAME} {ACAO} no {LOCAL}. {DETALHE}."

Exemplo preenchido:
  "TV Tokyo: Suzuki Mei brilhou no Music Monday em Tokyo.
   Audiência recorde de 2.3M espectadores."
```

**Tom de voz por veículo:**
- TV Nacional: Formal, institucional ("A renomada idol Suzuki Mei...")
- Revista: Sensacionalista, emotivo ("Incrível! Suzuki Mei conquista...")
- Jornal local: Informativo, comunitário ("Jovem de Osaka destaca-se...")
- Blog/Redes: Casual, fã ("OMG Suzuki arrasou ontem no show!!")
- Business: Corporativo ("Agência Starlight reporta crescimento de 15%...")

Cada tipo de notícia precisa de **templates por veículo** (tom diferente
pra cada). Templates serão **gerados por LLM** usando este catálogo como spec.
Todos templates precisam de **i18n** (multi-língua) desde a geração.

**CATÁLOGO COMPLETO DE TIPOS DE NOTÍCIA** (spec pra geração de templates):

**JOBS (resultados)**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| J01 | Job sucesso (show/concerto) | {IDOL}, {LOCAL}, {AUDIENCIA} | 5 | 3 | 15 |
| J02 | Job sucesso (TV) | {IDOL}, {PROGRAMA}, {AUDIENCIA} | 5 | 3 | 15 |
| J03 | Job sucesso (gravação) | {IDOL}, {MUSICA}, {CHART_POS} | 5 | 3 | 15 |
| J04 | Job sucesso (dublagem) | {IDOL}, {ANIME/GAME}, {PAPEL} | 4 | 2 | 8 |
| J05 | Job sucesso (sessão de fotos) | {IDOL}, {MARCA/REVISTA} | 4 | 2 | 8 |
| J06 | Job sucesso (meet & greet) | {IDOL}, {LOCAL}, {FANS_QTD} | 3 | 2 | 6 |
| J07 | Job sucesso (endorsement) | {IDOL}, {MARCA}, {VALOR} | 4 | 2 | 8 |
| J08 | Job sucesso (streaming) | {IDOL}, {PLATAFORMA}, {VIEWERS} | 3 | 2 | 6 |
| J09 | Job sucesso parcial | {IDOL}, {JOB_TYPE}, {DETALHE} | 4 | 2 | 8 |
| J10 | Job fracasso | {IDOL}, {JOB_TYPE}, {MOTIVO} | 4 | 2 | 8 |
| J11 | Job de grupo (sucesso) | {GRUPO}, {JOB_TYPE}, {LOCAL} | 5 | 3 | 15 |
| J12 | Job de grupo (fracasso) | {GRUPO}, {JOB_TYPE}, {MOTIVO} | 4 | 2 | 8 |

**ESCÂNDALOS (determinísticos)**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| S01 | Flagrada na rua com amigo | {IDOL}, {LOCAL}, {HORA} | 4 | 3 | 12 |
| S02 | Compras luxuosas expostas | {IDOL}, {LOCAL}, {ITEM_HINT} | 4 | 2 | 8 |
| S03 | Foto em lugar inesperado | {IDOL}, {LOCAL} | 3 | 2 | 6 |
| S04 | Namoro exposto | {IDOL}, {LOCAL}, {DETALHE} | 5 | 3 | 15 |
| S05 | Comentário polêmico | {IDOL}, {CONTEXTO}, {CITACAO} | 5 | 3 | 15 |
| S06 | Briga pública | {IDOL}, {LOCAL}, {TESTEMUNHA} | 5 | 3 | 15 |
| S07 | Vazamento de informação | {IDOL}, {INFO_TIPO} | 4 | 2 | 8 |
| S08 | Colapso público | {IDOL}, {LOCAL}, {GRAVIDADE} | 5 | 2 | 10 |
| S09 | Agressão séria | {IDOL}, {VITIMA/CONTEXTO} | 5 | 2 | 10 |
| S10 | Fraude/Engano | {IDOL}, {TIPO_FRAUDE} | 4 | 2 | 8 |

**MERCADO/TRANSFERÊNCIAS**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| M01 | Idol contratada por agência | {IDOL}, {AGENCIA} | 4 | 2 | 8 |
| M02 | Idol rescindiu contrato | {IDOL}, {AGENCIA}, {MOTIVO_HINT} | 4 | 2 | 8 |
| M03 | Buyout entre agências | {IDOL}, {AGENCIA_ORIGEM}, {AGENCIA_DESTINO} | 4 | 2 | 8 |
| M04 | Agência fez casting massivo | {AGENCIA}, {REGIAO}, {QTD} | 3 | 2 | 6 |
| M05 | Nova idol apareceu no mercado | {IDOL}, {REGIAO}, {METODO_DESCOBERTA} | 3 | 3 | 9 |
| M06 | Idol indie se destacou | {IDOL}, {JOB}, {RESULTADO} | 3 | 2 | 6 |
| M07 | Agência expandiu/subiu tier | {AGENCIA}, {TIER_NOVO} | 3 | 2 | 6 |
| M08 | Agência faliu | {AGENCIA}, {QTD_IDOLS_LIBERADAS} | 4 | 2 | 8 |

**RANKINGS/FAMA**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| R01 | Idol subiu pro top 10 | {IDOL}, {POSICAO}, {POSICAO_ANTERIOR} | 5 | 2 | 10 |
| R02 | Idol subiu de tier | {IDOL}, {TIER_NOVO} | 4 | 2 | 8 |
| R03 | Idol caiu de tier | {IDOL}, {TIER_NOVO}, {MOTIVO_HINT} | 4 | 2 | 8 |
| R04 | Ranking de agência mudou | {AGENCIA}, {POSICAO} | 3 | 2 | 6 |
| R05 | Grupo subiu no ranking | {GRUPO}, {POSICAO} | 4 | 2 | 8 |

**MÚSICA/CHARTS**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| C01 | Música entrou no top 10 | {MUSICA}, {ARTISTA}, {POSICAO} | 5 | 2 | 10 |
| C02 | Música #1 do ranking | {MUSICA}, {ARTISTA}, {SEMANAS_NO_TOP} | 5 | 3 | 15 |
| C03 | Novo single/álbum lançado | {ARTISTA}, {TITULO}, {TIPO} | 4 | 2 | 8 |
| C04 | Cover fez sucesso | {ARTISTA_COVER}, {MUSICA_ORIGINAL}, {ARTISTA_ORIGINAL} | 4 | 2 | 8 |
| C05 | CD/vinil esgotou | {ARTISTA}, {TITULO}, {UNIDADES} | 4 | 2 | 8 |
| C06 | Collab musical anunciada | {ARTISTA1}, {ARTISTA2}, {TIPO} | 4 | 2 | 8 |

**PRODUTOR (início de jogo)**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| P01 | Contratação de produtor (início) | {AGENCIA}, {AGENCIA_REGIAO}, {PRODUTOR_NOME}, {PRODUTOR_SOBRENOME}, {PRONOME}, {TRACO_1_DESC}, {TRACO_2_DESC}, {BACKGROUND_DESC}, {ESTILO_DESC} | 4 (por background) | 3 | 12 |

**Template P01 — Detalhes:**

Gerada automaticamente ao criar campanha. Aparece expandida (overlay fullscreen)
na primeira entrada no Portal. Jogador precisa fechar pra ver o Portal.

Veículo proporcional à reputação do background:
- Prodígio/Ícone: TV Nacional
- Hitmaker/Especialista: Revista
- Promessa/Veterano: Jornal Local
- Começando do Zero: Blog/Redes Sociais

Estrutura do corpo (3 parágrafos, adaptados por traços):
> Parágrafo 1: Anuncia a contratação factualmente.
> "Mudanças à vista na {AGENCIA}. A agência de {AGENCIA_REGIAO} está prestes a
> anunciar a nomeação de {PRONOME}, {PRODUTOR_NOME} {PRODUTOR_SOBRENOME}, como
> novo produtor."
>
> Parágrafo 2: Descreve o estilo do produtor usando traços e estilo.
> "Como figura {TRACO_1_DESC} que aposta forte em {TRACO_2_DESC}, {PRONOME}
> junta-se à {AGENCIA} numa transferência que irá intrigar muitas pessoas da
> indústria."
>
> Parágrafo 3: Referencia o background.
> Template varia conforme o background:
> - Prodígio: "Com uma carreira lendária no entretenimento..."
> - Hitmaker: "Acumulando sucessos e respeitado por lapidar potencial..."
> - Zero: "Sem uma carreira prévia como referência, ele aproveita..."

**CONTRATO/CARREIRA**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| K01 | Idol renovou contrato | {IDOL}, {AGENCIA}, {DURACAO} | 3 | 2 | 6 |
| K02 | Idol anunciou debut (aposentadoria) | {IDOL}, {ANOS_CARREIRA}, {CONQUISTAS} | 5 | 3 | 15 |
| K03 | Cerimônia de graduação | {IDOL}, {LOCAL}, {FANS_PRESENTES} | 5 | 2 | 10 |
| K04 | Ex-idol anuncia programa | {EX_IDOL}, {TIPO_PROGRAMA}, {EMISSORA} | 4 | 2 | 8 |
| K05 | Ex-idol dá entrevista (possível volta) | {EX_IDOL}, {VEICULO}, {CITACAO} | 4 | 3 | 12 |

**FINANÇAS PESSOAIS DA IDOL**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| F01 | Idol comprou casa/apartamento | {IDOL}, {LOCAL} | 3 | 2 | 6 |
| F02 | Idol comprou carro | {IDOL} | 2 | 2 | 4 |
| F03 | Idol fez viagem internacional | {IDOL}, {DESTINO} | 3 | 2 | 6 |
| F04 | Idol com dificuldades financeiras | {IDOL} | 3 | 2 | 6 |
| F05 | Idol contratou assessor pessoal | {IDOL} | 2 | 2 | 4 |

**GRUPO**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| G01 | Grupo formado | {GRUPO}, {MEMBROS_QTD}, {AGENCIA} | 4 | 2 | 8 |
| G02 | Membro adicionado ao grupo | {IDOL}, {GRUPO} | 3 | 2 | 6 |
| G03 | Membro saiu do grupo | {IDOL}, {GRUPO}, {MOTIVO_HINT} | 4 | 2 | 8 |
| G04 | Conflito interno vazou | {GRUPO}, {DETALHE_HINT} | 4 | 3 | 12 |
| G05 | Grupo dissolvido | {GRUPO}, {MOTIVO} | 4 | 2 | 8 |
| G06 | Disputa de liderança | {GRUPO}, {LIDER}, {DESAFIANTE} | 4 | 2 | 8 |

**FÃ CLUB**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| FC01 | Fãs fazem campanha positiva | {IDOL}, {TIPO_CAMPANHA} | 3 | 2 | 6 |
| FC02 | Fãs protestam/boicotam | {IDOL}, {MOTIVO} | 4 | 2 | 8 |
| FC03 | Assédio de fã reportado | {IDOL}, {TIPO_ASSEDIO} | 4 | 2 | 8 |
| FC04 | Fã club atingiu marco | {IDOL}, {QTD_FAS} | 3 | 2 | 6 |

**EVENTOS/SAZONAIS**

| ID | Tipo | Placeholders | Veículos | Variações | Total |
|---|---|---|---|---|---|
| E01 | Evento sazonal anunciado | {EVENTO}, {DATA}, {LOCAL} | 4 | 2 | 8 |
| E02 | Resultado de premiação | {EVENTO}, {VENCEDOR}, {CATEGORIA} | 5 | 3 | 15 |
| E03 | Festival (lineup anunciado) | {EVENTO}, {ARTISTAS_DESTAQUE} | 4 | 2 | 8 |
| E04 | Evento criado por agência | {AGENCIA}, {EVENTO}, {ESCALA} | 3 | 2 | 6 |

**TOTAL ESTIMADO: ~65 tipos × ~2.5 média de veículos × ~2.3 variações ≈ 375 templates base**
**Com i18n (3 idiomas MVP): ~1125 templates totais**

**Processo de geração:**
1. Catálogo acima serve como **spec** pro LLM
2. LLM gera cada template com tom de voz correto por veículo
3. Templates são revisados e incluídos no build
4. Templates vivem no World Pack (podem ser atualizados/expandidos)
5. Comunidade pode criar templates custom nos packs
| Resultado de job (fracasso) | Job Assignment | 5 × 3 = 15 |
| Escândalo leve | Event Generator | 5 × 3 = 15 |
| Escândalo médio | Event Generator | 5 × 3 = 15 |
| Escândalo grave | Event Generator | 5 × 2 = 10 |
| Contratação | Market/Transfer | 3 × 2 = 6 |
| Ranking (subida) | Fame & Rankings | 3 × 2 = 6 |
| Música (chart) | Music Charts | 3 × 2 = 6 |
| Ex-idol (retorno) | Idol Lifecycle | 3 × 2 = 6 |
| Finanças pessoais | Personal Finance | 2 × 2 = 4 |
| Oportunidade scouting | Market | 2 × 2 = 4 |
| Buyout entre agências | Rival AI | 3 × 2 = 6 |
| **Total estimado** | | **~110 templates base** |

Templates precisam de **multi-língua (i18n)** desde o início.

#### 3. Modo Skip = Jornal Semanal

Jogador que dá skip na semana recebe um **jornal semanal com destaques**:
- Top 5-10 notícias mais relevantes da semana
- Resumo compacto (1-2 linhas cada)
- Botão "Ver todas as notícias da semana" expande pra lista completa
- Pode filtrar por idol/agência mesmo no modo skip

#### 4. Seguir Idol

Ao ler uma notícia sobre qualquer idol, botão **"Seguir"** disponível:
- Idol seguida: jogador recebe **clipping** de todas notícias sobre ela
- No mercado: pode filtrar por "idols seguidas"
- Tab especial no feed: "Seguidas" mostra só notícias de idols acompanhadas
- Útil pra scouting passivo: ler feed → seguir → mandar scout → contratar
- Sem limite de idols seguidas

#### 5. Filtros

- Por tipo (escândalos, mercado, ranking, música, etc.)
- Por relevância: **Minhas idols** / **Idols seguidas** / **Minha agência** / **Todas**
- Por veículo (TV, revista, blog, etc.)
- Por região
- Por data (filtrar por semana específica)

### Interactions with Other Systems

Todos sistemas alimentam o feed. News Feed não afeta gameplay diretamente --
é informação pra o jogador tomar decisões.

## Dependencies

**Hard**: Fame (tier determina veículo), Event Generator (escândalos)
**Soft**: Todos outros sistemas (fontes de notícia)
- Producer Profile (#50): Background e traços afetam tom narrativo das notícias. Ver producer-profile.md seção 4a/4d.
**Depended on by**: Scouting (passivo), Market/Transfer (inteligência), News Feed UI

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `NEWS_HISTORY_MONTHS` | 3 | 1-12 | Meses de histórico mantidos |
| `WEEKLY_HIGHLIGHT_COUNT` | 5-10 | 3-20 | Notícias no jornal semanal (skip) |
| `SCOUTING_NEWS_RATE` | 0.2 | 0.1-0.5 | % de notícias com pistas de scouting |
| `TEMPLATES_PER_TYPE` | 3 variações | 2-5 | Variações pra evitar repetição |

## Acceptance Criteria

1. Notícias baseadas em FAMA (top 3% = TV, bottom 70% = blog)
2. Templates preenchidos corretamente com placeholders por veículo/tom
3. Tom de voz diferente por veículo (formal TV vs casual blog)
4. "Seguir idol" funciona e filtra no feed e no mercado
5. Modo skip mostra jornal semanal com top 5-10 destaques
6. "Ver todas" expande pra histórico completo da semana
7. Filtros combinados funcionam (tipo + idol + veículo + data)
8. Notícias diárias sem limite de volume (histórico completo)
9. Templates com suporte i18n desde o MVP
10. Histórico de 3 meses mantido, mais antigo descartado

## Open Questions

- **DEFERIDO**: Notícias falsas/rumores: boa ideia mas fora do MVP. Feature futura
- **RESOLVIDO**: Templates MVP = quantidade necessária pra cobrir TODOS os casos
  listados no catálogo acima (~375 base × idiomas MVP). Sem cortes -- todos tipos
  são necessários pra simulação funcionar. Priorizar geração por LLM em batch
