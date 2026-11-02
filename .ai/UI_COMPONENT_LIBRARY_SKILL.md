# UI_COMPONENT_LIBRARY_SKILL.md

# ProfitsPatrol UI Component Library

## Purpose

This skill defines all reusable UI components for ProfitsPatrol.

ProfitsPatrol is a gamified business education platform.

It is NOT:

* LMS
* School Portal
* ERP
* Admin Dashboard
* Corporate SaaS

It IS:

* Tycoon RPG
* Business Adventure
* Learning Game
* Kid-Friendly Simulator

---

# Global Design Language

## Visual References

* Monopoly GO
* Clash Royale
* Brawl Stars
* Duolingo
* Roblox Tycoon

---

## Brand Colors

### Primary Orange

```css
#F7931A
```

### Dark Orange

```css
#E56F00
```

### Gold

```css
#FFC83D
```

### Navy

```css
#0B1F3A
```

### Cream

```css
#FFF2CC
```

---

# Global Component Rules

## Border Radius

Small: 16px

Medium: 24px

Large: 32px

Hero: 40px

Never use sharp corners.

---

## Shadows

Use layered shadows.

Example:

```css
box-shadow:
0 8px 24px rgba(0,0,0,.12),
0 16px 40px rgba(0,0,0,.15);
```

---

## Buttons

Rules:

* Large
* Rounded
* High contrast
* Clear reward indication

Bad:

```txt
Continue
```

Good:

```txt
▶ Start Mission
+50 XP
```

---

## Cards

Every card must answer:

"What can I earn?"

Include:

* Reward
* XP
* Progress
* Difficulty

---

# Core Components

## XPBar

Purpose:

Shows progression.

Contains:

* Current XP
* Required XP
* Animated fill
* Level badge

Example:

```txt
LV 24

██████████░░░

8450 / 12000 XP
```

---

## PPTokenWidget

Displays:

* PP Tokens
* Daily gain
* Income rate

---

## StreakWidget

Displays:

* Current streak
* Next reward
* Reward preview

---

## QuestCard

Contains:

* Mission title
* Progress
* Reward
* Difficulty
* CTA

Example:

```txt
Open First Store

3 / 5

Reward:
100 PP
50 XP
```

---

## AchievementCard

Contains:

* Icon
* Name
* Description
* Unlock state

---

## AcademyCard

Contains:

* Lesson
* XP reward
* Estimated time
* Completion %

---

## GameCard

Contains:

* Cover image
* Difficulty
* Duration
* XP reward
* PP reward

---

## RewardPopup

Always animated.

Example:

```txt
+100 PP

+50 XP

LEVEL UP
```

---

## AvatarWidget

Contains:

* Character
* Outfit
* Cosmetic items
* Level

---

## HQWidget

Most important component.

Contains:

* HQ Preview
* Collect Income
* Upgrade
* Employees

---

## EmployeeCard

Contains:

* Employee Avatar
* Skill
* Salary
* Income Boost

---

## CardAcademyCard

Contains:

* Rarity
* Skill
* Level
* Progress

Rarities:

Common

Rare

Epic

Legendary

---

# Navigation

Use:

Bottom Navigation

Maximum:

5 items

Example:

🏠 Home

🎮 Play

🏢 HQ

🃏 Academy

👤 Profile

---

# Owl Usage

The owl mascot must appear in:

* Tutorials
* Empty states
* Rewards
* Loading screens
* Daily missions
* Achievement unlocks

Never hide the mascot.

The mascot is a core product asset.

---

# Animation Rules

Use Framer Motion.

Required:

* Button hover
* Card hover
* Rewards
* XP gain
* Level up
* Achievement unlock

Avoid static UI.

---

# Forbidden Patterns

Never generate:

* Enterprise dashboards
* ERP layouts
* KPI tables
* Corporate SaaS cards
* Dense forms
* Data-heavy screens

If uncertain:

Choose game UI over dashboard UI.
