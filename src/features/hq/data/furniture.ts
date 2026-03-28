import { FurnitureItem } from "../../../types";

export const FURNITURE_ITEMS: FurnitureItem[] = [
    // --- DESKS & WORKSTATIONS ---
    {
        id: 'desk_basic',
        name: 'Starter Desk',
        type: 'desk',
        cost: 100,
        icon: '🪑', // Simple desk
        width: 1,
        height: 1
    },
    {
        id: 'desk_executive',
        name: 'CEO Desk',
        type: 'desk',
        cost: 500,
        icon: '🖥️',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'desk_glass',
        name: 'Tech Setup',
        type: 'desk',
        cost: 1200,
        icon: '💻',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'desk_standing',
        name: 'Standing Desk',
        type: 'desk',
        cost: 800,
        icon: '📊',
        width: 1,
        height: 1
    },

    // --- CHAIRS & SEATING ---
    {
        id: 'chair_wood',
        name: 'Wooden Stool',
        type: 'chair',
        cost: 50,
        icon: '🪑',
        width: 1,
        height: 1
    },
    {
        id: 'chair_gaming',
        name: 'Gamer Throne',
        type: 'chair',
        cost: 300,
        icon: '🎮',
        width: 1,
        height: 1
    },
    {
        id: 'chair_office',
        name: 'Office Chair',
        type: 'chair',
        cost: 200,
        icon: '💺',
        width: 1,
        height: 1
    },
    {
        id: 'sofa_modern',
        name: 'Modern Sofa',
        type: 'chair',
        cost: 600,
        icon: '🛋️',
        width: 2,
        height: 1
    },

    // --- PLANTS & GREENERY ---
    {
        id: 'plant_cactus',
        name: 'Spikey',
        type: 'plant',
        cost: 75,
        icon: '🌵',
        width: 1,
        height: 1
    },
    {
        id: 'plant_palm',
        name: 'Money Tree',
        type: 'plant',
        cost: 450,
        icon: '🌴',
        width: 1,
        height: 1
    },
    {
        id: 'plant_flower',
        name: 'Flower Pot',
        type: 'plant',
        cost: 120,
        icon: '🌻',
        width: 1,
        height: 1
    },
    {
        id: 'plant_bonsai',
        name: 'Zen Bonsai',
        type: 'plant',
        cost: 350,
        icon: '🪴',
        width: 1,
        height: 1
    },
    {
        id: 'plant_rose',
        name: 'Rose Bush',
        type: 'plant',
        cost: 200,
        icon: '🌹',
        width: 1,
        height: 1
    },

    // --- DECORATIONS & TROPHIES ---
    {
        id: 'decor_trophy',
        name: 'Gold Cup',
        type: 'decoration',
        cost: 1000,
        icon: '🏆',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'alumni_desk_trophy',
        name: 'Alumni Gold',
        type: 'decoration',
        cost: 0, // Not buyable, only earned
        icon: '🌟',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_garage' // Accessible anywhere once earned
    },
    {
        id: 'decor_neon',
        name: 'Open Sign',
        type: 'decoration',
        cost: 250,
        icon: '💡',
        width: 1,
        height: 1
    },
    {
        id: 'decor_painting',
        name: 'Art Piece',
        type: 'decoration',
        cost: 400,
        icon: '🖼️',
        width: 1,
        height: 1
    },
    {
        id: 'decor_globe',
        name: 'World Globe',
        type: 'decoration',
        cost: 300,
        icon: '🌍',
        width: 1,
        height: 1
    },
    {
        id: 'decor_clock',
        name: 'Wall Clock',
        type: 'decoration',
        cost: 150,
        icon: '🕐',
        width: 1,
        height: 1
    },
    {
        id: 'decor_books',
        name: 'Bookshelf',
        type: 'decoration',
        cost: 500,
        icon: '📚',
        width: 1,
        height: 1
    },
    {
        id: 'decor_telescope',
        name: 'Telescope',
        type: 'decoration',
        cost: 900,
        icon: '🔭',
        width: 1,
        height: 1
    },
    {
        id: 'decor_guitar',
        name: 'Guitar',
        type: 'decoration',
        cost: 600,
        icon: '🎸',
        width: 1,
        height: 1
    },

    // --- LIGHTING ---
    {
        id: 'light_lamp',
        name: 'Desk Lamp',
        type: 'lighting',
        cost: 180,
        icon: '🪔',
        width: 1,
        height: 1
    },
    {
        id: 'light_chandelier',
        name: 'Chandelier',
        type: 'lighting',
        cost: 1500,
        icon: '💎',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'light_neon',
        name: 'Neon Lights',
        type: 'lighting',
        cost: 700,
        icon: '✨',
        width: 1,
        height: 1
    },

    // --- RUGS & FLOOR ITEMS ---
    {
        id: 'decor_rug_bear',
        name: 'Bear Rug',
        type: 'rug',
        cost: 800,
        icon: '🐻',
        width: 2,
        height: 2,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'rug_persian',
        name: 'Persian Rug',
        type: 'rug',
        cost: 600,
        icon: '🧶',
        width: 2,
        height: 1
    },

    // --- TECH & GADGETS ---
    {
        id: 'tech_printer',
        name: 'Printer',
        type: 'desk',
        cost: 350,
        icon: '🖨️',
        width: 1,
        height: 1
    },
    {
        id: 'tech_phone',
        name: 'Desk Phone',
        type: 'desk',
        cost: 100,
        icon: '☎️',
        width: 1,
        height: 1
    },
    {
        id: 'tech_camera',
        name: 'Security Cam',
        type: 'decoration',
        cost: 450,
        icon: '📹',
        width: 1,
        height: 1
    },
    {
        id: 'tech_microphone',
        name: 'Podcast Mic',
        type: 'desk',
        cost: 550,
        icon: '🎙️',
        width: 1,
        height: 1
    },

    // --- SPORTS & FITNESS ---
    {
        id: 'sports_basketball',
        name: 'Basketball',
        type: 'decoration',
        cost: 200,
        icon: '🏀',
        width: 1,
        height: 1
    },
    {
        id: 'sports_soccer',
        name: 'Soccer Ball',
        type: 'decoration',
        cost: 180,
        icon: '⚽',
        width: 1,
        height: 1
    },
    {
        id: 'sports_dumbbell',
        name: 'Dumbbells',
        type: 'decoration',
        cost: 300,
        icon: '🏋️',
        width: 1,
        height: 1
    },

    // --- FOOD & DRINKS ---
    {
        id: 'food_coffee',
        name: 'Coffee Maker',
        type: 'decoration',
        cost: 250,
        icon: '☕',
        width: 1,
        height: 1
    },
    {
        id: 'food_pizza',
        name: 'Pizza Box',
        type: 'decoration',
        cost: 50,
        icon: '🍕',
        width: 1,
        height: 1
    },
    {
        id: 'food_cake',
        name: 'Birthday Cake',
        type: 'decoration',
        cost: 100,
        icon: '🎂',
        width: 1,
        height: 1
    },

    // --- LUXURY ITEMS ---
    {
        id: 'luxury_diamond',
        name: 'Diamond Display',
        type: 'decoration',
        cost: 5000,
        icon: '💎',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'luxury_crown',
        name: 'Royal Crown',
        type: 'decoration',
        cost: 3000,
        icon: '👑',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'luxury_gem',
        name: 'Gem Collection',
        type: 'decoration',
        cost: 2500,
        icon: '💍',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },

    // --- BEDROOM FURNITURE ---
    {
        id: 'bed_single',
        name: 'Single Bed',
        type: 'decoration',
        cost: 400,
        icon: '🛏️',
        width: 2,
        height: 1
    },
    {
        id: 'bed_double',
        name: 'King Bed',
        type: 'decoration',
        cost: 800,
        icon: '🛌',
        width: 2,
        height: 2,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'wardrobe',
        name: 'Wardrobe',
        type: 'decoration',
        cost: 600,
        icon: '🚪',
        width: 1,
        height: 1
    },
    {
        id: 'mirror',
        name: 'Full Mirror',
        type: 'decoration',
        cost: 250,
        icon: '🪞',
        width: 1,
        height: 1
    },
    {
        id: 'nightstand',
        name: 'Nightstand',
        type: 'decoration',
        cost: 150,
        icon: '🗄️',
        width: 1,
        height: 1
    },

    // --- BATHROOM ITEMS ---
    {
        id: 'bath_tub',
        name: 'Bathtub',
        type: 'decoration',
        cost: 700,
        icon: '🛁',
        width: 2,
        height: 1
    },
    {
        id: 'shower',
        name: 'Shower',
        type: 'decoration',
        cost: 500,
        icon: '🚿',
        width: 1,
        height: 1
    },
    {
        id: 'toilet',
        name: 'Toilet',
        type: 'decoration',
        cost: 300,
        icon: '🚽',
        width: 1,
        height: 1
    },
    {
        id: 'sink',
        name: 'Sink',
        type: 'decoration',
        cost: 200,
        icon: '🚰',
        width: 1,
        height: 1
    },

    // --- KITCHEN APPLIANCES ---
    {
        id: 'fridge',
        name: 'Refrigerator',
        type: 'decoration',
        cost: 900,
        icon: '🧊',
        width: 1,
        height: 1
    },
    {
        id: 'stove',
        name: 'Stove',
        type: 'decoration',
        cost: 650,
        icon: '🔥',
        width: 1,
        height: 1
    },
    {
        id: 'microwave',
        name: 'Microwave',
        type: 'decoration',
        cost: 300,
        icon: '📻',
        width: 1,
        height: 1
    },
    {
        id: 'dishwasher',
        name: 'Dishwasher',
        type: 'decoration',
        cost: 550,
        icon: '🍽️',
        width: 1,
        height: 1
    },
    {
        id: 'kitchen_table',
        name: 'Dining Table',
        type: 'decoration',
        cost: 450,
        icon: '🍽️',
        width: 2,
        height: 1
    },

    // --- ENTERTAINMENT ---
    {
        id: 'tv_small',
        name: 'TV',
        type: 'decoration',
        cost: 600,
        icon: '📺',
        width: 1,
        height: 1
    },
    {
        id: 'tv_large',
        name: 'Big Screen TV',
        type: 'decoration',
        cost: 1500,
        icon: '🖥️',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'game_console',
        name: 'Game Console',
        type: 'decoration',
        cost: 500,
        icon: '🎮',
        width: 1,
        height: 1
    },
    {
        id: 'arcade',
        name: 'Arcade Machine',
        type: 'decoration',
        cost: 2000,
        icon: '🕹️',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'piano',
        name: 'Piano',
        type: 'decoration',
        cost: 3500,
        icon: '🎹',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'drums',
        name: 'Drum Set',
        type: 'decoration',
        cost: 1200,
        icon: '🥁',
        width: 2,
        height: 1
    },

    // --- OFFICE EQUIPMENT ---
    {
        id: 'filing_cabinet',
        name: 'Filing Cabinet',
        type: 'decoration',
        cost: 400,
        icon: '🗃️',
        width: 1,
        height: 1
    },
    {
        id: 'whiteboard',
        name: 'Whiteboard',
        type: 'decoration',
        cost: 350,
        icon: '📋',
        width: 1,
        height: 1
    },
    {
        id: 'safe',
        name: 'Safe',
        type: 'decoration',
        cost: 1000,
        icon: '🔒',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'water_cooler',
        name: 'Water Cooler',
        type: 'decoration',
        cost: 250,
        icon: '💧',
        width: 1,
        height: 1
    },

    // --- MORE DECORATIONS ---
    {
        id: 'aquarium',
        name: 'Aquarium',
        type: 'decoration',
        cost: 800,
        icon: '🐠',
        width: 1,
        height: 1
    },
    {
        id: 'statue',
        name: 'Statue',
        type: 'decoration',
        cost: 1500,
        icon: '🗿',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        type: 'decoration',
        cost: 2000,
        icon: '🔥',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'fountain',
        name: 'Water Fountain',
        type: 'decoration',
        cost: 1800,
        icon: '⛲',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'flag',
        name: 'Flag',
        type: 'decoration',
        cost: 100,
        icon: '🚩',
        width: 1,
        height: 1
    },
    {
        id: 'balloon',
        name: 'Balloons',
        type: 'decoration',
        cost: 50,
        icon: '🎈',
        width: 1,
        height: 1
    },

    // --- PETS ---
    {
        id: 'pet_cat',
        name: 'Cat',
        type: 'decoration',
        cost: 500,
        icon: '🐱',
        width: 1,
        height: 1
    },
    {
        id: 'pet_dog',
        name: 'Dog',
        type: 'decoration',
        cost: 600,
        icon: '🐶',
        width: 1,
        height: 1
    },
    {
        id: 'pet_bird',
        name: 'Bird Cage',
        type: 'decoration',
        cost: 300,
        icon: '🦜',
        width: 1,
        height: 1
    },

    // --- MORE TECH ---
    {
        id: 'laptop',
        name: 'Laptop',
        type: 'desk',
        cost: 800,
        icon: '💻',
        width: 1,
        height: 1
    },
    {
        id: 'tablet',
        name: 'Tablet',
        type: 'desk',
        cost: 400,
        icon: '📱',
        width: 1,
        height: 1
    },
    {
        id: 'speaker',
        name: 'Speakers',
        type: 'decoration',
        cost: 350,
        icon: '🔊',
        width: 1,
        height: 1
    },
    {
        id: 'headphones',
        name: 'Headphones',
        type: 'decoration',
        cost: 200,
        icon: '🎧',
        width: 1,
        height: 1
    },
    {
        id: 'robot',
        name: 'Robot Helper',
        type: 'decoration',
        cost: 5000,
        icon: '🤖',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },

    // --- FOOD & DRINKS ---
    {
        id: 'food_burger',
        name: 'Burger',
        type: 'decoration',
        cost: 30,
        icon: '🍔',
        width: 1,
        height: 1
    },
    {
        id: 'food_sushi',
        name: 'Sushi',
        type: 'decoration',
        cost: 80,
        icon: '🍣',
        width: 1,
        height: 1
    },
    {
        id: 'food_donut',
        name: 'Donuts',
        type: 'decoration',
        cost: 40,
        icon: '🍩',
        width: 1,
        height: 1
    },
    {
        id: 'drink_wine',
        name: 'Wine Bottle',
        type: 'decoration',
        cost: 150,
        icon: '🍷',
        width: 1,
        height: 1
    },

    // ==========================================
    // 🌟 SEASON 2 DROP: LUXURY & TECH EXPANSION 🌟
    // ==========================================

    // --- EXEC OFFICE (S2) ---
    {
        id: 'desk_hologram',
        name: 'Holo-Desk Model X',
        type: 'desk',
        cost: 4500,
        icon: '🌌',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'chair_massage',
        name: 'Zero-G Massage Chair',
        type: 'chair',
        cost: 3200,
        icon: '💆',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_server_rack',
        name: 'Crypto Server Unit',
        type: 'decoration',
        cost: 8500,
        icon: '🗄️',
        width: 1,
        height: 2,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'light_smart',
        name: 'Smart Ambient Array',
        type: 'lighting',
        cost: 1200,
        icon: '🌈',
        width: 1,
        height: 1
    },

    // --- GAME ROOM (S2) ---
    {
        id: 'arcade_vr',
        name: 'VR Omni-Treadmill',
        type: 'decoration',
        cost: 6500,
        icon: '🥽',
        width: 2,
        height: 2,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'table_billiards',
        name: 'Billiards Table',
        type: 'decoration',
        cost: 2800,
        icon: '🎱',
        width: 3,
        height: 2,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'decor_pinball',
        name: 'Retro Pinball',
        type: 'decoration',
        cost: 1800,
        icon: '🎰',
        width: 1,
        height: 2
    },
    {
        id: 'decor_jukebox',
        name: 'Vintage Jukebox',
        type: 'decoration',
        cost: 2200,
        icon: '📻',
        width: 1,
        height: 1
    },

    // --- LIVING & LOUNGE (S2) ---
    {
        id: 'sofa_velvet',
        name: 'Velvet Cloud Sectional',
        type: 'chair',
        cost: 3500,
        icon: '🛋️',
        width: 3,
        height: 2,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'decor_aquarium_large',
        name: 'Wall-to-Wall Aquarium',
        type: 'decoration',
        cost: 7500,
        icon: '🦈',
        width: 3,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_grand_piano',
        name: 'Grand Piano',
        type: 'decoration',
        cost: 9500,
        icon: '🎹',
        width: 3,
        height: 2,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_art_abstract',
        name: 'Million Dollar Canvas',
        type: 'decoration',
        cost: 12000,
        icon: '🖼️',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_bonsai_rare',
        name: 'Century Old Bonsai',
        type: 'plant',
        cost: 4000,
        icon: '🌲',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },

    // --- KITCHEN/BAR (S2) ---
    {
        id: 'fridge_smart',
        name: 'Smart Fridge',
        type: 'decoration',
        cost: 2500,
        icon: '❄️',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'bar_island',
        name: 'Marble Island Bar',
        type: 'desk',
        cost: 4800,
        icon: '🧊',
        width: 3,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'decor_espresso',
        name: 'Barista Espresso Machine',
        type: 'decoration',
        cost: 1500,
        icon: '☕',
        width: 1,
        height: 1
    },
    {
        id: 'table_dining',
        name: 'Mahogany Dining Table',
        type: 'desk',
        cost: 3600,
        icon: '🪑',
        width: 3,
        height: 2,
        reqHqLevel: 'hq_office'
    },

    // --- BEDROOM/BATH (S2) ---
    {
        id: 'bed_king_canopy',
        name: 'Royal Canopy Bed',
        type: 'decoration',
        cost: 5500,
        icon: '🛌',
        width: 2,
        height: 2,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'bathtub_freestanding',
        name: 'Freestanding Clawfoot Tub',
        type: 'decoration',
        cost: 3800,
        icon: '🛁',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_office'
    },
    {
        id: 'decor_vanity',
        name: 'Hollywood Make-up Vanity',
        type: 'desk',
        cost: 2400,
        icon: '🪞',
        width: 2,
        height: 1
    },

    // --- EXOTICS & TOYS (S2) ---
    {
        id: 'pet_tiger_cub',
        name: 'Exotic Bengal Cat',
        type: 'decoration',
        cost: 8000,
        icon: '🐅',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'pet_falcon',
        name: 'Hunting Falcon',
        type: 'decoration',
        cost: 7000,
        icon: '🦅',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_suit_armor',
        name: 'Medieval Armor Suit',
        type: 'decoration',
        cost: 4500,
        icon: '🛡️',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_telescope_gold',
        name: 'Gold-Plated Telescope',
        type: 'decoration',
        cost: 5000,
        icon: '🔭',
        width: 1,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_vault_door',
        name: 'Titanium Bank Vault',
        type: 'decoration',
        cost: 15000,
        icon: '🏦',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'toy_sports_car',
        name: 'Scale Model Supercar',
        type: 'decoration',
        cost: 12000,
        icon: '🏎️',
        width: 2,
        height: 1,
        reqHqLevel: 'hq_highrise'
    },
    {
        id: 'decor_gong',
        name: 'Wall Street Gong',
        type: 'decoration',
        cost: 2000,
        icon: '🥏',
        width: 1,
        height: 1
    }
]

