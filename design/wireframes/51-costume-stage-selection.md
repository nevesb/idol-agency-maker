# Wireframe 51 — Costume & Stage Selection (Palco e Figurino)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Match Day Equipment / Weather Setup  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/stage`  
> **GDDs**: show-system, finance-economy

---

## Conceito

No FM, antes do jogo você apenas confere se a equipe vai jogar de uniforme 1 ou 2, e o estado do gramado.
No **Star Idol Agency**, esta é a tela de **Figurino e Palco**. Onde o produtor investe dinheiro bruto. Um show no Tokyo Dome exige um palco monumental (fogos de artifício, elevadores hidráulicos) e figurinos deslumbrantes. O "Hype" base da platéia multiplica dependendo da qualidade dessas escolhas.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Planejamento | Setlist | PALCO E FIGURINO (Ativo) | Ensaios | Operações         |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Palco e Figurino > Celestial Nine: TOUR FINAL TOKYO DOME                          |
+-------------------------------------------------------------------------------------------------+
| ORÇAMENTO DE PRODUÇÃO DISPONÍVEL: ¥ 150.000.000                                                 |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - FIGURINO (COSTUMES) ]      | [ COLUNA CENTRO/DIR - EFEITOS DE PALCO (STAGE) ]    |
|                                            |                                                      |
| SELEÇÃO DE VESTUÁRIO (Theme)               | ESTRUTURA DO PALCO                                   |
| [ Dropdown: Tema "Starlight" (Premium) v ] | Nível do Palco: [ Dropdown: Estádio Grande v ]       |
| Custo de Confecção: ¥ 10.000.000           | (Permite efeitos pirotécnicos maiores)               |
|                                            |                                                      |
| IMPACTO DO FIGURINO                        | EFEITOS ESPECIAIS (SFX)                              |
| Carisma Boost: +2 (Aparência Brilhante)    | [X] Chuva de Prata (Confetes)    [ ¥ 500k ]          |
| Conforto Físico: Alto (Não cansa tanto)    | [X] Canhões de Fogo              [ ¥ 2M ]            |
|                                            | [ ] Elevadores Hidráulicos       [ ¥ 5M ]            |
| TROCAS DURANTE O SHOW                      | [ ] Show de Lasers Sincronizado  [ ¥ 3M ]            |
| Slot 1 a 3: Figurino Starlight             | [ ] Holograma (Realidade Aumen.) [ ¥ 15M ]           |
| Slot 4 a 6: [ Dropdown: Casual Chic v ]    |                                                      |
| (Exige 1 música de intervalo acústico)     | IMPACTO DO PALCO                                     |
|                                            | Hype Visual Base: [★★★★☆]                          |
|                                            | Expectativa do Fã-clube: Alta ("Eles esperam fogo")  |
|                                            |                                                      |
|                                            | CUSTO TOTAL DA PRODUÇÃO: ¥ 20.500.000               |
|                                            | [ Confirmar Produção Técnica ]                       |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Resource Management (Orçamento)
A tela de pré-jogo agora embute um menu de compras em tempo real. Igual aprovar reforma no estádio do FM. O slider/checkbox de efeitos especiais vai consumindo do orçamento de show da agência na hora, punindo o jogador com menos lucro final mas garantindo fama se o show for impecável.

### 2. Modificadores Estatísticos Invisíveis (Boosts)
Figurino "Premium" dá +2 de Carisma temporário, mascarando uma idol que normalmente tem nota baixa. Igual um jogador de futebol jogar melhor com a braçadeira de capitão, aqui a escolha visual não é apenas estética, mas matemática.

---

## Acceptance Criteria

1. Tela dividida entre configuração de Figurinos (Esquerda) e Palco/Efeitos (Direita).
2. Cálculo em tempo real do custo técnico sendo deduzido do "Orçamento de Produção".
3. Efeitos especiais apresentam requisitos (ex: Fogo só pode num palco de estádio, não num café).
4. Configuração de "Troca de Figurino" alerta o jogador caso não exista uma música acústica/MC (intervalo) programada na Setlist.