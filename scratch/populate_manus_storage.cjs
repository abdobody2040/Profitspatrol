const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'manus-storage');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const arcadeDir = path.join(__dirname, '..', 'public', 'images', 'arcade');

const bannerMap = {
  'profitspatrol-cashflow-scene_86e90589.png': 'dealmaker.jpg',
  'profitspatrol-lemonade-boss_fc5440d1.png': 'lemonade.jpg',
  'profitspatrol-snack-shack_45948480.png': 'cupcake.jpg',
  'profitspatrol-tshirt-tycoon_780eac04.png': 'printshop.jpg',
  'profitspatrol-pet-shop-manager_8e2030bf.png': 'petsalon.jpg',
  'profitspatrol-mini-cafe_01d5224d.png': 'coffee.jpg',
  'profitspatrol-sales-master_bfa7c59c.png': 'sales.jpg',
  'profitspatrol-brand-builder_1598968b.png': 'brand.jpg',
  'profitspatrol-marketing-mix_4ac7d08e.png': 'marketing.jpg',
  'profitspatrol-time-tycoon_bc91e7a1.png': 'startup.jpg',
  'profitspatrol-team-builder_7b77cdec.png': 'teamcaptain.jpg',
  'profitspatrol-supply-chain-rush_2db2c684.png': 'factory.jpg',
  'profitspatrol-inventory-master_f4b22796.png': 'ecommerce.jpg',
  'profitspatrol-business-crisis_7a8e6f83.png': 'boardroom.jpg',
  'profitspatrol-investment-island_49643be5.png': 'investisland.jpg',
  'profitspatrol-risk-radar_410cb874.png': 'cyber.jpg',
  'profitspatrol-portfolio-quest_fca95201.png': 'stockmarket.jpg',
  'profitspatrol-compound-mountain_b1e65507.png': 'innovation.jpg',
  'profitspatrol-scam-detective_1f79d967.png': 'bughunter.jpg',
  'profitspatrol-money-market-board_124e1829.png': 'stockmarket.jpg',
  'profitspatrol-venture-workshop-board_1a7c1ee4.png': 'ideafactory.jpg',
  'profitspatrol-strategy-hall-board_6fdf93e8.png': 'boardroom.jpg',
  'profitspatrol-launch-park-board_46ad542b.png': 'space.jpg',
};

for (const [targetName, sourceName] of Object.entries(bannerMap)) {
  const src = path.join(arcadeDir, sourceName);
  const dest = path.join(targetDir, targetName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${sourceName} -> ${targetName}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}

console.log('All game banner assets mapped to public/manus-storage/');
