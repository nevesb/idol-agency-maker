# Wireframe 48 — Operations Responsibilities (Delegação Operacional)

> **Status**: Draft (FM26 UI Standard)
> **Referência visual**: FM26 Staff Responsibilities (Operations Sub-tab)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/agency/operations/responsibilities`
> **GDDs**: agency-staff-operations, staff-functional

---

## Conceito

No FM, delegar quem dá as entrevistas pré-jogo, renova o contrato dos garotos da base e ajusta os amistosos.
No **Star Idol Agency**, esta é a tela de **Governança Logística e de Imagem**. O Produtor não tem tempo para agendar a van das meninas para gravar comercial de xampu todo dia, nem dar entrevista pra toda revista de fofoca. É aqui que ele define o **Diretor de PR (Relações Públicas)** e o **Head Manager (Operações Logísticas)** para o piloto automático.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | CLUBE | Carreira     [Search] [>]  |
|-------------------------------------------------------------------------------------------------|
| Visão Geral | Dinâmica | Planejamento | Grupos | OPERAÇÕES (Ativo) | Relatórios               |
|-------------------------------------------------------------------------------------------------|
| Clube > Operações > Delegação (Responsabilidades)                                               |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQ - VISÃO GERAL DE OPERAÇÕES ]  | [ CENTRO/DIR - ATRIBUIÇÕES ESPECÍFICAS (GRID) ]    |
|                                            |                                                    |
| STATUS DE DELEGAÇÃO                        | MÍDIA E RELAÇÕES PÚBLICAS                          |
| Operações de Mídia: [ Delegado ]           |                                                    |
| Operações de Jobs:  [ Manual ]             | Lidar com a imprensa local e entrevistas em shows  |
| Renovação da Base:  [ Manual ]             | [ Dropdown: Chefe de RP (Kenji) v ]                |
|                                            |                                                    |
| DIRETOR DE OPERAÇÕES                       | Controlar vazamento de escândalos de Idols         |
| [Avatar] Sr. Yorihiro                      | [ Dropdown: Produtor (Você) v ]                    |
| Carga de Trabalho: Normal                  | "Manter sob meu controle para não haver demissão." |
| Avaliação: [★★★★☆]                         |                                                    |
|                                            | Responder coletivas após premiações da Oricon      |
| DIRETOR DE CASTING                         | [ Dropdown: Líder do Grupo Principal (Sakura) v ]  |
| [Avatar] Tanaka                            |                                                    |
| Carga de Trabalho: Alta                    |----------------------------------------------------|
| Avaliação: [★★★☆☆]                         | AGENDA E JOBS COMERCIAIS                           |
|                                            |                                                    |
| CHEFE DE RP (PR)                           | Agendar e aprovar comerciais de TV e Revistas      |
| [Avatar] Kenji                             | [ Dropdown: Produtor (Você) v ]                    |
| Carga de Trabalho: Leve                    |                                                    |
| Avaliação: [★★★★★]                         | Aceitar/Rejeitar Collabs em Redes Sociais          |
|                                            | [ Dropdown: Diretor de Operações v ]               |
|                                            |                                                    |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. View Direcionada (Operations Tab)
Idêntico ao `Wireframe 14` de governança global, mas focado especificamente na aba de Operações (Logística, Mídia, Redes Sociais). A navegação horizontal coloca essa configuração sob o hub logístico do FM26.

### 2. Ações de Dropdown Instantâneas (Centro)
Uma matriz vertical. Na esquerda, você vê sua equipe corporativa (Diretor, Casting, RP). Na direita, as tarefas operacionais. Clicou no dropdown da linha "Controlar vazamento de escândalos", o jogador escolhe o Diretor de Operações ou assume a bronca ele mesmo. 

### 3. Idols como Staff de Relações Públicas (Delegação Excepcional)
No FM26 o Capitão do time é responsável por acalmar o vestiário e dar entrevistas. Adaptamos para a Líder do Grupo (Sakura) ser delegada como a "Face do Grupo" que dá as entrevistas pós-show se o produtor tiver timidez.

---

## Acceptance Criteria

1. Tela listando responsabilidades de logística, agendamento de jobs e controle de mídia/imprensa.
2. Layout vertical em dropdowns com seleção imediata do responsável pela tarefa.
3. Permissão estendida para que Idols com função "Líder" assumam papéis de Relações Públicas nas coletivas de imprensa, afetando o estresse/carisma delas.
4. Indicadores de Carga de Trabalho dos diretores na coluna da esquerda.