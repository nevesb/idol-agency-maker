# Wireframe 74 — Settings & Accessibility (Configurações do Jogo)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Preferences / Options Panel  
> **Resolução alvo**: 1920×1080 (PC-first) ou Modal overlay  
> **Rota**: `/settings` ou Modal overlay (acessível via Menu do Jogo)  
> **GDDs**: settings-accessibility

---

## Conceito

No FM26, o painel de Preferências é acessível a qualquer momento pelo menu do jogo. Ele agrupa opções em abas organizadas: interface, áudio, notificações, acessibilidade.
No **Star Idol Agency**, esta é a tela de **Configurações Gerais**. Tudo que o jogador precisa personalizar — idioma, velocidade da simulação, áudio, acessibilidade, saves — fica centralizado aqui. Funciona como modal overlay sobre qualquer tela do jogo, sem perder contexto.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira | MENU DO JOGO(V) |
|-------------------------------------------------------------------------------------------------|
|                                                                                                 |
|   +-------------------------------------------------------------------------------------------+ |
|   | CONFIGURAÇÕES DO JOGO                                                      [ X Fechar ]   | |
|   |-------------------------------------------------------------------------------------------| |
|   | [Geral] [Áudio] [Acessibilidade] [Save & Nuvem] [Tutorial] [Notificações]                | |
|   |===========================================================================================| |
|   |                                                                                           | |
|   | === ABA: GERAL (Ativa) ===============================================================   | |
|   |                                                                                           | |
|   | Idioma                          [ EN ▾ ]  (EN / PT-BR / JA)                               | |
|   | Tema                            ( ) Claro   (●) Escuro                                    | |
|   | Velocidade de Simulação         [×0.5] [×1] [●×2] [×4]                                   | |
|   |                                                                                           | |
|   | === ABA: ÁUDIO =======================================================================   | |
|   |                                                                                           | |
|   | Volume da Música                [========|====] 65%                                       | |
|   | Volume dos Efeitos Sonoros      [=====|=======] 40%                                       | |
|   | 🔇 Silenciar Tudo               [ OFF ]                                                   | |
|   | (Nota: sistema de áudio completo será expandido em futuras versões)                        | |
|   |                                                                                           | |
|   | === ABA: ACESSIBILIDADE ============================================================   | |
|   |                                                                                           | |
|   | Modo Daltonismo                 [ OFF ] (Protanopia / Deuteranopia / Tritanopia)           | |
|   |   Preview: [Cores Normais ■■■] → [Cores Ajustadas ■■■]                                   | |
|   | Tamanho da Fonte                (Pequena) (●Normal) (Grande) (Muito Grande)                | |
|   | Alto Contraste                  [ OFF ]                                                    | |
|   | Simplificar UI                  [ OFF ] (remove animações decorativas e reduz densidade)   | |
|   | Velocidade de Animação          (●Normal) (Rápida) (Instantânea)                          | |
|   |                                                                                           | |
|   | === ABA: SAVE & NUVEM ==============================================================   | |
|   |                                                                                           | |
|   | Auto-Save                       [● ON ]  (a cada avanço de semana)                        | |
|   | Cloud Save                      [ OFF ]  (requer login Supabase)                          | |
|   | [ Exportar Save (.json) ]       [ Importar Save ]                                         | |
|   | Último save: 07/04/2026 14:32                                                             | |
|   |                                                                                           | |
|   | === ABA: TUTORIAL ================================================================   | |
|   |                                                                                           | |
|   | Modo Tutorial                   [● ON ]                                                   | |
|   | [ Resetar Tutorial ]            (reexibe todas as dicas desde o início)                    | |
|   | Nível do Assistente             (●Básico) (Avançado)                                      | |
|   |   Básico: dicas essenciais | Avançado: sugestões táticas e financeiras                    | |
|   |                                                                                           | |
|   | === ABA: NOTIFICAÇÕES ===========================================================   | |
|   |                                                                                           | |
|   | Notificações Push               [● ON ]                                                   | |
|   | Tipos:                                                                                    | |
|   |   [✓] Resultados de Shows                                                                | |
|   |   [✓] Transferências e Contratos                                                         | |
|   |   [✓] Lesões e Saúde                                                                     | |
|   |   [ ] Rumores e Mídia                                                                     | |
|   |   [✓] Finanças (alertas de orçamento)                                                    | |
|   |   [ ] Social Media (tendências)                                                           | |
|   |                                                                                           | |
|   |-------------------------------------------------------------------------------------------| |
|   |                                          [ Aplicar Mudanças ]   [ Restaurar Padrões ]     | |
|   +-------------------------------------------------------------------------------------------+ |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. Tabbed Modal (Preferências por Categorias)
Exatamente como o FM26 organiza suas preferências em abas horizontais. Cada aba foca em um domínio. O jogador nunca precisa rolar uma lista infinita de opções — seleciona a aba e vê apenas o relevante.

### 2. Overlay sem Perda de Contexto
O modal abre sobre a tela atual. O jogador pode estar no meio de uma negociação de contrato, abrir Settings, ajustar a velocidade de simulação, fechar e continuar exatamente onde estava. Nenhuma navegação de rota é necessária.

### 3. Preview de Acessibilidade em Tempo Real
O modo daltonismo mostra um preview inline das cores ajustadas antes de aplicar. O jogador vê o impacto visual imediatamente, sem ciclo de tentativa e erro.

### 4. Save Export como Safety Net
Exportar save como `.json` dá controle ao jogador sobre seus dados. Essencial para um jogo single-player onde perder um save de 200 horas é catastrófico.

---

## Acceptance Criteria

1. Modal overlay acessível de qualquer tela via Menu do Jogo, sem navegação de rota.
2. Abas funcionais para Geral, Áudio, Acessibilidade, Save & Nuvem, Tutorial e Notificações.
3. Troca de idioma (EN/PT-BR/JA) aplica-se imediatamente à interface sem recarregar.
4. Slider de velocidade de simulação altera o tick rate do Web Worker em tempo real.
5. Modo daltonismo com preview visual inline antes de confirmar a aplicação.
6. Tamanho de fonte e alto contraste aplicam-se à interface inteira via variáveis CSS.
7. Auto-save ativo por padrão; Cloud Save desabilitado até login Supabase.
8. Export/Import de save gera e aceita arquivo `.json` compatível.
9. Reset de tutorial reexibe a sequência completa de onboarding (integração com Wireframe 75).
10. Botão "Restaurar Padrões" reverte todas as configurações ao estado inicial com confirmação.
