# Wireframe 47 — Week Results Expanded (Resumo da Semana)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Inbox Processing / Weekly Summary Modal
> **Resolução alvo**: Modal/Screen Overlay
> **Rota**: Modal sobre `/agency/portal` ou `/agency/operations`
> **GDDs**: schedule-agenda, idol-lifecycle, finance-economy

---

## Conceito

No Football Manager, você avança no tempo até ser parado por uma janela que resume os resultados da semana: quem treinou bem, quem se machucou, como foram as vendas de ingressos, o relatório do diretor da base. 
No **Star Idol Agency**, esta é a **Revisão da Semana (O Relatório da Segunda-Feira)**. É o momento em que você "bate o ponto" com a sua diretoria executiva, colhendo os frutos financeiros e de fama dos 7 dias que se passaram, antes de planejar os próximos 7.

---

## Estrutura da Tela (Layout FM26)

```text
===================================================================================================
TELA DE FUNDO ESCURECIDA (EX: PORTAL DA AGÊNCIA)
===================================================================================================
|                                                                                                 |
|   +-----------------------------------------------------------------------------------------+   |
|   | RELATÓRIO DA SEMANA [ 12 de Abril - 18 de Abril de 2026 ]                         [ X ] |   |
|   |                                                                                         |   |
|   | [ BARRA DE SUCESSO DA SEMANA ]                                                          |   |
|   | Faturamento Bruto: + ¥ 15.000.000 (Comercial Spark, Show Tokyo Dome)                    |   |
|   | Crescimento de Fama: + 120.000 Seguidores                                               |   |
|   |                                                                                         |   |
|   |-----------------------------------------------------------------------------------------|   |
|   | [ COLUNA ESQUERDA - DESTAQUES DO TREINO ]   | [ COLUNA DIREITA - EVENTOS E MERCADO ]    |   |
|   |                                             |                                           |   |
|   | DESTAQUES NO TREINO VOCAL E DANÇA           | STATUS DOS LANÇAMENTOS (ORICON)           |   |
|   | [Verde] Sakura: Evolução Excelente (+0.2)   | [Capa] "Starlight Melody" (Celestial Nine)|   |
|   |         Foco: Poder Vocal atingiu 16        | Subiu para a 3ª Posição nas Paradas       |   |
|   |                                             | (Vendas na semana: 145.000 unidades)      |   |
|   | [Amarelo] Haruka: Estagnada (0.0)           |                                           |   |
|   |           "Faltou motivação nos treinos."   | INCIDENTES E LOGÍSTICA                    |   |
|   |                                             |                                           |   |
|   | [Vermelho] Yumi: Queixando-se de Fadiga Alta| [!] Escândalo Evitado                     |   |
|   |            (Risco de Lesão: Severo)         | Aiko foi vista com um rapaz na saída do   |   |
|   |                                             | estúdio. O Manager Kenji agiu rápido e a  |   |
|   | PREPARAÇÃO DO STAFF (HEAD COACH)            | revista aceitou abafar a história em      |   |
|   | "Recomendo dar 2 dias de folga para a Yumi  | troca de uma entrevista exclusiva.        |   |
|   | imediatamente, ou a perderemos pro próximo  |                                           |   |
|   | mês."                                       |                                           |   |
|   | [ Botão: Aplicar Folga ]                    |                                           |   |
|   |                                             |                                           |   |
|   +-----------------------------------------------------------------------------------------+   |
|   |                                                                                         |   |
|   |                 [ Botão Gigante Magenta: Continuar para a Próxima Semana ]              |   |
===================================================================================================
```

## Componentes FM26 Aplicados

### 1. The Weekly Stop (Modal Obrigatório)
O jogador no FM26 avança os dias até o jogo pará-lo num relatório crucial (Inbox Modal expansivo). Isso concentra a leitura, ao invés de mandar 5 e-mails pingados. Se a Aiko quase foi pega num escândalo, a Yumi tá morrendo de cansaço e o Single subiu na Oricon, o jogador lê tudo num único dashboard e clica em `Continuar`.

### 2. Atuação Direta sobre o Alerta
O FM moderno sempre que dá um problema, oferece o botão de resolver no próprio e-mail/relatório. Se a Yumi tá em fadiga crítica na coluna esquerda, o botão `[Aplicar Folga]` já está embaixo do aviso do Head Coach. O produtor clica e pronto, a Yumi some da agenda da semana seguinte sem ele precisar abrir a aba Roster.

---

## Acceptance Criteria

1. Modal de Overlay centralizado reunindo: Finanças da Semana, Treino, Vendas Oricon e Incidentes Sociais.
2. Botões de resolução imediata atrelados aos incidentes críticos (ex: aplicar folga a idol estafada).
3. Sumário visual claro das metas alcançadas (Dinheiro/Fama no topo).