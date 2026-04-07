# Wireframe 54 — Pre-Show Briefing (O Vestiário)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Pre-Match Team Talk / Dressing Room  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/shows/briefing`  
> **GDDs**: show-system, agency-staff-operations

---

## Conceito

A icônica tela de "Team Talk" do Football Manager, onde você grita com os jogadores ou os tranquiliza antes de entrarem em campo.
No **Star Idol Agency**, esta é a tela do **Camarim / Briefing**. Faltam 10 minutos para subir no palco. O produtor precisa lidar com as expectativas do evento. Falar para garotas de 15 anos "Não importa se errarmos, vamos nos divertir" as relaxa. Dizer "A mídia inteira está assistindo, não cometam um único erro" aumenta o Foco, mas explode a barra de Pressão (Nervosismo).

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | DIA DE SHOW (Ativo) | Clube | Carreira         |
|-------------------------------------------------------------------------------------------------|
| Próximo Show | Formações | Setlist | Palco e Figurino | Ensaios | CAMARIM (Ativo)               |
|-------------------------------------------------------------------------------------------------|
| FALTAM 15 MINUTOS PARA O SHOW: Celestial Nine - Tokyo Dome                                      |
+-------------------------------------------------------------------------------------------------+
| [ COLUNA ESQUERDA - DISCURSO DO PRODUTOR ] | [ COLUNA CENTRO/DIR - REAÇÃO DO GRUPO ]             |
|                                            |                                                     |
| TONE DO DISCURSO (Abordagem)               | MENTALIDADE ATUAL DA EQUIPE                         |
| [ Dropdown: Encorajador (Calmo) v ]        | Pressão Média do Evento: [★★★★☆] Muito Alta       |
|                                            |                                                     |
| OPÇÕES DE FALA (TEAM TALK)                 | REAÇÕES INDIVIDUAIS (BODY LANGUAGE)                 |
| ( ) "Apenas vão lá e divirtam-se!"         |                                                     |
|     (Alivia pressão, reduz foco técnico)   | [Avatar] Sakura (Center)                            |
|                                            | Estado: Motivada e Pronta                           |
| (*) "Vocês treinaram duro. Confio em vocês"| Reação à Fala: [Verde] "Parece revigorada."         |
|     (Neutro, mantém confiança)             |                                                     |
|                                            | [Avatar] Aiko (Main Vocal)                          |
| ( ) "A Titam Ag. falhou ontem. Provem que  | Estado: Extremamente Nervosa (Mãos Tremendo)        |
|     somos os Número 1 da Oricon!"          | Reação à Fala: [Amarelo] "Achou a cobrança pesada." |
|     (Aumenta o Foco; explode a Pressão)    |                                                     |
|                                            | [Avatar] Yumi (Lead Dancer)                         |
| CONVERSA INDIVIDUAL (Side Talk)            | Estado: Confiante / Relaxada                        |
| [ Falar apenas com Aiko ]                  | Reação à Fala: [Verde] "Deu um sorriso de escárnio" |
| Dizer: "Esqueça os fotógrafos, concentre-  |                                                     |
| se apenas na minha voz de fundo."          |-----------------------------------------------------|
|                                            | [ Botão Gigante Verde: MANDAR PRO PALCO ]           |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Tone & Talk Mechanics (Tom e Reação)
Mecânica amada do FM: você escolhe como fala (Gritando, Calmo, Asserivo) e a frase. A direita da tela é puro feedback de "Linguagem Corporal" (Body Language). Uma Idol sob pressão tremendo precisa de uma fala calma.

### 2. Side Talks (Falas Individuais)
Você fez o discurso geral para o grupo (Centro da Roda), mas percebeu que Aiko ainda está tremendo. A mecânica de "Conversa Individual" do FM permite o "abraço no canto do vestiário" para salvar o mental da Main Vocal.

---

## Acceptance Criteria

1. Tela apresenta opções de "Tom de Voz" e "Frase Pronta" relacionadas ao contexto do show (Rivalidade, Pressão, Finais).
2. Painel de feedback imediato onde cada integrante reage à fala (Ficou Confiante, Irritada, Nervosa, Motivada) baseado em sua personalidade escondida (Professionalism, Handling Pressure).
3. Opção de interações 1-a-1 para idols que reagiram mal ou estão em estados mentais críticos antes do show começar.