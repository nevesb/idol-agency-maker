# Wireframe 16 — Show Assignments (Atribuição de Equipe de Eventos)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Match Day Experience / Squad Registration
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/events/assignments`
> **GDDs**: show-system, staff-roles, operations

---

## Conceito

No Football Manager 2026, as abas relacionadas a jogos mudaram para a nova aba global "Dia de Jogo" (Match Day), que fica em destaque no Top Navigation. O fluxo de gerenciamento antes do evento foca em quem viaja e quem cuida do que (como registro de plantel e match prep).

No **Star Idol Agency**, esta é a tela onde você monta a **"Touring Crew"** ou a **"Show Staff"**. Para o show dar certo (dar mais receita e fama sem falhas técnicas), você precisa escalar: Road Manager, Figurino/Stylist, Maquiagem, Segurança e Diretor de Palco.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW | Clube | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Planeamento de Show (Ativo) | Setlist | Operações | Relatórios                  |
|-------------------------------------------------------------------------------------------------|
| Dia de Show > Planeamento de Show > Atribuição de Staff > [Evento: Tokyo Dome Live]             |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - REQUISITOS DO SHOW ]   | [ CENTRO - STAFF DISPONÍVEL ]     | [ DIR - O EVENTO ]  |
|                                       |                                   |                     |
| EXIGÊNCIAS DO EVENTO                  | STAFF (Arraste ou Selecione)      | TOKYO DOME LIVE     |
| (Tokyo Dome Live - 50.000 pessoas)    |                                   | Data: Sáb, 18:00    |
|                                       | [Drop: Filtrar por Função v]      | Local: Tokyo Dome   |
| [ ] Direção de Palco (Obrigatório)    |                                   | Tipo: Grande Show   |
|     (Vazio)                           | [Avatar] Sr. Tanaka (Segurança)   |                     |
|     + Clicar para adicionar           | Nível: 16 | Custo: ¥50k/evento    | EXPECTATIVAS        |
|                                       |                                   | Figurino: [★★★★☆]   |
| [X] Road Manager                      | [Avatar] Miki (Stylist)           | Palco:    [★★★★★]   |
|     [Avatar] Você (Produtor)          | Nível: 14 | Custo: Fixa (Mês)     | Segurança:[★★★☆☆]   |
|                                       |                                   |                     |
| [X] Stylist Principal                 | [Avatar] Koji (Stage Director)    | IMPACTO ATUAL STAFF |
|     [Avatar] Miki                     | Nível: 19 | Custo: ¥120k/evento   | Bônus Estética: +15 |
|                                       |                                   | Risco de Furo: 2%   |
| [ ] Equipe de Segurança (Recomendado) | [Avatar] Sakura (Makeup)          |                     |
|     (Vazio)                           | Nível: 12 | Custo: Fixa (Mês)     | [ Botão: Auto-Fill] |
|     + Clicar para adicionar           |                                   |                     |
|                                       | [Avatar] Kenji (Road Manager)     |                     |
| CUSTO ESTIMADO DO STAFF: ¥0           | Nível: 10 | Custo: Fixa (Mês)     |                     |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Novo Navigation Bar ("Dia de Show")
Assim como a aba "Match Day" no FM26 agora substituiu velhos menus em favor de um hub unificado, criamos a navegação "Dia de Show" onde toda a preparação do evento acontece.

### 2. Painel de Exigências (Esquerda)
O novo FM usa interfaces muito visuais para montar esquadrões (squad registration). Aqui adaptamos isso: o show é grande? Exige Diretor de Palco. O jogador clica no espaço vazio e seleciona do meio.

### 3. Centro (Inventário Visual de Staff)
Cards verticais em formato de lista (Avatar, Nome, Status, Custo). Como no FM26, o *drag-and-drop* ou clique rápido é a principal forma de mover elementos da lista central para a coluna de atribuição da esquerda.

### 4. O Evento (Painel de Contexto à Direita)
Refletindo o "Match Preview" do painel direito do FM26, esta coluna resume a importância do evento, o hype, e as notas que a mídia vai julgar (as "estrelas" de Figurino e Palco). Quando você escala um bom Stage Director, a barra de "Impacto" sobe na hora.

---

## Acceptance Criteria

1. Top menu unificado reflete a nova aba "Match Day" do FM26, mas como "Dia de Show".
2. Estrutura 3-colunas que facilita a leitura "Requisito -> Seleção -> Impacto Geral".
3. Visualização clara entre staffs que ganham "por evento" (freelancers de luxo) vs staff "fixo/mês", o que impacta as finanças diretas do show.
4. Auto-Fill presente para delegar a escolha para a IA/Assistente do jogo.