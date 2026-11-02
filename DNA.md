# Profits Patrol UI Design System & App DNA

This document defines the core technical and design "DNA" of the Profits Patrol platform. It serves as a comprehensive reference for future development, ensuring consistency in our signature **"Juicy" & Gamified Educational aesthetic**—heavily inspired by the **Adventure Map** and the **Landing Page**.

---

## 🎨 Design Foundations

### 1. Color System (The "Vibrant" Palette)
Our colors are chosen to be energetic, kid-friendly, and high-contrast.

**Primary Brand Colors**:
- **Energy Yellow**: `#FFC800` (BizCoins, Stars, Progression, Primary CTAs)
- **Growth Green**: `#58CC02` (Success, Nature, Checkmarks, Active states)
- **Trust Blue**: `#2B70C9` (Intelligence, Foundation, Corporate sections)
- **Action Purple**: `#A855F7` (Secondary actions, AI sections)

**Adventure Map & Landing Environments**:
- **Light Theme Gradient**: `from-green-50 via-blue-50 to-white` (Landing) or `from-[#84cc16] to-[#65a30d]` (Map)
- **Dark Theme Gradient**: `from-slate-900 to-slate-950`
- **Path/Track Colors**: Base `#a16207`, Track `#e5cca9`, Inner Dashed `#d4b895`

**Semantic Theme Colors**:
- Use Tailwind's 500/600/700 shades for UI elements (e.g., `emerald`, `orange`, `rose`, `purple`, `cyan`, `indigo`, `fuchsia`).

---

### 2. Geometry & Spacing (The "Soft & Touchable" Feel)
Everything should feel "squishy" and tactile.

- **Base Unit**: 4px scaling (Tailwind defaults).
- **Rounding Strategy**:
  - **Standard Containers**: `rounded-[24px]` or `rounded-3xl`
  - **Map Nodes/Interactive Buttons**: `rounded-[30px]` or `rounded-full`
  - **Cards**: `rounded-2xl`
- **The "3D" Effect**:
  - **Bottom Borders**: Use thick bottom borders for buttons and cards to create depth.
    - Buttons: `border-b-[4px]` or `border-b-[6px]`
    - Map Nodes: `border-b-[8px]`
  - **Shadows**: `shadow-xl` for standard elements, `shadow-2xl` for floating overlays.

---

### 3. Typography Hierarchy
- **Headers & Labels**: `font-black`, `uppercase`, `tracking-widest`.
- **Primary Body**: Bold, readable sans-serif (Inter/system-ui).
- **Emphasis**: Use text shadows or gradients for high-impact titles.

---

## 🧱 Component Architecture

### 1. The "Juicy" Button (`btn-juicy`)
Our signature button style uses a thick bottom border and a squish effect.

```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95, translateY: 4 }}
  className="bg-kid-primary text-yellow-900 px-8 py-4 rounded-xl font-black border-b-[6px] border-yellow-700 shadow-xl"
>
  GET STARTED!
</motion.button>
```

### 2. Glassmorphism & Overlays
Floating UI elements use a frosted glass effect to maintain context.
- **Light Mode**: `bg-white/90 backdrop-blur-md border-white/50 shadow-2xl`
- **Dark Mode**: `bg-slate-800/90 backdrop-blur-md border-gray-700/50 shadow-2xl`

### 3. Map Nodes & Progression
Nodes are interactive targets that show state (Locked, Active, Complete) and difficulty pips (Stars).
- **Current Node**: Features a bouncing "Let's Go!" speech bubble and a mascot presence.
- **Complete Node**: Colorized with a checkmark and 3 glowing stars.

---

## ✨ Micro-Animations & Interactivity

### 1. Motion Principles
- **Continuous Floating**: Mascots and highlights use `y: [0, -8, 0]` with `repeat: Infinity`.
- **Hover/Interaction**: High responsiveness. Scale up (1.05-1.15) on hover, scale down (0.9-0.95) on tap.
- **Entrance**: Fade-in with a slight upward slide (`y: [20, 0]`, `opacity: [0, 1]`).

### 2. Mascot (Ollie)
Ollie is our guide. He should appear on "Active" nodes, onboarding screens, and key feedback moments.
- **Animation**: Continuous floating ease-in-out.
- **Interactivity**: Often accompanied by a speech bubble (`AnimatePresence`).

---

## ♿ Accessibility & Inclusivity (WCAG AA)
- **Contrast**: Maintain 4.5:1 ratio for text.
- **Targets**: Interactive elements must be at least 44x44px.
- **Keyboard**: Explicit focus rings (`focus:ring-4 focus:ring-yellow-300`).
- **Screen Readers**: Use semantic HTML and descriptive `aria-label` attributes.

---

## ⚡ Technical DNA
- **React 19 / TypeScript / Vite**: Modern, type-safe development.
- **Framer Motion**: The standard for all layout transitions and animations.
- **Zustand**: Global state with feature slices.
- **Localization (i18next)**: Modular, RTL-aware translation structure.
- **Deterministic Rendering**: Use seeded hashes instead of `Math.random` for decorative items (Trees, Clouds) to ensure hydration stability.

---

**UI Designer**: Antigravity (UI Designer Skill Applied)
**Version**: 3.0
**Last Updated**: May 4, 2026
