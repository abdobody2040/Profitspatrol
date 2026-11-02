# -*- coding: utf-8 -*-
import json
import os

# Base directory for modular assets
BASE_DIR = 'public/images/personal profile/PNG'

def check_file(rel_path):
    rel = rel_path.replace('%20', ' ')
    p = os.path.join('public', rel.lstrip('/'))
    exists = os.path.exists(p)
    if not exists:
        print(f"WARNING: File does not exist: {p}")
    return exists

print("Verifying catalog paths...")

# We will generate the TypeScript code for avatarCatalog.ts
items = []

# 1. Skin Tints
skin_tints = [
    ('kenney_skin_tint_1', 'Fair Founder Tone', 'بشرة فاتحة للمؤسس', 'Tint 1', '#FFE0B1'),
    ('kenney_skin_tint_2', 'Light Peach Tone', 'بشرة حنطية فاتحة', 'Tint 2', '#FCD49C'),
    ('kenney_skin_tint_3', 'Warm Wheat Tone', 'بشرة قمحية دافئة', 'Tint 3', '#E8B37A'),
    ('kenney_skin_tint_4', 'Golden Olive Tone', 'بشرة زيتونية ذهبية', 'Tint 4', '#D89E66'),
    ('kenney_skin_tint_5', 'Sun-Kissed Bronze', 'بشرة برونزية مشمسة', 'Tint 5', '#C6834E'),
    ('kenney_skin_tint_6', 'Warm Amber Chestnut', 'بشرة كستنائية عنبرية', 'Tint 6', '#B06836'),
    ('kenney_skin_tint_7', 'Deep Mocha Tone', 'بشرة موكا عميقة', 'Tint 7', '#8A4B23'),
    ('kenney_skin_tint_8', 'Royal Espresso Tone', 'بشرة إسبريسو ملكية', 'Tint 8', '#603014'),
]

for item_id, name, name_ar, tint, color in skin_tints:
    fp = f"/images/personal%20profile/PNG/Skin/{tint.replace(' ', '%20')}/tint{tint[-1]}_head.png"
    check_file(fp)
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'skin',
        'subcategory': 'skin',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'thumbnailPath': fp,
        'emoji': '🧑',
        'description': f'{name} complexion for young founder character.',
        'descriptionAr': f'{name_ar} لشخصية رائد الأعمال الصغير.',
        'cost': 0,
        'rarity': 'common',
        'color': color,
        'unlockRequirement': {'type': 'free', 'description': 'Free Starter Skin Tone', 'descriptionAr': 'لون بشرة متاح مجاناً للجميع'},
        'isPurchasable': False,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['skin', 'tone', 'starter']
    })

# 2. Complete Faces
faces = [
    ('kenney_face_complete_1', 'Confident Founder Smile', 'ابتسامة المؤسس الواثق', 'face1.png', 0, 'common', 'free', 0, '+2% Pitch Charisma', '+2% كاريزما العرض'),
    ('kenney_face_complete_2', 'Joyful Entrepreneur', 'رائد الأعمال السعيد', 'face2.png', 0, 'common', 'free', 0, '+2% Team Morale', '+2% معنويات الفريق'),
    ('kenney_face_complete_3', 'Pitch Strategy Focus', 'تركيز العرض التقديمي', 'face3.png', 50, 'rare', 'level', 2, '+5% Negotiation Precision', '+5% دقة في التفاوض'),
    ('kenney_face_complete_4', 'Victory Deal Grin', 'ابتسامة الفوز والصفقات', 'face4.png', 100, 'epic', 'level', 4, '+10% Investor Excitement', '+10% حماس المستثمرين'),
]

for item_id, name, name_ar, fname, cost, rarity, req_type, target, perk, perk_ar in faces:
    fp = f"/images/personal%20profile/PNG/Face/Completes/{fname}"
    check_file(fp)
    req = {'type': 'free', 'description': 'Starter Expression', 'descriptionAr': 'تعبير وجه افتراضي مجاني'} if req_type == 'free' else {
        'type': 'level', 'target': target, 'description': f'Unlocks at Level {target}', 'descriptionAr': f'يفتح عند المستوى {target}'
    }
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'face',
        'subcategory': 'face',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'thumbnailPath': fp,
        'emoji': '😊',
        'description': f'Expressive facial design: {name}.',
        'descriptionAr': f'ملامح وتعبير وجه مميز: {name_ar}.',
        'cost': cost,
        'rarity': rarity,
        'color': '#F59E0B',
        'unlockRequirement': req,
        'perkText': perk,
        'perkTextAr': perk_ar,
        'isPurchasable': cost > 0,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['face', 'expression']
    })

# 3. Hairstyles
hairstyles = [
    # Brown 2
    ('kenney_hair_brown2_man5', 'Junior Executive Crop', 'قصة شعر تنفيذية كلاسيكية', 'Brown 2', 'brown2Man5.png', 0, 'common', 'free', 0),
    ('kenney_hair_brown2_woman1', 'CEO Wavy Bob', 'بوب مموج للمديرة التنفيذية', 'Brown 2', 'brown2Woman1.png', 0, 'common', 'free', 0),
    ('kenney_hair_brown2_man1', 'Sharp Side Part', 'فرق جانبي أنيق', 'Brown 2', 'brown2Man1.png', 60, 'common', 'free', 0),
    ('kenney_hair_brown2_man2', 'Classic Pompadour', 'تسريحة بومبادور راقية', 'Brown 2', 'brown2Man2.png', 80, 'rare', 'level', 2),
    ('kenney_hair_brown2_man3', 'Modern Founder Quiff', 'تسريحة كويف عصرية', 'Brown 2', 'brown2Man3.png', 75, 'rare', 'free', 0),
    ('kenney_hair_brown2_woman2', 'Sleek Founder Ponytail', 'ذيل حصان المؤسسة الأنيقة', 'Brown 2', 'brown2Woman2.png', 70, 'rare', 'free', 0),
    ('kenney_hair_brown2_woman4', 'Long Layered Curls', 'خصلات مموجة طويلة', 'Brown 2', 'brown2Woman4.png', 90, 'rare', 'level', 3),
    ('kenney_hair_brown2_woman5', 'Cascading Executive Locks', 'تسريحة انسيابية فخمة', 'Brown 2', 'brown2Woman5.png', 110, 'epic', 'level', 4),

    # Black
    ('kenney_hair_black_man1', 'Boardroom Clean Cut', 'قصة مجلس الإدارة النظيفة', 'Black', 'blackMan1.png', 50, 'common', 'free', 0),
    ('kenney_hair_black_man3', 'Tech Founder Textured Fade', 'تدرج شبابي حديث', 'Black', 'blackMan3.png', 80, 'rare', 'level', 2),
    ('kenney_hair_black_man4', 'Spiky Innovator Hair', 'شعر مبتكر حيوي', 'Black', 'blackMan4.png', 70, 'rare', 'free', 0),
    ('kenney_hair_black_man7', 'Creative Undercut', 'قصة إبداعية مبتكرة', 'Black', 'blackMan7.png', 100, 'epic', 'level', 3),
    ('kenney_hair_black_woman1', 'Pitch Day Chic Bob', 'بوب أنيق لأيام العروض', 'Black', 'blackWoman1.png', 65, 'common', 'free', 0),
    ('kenney_hair_black_woman3', 'High Ambition Ponytail', 'ذيل حصان الطموح العالي', 'Black', 'blackWoman3.png', 75, 'rare', 'free', 0),
    ('kenney_hair_black_woman6', 'Voluminous Natural Curls', 'تموجات كثيفة مفعمة بالحيوية', 'Black', 'blackWoman6.png', 95, 'epic', 'level', 4),

    # Blonde
    ('kenney_hair_blonde_man1', 'Sunny Startup Crop', 'قصة شقراء مبهجة للشركات الناشئة', 'Blonde', 'blondeMan1.png', 60, 'common', 'free', 0),
    ('kenney_hair_blonde_man2', 'Golden Investor Waves', 'تموجات المستثمر الذهبية', 'Blonde', 'blondeMan2.png', 75, 'rare', 'level', 2),
    ('kenney_hair_blonde_man6', 'Agile Product Lead Hair', 'شعر مدير المنتج السريع', 'Blonde', 'blondeMan6.png', 70, 'rare', 'free', 0),
    ('kenney_hair_blonde_woman1', 'Golden Director Bob', 'بوب أشقر للإدارة الإبداعية', 'Blonde', 'blondeWoman1.png', 85, 'rare', 'level', 2),
    ('kenney_hair_blonde_woman4', 'Long Flowing Golden Waves', 'شعر أشقر انسيابي طويل', 'Blonde', 'blondeWoman4.png', 105, 'epic', 'level', 3),

    # Red
    ('kenney_hair_red_man4', 'Fiery Innovator Quiff', 'شعر ناري للمبتكر الجريء', 'Red', 'redMan4.png', 90, 'rare', 'level', 2),
    ('kenney_hair_red_woman2', 'Auburn Ambition Ponytail', 'ذيل حصان كستنائي طموح', 'Red', 'redWoman2.png', 90, 'rare', 'level', 2),
    ('kenney_hair_red_woman5', 'Crimson Flowing Locks', 'خصلات قرمزية براقة', 'Red', 'redWoman5.png', 120, 'epic', 'level', 4),

    # Grey / Silver
    ('kenney_hair_grey_man5', 'Distinguished Mentor Crop', 'قصة المرشد الملهم الوقور', 'Grey', 'greyMan5.png', 110, 'epic', 'level', 5),
    ('kenney_hair_grey_woman4', 'Silver Executive Waves', 'أمواج فضية راقية للمديرة', 'Grey', 'greyWoman4.png', 110, 'epic', 'level', 5),

    # Tan / White
    ('kenney_hair_tan_man6', 'Desert Venture Casual', 'تسريحة رواد الأعمال الصحراوية', 'Tan', 'tanMan6.png', 65, 'common', 'free', 0),
    ('kenney_hair_white_man8', 'Futuristic Platinum Style', 'تسريحة بلاتينية مستقبلية', 'White', 'whiteMan8.png', 150, 'legendary', 'level', 7),
]

for item_id, name, name_ar, color_folder, fname, cost, rarity, req_type, target in hairstyles:
    fp = f"/images/personal%20profile/PNG/Hair/{color_folder.replace(' ', '%20')}/{fname}"
    check_file(fp)
    req = {'type': 'free', 'description': 'Starter Hairstyle', 'descriptionAr': 'تسريحة شعر مجانية للمبتدئين'} if req_type == 'free' and cost == 0 else (
        {'type': 'free', 'description': 'Available in Wardrobe Store', 'descriptionAr': 'متاحة في المتجر للشراء'} if req_type == 'free' else {
            'type': 'level', 'target': target, 'description': f'Unlocks at Level {target}', 'descriptionAr': f'تفتح عند المستوى {target}'
        }
    )
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'hair',
        'subcategory': 'hair',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'thumbnailPath': fp,
        'emoji': '💇',
        'description': f'Signature hairstyle: {name}.',
        'descriptionAr': f'تسريحة شعر مميزة: {name_ar}.',
        'cost': cost,
        'rarity': rarity,
        'color': '#8B5CF6',
        'unlockRequirement': req,
        'isPurchasable': cost > 0,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['hair', 'style']
    })

# 4. Shirts & Tops
shirts = [
    # Red
    ('kenney_shirt_red_1', 'Junior Founder Red Polo', 'بولو المؤسس الصغير الأحمر', 'Red', 'redShirt1.png', 'redArm_long.png', 0, 'common', 'free', 0, '+3% Daily Motivation', '+3% حافز يومي'),
    ('kenney_shirt_red_2', 'Startup Pitch Button-Up', 'قميص عروض الشركات الناشئة', 'Red', 'redShirt2.png', 'redArm_long.png', 70, 'common', 'free', 0, '+4% Pitch Clarity', '+4% وضوح في العرض'),
    ('kenney_shirt_red_6', 'Angel Investor Crimson V-Neck', 'سترة المستثمر الملائكي القرمزية', 'Red', 'redShirt6.png', 'redArm_long.png', 90, 'rare', 'level', 2, '+6% Angel Networking', '+6% شبكة علاقات قوية'),

    # Blue
    ('kenney_shirt_blue_1', 'Venture Blue Oxford', 'قميص أكسفورد الأزرق الكلاسيكي', 'Blue', 'blueShirt1.png', 'blueArm_long.png', 80, 'common', 'free', 0, '+5% Negotiation Trust', '+5% ثقة في المفاوضات'),
    ('kenney_shirt_blue_4', 'Shark Tank Ready Blazer', 'سترة حوض المستثمرين الرسمية', 'Blue', 'blueShirt4.png', 'blueArm_long.png', 130, 'epic', 'level', 3, '+10% Pitch Charisma', '+10% كاريزما العرض'),
    ('kenney_shirt_blue_7', 'Silicon Valley Tech Tee', 'تي شيرت وادي السيليكون التقني', 'Blue', 'blueShirt7.png', 'blueArm_long.png', 50, 'common', 'free', 0, '+4% Fast Prototyping', '+4% بناء نماذج أسرع'),

    # Navy
    ('kenney_shirt_navy_1', 'Executive Navy Suit Top', 'سترة كحلية رسمية فاخرة', 'Navy', 'navyShirt1.png', 'navyArm_long.png', 140, 'epic', 'level', 4, '+12% Executive Presence', '+12% هيبة تنفيذية'),
    ('kenney_shirt_navy_3', 'Corporate Strategist Shirt', 'قميص استراتيجي الشركات الكبرى', 'Navy', 'navyShirt3.png', 'navyArm_long.png', 100, 'rare', 'level', 2, '+7% Strategic Insight', '+7% رؤية استراتيجية'),

    # White
    ('kenney_shirt_white_1', 'Pristine Boardroom White', 'قميص مجلس الإدارة الأبيض النقي', 'White', 'whiteShirt1.png', 'armWhite_long.png', 95, 'rare', 'free', 0, '+6% Clean Bookkeeping', '+6% شفافية مالية'),
    ('kenney_shirt_white_5', 'Minimalist Founder Tee', 'تي شيرت البساطة والتركيز الأبيض', 'White', 'whiteShirt5.png', 'armWhite_long.png', 45, 'common', 'free', 0, '+3% Focus Efficiency', '+3% كفاءة وتركيز'),

    # Green
    ('kenney_shirt_green_1', 'Sustainable Enterprise Polo', 'بولو المشاريع الخضراء المستدامة', 'Green', 'greenShirt1.png', 'greenArm_long.png', 85, 'rare', 'free', 0, '+7% Eco Business Trust', '+7% ثقة المشاريع الخضراء'),
    ('kenney_shirt_green_4', 'Growth Hacker Longsleeve', 'قميص النمو التسويقي السريع', 'Green', 'greenShirt4.png', 'greenArm_long.png', 95, 'rare', 'level', 2, '+8% Viral Marketing', '+8% تسويق واسع الانتشار'),

    # Grey
    ('kenney_shirt_grey_1', 'Fintech Charcoal Knit', 'سترة التكنولوجيا المالية الرمادية', 'Grey', 'greyShirt1.png', 'greyArm_long.png', 90, 'rare', 'free', 0, '+6% Algorithmic Speed', '+6% سرعة في اتخاذ القرارات'),
    ('kenney_shirt_grey_5', 'Product Manager Casual Top', 'قميص مدير المنتج المريح', 'Grey', 'greyShirt5.png', 'greyArm_long.png', 60, 'common', 'free', 0, '+4% Team Alignment', '+4% تناغم فريق العمل'),

    # Pine
    ('kenney_shirt_pine_1', 'Eco Founder Flannel', 'قميص ريادة الأعمال البيئية الكلاسيكي', 'Pine', 'pineShirt1.png', 'pineArm_long.png', 85, 'rare', 'free', 0, '+5% Natural Brand Image', '+5% صورة علامة تجارية طبيعية'),

    # Yellow
    ('kenney_shirt_yellow_1', 'Creative Director Vibrant Polo', 'قميص المدير الإبداعي المشرق', 'Yellow', 'shirtYellow1.png', 'armYellow_long.png', 85, 'rare', 'free', 0, '+8% Creative Breakthroughs', '+8% ابتكارات غير مسبوقة'),
]

for item_id, name, name_ar, color_folder, fname, arm_fname, cost, rarity, req_type, target, perk, perk_ar in shirts:
    fp = f"/images/personal%20profile/PNG/Shirts/{color_folder}/{fname}"
    arm_fp = f"/images/personal%20profile/PNG/Shirts/{color_folder}/{arm_fname}"
    check_file(fp)
    check_file(arm_fp)
    req = {'type': 'free', 'description': 'Default Starter Shirt', 'descriptionAr': 'قميص افتراضي مجاني للمبتدئين'} if req_type == 'free' and cost == 0 else (
        {'type': 'free', 'description': 'Available in Wardrobe Store', 'descriptionAr': 'متاح للشراء في المتجر'} if req_type == 'free' else {
            'type': 'level', 'target': target, 'description': f'Unlocks at Level {target}', 'descriptionAr': f'يفتح عند المستوى {target}'
        }
    )
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'clothing',
        'subcategory': 'shirt',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'armFilePath': arm_fp,
        'thumbnailPath': fp,
        'emoji': '👕',
        'description': f'{name} tailored for ambitious founders.',
        'descriptionAr': f'{name_ar} مصمم خصيصاً لرواد الأعمال الطموحين.',
        'cost': cost,
        'rarity': rarity,
        'color': '#3B82F6',
        'unlockRequirement': req,
        'perkText': perk,
        'perkTextAr': perk_ar,
        'isPurchasable': cost > 0,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['clothing', 'shirt', 'top']
    })

# 5. Pants & Bottoms
pants_list = [
    ('kenney_pants_light_blue_3', 'Startup Casual Denim', 'جينز الشركات الناشئة المريح', 'Light Blue', 'pantsLightBlue3.png', 'pantsLightBlue_long.png', 0, 'common', 'free', 0),
    ('kenney_pants_light_blue_1', 'Washed Founder Chinos', 'شينو أزرق فاتح مريح', 'Light Blue', 'pantsLightBlue1.png', 'pantsLightBlue_long.png', 60, 'common', 'free', 0),
    ('kenney_pants_navy_1', 'Boardroom Navy Trousers', 'بنطال كحلي كلاسيكي فاخر', 'Navy', 'pantsNavy1.png', 'pantsNavy_long.png', 110, 'rare', 'level', 2),
    ('kenney_pants_navy_3', 'Executive Tailored Slacks', 'بنطال مفصل لرجال الأعمال', 'Navy', 'pantsNavy3.png', 'pantsNavy_long.png', 130, 'epic', 'level', 4),
    ('kenney_pants_grey_1', 'Fintech Charcoal Pants', 'بنطال رمادي أنيق للشركات التقنية', 'Grey', 'pantsGrey1.png', 'pantsGrey_long.png', 85, 'common', 'free', 0),
    ('kenney_pants_grey_3', 'Modern Office Slacks', 'بنطال مكتبي عصري', 'Grey', 'pantsGrey3.png', 'pantsGrey_long.png', 95, 'rare', 'level', 2),
    ('kenney_pants_tan_1', 'Wall Street Tan Chinos', 'بناطيل شينو بيج راقية', 'Tan', 'pantsTan1.png', 'pantsTan_long.png', 80, 'common', 'free', 0),
    ('kenney_pants_tan_4', 'Venture Field Khakis', 'كاكي العمل الميداني والإنتاج', 'Tan', 'pantsTan4.png', 'pantsTan_long.png', 75, 'common', 'free', 0),
    ('kenney_pants_white_1', 'Summer Conference Slacks', 'بنطال أبيض لمؤتمرات الصيف', 'White', 'pantsWhite1.png', 'pantsWhite_long.png', 115, 'rare', 'level', 3),
    ('kenney_pants_pine_1', 'Sustainable Cargo Pants', 'بنطال كارغو المشاريع الخضراء', 'Pine', 'pantsPine1.png', 'pantsPine_long.png', 85, 'rare', 'free', 0),
    ('kenney_pants_red_1', 'Bold Statement Slacks', 'بنطال أحمر جريء للرواد الاستثنائيين', 'Red', 'pantsRed1.png', 'pantsRed_long.png', 100, 'epic', 'level', 3),
    ('kenney_pants_green_1', 'Green Field Chinos', 'بنطال شينو أخضر بيئي', 'Green', 'pantsGreen1.png', 'pantsGreen_long.png', 80, 'common', 'free', 0),
    ('kenney_pants_blue1_1', 'Classic Royal Blue Slacks', 'بنطال أزرق ملكي كلاسيكي', 'Blue 1', 'pantsBlue11.png', 'pantsBlue14.png', 90, 'rare', 'free', 0),
]

for item_id, name, name_ar, color_folder, fname, leg_fname, cost, rarity, req_type, target in pants_list:
    fp = f"/images/personal%20profile/PNG/Pants/{color_folder.replace(' ', '%20')}/{fname}"
    leg_fp = f"/images/personal%20profile/PNG/Pants/{color_folder.replace(' ', '%20')}/{leg_fname}"
    check_file(fp)
    check_file(leg_fp)
    req = {'type': 'free', 'description': 'Starter Denim Pants', 'descriptionAr': 'بنطال جينز مجاني للمبتدئين'} if req_type == 'free' and cost == 0 else (
        {'type': 'free', 'description': 'Available in Wardrobe Store', 'descriptionAr': 'متاح للشراء في المتجر'} if req_type == 'free' else {
            'type': 'level', 'target': target, 'description': f'Unlocks at Level {target}', 'descriptionAr': f'يفتح عند المستوى {target}'
        }
    )
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'pants',
        'subcategory': 'pants',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'legFilePath': leg_fp,
        'thumbnailPath': fp,
        'emoji': '👖',
        'description': f'{name} crafted for agile daily business.',
        'descriptionAr': f'{name_ar} مصمم لراحة ومرونة رائد الأعمال.',
        'cost': cost,
        'rarity': rarity,
        'color': '#0EA5E9',
        'unlockRequirement': req,
        'isPurchasable': cost > 0,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['pants', 'bottoms']
    })

# 6. Shoes & Footwear
shoes_list = [
    ('kenney_shoe_brown1_5', 'Classic Handcrafted Loafers', 'حذاء لوفر بني كلاسيكي مريح', 'Brown 1', 'brownShoe5.png', 0, 'common', 'free', 0),
    ('kenney_shoe_brown1_1', 'Heritage Leather Derby', 'حذاء ديربي جلدي تقليدي', 'Brown 1', 'brownShoe1.png', 70, 'common', 'free', 0),
    ('kenney_shoe_black_1', 'Executive Black Oxfords', 'حذاء أكسفورد أسود رسمي', 'Black', 'blackShoe1.png', 95, 'rare', 'level', 2),
    ('kenney_shoe_black_3', 'Boardroom High-Gloss Shoes', 'حذاء كبار الشخصيات اللامع', 'Black', 'blackShoe3.png', 125, 'epic', 'level', 4),
    ('kenney_shoe_black_5', 'Modern Minimalist Loafers', 'حذاء بدون أربطة عصري أسود', 'Black', 'blackShoe5.png', 80, 'common', 'free', 0),
    ('kenney_shoe_brown2_3', 'Italian Leather Brogues', 'حذاء بروغ جلدي إيطالي', 'Brown 2', 'brown2Shoe3.png', 110, 'rare', 'level', 3),
    ('kenney_shoe_blue_1', 'Navy Suede Slip-ons', 'حذاء شمواه كحلي مريح', 'Blue', 'blueShoe1.png', 85, 'common', 'free', 0),
    ('kenney_shoe_blue_4', 'Tech Campus Sneakers', 'سنيكرز خفيف لرواد التقنية', 'Blue', 'blueShoe4.png', 75, 'common', 'free', 0),
    ('kenney_shoe_grey_1', 'Agile Sprint Sneakers', 'حذاء رياضي مريح لفرق العمل السريعة', 'Grey', 'greyShoe1.png', 65, 'common', 'free', 0),
    ('kenney_shoe_grey_3', 'Executive Athletic Kicks', 'سنيكرز رمادي رسمي خفيف', 'Grey', 'greyShoe3.png', 70, 'common', 'free', 0),
    ('kenney_shoe_tan_1', 'Summer Yacht Deck Shoes', 'حذاء بحري صيفي لرحلات الأعمال', 'Tan', 'tanShoe1.png', 90, 'rare', 'level', 2),
    ('kenney_shoe_red_1', 'Disruptor Red Sneakers', 'سنيكرز أحمر ثوري يلفت الأنظار', 'Red', 'redShoe1.png', 90, 'epic', 'level', 3),
]

for item_id, name, name_ar, color_folder, fname, cost, rarity, req_type, target in shoes_list:
    fp = f"/images/personal%20profile/PNG/Shoes/{color_folder.replace(' ', '%20')}/{fname}"
    check_file(fp)
    req = {'type': 'free', 'description': 'Starter Business Footwear', 'descriptionAr': 'حذاء أعمال أولي مجاني'} if req_type == 'free' and cost == 0 else (
        {'type': 'free', 'description': 'Available in Wardrobe Store', 'descriptionAr': 'متاح للشراء في المتجر'} if req_type == 'free' else {
            'type': 'level', 'target': target, 'description': f'Unlocks at Level {target}', 'descriptionAr': f'يفتح عند المستوى {target}'
        }
    )
    items.append({
        'id': item_id,
        'name': name,
        'nameAr': name_ar,
        'category': 'shoes',
        'subcategory': 'shoes',
        'source': 'kenney',
        'renderingMode': 'layered_parts',
        'filePath': fp,
        'thumbnailPath': fp,
        'emoji': '👞',
        'description': f'{name} designed for confidence in every meeting.',
        'descriptionAr': f'{name_ar} تمنحك ثقة وثباتاً في كل خطوة.',
        'cost': cost,
        'rarity': rarity,
        'color': '#D97706',
        'unlockRequirement': req,
        'isPurchasable': cost > 0,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['shoes', 'footwear']
    })

print(f"Total modular items: {len(items)}")

# Convert items to valid TypeScript code
out_ts = 'import { AvatarItem, AvatarCategory, ModularAvatarConfig } from "../types/avatar";\\n\\n'
out_ts += 'export const AVATAR_CATALOG: AvatarItem[] = ' + json.dumps(items, indent=4, ensure_ascii=False) + ' as AvatarItem[];\\n\\n'

out_ts += '''
export const CATEGORY_LABELS: Record<string, { en: string; ar: string; emoji: string }> = {
    all: { en: 'All Items', ar: 'كل العناصر', emoji: '✨' },
    skin: { en: 'Skin Tones', ar: 'ألوان البشرة', emoji: '🧑' },
    face: { en: 'Expressions', ar: 'الملامح والوجه', emoji: '😊' },
    hair: { en: 'Hairstyles', ar: 'تسريحات الشعر', emoji: '💇' },
    clothing: { en: 'Tops & Shirts', ar: 'القمصان والملابس', emoji: '👕' },
    pants: { en: 'Pants & Slacks', ar: 'البناطيل والسراويل', emoji: '👖' },
    shoes: { en: 'Shoes & Footwear', ar: 'الأحذية والخفاف', emoji: '👞' },
    accessories: { en: 'Accessories', ar: 'الإكسسوارات', emoji: '🕶️' },
    business: { en: 'Business Outfits', ar: 'أطقم الأعمال', emoji: '👔' },
    district: { en: 'District Gear', ar: 'عتاد الأحياء', emoji: '🏙️' },
    achievement: { en: 'Achievements', ar: 'أوسمة الإنجاز', emoji: '👑' },
    background: { en: 'Headquarters', ar: 'المقر والخلفيات', emoji: '🏢' },
};

export const DEFAULT_AVATAR_CONFIG: ModularAvatarConfig = {
    skinTone: 'Tint 1',
    faceId: 'kenney_face_complete_1',
    hairId: 'kenney_hair_brown2_man5',
    shirtId: 'kenney_shirt_red_1',
    pantsId: 'kenney_pants_light_blue_3',
    shoesId: 'kenney_shoe_brown1_5',
    backgroundId: 'avatar_bg_office_clean_001',
};

export const DEFAULT_EQUIPPED_ITEM_IDS: string[] = [
    'kenney_skin_tint_1',
    'kenney_face_complete_1',
    'kenney_hair_brown2_man5',
    'kenney_shirt_red_1',
    'kenney_pants_light_blue_3',
    'kenney_shoe_brown1_5',
    'avatar_bg_office_clean_001',
];

export function getAvatarItemById(id: string): AvatarItem | undefined {
    return AVATAR_CATALOG.find((item) => item.id === id);
}

export function resolveAvatarConfigFromEquipped(equippedIds: string[] = []): ModularAvatarConfig {
    const config: ModularAvatarConfig = { ...DEFAULT_AVATAR_CONFIG };

    for (const id of equippedIds) {
        const item = getAvatarItemById(id);
        if (!item) continue;

        switch (item.category) {
            case 'skin':
                // Extract tint number from id or path
                if (item.filePath?.includes('Tint%20')) {
                    const match = item.filePath.match(/Tint%20(\\d)/);
                    if (match) config.skinTone = `Tint ${match[1]}`;
                }
                break;
            case 'face':
                config.faceId = item.id;
                break;
            case 'hair':
                config.hairId = item.id;
                break;
            case 'clothing':
                config.shirtId = item.id;
                break;
            case 'pants':
                config.pantsId = item.id;
                break;
            case 'shoes':
                config.shoesId = item.id;
                break;
            case 'accessories':
                config.accessoryId = item.id;
                break;
            case 'background':
                config.backgroundId = item.id;
                break;
            default:
                break;
        }
    }

    return config;
}
'''

with open('src/features/avatar/data/avatarCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(out_ts)

print("avatarCatalog.ts successfully generated and written!")
