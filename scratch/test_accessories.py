from PIL import Image

head = Image.open('public/images/personal profile/PNG/Skin/Tint 1/tint1_head.png').resize((173, 168), Image.Resampling.BILINEAR)
hair = Image.open('public/images/personal profile/PNG/Hair/Brown 2/brown2Man5.png').resize((176, 134), Image.Resampling.BILINEAR)

def create_base():
    c = Image.new('RGBA', (400, 500), (240, 243, 246, 255))
    c.paste(head, (113, 30), head)
    face = Image.open('public/images/personal profile/PNG/Face/Completes/face1.png').resize((100, 101))
    c.paste(face, (150, 65), face)
    c.paste(hair, (112, 8), hair)
    return c

# 1. Cap: accessory_cap.png
# Let's crop away transparent padding or find the right (x, y, w, h)
cap_img = Image.open('public/images/personal profile/PNG/Accessories/accessory_cap.png')
# Original is (256, 180), bbox is (30, 14, 227, 123) -> content is (197, 109)
# If we scale cap so content width is ~180 (similar to head width 173):
# Scale = 180 / 197 = 0.914
# Rendered width = 256 * 0.914 = 234
# Rendered height = 180 * 0.914 = 164
# Visor should sit right at eyebrow level (around y=65 to 70)
# Content bottom (y=123) at scale 0.914 is at offset 112 from top of image
# So to place visor at y=68: y_pos = 68 - 112 = -44
# Center content x: content center is (30 + 227)/2 = 128.5 (exactly middle of 256)
# So x_pos = 200 - 234/2 = 83

base = create_base()
cap_resized = cap_img.resize((234, 164), Image.Resampling.BILINEAR)
base.paste(cap_resized, (83, -25), cap_resized) # test
base.save('scratch/test_cap_fit.png')
print('Cap test saved')
