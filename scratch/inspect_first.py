import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/features/avatar/data/avatarCatalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for item_id in [
    'avatar_bg_office_clean_001', 'avatar_bg_penthouse_002', 'avatar_bg_money_vault_003', 'avatar_bg_space_orbit_004',
    'avatar_district_risk_shield_003', 'avatar_district_builder_hat_002', 'avatar_acc_cap_006', 'avatar_acc_tophat_002'
]:
    pos = text.find(f'"id": "{item_id}"')
    if pos != -1:
        end = text.find('},', pos)
        print(f'=== {item_id} ===\n' + text[pos:end+1] + '\n')
