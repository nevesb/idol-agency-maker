# Wireframe 67 — History & Archives (Museu da Agência / Oricon Histórico)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Club History / Competition History / Records  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings/history`  
> **GDDs**: agency-growth

---

## Conceito

No FM, o "Club History" e "Records" guardam o maior artilheiro da história e o jogador mais jovem a entrar em campo.
No **Star Idol Agency**, esta é a tela do **Museu (Arquivos da Agência)**. Para jogos infinitos (saves de 20 anos), aqui ficam registradas as Idols lendárias que já se formaram (Graduated), os prêmios que a agência varreu na década passada e o "Hall of Fame" da Oricon.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| Rankings | Finanças | HISTÓRICO ORICON E MUSEU (Ativo) | Auditoria Médica | Segurança         |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - STATUS LENDÁRIO DA AGÊNCIA ]                                                |
| Ano de Fundação: 2024 | Total de Lançamentos: 42 | Discos de Platina: 5 | Discos de Ouro: 12    |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - RECORDES HISTÓRICOS ]       | [ COLUNA CENTRO/DIR - HALL OF FAME E LANÇAMENTOS ] |
|                                            |                                                    |
| RECORDES DO CLUBE (RECORDS)                | O "HALL DA FAMA" (IDOLS GRADUADAS E LENDÁRIAS)     |
|                                            |                                                    |
| Maior Venda de um Single:                  | [Avatar Envelhecido] MIKU (Graduada em 2028)       |
| "Starlight Melody" (850.000 cópias)        | Status: Lenda Viva (Atriz atualmente)              |
|                                            | Conquistas na Agência: 3x Center of the Year       |
| Maior Show da História:                    | Anos Ativos: 2024 - 2028                           |
| Tokyo Dome Live 2028 (55.000 presentes)    |                                                    |
|                                            | [Avatar] REINA (Graduada em 2030)                  |
| Idol que Mais Vendeu Merchandising:        | Status: Ícone do Clube (Carreira Solo)             |
| Sakura (¥ 2.5 Bilhões em Carreira)         | Conquistas: Mais semanas no Top 1 da Oricon        |
|                                            |                                                    |
| Idol Mais Jovem a Debutar:                 |----------------------------------------------------|
| Mio (13 anos e 14 dias)                    | DISCOGRAFIA HISTÓRICA (Acesso Rápido)              |
|                                            |                                                    |
| Maior Escândalo (Infelizmente):            | [ Capa do Single ] "Starlight Melody" (2026)       |
| O caso Bunshun de Aiko (2026)              | Posição Máx: #1 (4 Semanas) | Status: [Platina]    |
|                                            |                                                    |
|                                            | [ Capa do Álbum ] "Celestial Era" (2027)           |
|                                            | Posição Máx: #2 (1 Semana)  | Status: [Ouro]       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Club Records List (Coluna da Esquerda)
O clássico sumário estático mas dinamicamente atualizável do FM. "Recorde de Público", "Jogador mais jovem", "Maior venda". Isso dá um senso de progressão massivo. O jogador tenta bater os próprios recordes daqui a 10 temporadas.

### 2. Hall of Fame e Ícones do Clube (Legends & Icons)
No FM um jogador se torna "Lenda" ou "Ícone". Aqui as Idols que sustentaram a agência nos primeiros 5 anos, quando se "formam" (saem do grupo por idade ou carreira solo), são eternizadas no Hall of Fame do painel direito, com seu histórico congelado no tempo.

### 3. Discografia Consolidada
Lista estilo "Trophy Cabinet" focada nos discos (Músicas e Álbuns) que alcançaram marcos importantes (Ouro/Platina), mantendo viva a história dos produtos lançados pela agência.

---

## Acceptance Criteria

1. Painel esquerdo calculando e atualizando recordes absolutos (maior venda, idade mínima, etc) gerados proceduralmente pelo save.
2. Sistema de "Hall of Fame" para idols que atingiram status lendário e se aposentaram (Graduated).
3. "Trophy Cabinet" musical que exibe os singles de maior sucesso da agência como itens colecionáveis e clicáveis.