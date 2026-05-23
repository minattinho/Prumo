---
name: Prumo
description: Marketplace brasileiro de prestadores de serviços verificados
colors:
  night-foundation: "#1A2B4A"
  work-blue: "#1A5DB8"
  sky-scaffold: "#4A90E2"
  blueprint-tint: "#EAF0FB"
  construction-orange: "#E8761A"
  fieldwork-gray: "#555555"
  pale-blueprint: "#F4F7FB"
  grid-line: "#E2EAF4"
  canvas: "#FFFFFF"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.work-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#154fa0"
  button-cta:
    backgroundColor: "{colors.construction-orange}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "14px 28px"
  button-cta-hover:
    backgroundColor: "#cc6515"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.night-foundation}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.work-blue}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
---

# Design System: Prumo

## 1. Overview

**Creative North Star: "The Site Foreman"**

Prumo's visual system is built around the authority of competence. Not corporate-polished, not startup-flashy. A site foreman knows every trade, has seen a thousand projects, and communicates in direct commands. The interface carries that same quality: clear hierarchy, no decorative noise, trust established through demonstrated capability rather than reassurance theater.

Color is used structurally, not decoratively. Night Foundation navy anchors the heavy surfaces (heroes, trust sections); Work Blue claims all interactive intent; Construction Orange fires once on the most important conversion action per surface. Everything else recedes, letting the professional's portfolio photography carry the visual weight. The system is committed on hero surfaces (Night Foundation covers 30-50% of landing-page area) and restrained everywhere else.

Motion is minimal: state changes only. No choreography, no entrance animations competing with portfolio images. The work speaks; the interface steps back.

**Key Characteristics:**
- Flat-by-default surfaces with depth only on hover/elevation states
- Single typeface (Inter) with strong weight contrast driving hierarchy
- Construction Orange reserved for exactly one primary CTA per surface
- Professional cards are the only card pattern; all other groupings use dividers or inline layouts
- Generous touch targets (44px minimum) for mobile tradespeople in the field
- Dark hero surfaces use tonal layering (white/5-10 opacity) not shadows

## 2. Colors: The Foreman's Palette

Committed on hero surfaces, restrained everywhere else. Night Foundation is structural; Work Blue is directional; Construction Orange is a single alert.

### Primary
- **Night Foundation** (`#1A2B4A`): Hero backgrounds, trust sections, footer. The weight of the system. Carries the authority of a foundation wall: solid, load-bearing, proven.
- **Work Blue** (`#1A5DB8`): All interactive elements, links, active nav states, icon accents, CTA buttons (non-orange). The unambiguous signal: this is what you tap or click.
- **Sky Scaffold** (`#4A90E2`): Supporting interactive states, map markers, informational accents, progress indicators. Secondary to Work Blue; never competes with it.

### Secondary
- **Construction Orange** (`#E8761A`): Single high-value CTA per surface: professional registration, subscription checkout, the most important conversion action visible. Scarcity is the point.

### Neutral
- **Blueprint Tint** (`#EAF0FB`): Secondary page backgrounds, sidebar surface, selected nav items, avatar fallback background.
- **Pale Blueprint** (`#F4F7FB`): Tertiary surfaces, stat boxes inside professional cards, muted info regions.
- **Grid Line** (`#E2EAF4`): Borders, dividers, input outlines at rest.
- **Fieldwork Gray** (`#555555`): All body copy, secondary labels, descriptive text. Not black; close enough to read clearly in daylight on a phone.
- **Canvas** (`#FFFFFF`): Base page background, card surfaces, header.

### Named Rules
**The One Orange Rule.** Construction Orange fires on one element per surface. Not two. Never on decorative or supporting elements. If you are considering putting Construction Orange on a secondary CTA, that CTA is not secondary enough.

**The Night Foundation Commitment Rule.** Night Foundation is not a card color or an accent. It covers full sections. When it appears, it should feel immersive, not incidental.

## 3. Typography

**Display / Body Font:** Inter (with ui-sans-serif, system-ui, sans-serif fallback chain)

Inter at high weight contrast. Single typeface; hierarchy achieved entirely through weight (400 / 600 / 700) and scale. The pairing is direct, legible, and unpretentious, like the brand.

### Hierarchy
- **Display** (700, clamp(2.5rem, 6vw, 3.75rem), line-height 1.1, -0.02em tracking): Hero headline. "Encontre os melhores prestadores de serviços" size. Tight leading for impact.
- **Headline** (700, clamp(1.5rem, 4vw, 2rem), line-height 1.2, -0.01em tracking): Section headings, page titles. "O que você precisa?", "Como funciona".
- **Title** (600, 1.125rem, line-height 1.3): Card names, subsection headers, professional names.
- **Body** (400, 0.9375rem, line-height 1.6): Primary reading text. Max line length 65-75ch enforced.
- **Label** (600, 0.75rem, line-height 1.4, 0.06em tracking, UPPERCASE): Section overlines ("CATEGORIAS", "PROCESSO", "SEGURANÇA"), nav group headers, badge text.

### Named Rules
**The Weight Ladder Rule.** No two adjacent text elements share the same weight. A 600 title is followed by 400 body or 700 display, never another 600. Flat-weight hierarchies are invisible.

**The Overline Pattern.** Sections open with a label (0.75rem, 600, uppercase, orange, 0.06em tracking) before the headline. This is the system's primary section-entry grammar. Do not replace it with decorative rules, underlines, or icon ornaments.

## 4. Elevation

Near-flat system. Portfolio photography provides the visual depth; shadows would compete. Surfaces are flat at rest; minimal lift on interactive cards communicates affordance without decoration.

Dark sections (Night Foundation) use tonal opacity layering instead of shadows: `bg-white/5` for base, `bg-white/10` on hover. Shadows on dark surfaces are invisible anyway; tonal shifts do the work.

### Shadow Vocabulary
- **card-rest** (`0 1px 4px rgba(0,0,0,0.08)`): Resting professional card. Barely visible; establishes card edge without elevation theater.
- **card-hover** (`0 4px 16px rgba(0,0,0,0.12)` + `translateY(-2px)`): Interactive card on hover. Combined with a 2px lift transform; the physical and optical shadow move together.
- **header** (`0 1px 0 #E2EAF4` via border-b): Sticky header separation from page content.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow communicates elevation (hover, modal, focused input context), not brand personality. A component that uses shadow to look "premium" has failed the Foreman test.

## 5. Components

### Buttons
- **Shape:** Gently curved (8px radius) for primary/default; 16px for large hero CTAs (rounded-2xl); 9999px never used on buttons.
- **Primary (Work Blue):** `#1A5DB8` background, white text, 8px radius, 8-16px padding. Min height 44px on mobile. Hover to `#154fa0`. Focus-visible: 3px ring at Work Blue/50.
- **CTA (Construction Orange):** `#E8761A` background, white text, 16px radius, 14-28px padding. Hover to `#cc6515`. One per surface.
- **Ghost:** Transparent, Work Blue text, 8px radius. Hover: Blueprint Tint background, Night Foundation text.
- **Outline:** Transparent, border-grid-line, Night Foundation text. Hover: Pale Blueprint background.
- **Destructive:** Destructive/10 background, destructive text. For delete/cancel flows only.

### Specialty Chips
- **Style:** Rounded-full, `#f1f5f9` background, Fieldwork Gray text, text-xs (0.75rem), px-2.5 py-1. No border.
- **Category filter chips:** Per-category color pairs (amber, zinc, cyan, rose, green). Active state fills with category color + white text. Selected state uses the full color.

### Professional Card (signature component)
The most important component in the system. The professional's evidence, not a product listing.
- **Shape:** 12px radius (rounded-card), white background, border-slate-200.
- **Rest state:** `0 1px 4px rgba(0,0,0,0.08)` shadow, flat.
- **Hover:** -2px Y lift, `0 4px 16px rgba(0,0,0,0.12)`, border shifts to Sky Scaffold/30. Portfolio images scale 105% on group hover.
- **Structure top to bottom:** avatar (56px circle, Blueprint Tint fallback) + name/specialty/location row + verification badge; specialty chips (secondary specialties, 1-2 max visible); 2-col stat grid (rating, completed services); 3-up portfolio strip (square, equal columns, Camera placeholder icon); availability badge (emerald-50); full-width primary button.
- **Internal padding:** 16px (p-4) for all sections; 12px inner cells in stat grid.

### Cards (trust/feature cards)
- **Corner Style:** 16px (rounded-2xl).
- **On dark surfaces (Night Foundation):** `bg-white/5` base, `border-white/10`, hover to `bg-white/10 border-white/20`.
- **On light surfaces:** white background, border-gray-100, shadow-card.
- **Internal Padding:** 28px (p-7) for trust/feature contexts.

### Inputs / Fields
- **Style:** Stroke input, transparent background, Grid Line border (`#E2EAF4`), 8px radius, h-8 (32px default) or h-10 (40px for search).
- **Focus:** Work Blue border + 3px Work Blue/20 ring.
- **Error (aria-invalid):** Destructive border + 3px destructive/20 ring.
- **Disabled:** bg-input/50, pointer-events-none, 50% opacity.
- **Placeholder:** Fieldwork Gray at 60% opacity.

### Navigation (Header)
- **Style:** White, sticky, border-b border-gray-100 (`#F1F5F9` equivalent), shadow-sm. Height 64px.
- **Links:** Fieldwork Gray default, hover to Work Blue. font-medium, text-sm.
- **CTA in nav:** Construction Orange, white text, px-4 py-2, 8px radius. "Anunciar serviço." One orange element in the header.
- **Active/focus underline:** Work Blue transition-colors, no underline at rest.

### Navigation (Dashboard Sidebar)
- **Style:** White, border-r border-gray-100, full-height. Width 256px. Logo at top.
- **Group labels:** 10px, 600, uppercase, 0.06em tracking, gray-400.
- **Active item:** Blueprint Tint (`#EAF0FB`) background, Work Blue text, 600 weight, right-side 6px dot indicator (Work Blue).
- **Default item:** Fieldwork Gray, hover bg-gray-50 Night Foundation text.
- **Footer:** Logout button with hover:bg-red-50 hover:text-red-600 for clear destructive affordance.

## 6. Do's and Don'ts

### Do:
- **Do** use Night Foundation for full-bleed hero and trust sections; committed coverage (30-50% of the surface) earns the palette.
- **Do** reserve Construction Orange for the single highest-priority CTA on any screen. Its singularity is what gives it conversion power.
- **Do** lead professional profile screens with portfolio photographs above the fold; the work is the argument, not the badge.
- **Do** enforce WCAG AA contrast on all text, including body copy on Blueprint Tint backgrounds. Mobile tradespeople read in direct sunlight.
- **Do** use 44px minimum touch targets for all interactive elements, especially in dashboard workflows.
- **Do** open sections with the overline label pattern: uppercase, Construction Orange, 0.06em tracking, then headline. This is the system's grammar.
- **Do** use font weight as the primary hierarchy tool. Scale changes alone are not enough.
- **Do** let portfolio images carry visual weight. The interface steps back; the work steps forward.

### Don't:
- **Don't** use GetNinjas-style or Habitissimo-style cluttered layouts with more than 3 content types in a single card. Prumo is a curated directory, not a listing board.
- **Don't** use generic SaaS aesthetics: no gradient blobs as decoration, no floating UI mockup screenshots in heroes, no purple or teal palettes, no "we're a funded startup" investor-pitch tone.
- **Don't** build OLX-style or Mercado Livre-style classifieds grids with high visual noise and minimal information density per item.
- **Don't** apply border-left greater than 1px as a colored accent stripe on cards, alerts, or list items. Use full borders, background tints, or nothing.
- **Don't** use gradient text (background-clip: text with gradient background). Emphasis through weight or size, always.
- **Don't** use glassmorphism decoratively. Blurred frosted panels are not trust signals.
- **Don't** build identical icon + heading + text cards in a repeating grid. Break with size variation, prose sections, or list layouts.
- **Don't** use modals as the default for forms with more than 3 fields, confirmations that have context, or detail views. Inline, progressive, or new-page alternatives first.
- **Don't** animate layout properties (width, height, padding, top/left). State-change transitions only: color, opacity, transform, shadow.
- **Don't** write em dashes or double-hyphens in UI copy. Commas, colons, or periods.
- **Don't** place Construction Orange on decorative elements, background tints, or supporting CTAs. If it is orange, it is the most important action on this surface.
