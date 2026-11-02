# ProfitsPatrol Visual Design System

## Purpose

This file controls the visual appearance of ProfitsPatrol.

Use together with:

* GLOBAL_PROJECT_PROMPT.md
* UI_COMPONENT_LIBRARY.md

Visual rules only.

---

# Core Aesthetic

Juicy

Gamified

Friendly

Rewarding

Premium Mobile Game

Inspired by:

* Toca Boca
* Monopoly GO
* Clash Royale
* Brawl Stars
* Roblox Tycoon

---

# Brand Mascot

ProfitsPatrol Owl

The owl is the face of the product.

The owl should appear in:

* Tutorials
* Empty States
* Success Screens
* Reward Screens
* Daily Missions
* Onboarding

The owl should feel alive.

---

# Color Palette

## Brand Orange

#F7931A

Primary actions.

---

## Deep Orange

#E56F00

Pressed states.

---

## Gold

#FFC83D

Rewards.

Coins.

Stars.

Rare items.

---

## Navy

#0B1F3A

Primary backgrounds.

Game HUD.

Panels.

---

## Cream

#FFF2CC

Cards.

Highlights.

Friendly surfaces.

---

# Legacy Accent Colors

Growth Green

#58CC02

Success.

---

Trust Blue

#2B70C9

Educational content.

---

Action Purple

#A855F7

AI systems.

Special abilities.

Epic rewards.

---

# Typography

Primary:

Inter

Fallback:

System UI

---

# Headers

font-black

uppercase

tracking-widest

High contrast.

---

# Body Text

Readable.

Simple.

Kid friendly.

Avoid dense text blocks.

---

# Geometry

## Containers

rounded-3xl

24px

---

## Hero Cards

rounded-[32px]

---

## Buttons

rounded-full

---

## Interactive Nodes

Circular whenever possible.

---

# 3D Treatment

ProfitsPatrol uses soft toy-like depth.

Buttons should feel pressable.

Use:

border-b-[6px]

for primary actions.

---

# Shadows

Cards:

shadow-xl

---

Floating Elements:

shadow-2xl

---

Reward Elements:

Glow + Shadow

---

# Motion

## Hover

scale: 1.05

---

## Tap

scale: 0.95

translateY: 4

---

## Rewards

Coin burst

XP burst

Particle effects

---

## Mascot

Floating idle motion

y: [0,-8,0]

Repeat forever.

---

## Page Entry

Fade + Slide

opacity: [0,1]

y: [20,0]

---

# Glassmorphism

Light:

bg-white/90

backdrop-blur-md

border-white/50

shadow-2xl

---

Dark:

bg-slate-800/90

backdrop-blur-md

border-gray-700/50

shadow-2xl

---

# Mobile Rules

Mobile first.

Always.

Desktop adapts from mobile.

---

# Touch Targets

Minimum:

44x44

Preferred:

56x56

---

# Card Rules

Every card should have:

Icon

Title

Reward

Progress

Action

Never display plain text-only cards.

---

# Reward Visual Language

Coins = Gold

XP = Purple

Level Up = Orange + Gold

Achievements = Gold Glow

Legendary = Animated Shine

---

# Rarity Colors

Common

#94A3B8

Rare

#3B82F6

Epic

#A855F7

Legendary

#FFC83D

Mythic

#FF6B00

---

# Forbidden Visual Patterns

Do not create:

* Enterprise dashboards
* SaaS admin panels
* Corporate analytics pages
* Spreadsheet-style layouts
* Dense data tables

If unsure:

Choose game UI over dashboard UI.
