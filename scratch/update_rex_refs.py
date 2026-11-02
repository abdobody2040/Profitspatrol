# update_rex_refs.py
import re

# 1. RexShowdownModal.tsx
with open('src/features/rivalry/components/RexShowdownModal.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('<span>🦝</span>', '<span>🦖</span>')
text = text.replace('alt="Rex the Raccoon"', 'alt="Rex the Dinosaur"')
text = text.replace("'/assets/rex_raccoon.png'", "'/images/characters_clean/rex_idle.png'")
with open('src/features/rivalry/components/RexShowdownModal.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated RexShowdownModal.tsx')

# 2. BusinessDashboard.tsx
with open('src/features/business/components/BusinessDashboard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("isArabic ? 'المنافسة الإقليمية: ريكس الراكون' : 'District Rivalry: Rex the Raccoon'",
                    "isArabic ? 'المنافسة الإقليمية: ريكس المنافس' : 'District Rivalry: Rival Rex'")
with open('src/features/business/components/BusinessDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated BusinessDashboard.tsx')

# 3. HeroMentorshipParentCard.tsx
with open('src/features/dashboard/components/HeroMentorshipParentCard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("nameAr: 'الراكون ريكس',", "nameAr: 'ريكس (المنافس الذكي)',")
text = text.replace("icon: '🦝',", "icon: '🦖',", 1)
text = text.replace("color: '#F97316',", "color: '#C8553D',", 1)
with open('src/features/dashboard/components/HeroMentorshipParentCard.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated HeroMentorshipParentCard.tsx')

# 4. storyQuests.ts
with open('src/features/characters/data/storyQuests.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("hqItemNameEn: 'Golden Rex Raccoon Champion Statue'", "hqItemNameEn: 'Golden Rex Champion Statue'")
text = text.replace("hqItemNameAr: 'تمثال الراكون ريكس الذهبي للشراكة التنافسية'", "hqItemNameAr: 'تمثال ريكس الذهبي للشراكة التنافسية'")
text = text.replace("hqItemIcon: '🦝'", "hqItemIcon: '🦖'")
with open('src/features/characters/data/storyQuests.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated storyQuests.ts')

# 5. furniture.ts
with open('src/features/hq/data/furniture.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("name: 'Golden Rex Raccoon Champion Statue',", "name: 'Golden Rex Champion Statue',")
text = text.replace("icon: '🦝',", "icon: '🦖',")
with open('src/features/hq/data/furniture.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated furniture.ts')

# 6. assetRegistry.ts
with open('src/lib/assets/assetRegistry.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("path: '/assets/characters/rex_default.png'", "path: '/images/characters_clean/rex_idle.png'")
text = text.replace("altTextEn: 'Rex the Business Rival'", "altTextEn: 'Rex the Dinosaur (Business Rival)'")
with open('src/lib/assets/assetRegistry.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated assetRegistry.ts')

# 7. TheTankMode.tsx
with open('src/features/tank/components/TheTankMode.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("case 'cash': return { role: 'المستثمر ريكس · مستر كاش', lookingFor: 'يبحث عن تدفق نقدي سريع وعوائد سخية ولن يتردد في خفض تقييمك' };",
                    "case 'cash': return { role: 'المستثمر ريكس · طالب وحكم متدرب', lookingFor: 'مفاوض ذكي يبحث عن تدفق نقدي سريع وعوائد سخية؛ ولن يتردد في خفض تقييمك!' };")
text = text.replace("case 'cash': return { role: 'Rex · Wall Street Mogul', lookingFor: 'Fast positive cash flow; tough negotiator who wants high equity' };",
                    "case 'cash': return { role: 'Rex · Apprentice Judge & Negotiator', lookingFor: 'Fast positive cash flow; tough, clever negotiator who drives a hard bargain' };")
text = text.replace("case 'cash': return 'border-purple-500 dark:border-purple-500 ring-2 ring-purple-500/40 shadow-purple-500/20';",
                    "case 'cash': return 'border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/20';")
with open('src/features/tank/components/TheTankMode.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated TheTankMode.tsx')
