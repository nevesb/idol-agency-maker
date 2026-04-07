# Wireframe 69 — Social Media Feed (Painel de Redes Sociais)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Social Feed / Twitter Integration  
> **Resolução alvo**: 1920×1080 (PC-first) ou Painel Lateral Expansível  
> **Rota**: `/agency/social` ou componente global  
> **GDDs**: social-system, agency-growth

---

## Conceito

No FM, os fãs reclamam das suas substituições no Twitter in-game.
No **Star Idol Agency**, esta é a **Tela de Social Media Feed**. A internet dita o ritmo da indústria musical asiática. Aqui você acompanha em tempo real o que os Fãs (IdolOtakus), os Haters e a Mídia Especializada estão dizendo sobre os últimos singles, os shows e os boatos de namoro.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira                 |
|-------------------------------------------------------------------------------------------------|
| Notícias | Inbox | PAINEL SOCIAL (Ativo) |                                                      |
+-------------------------------------------------------------------------------------------------+
| [ FILTROS ]  [X] Mostrar Fãs   [X] Mostrar Imprensa   [ ] Ocultar Haters   [ Dropdown: Geral v ]|
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ/CENTRO - O FEED (TIMELINE) ]          | [ COLUNA DIR - TENDÊNCIAS (TRENDING) ]     |
|                                                    |                                            |
| [Avatar] @TokyoPopNews (Imprensa) [✓ Verificado]   | TRENDING TOPICS NACIONAIS                  |
| A Star Idol Agency surpreende o mercado levando o  |                                            |
| Celestial Nine ao Tokyo Dome. Um marco na história!| 1. #CelestialNineTokyoDome                 |
| ❤️ 12k  🔄 4k                                      | 2. #SakuraCenter                           |
|                                                    | 3. Aiko Falhou                             |
|----------------------------------------------------| 4. Titam Agency Lançamento                 |
|                                                    |                                            |
| [Avatar] @KahoLover99 (Fã-Clube)                   | ANÁLISE DE SENTIMENTO (GRUPO PRINCIPAL)    |
| Por que a Kaho não ganha uma linha na música nova? |                                            |
| O produtor odeia ela? #JusticeForKaho              | Celestial Nine                             |
| ❤️ 850  🔄 120                                     | [ Gráfico de Barra: 85% Positivo ]         |
|                                                    |                                            |
|----------------------------------------------------| IMPACTO DE IMAGEM DA ÚLTIMA SEMANA         |
|                                                    | Sakura:  [++] Amada pela internet          |
| [Avatar] @IdolHater_XX (Hater)                     | Kaho:    [++] Defendida pelos fãs          |
| Vi a Aiko num café de Shibuya ontem com um cara.   | Yumi:    [=]  Neutro                       |
| Cadê a regra de não namorar? Decepcionado...       | Aiko:    [--] Ganhando Hate da base dura   |
| ❤️ 4.5k  🔄 2.1k   [!] ALERTA DE RUMOR ESPALHANDO  |                                            |
|                                                    |                                            |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. The Social Timeline
Igual ao feed do FM. As mensagens são geradas processualmente cruzando os últimos eventos do jogo (um show bem sucedido, uma nota de imprensa). Mensagens de ódio (Haters) engajam mais rápido e acendem o alerta de "[!] RUMOR ESPALHANDO" avisando ao jogador que ele tem um problema de Relações Públicas (Wireframe 65) nas mãos.

### 2. Análise de Sentimento Visual
Ao invés de ler 300 tweets para saber se a base de fãs está feliz, a coluna da direita agrupa o sentimento da internet. Se 85% é Positivo, as vendas de Merchandising (Wireframe 66) estarão seguras para o próximo mês.

---

## Acceptance Criteria

1. Feed de rolagem vertical imitando interface de redes sociais.
2. Interações simuladas baseadas nos resultados diretos das escolhas do jogador (setlists, substituições, figurinos).
3. Painel dinâmico lateral resumindo as "Tendências" (Trending Topics) e a análise global de sentimento dos fãs.