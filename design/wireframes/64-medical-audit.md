# Wireframe 64 — Medical Audit (Centro Médico / Fadiga Geral)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Medical Centre / Injury Risk Assessment  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings/medical`  
> **GDDs**: training-system, agency-staff-operations

---

## Conceito

No FM, o Centro Médico avisa quem vai estourar o joelho se jogar a próxima partida.
No **Star Idol Agency**, esta é a **Auditoria Médica e Psicológica**. É a tela em que o Médico e o Psicólogo do clube listam a fadiga muscular e o estresse mental das meninas. Ignorar esta tela significa perder a Main Vocal para uma crise de Burnout ou Lesão no Tornozelo no meio de uma Turnê.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| Rankings | Finanças Avançadas | Histórico Oricon | AUDITORIA MÉDICA (Ativo) | Segurança         |
+-------------------------------------------------------------------------------------------------+
| [ PAINEL SUPERIOR - RESUMO DO DEPARTAMENTO MÉDICO ]                                             |
| Lesões Atuais: 1 | Risco de Burnout Crítico: 2 Idols | Carga Global de Treino: Alta             |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - AVALIAÇÃO DE RISCO ]        | [ COLUNA CENTRO/DIR - RELATÓRIO DO PLANTEL ]       |
|                                            |                                                    |
| ALERTA DO HEAD FISIOTERAPEUTA              | STATUS CLÍNICO E MENTAL DA EQUIPE                  |
| "A carga de ensaios de dança desta semana  |                                                    |
| está sobrecarregando os tornozelos da Yumi.| [!] ZONA DE RISCO (VERMELHO)                       |
| Aumente o repouso dela ou ela se machucará"| [Avatar] Yumi                                      |
|                                            | Risco Físico: Altíssimo (Sobrecarga de Dança)      |
| ALERTA DO PSICÓLOGO (SAÚDE MENTAL)         | Risco Mental: Moderado                             |
| "Aiko está sofrendo com a pressão da mídia.| Ação Recomendada: [ Dropdown: Folga de 3 Dias v ]  |
| Tire-a de frentes de PR e entrevistas, ou  |                                                    |
| o Burnout será iminente."                  | [Avatar] Aiko                                      |
|                                            | Risco Físico: Baixo                                |
| INTENSIDADE GERAL DE TREINO                | Risco Mental: Altíssimo (Crise de Pressão/Haters)  |
| [ ||||||||||||||------ ] 75% (Pesada)      | Ação Recomendada: [ Dropdown: Terapia/Descanso v ] |
|                                            |                                                    |
| [ Botão: Reduzir Carga de Treino de Todo   | [OK] ZONA SEGURA (VERDE)                           |
|   o Plantel Automaticamente ]              | [Avatar] Sakura                                    |
|                                            | Risco Físico: Normal  | Risco Mental: Normal       |
|                                            |                                                    |
|                                            | LISTA DE LESIONADAS/AFASTADAS                      |
|                                            | [Avatar] Miku (Lesão no Tornozelo - 2 Semanas)     |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Risk Assessment (Matriz de Risco)
O Medical Centre do FM moderno é proativo. Ele não lista só quem tá machucado, ele avisa quem *vai* se machucar. Aqui, a tabela divide quem tá na "Zona de Risco" física ou mental, alertando o produtor.

### 2. Dual Health System (Físico vs Mental)
No futebol, o foco é físico. No mundo Idol, a saúde mental (Pressão, Burnout, Hate da internet) é tão letal para a carreira quanto um tornozelo torcido. O Psicólogo do clube aparece no mesmo peso do Fisioterapeuta.

### 3. Ações Rápidas Preventivas
O botão "Dar folga de 3 dias" já aparece no relatório da Yumi. O produtor resolve o problema com 1 clique.

---

## Acceptance Criteria

1. Painel de status cruzando Risco Físico (Estamina/Lesão) e Risco Mental (Pressão/Burnout) de cada Idol.
2. Agrupamento visual das integrantes em Zonas de Risco (Severo, Alerta, Seguro, Lesionado).
3. Textos proativos da IA do Staff (Médico e Psicólogo) sugerindo ações corretivas (Dar folga, tirar de entrevistas).