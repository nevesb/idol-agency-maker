# Procedural Visual Generator

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

O Procedural Visual Generator cria visuais únicos estilo otome/VTuber pra
cada idol usando composição modular de partes (cabelo, rosto, olhos, corpo,
roupas). Usa a visual_seed de cada idol pra gerar deterministicamente o
mesmo visual em todo playthrough. ~5.000+ visuais únicos precisam ser
gerados com qualidade suficiente pra o jogador se apegar emocionalmente.

## Player Fantasy

A fantasia é de **identidade visual**. Cada idol tem um rosto que o jogador
reconhece. "A de cabelo rosa com olhos verdes é minha idol SSS". Visual
conecta os stats abstratos a uma pessoa. Sem visual, são só números.

## Detailed Design

### Core Rules

#### 1. Sistema Modular de Partes

```
Visual = Combinar:
  face_shape:     15+ formatos
  skin_tone:      10+ tons
  eye_shape:      20+ formatos
  eye_color:      15+ cores
  hair_style:     50+ estilos
  hair_color:     30+ cores
  eyebrows:       10+ formatos
  mouth:          10+ formatos
  nose:           8+ formatos
  accessories:    20+ (óculos, piercings, etc.)
  outfit_base:    30+ (uniforme, casual, stage)
  body_type:      5+ (slim, average, athletic)
  height:         range (150-180cm visual)

Total combinações: > 10 bilhões (suficiente pra 5000+ únicos)
```

#### 2. Coerência com Stats

- **Visual** (stat) alto → partes mais atraentes selecionadas pela seed
- **Região** afeta tendências (Fukuoka = Visual alto = rostos mais refinados)
- **Gênero** determina pool de partes
- **Idade** afeta: idol jovem = rosto mais jovem, veterana = features maduras
- **Cirurgia estética** (Personal Finance) → visual muda permanentemente (+Visual stat)

#### 3. Determinismo

- Mesma visual_seed = mesmo visual, sempre, em qualquer plataforma
- PRNG determinístico (PCG/xoshiro256) pra selecionar partes
- Partes são assets estáticos (sprites/textures) combinados em runtime
- Não usa IA generativa -- composição determinística de assets pré-feitos

#### 4. Scope Tiers

| Tier | Qualidade | Quando |
|---|---|---|
| **MVP** | Avatar generator básico: 2 tipos de cabelo, 2 de olhos, múltiplas cores, roupa simples com cores variadas. Suficiente pra diferenciar | MVP |
| **Alpha** | Sistema modular expandido (10+ cabelos, 10+ olhos, face shapes, acessórios) | Alpha |
| **Full Vision** | Completo (expressões, poses, aging, cirurgia visual) | Full Vision |

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Idol Database** | visual_seed por idol |
| **Stats System** | Visual stat influencia seleção de partes |
| **Idol Personal Finance** | Cirurgia → visual atualizado |
| **Idol Profile UI** | Avatar exibido no perfil |
| **Dashboard UI** | Avatares no roster strip |

## Dependencies

**Hard**: Idol Database (visual_seed)
**Soft**: Stats (Visual stat), Personal Finance (cirurgia)
**Depended on by**: Todas UIs que mostram avatar

## Acceptance Criteria

1. Mesma seed gera mesmo visual em qualquer plataforma
2. 5.000+ visuais são visualmente distintos
3. Visual stat alto correlaciona com visual mais atraente
4. Região influencia tendências de aparência
5. Combinação de partes roda em <50ms (runtime)
6. Cirurgia altera visual permanentemente
