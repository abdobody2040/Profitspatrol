with open('MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

addition = """
- [x] **2026-10-12** — **Rex Official Model Sheet Integration & Identity Canonicalization (T-Rex Dinosaur)**:
    - **1. Character Sheet Alignment**:
        - User uploaded official character sheet (`media_1791755240474.jpg`) defining Rex:
            - **Name**: ريكس (Rex)
            - **Species**: Cute Terracotta Red T-Rex Dinosaur (تيرانوصور / ديناصور لطيف) — NOT a raccoon.
            - **Role**: "طالب وحكم متدرب" (Student & Apprentice Judge / Sharp Negotiator & Rival).
            - **Color Palette**: Terracotta Red (`#C8553D`), Cream Snout & Belly (`#F5E6C8`), Navy Blue Cap/Apron (`#001B2A` / `#1E3A5F`), Gold Spikes & Pencil (`#F59E0B`).
            - **Signature Accessories**: Dark navy backwards baseball cap with yellow pencil tucked behind his ear; dark navy work apron with circular badge on chest.
            - **Personality**: متحمس، ذكي، فكاهي (Enthusiastic, Smart, Witty). Loves: كرة القدم، تنظيم الفرق، الألغاز (Soccer, Team Organization, Puzzles).
    - **2. Clean Character & Judge Visual Assets Generated**:
        - `public/images/characters_clean/rex_idle.png`: Crisp 260x280 transparent RGBA cutout of canonical Rex in standing front view with backwards cap, pencil behind ear, and work apron with badge.
        - `public/images/characters_clean/rex_eyebrow.png`: Clean 260x280 transparent RGBA cutout of Rex raising his eyebrow with hand on chin in calculating 3/4 pose.
        - `public/images/tank/judge_rex.jpg`: High-definition 1024x1024 3D studio portrait of Rex in calculating 3/4 pose on warm amber/midnight obsidian spotlight background.
        - `public/images/tank/tank_judges_panel.jpg`: Updated panoramic judging panel with Rex seated in seat 5 behind the executive desk and gold "REX" nameplate, with all raccoon remnants seamlessly removed.
    - **3. Full Codebase Identity Synced**:
        - Updated `rivalRex.ts`: Species changed to `'T-Rex Dinosaur'` / `'ديناصور تي-ريكس ذكي'`, role updated to apprentice judge & rival, colors updated to `#C8553D` and `#1E3A5F`.
        - Updated `RexShowdownModal.tsx`: Changed raccoon emoji 🦝 to dinosaur 🦖, updated alt text and fallback path to `/images/characters_clean/rex_idle.png`.
        - Updated `TheTankMode.tsx`: Bio updated to "المستثمر ريكس · طالب وحكم متدرب", ring styling updated to amber theme.
        - Updated `HeroMentorshipParentCard.tsx`, `storyQuests.ts`, `furniture.ts`, `BusinessDashboard.tsx`, and `assetRegistry.ts`.
        - Verified 100% test suite passing (17/17 tank tests, all green).
"""

text = text.rstrip() + '\n' + addition
with open('MEMORY.md', 'w', encoding='utf-8') as f:
    f.write(text)
print('MEMORY.md updated successfully!')
