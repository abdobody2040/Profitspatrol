from PIL import Image

head = Image.open('public/images/personal profile/PNG/Skin/Tint 1/tint1_head.png').resize((173, 168), Image.Resampling.BILINEAR)
hair = Image.open('public/images/personal profile/PNG/Hair/Brown 2/brown2Man5.png').resize((176, 134), Image.Resampling.BILINEAR)

def create_base():
    c = Image.new('RGBA', (400, 500), (240, 243, 246, 255))
    neck = Image.open('public/images/personal profile/PNG/Skin/Tint 1/tint1_neck.png').resize((96, 37))
    c.paste(neck, (152, 175), neck)
    shirt = Image.open('public/images/personal profile/PNG/Outfits/business_blazer.png').resize((176, 176))
    c.paste(shirt, (112, 140), shirt)
    c.paste(head, (113, 30), head)
    face = Image.open('public/images/personal profile/PNG/Face/Completes/face1.png').resize((100, 101))
    c.paste(face, (150, 65), face)
    c.paste(hair, (112, 8), hair)
    return c

# 1. Tophat: accessory_tophat.png
# size: (256, 256), bbox: (9, 35, 247, 189) -> content is (238, 154)
# Content width ~190 to cover head (173): scale = 190 / 238 = 0.8
# Rendered w = 256 * 0.8 = 205, h = 256 * 0.8 = 205
# Content bottom y=189 * 0.8 = 151
# Brim should sit around y=35 (hairline): y_pos = 35 - 151 = -116
# x_pos = 200 - 205/2 = 97.5 ~ 98
b_tophat = create_base()
tophat = Image.open('public/images/personal profile/PNG/Accessories/accessory_tophat.png').resize((205, 205), Image.Resampling.BILINEAR)
b_tophat.paste(tophat, (98, -95), tophat)
b_tophat.save('scratch/test_tophat.png')

# 2. Builder Helmet: district_builder_hat.png
# size: (200, 200), bbox: (12, 22, 188, 111) -> content is (176, 89)
# Content width 180: scale = 180 / 176 = 1.02
# Rendered w = 204, h = 204
# Content bottom y=111 * 1.02 = 113
# Brim should sit around y=45: y_pos = 45 - 113 = -68
# x_pos = 200 - 204/2 = 98
b_helmet = create_base()
helmet = Image.open('public/images/personal profile/PNG/District/district_builder_hat.png').resize((204, 204), Image.Resampling.BILINEAR)
b_helmet.paste(helmet, (98, -68), helmet)
b_helmet.save('scratch/test_helmet.png')

# 3. Crown: achieve_tycoon_crown.png
# size: (200, 200), bbox: (19, 54, 181, 143) -> content is (162, 89)
# Content width 150: scale = 150 / 162 = 0.925
# Rendered w = 185, h = 185
# Content bottom y=143 * 0.925 = 132
# Crown base should sit at y=25: y_pos = 25 - 132 = -107
# x_pos = 200 - 185/2 = 107
b_crown = create_base()
crown = Image.open('public/images/personal profile/PNG/Achievements/achieve_tycoon_crown.png').resize((185, 185), Image.Resampling.BILINEAR)
b_crown.paste(crown, (107, -90), crown)
b_crown.save('scratch/test_crown.png')

# 4. Wreath: achieve_tank_champion.png
# size: (200, 200), bbox: (47, 12, 153, 168) -> content is (106, 156)
# Content width ~160: scale = 160 / 106 = 1.5
# Wait, wreath encircles head: Rendered w = 220, h = 220
# x = 200 - 110 = 90
# y_pos = -40
b_wreath = create_base()
wreath = Image.open('public/images/personal profile/PNG/Achievements/achieve_tank_champion.png').resize((220, 220), Image.Resampling.BILINEAR)
b_wreath.paste(wreath, (90, -40), wreath)
b_wreath.save('scratch/test_wreath.png')

# 5. Money Tie: district_money_tie.png
# size: (200, 200), bbox: (71, 22, 129, 188) -> content is (58, 166)
# Knot sits at collar y=155. Width 60, height 170.
# x_pos = 200 - 30 = 170.
# In district_money_tie.png, knot is near y=22.
# Scale: if we render tie with w=80, h=160
# Knot is at y=22 * (160/200) = 17.6 from top of image
# To place knot at y=155: y_pos = 155 - 18 = 137
# x_pos = 200 - 40 = 160
b_tie = create_base()
tie = Image.open('public/images/personal profile/PNG/District/district_money_tie.png').resize((80, 160), Image.Resampling.BILINEAR)
b_tie.paste(tie, (160, 137), tie)
b_tie.save('scratch/test_tie.png')

# 6. Bowtie: accessory_bowtie.png
# size: (200, 140), bbox: (19, 32, 181, 109)
# Knot at y=155, width 76, height 53
# x = 200 - 38 = 162, y = 135
b_bowtie = create_base()
bowtie = Image.open('public/images/personal profile/PNG/Accessories/accessory_bowtie.png').resize((76, 53), Image.Resampling.BILINEAR)
b_bowtie.paste(bowtie, (162, 135), bowtie)
b_bowtie.save('scratch/test_bowtie.png')

# 7. Shield: district_risk_shield.png
# size: (200, 200), bbox: (32, 27, 168, 178)
# In character's right hand (hand is at x=338, y=250):
# Place shield over the hand at x=310, y=220, w=110, h=110
b_shield = create_base()
shield = Image.open('public/images/personal profile/PNG/District/district_risk_shield.png').resize((110, 110), Image.Resampling.BILINEAR)
b_shield.paste(shield, (310, 220), shield)
b_shield.save('scratch/test_shield.png')

print('All 7 accessory tests generated')
