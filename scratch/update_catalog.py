import json

with open('src/features/avatar/data/avatarCatalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('= [') + 2
end = text.rfind('] as AvatarItem[];') + 1
items = json.loads(text[start:end])

# Update pants and shirts
for i in items:
    cat = i.get('category')
    item_id = i.get('id')
    if cat == 'pants':
        i['thumbnailPath'] = f'/images/personal%20profile/thumbnails/pants/{item_id}_thumb.png'
        if item_id == 'kenney_pants_blue1_1':
            i['legFilePath'] = '/images/personal%20profile/PNG/Pants/Blue%201/pantsBlue1_long.png'
    elif cat == 'clothing':
        i['thumbnailPath'] = f'/images/personal%20profile/thumbnails/shirts/{item_id}_thumb.png'
    elif item_id == 'avatar_acc_cool_shades_001':
        i['filePath'] = '/images/personal%20profile/PNG/Accessories/accessory_sunglasses.png'
        i['thumbnailPath'] = '/images/personal%20profile/PNG/Accessories/accessory_sunglasses.png'
    elif item_id == 'avatar_acc_tophat_002':
        i['filePath'] = '/images/personal%20profile/PNG/Accessories/accessory_tophat.png'
        i['thumbnailPath'] = '/images/personal%20profile/PNG/Accessories/accessory_tophat.png'
    elif item_id == 'avatar_acc_golden_watch_003':
        i['filePath'] = '/images/personal%20profile/PNG/Accessories/accessory_watch.png'
        i['thumbnailPath'] = '/images/personal%20profile/PNG/Accessories/accessory_watch.png'

# Check if new accessories already present
existing_ids = {i['id'] for i in items}
new_accs = [
    {
        'id': 'avatar_acc_glasses_004',
        'name': 'Executive Analyst Eyeglasses',
        'nameAr': 'نظارات المحلل المالي التنفيذية',
        'category': 'accessories',
        'subcategory': 'accessory',
        'renderingMode': 'modular_svg',
        'source': 'profit_patrol',
        'filePath': '/images/personal%20profile/PNG/Accessories/accessory_glasses.png',
        'thumbnailPath': '/images/personal%20profile/PNG/Accessories/accessory_glasses.png',
        'description': 'Sharp executive glasses for spotting trends and reviewing quarterly ledgers.',
        'descriptionAr': 'نظارات أنيقة لقراءة التقارير الفصلية واكتشاف اتجاهات السوق.',
        'cost': 120,
        'rarity': 'common',
        'color': '#334155',
        'unlockRequirement': {
            'type': 'free',
            'description': 'Available to buy anytime',
            'descriptionAr': 'متاح للشراء في أي وقت'
        },
        'perkText': '+4% Financial Analysis',
        'perkTextAr': '+4% دقة في التحليل المالي',
        'isPurchasable': True,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['accessories', 'glasses']
    },
    {
        'id': 'avatar_acc_bowtie_005',
        'name': 'Wall Street Red Bowtie',
        'nameAr': 'ربطة عنق وول ستريت الحمراء',
        'category': 'accessories',
        'subcategory': 'accessory',
        'renderingMode': 'modular_svg',
        'source': 'profit_patrol',
        'filePath': '/images/personal%20profile/PNG/Accessories/accessory_bowtie.png',
        'thumbnailPath': '/images/personal%20profile/PNG/Accessories/accessory_bowtie.png',
        'description': 'Dapper red silk bowtie commanding attention in any boardroom.',
        'descriptionAr': 'ربطة عنق حريرية حمراء فاخرة تمنحك حضوراً واثقاً في الاجتماعات.',
        'cost': 150,
        'rarity': 'rare',
        'color': '#DC2626',
        'unlockRequirement': {
            'type': 'free',
            'description': 'Available to buy anytime',
            'descriptionAr': 'متاح للشراء في أي وقت'
        },
        'perkText': '+6% Negotiation Charm',
        'perkTextAr': '+6% جاذبية في المفاوضات',
        'isPurchasable': True,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['accessories', 'tie']
    },
    {
        'id': 'avatar_acc_cap_006',
        'name': 'Tech Founder Baseball Cap',
        'nameAr': 'قبعة مؤسس التكنولوجيا الرياضية',
        'category': 'accessories',
        'subcategory': 'accessory',
        'renderingMode': 'modular_svg',
        'source': 'profit_patrol',
        'filePath': '/images/personal%20profile/PNG/Accessories/accessory_cap.png',
        'thumbnailPath': '/images/personal%20profile/PNG/Accessories/accessory_cap.png',
        'description': 'Casual navy cap with gold star emblem for late-night hackathons.',
        'descriptionAr': 'قبعة كحلية أنيقة بشعار النجمة الذهبية لجلسات البرمجة والابتكار.',
        'cost': 180,
        'rarity': 'rare',
        'color': '#1E3A8A',
        'unlockRequirement': {
            'type': 'level',
            'target': 2,
            'description': 'Unlocks at Level 2',
            'descriptionAr': 'يفتح عند المستوى 2'
        },
        'perkText': '+8% Focus & Speed',
        'perkTextAr': '+8% سرعة وتركيز',
        'isPurchasable': True,
        'isEquippable': True,
        'isVisible': True,
        'releaseStatus': 'published',
        'tags': ['accessories', 'hat']
    }
]

for a in new_accs:
    if a['id'] not in existing_ids:
        items.append(a)

new_json = json.dumps(items, ensure_ascii=False, indent=4)
new_text = text[:start] + new_json + text[end:]

with open('src/features/avatar/data/avatarCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f'Successfully updated avatarCatalog.ts with {len(items)} items!')
