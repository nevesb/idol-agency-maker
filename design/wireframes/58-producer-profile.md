# Wireframe 58 — Producer Profile (Perfil do Jogador)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Manager Profile / Attributes  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/producer/profile`  
> **GDDs**: player-manager-system

---

## Conceito

No FM, o Manager (Treinador) tem atributos de 1 a 20 divididos em "Treinamento" (Defesa, Ataque) e "Mental" (Motivação, Conhecimento Tático).
No **Star Idol Agency**, esta é a tela do **Seu Perfil (Produtor)**. Você não é apenas uma entidade que clica botões, você tem atributos que influenciam o jogo (e que podem ser evoluídos). Um produtor com alta "Liderança" impede brigas no vestiário. Um com alto "Olho para Talento" (Scouting) não precisa pagar caro por Head Scouts.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | CARREIRA (Ativo)         |
|-------------------------------------------------------------------------------------------------|
| MEU PERFIL (Ativo) | Relacionamentos | Promessas | Histórico                                    |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - RESUMO DO PRODUTOR ]                                                        |
| [Avatar 3D do Produtor]  Nome: B. Neves | Idade: 35 | Reputação Nacional: [★★★☆☆]           |
| Agência Atual: Star Idol Agency | Salário: ¥ 5.000.000 p/a | Fim do Contrato: Dez/2028          |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - ATRIBUTOS GERENCIAIS ]      | [ COLUNA CENTRO/DIR - ATRIBUTOS TÉCNICOS & ESTILO ]|
|                                            |                                                    |
| HABILIDADES MENTAIS E DE GESTÃO            | HABILIDADES TÉCNICAS (PRODUÇÃO)                    |
| (Escala 1-20)                              | (Escala 1-20)                                      |
|                                            |                                                    |
| Liderança:              16                 | Olho para Talento (Scouting):  12                  |
| Gestão de Pessoas (Man Management): 14     | Visão Musical (A&R):           18                  |
| Motivação:              15                 | Criação de Coreografia:         5                  |
| Resolução de Conflitos: 13                 | Treinamento Vocal:              8                  |
| Controle Financeiro:    10                 | Relações Públicas (Mídia):     14                  |
|                                            |                                                    |
| TENDÊNCIAS DE GERENCIAMENTO (Traits)       | GRÁFICO POLAR (RADAR CHART)                        |
| > Prefere lançar baladas.                  | [ Radar Chart FM26 comparando Perfil Mental vs     |
| > Tende a contratar idols muito jovens.    |   Técnico vs Midia vs Treino ]                     |
| > Evita conflitos públicos.                |                                                    |
|                                            | HISTÓRICO DE TÍTULOS                               |
| ESTILO DE JOGO (Filosofia)                 | 1x Oricon #1 Single (2025)                         |
| "Foco no Vocal Ao Vivo / Pouca Dança"      | 1x Idol Group of the Year (2024)                   |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Manager Attributes (Os Atributos Visíveis)
FM divide treinadores em Tracksuit (Foca em Treino) e Tactical (Foca em Mente). Aqui, você pode ser um "Produtor Técnico" (sabe criar música e dança, não precisa de Coaches caros) ou um "Gestor de Pessoas" (as meninas amam você e o ego delas nunca infla).

### 2. Radar Chart Profile
O polígono radar do FM é famoso. Ele dá uma visão imediata se você é um gênio da TV e Mídia (focado na direita do gráfico) mas um péssimo músico (encolhido na esquerda).

### 3. Manager Tendencies (Traits)
A IA (e os jornalistas do jogo) reparam nos seus "Traits". Se você joga com "Pressing Alto" no FM, você tem o Trait. Se no jogo você sempre escala garotas de 14 anos para fazer shows, você ganha a tendência "Prefere Talentos Jovens", o que atrai mais prodígios, mas pode gerar críticas de certa ala da imprensa.

---

## Acceptance Criteria

1. Tela exibe os Atributos do Produtor divididos em Mentais/Gestão e Técnicos/Produção.
2. Presença de um Gráfico Polar (Radar) gerado dinamicamente para sumarizar o estilo do jogador.
3. Exibição de Reputação (Estrelas) e Informações Contratuais do jogador em relação à Agência.
4. "Traits" (Tendências) comportamentais desbloqueadas conforme as escolhas do jogador durante a campanha.