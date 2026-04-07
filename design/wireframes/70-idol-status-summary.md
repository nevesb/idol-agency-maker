# Wireframe 70 — Idol Status Summary (O Card de Substituição)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Quick Sub / Player Hover Card  
> **Resolução alvo**: Tooltip/Popover (Tamanho Fixo)  
> **Rota**: Componente global ativado no Hover (Hover sobre Avatar)  
> **GDDs**: player-manager-system

---

## Conceito

No FM, quando você passa o mouse sobre um jogador na tela de Táticas, abre um card rápido: Fadiga, Nota, Perna Boa e Lesões. Isso evita que você tenha que abrir o perfil completo dele.
No **Star Idol Agency**, esta é a **Idol Hover Card (Resumo Rápido)**. É onipresente. Se você passar o mouse no nome de uma idol na tela de agenda, na vitrine de negociação ou no Match Engine, esse card pipoca mostrando as estatísticas vitais num piscar de olhos.

---

## Estrutura da Tela (Layout FM26)

```text
=============================================================================
| [ POP-UP / HOVER CARD ]                                                   |
|                                                                           |
|  [ FOTO DA IDOL ]  SAKURA K. (18)                                         |
|  [ Nível: S ]      Center | Main Dancer                                   |
|                    Star Idol Agency - Grupo: Celestial Nine               |
|---------------------------------------------------------------------------|
| ESTATÍSTICAS VITAIS (DIA ATUAL)                                           |
|                                                                           |
| Fadiga (Stamina):  [ ||||||||||  ] 100% (Fresca)                          |
| Condição Mental:   [ |||||||     ] 70% (Foco Bom)                         |
| Pressão/Estresse:  [ ||          ] 20% (Calma)                            |
| Moral:             [ Verde ] Excelente                                    |
|                                                                           |
| PRINCIPAIS ATRIBUTOS TÉCNICOS               DINÂMICAS SOCIAIS             |
| Vocal Ao Vivo:  14                          Amiga de: Yumi, Haruka        |
| Sincronia:      18                          Rival de: Aiko                |
| Carisma:        19                                                        |
| Estamina:       12 [!] (Cansa Rápido)       CONTRATO                      |
|                                             Expira em: 6 Meses [!]        |
|                                                                           |
=============================================================================
```

## Componentes FM26 Aplicados

### 1. Hover/Tooltip Uniformity
O FM26 transformou a UI de táticas numa interface limpa porque delegou 80% da leitura de dados pro *Hover*. Não é necessário abrir 5 telas. Passar o mouse na Sakura te mostra a estamina atual dela para você não arrastá-la por acidente para um Job na televisão se a barra dela estiver vermelha.

### 2. Micro-Alertas [!]
O card funciona como um mini-auditor. Se a "Estamina é 12", ela ganha um símbolo `[!]`. Se o contrato "Expira em 6 Meses", o `[!]` brilha. O produtor faz a gestão de crise sem sair da tela em que está.

---

## Acceptance Criteria

1. Componente flutuante acionado em hover sobre qualquer texto ou foto representando o nome de uma Idol no jogo.
2. Contém representações visuais em barras das variáveis dinâmicas de alta rotação (Fadiga, Pressão, Moral).
3. Exibição imediata das afinidades sociais críticas (Amigos/Rivais) para suporte à criação de formações (Wireframe 52).
4. Símbolos de alerta visual [!] para atributos perigosamente baixos ou status contratuais críticos.