# Wireframe 59 — Producer Relationships (Dinâmica de Relacionamento)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Manager Relationships / Dynamics  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/producer/relationships`  
> **GDDs**: player-manager-system, social-system

---

## Conceito

No FM, o treinador pode ter "Favored Personnel" (Jogadores que o amam) e rivais na imprensa ou em outros clubes.
No **Star Idol Agency**, esta é a tela de **Sua Teia de Contatos (Relacionamentos)**. Neste jogo, network é poder. Ter um bom relacionamento com a Chefe da Agência Rivais pode facilitar compras. Ter idols que te odeiam gera um vazamento (leak) para a imprensa.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | CARREIRA (Ativo)         |
|-------------------------------------------------------------------------------------------------|
| Meu Perfil | RELACIONAMENTOS (Ativo) | Promessas | Histórico                                    |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - PESSOAS FAVORITAS ]         | [ COLUNA CENTRO/DIR - REDE E RIVALIDADES ]         |
|                                            |                                                    |
| ALIANÇAS FORTES (Favoured Personnel)       | RELACIONAMENTO COM A DIRETORIA (BOARD)             |
|                                            | CEO da Agência (Presidente): [Verde] Muito Próximo |
| [Avatar] Sakura (Sua Idol Favorita)        | "Ele confia cegamente no seu projeto a longo prazo"|
| Nível de Confiança: Máximo                 |                                                    |
|                                            | RELAÇÃO COM A MÍDIA                                |
| [Avatar] Sr. Yorihiro (Diretor de Oper.)   | Imprensa Nacional: [Amarelo] Neutro / Fria         |
| Nível de Confiança: Alto                   | "Acham você arrogante nas entrevistas após o show."|
|                                            |                                                    |
|--------------------------------------------|----------------------------------------------------|
|                                            |                                                    |
| DESAFETOS E RIVAIS                         | RIVAIS DA INDÚSTRIA (AGÊNCIAS E PRODUTORES)        |
|                                            |                                                    |
| [Avatar] Aiko (Sua Própria Idol!)          | [Logo] Agência Titan (Rival Histórico)             |
| Status: [Vermelho] Relacionamento Quebrado | Produtor da Titan: Akio Tanaka                     |
| Motivo: "Você quebrou a promessa de        | Status: [Vermelho Escuro] Inimigo Declarado        |
| torná-la a Center do último single."       |                                                    |
| Risco de Motim: Elevado.                   | [Logo] RedMoon Agency                              |
|                                            | Produtora: Naomi K.                                |
| [Avatar] Kenji (Manager de Turnê)          | Status: [Verde] Relacionamento Amigável            |
| Status: [Amarelo] Fricção Recente          | "Costuma aceitar contratos de Collabs com você."   |
|                                            |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Dynamics / Relationship Flags
Assim como no FM você entra no perfil de um treinador do Arsenal e vê que ele odeia o treinador do Chelsea, aqui o "Relacionamento" é explícito por cores e avatares. Os laços são formados por ações do jogo (elogiar demais uma garota, roubar a música de outra agência).

### 2. Mídia e Diretoria
As entidades "invisíveis" também avaliam você. Se você tratar mal a mídia (coletivas), a barra cai. No FM isso gera piores notas nos jornais (afetando o Hype do seu show). 

### 3. "Motim" de Vestuário
Aiko na lista de "Desafetos" é um risco FM clássico ("Player lost trust in the manager"). Ela pode contaminar o restante do elenco se tiver forte influência no Social System (Wireframe 29).

---

## Acceptance Criteria

1. Painéis separados por categorias (Aliados, Rivalidades/Desafetos, Status Institucional).
2. Status visual colorido (Verde = Positivo, Amarelo = Fricção, Vermelho = Inimigo).
3. Motivo da quebra (ou da união) de relacionamento explícito no texto de apoio ("Você quebrou a promessa...").