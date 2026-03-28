
import { BusinessSimulation } from "../../../types";

export const GAMES_DB: BusinessSimulation[] = [
  // --- Retail & Food ---
  {
    "business_id": "BIZ_01_LEMONADE",
    "name": "Lemonade Stand",
    "nameKey": "games.lemonade_stand.title",
    "category": "Retail & Food",
    "game_type": "simulation_tycoon",
    "description": "Adjust your recipe and prices based on the weather forecast.",
    "descriptionKey": "games.lemonade_stand.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#FFC800", "secondary": "#F59E0B", "accent": "#10B981", "background": "#FEF3C7" },
      "icon": "🍋"
    },
    "variables": {
      "resources": ["lemons", "sugar", "ice", "cups"],
      "dynamic_factors": ["temperature", "weather_condition"],
      "player_inputs": ["price_per_cup", "ice_per_cup", "lemons_per_cup"]
    },
    "upgrade_tree": [
      { "id": "upgrade_ice_chest", "name": "Super Cooler", "effect": "Ice melts 50% slower", "cost": 50, "modifier_target": "quality", "modifier_value": 1.2 },
      { "id": "upgrade_juicer", "name": "Electric Juicer", "effect": "Production speed +25%", "cost": 100, "modifier_target": "speed", "modifier_value": 1.25 },
      { "id": "upgrade_sign", "name": "Spinning Sign", "effect": "Customer attraction +20%", "cost": 150, "modifier_target": "demand", "modifier_value": 1.2 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Heatwave", "effect": "Demand increases by 200%", "duration": "1_day", "modifier_target": "demand", "modifier_value": 2.0 },
      "negative": { "event_name": "Sour Batch", "effect": "Refund cost increases by 20%", "duration": "1_day", "modifier_target": "revenue", "modifier_value": 0.8 }
    }
  },
  {
    "business_id": "BIZ_02_PIZZA",
    "name": "Pizza Rush",
    "nameKey": "games.pizza_delivery.title",
    "category": "Retail & Food",
    "game_type": "grid_territory",
    "description": "Deliver pizzas to hungry customers. Avoid traffic!",
    "descriptionKey": "games.pizza_delivery.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#EF4444", "secondary": "#B91C1C", "accent": "#F59E0B", "background": "#FFF1F2" },
      "icon": "🍕"
    },
    "grid_config": {
      "rows": 8, "cols": 8,
      "start_pos": { "r": 0, "c": 0 },
      "obstacles": [{ "r": 2, "c": 2 }, { "r": 5, "c": 5 }, { "r": 3, "c": 6 }],
      "visuals": { "cell_empty": "#FEE2E2", "cell_filled": "#FECACA", "player_icon": "🛵" }
    },
    "scoring": { "base_points": 20, "time_limit": 45 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_03_CUPCAKE",
    "name": "Cupcake Bakery",
    "nameKey": "games.cupcake_bakery.title",
    "category": "Retail & Food",
    "game_type": "cooking_game",
    "description": "Assemble cupcakes exactly as ordered!",
    "descriptionKey": "games.cupcake_bakery.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#EC4899", "secondary": "#DB2777", "accent": "#F472B6", "background": "#FDF2F8" },
      "icon": "🧁"
    },
    "cooking_config": {
      "ingredients": [
        { "id": "base_vanilla", "labelKey": "ingredients.base_vanilla", "icon": "🧁", "type": "base" },
        { "id": "frosting_pink", "labelKey": "ingredients.frosting_pink", "icon": "🥣", "type": "filling" },
        { "id": "frosting_blue", "labelKey": "ingredients.frosting_blue", "icon": "🥣", "type": "filling" },
        { "id": "top_cherry", "labelKey": "ingredients.top_cherry", "icon": "🍒", "type": "topping" },
        { "id": "top_sprinkle", "labelKey": "ingredients.top_sprinkle", "icon": "🍬", "type": "topping" }
      ],
      "recipes": [
        { "id": "classic_cupcake", "items": ["base_vanilla", "frosting_pink", "top_cherry"] },
        { "id": "berry_blast", "items": ["base_vanilla", "frosting_blue", "top_sprinkle"] }
      ]
    },
    "scoring": { "base_points": 15 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_04_COFFEE",
    "name": "Coffee Cart",
    "nameKey": "games.coffee_cart.title",
    "category": "Retail & Food",
    "game_type": "simulation_tycoon",
    "description": "Brew the perfect cup. Balance roast strength and milk foam.",
    "descriptionKey": "games.coffee_cart.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#78350F", "secondary": "#451a03", "accent": "#D97706", "background": "#FFFBEB" },
      "icon": "☕"
    },
    "variables": {
      "resources": ["beans", "milk", "cups"],
      "dynamic_factors": ["morning_rush", "weather"],
      "player_inputs": ["roast_level", "milk_foam", "price"]
    },
    "upgrade_tree": [
      { "id": "up_espresso", "name": "Espresso Machine", "effect": "Speed +30%", "cost": 200 },
      { "id": "up_beans", "name": "Premium Beans", "effect": "Quality +20%", "cost": 150 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Rainy Day", "effect": "Hot coffee demand +50%", "duration": "1d" },
      "negative": { "event_name": "Machine Break", "effect": "Speed -50%", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_05_TACO",
    "name": "Taco Truck",
    "nameKey": "games.taco_truck.title",
    "category": "Retail & Food",
    "game_type": "cooking_game",
    "description": "Build tacos strictly to order! Don't forget the guac.",
    "descriptionKey": "games.taco_truck.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#F59E0B", "secondary": "#B45309", "accent": "#EF4444", "background": "#FEF3C7" },
      "icon": "🌮"
    },
    "cooking_config": {
      "ingredients": [
        { "id": "shell_corn", "labelKey": "ingredients.shell_corn", "icon": "🌮", "type": "base" },
        { "id": "meat_beef", "labelKey": "ingredients.meat_beef", "icon": "🥩", "type": "filling" },
        { "id": "cheese_shred", "labelKey": "ingredients.cheese_shred", "icon": "🧀", "type": "filling" },
        { "id": "lettuce_shred", "labelKey": "ingredients.lettuce_shred", "icon": "🥬", "type": "topping" },
        { "id": "salsa", "labelKey": "ingredients.salsa", "icon": "🌶️", "type": "topping" }
      ],
      "recipes": [
        { "id": "classic_taco", "items": ["shell_corn", "meat_beef", "lettuce_shred", "cheese_shred"] },
        { "id": "spicy_taco", "items": ["shell_corn", "meat_beef", "salsa", "cheese_shred"] },
        { "id": "meat_lover", "items": ["shell_corn", "meat_beef", "meat_beef", "cheese_shred"] }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_06_ICECREAM",
    "name": "Ice Cream Parlor",
    "nameKey": "games.ice_cream_parlor.title",
    "category": "Retail & Food",
    "game_type": "service_queue",
    "description": "Scoop happiness! Keep flavors moving.",
    "descriptionKey": "games.ice_cream_parlor.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#F472B6", "secondary": "#DB2777", "accent": "#60A5FA", "background": "#FDF2F8" },
      "icon": "🍦"
    },
    "service_config": {
      "actions": [
        { "id": "scoop_vanilla", "labelKey": "actions.scoop_vanilla", "icon": "🍨", "color": "#F3F4F6" },
        { "id": "scoop_choco", "labelKey": "actions.scoop_choco", "icon": "🍫", "color": "#78350F" },
        { "id": "scoop_berry", "labelKey": "actions.scoop_berry", "icon": "🍓", "color": "#EC4899" },
        { "id": "topping_cherry", "labelKey": "actions.topping_cherry", "icon": "🍒", "color": "#EF4444" },
        { "id": "topping_sprinkle", "labelKey": "actions.topping_sprinkle", "icon": "✨", "color": "#F59E0B" }
      ],
      "customer_types": [
        { "id": "kid", "name": "Kid", "possible_requests": [["scoop_vanilla", "topping_sprinkle"], ["scoop_choco"]] },
        { "id": "fan", "name": "Fan", "possible_requests": [["scoop_berry", "topping_cherry"], ["scoop_vanilla", "scoop_choco"]] }
      ]
    },
    "upgrade_tree": [
      { "id": "up_freezer", "name": "Deep Freezer", "effect": "Less melting", "cost": 150 },
      { "id": "up_flavors", "name": "Flavor Station", "effect": "Attraction +20%", "cost": 200 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Summer Camp", "effect": "Huge group of kids!", "duration": "1d" },
      "negative": { "event_name": "Brain Freeze", "effect": "Customers eat slower", "duration": "1d" }
    }
  },

  // --- Services & E-Commerce ---
  {
    "business_id": "BIZ_12_CARWASH",
    "name": "Groovy Car Wash",
    "nameKey": "games.car_wash.title",
    "category": "Services & E-Commerce",
    "game_type": "action_rhythm",
    "description": "Scrub the cars to the beat! Hit the targets perfectly.",
    "descriptionKey": "games.car_wash.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#3B82F6", "secondary": "#2563EB", "accent": "#60A5FA", "background": "#EFF6FF" },
      "icon": "🚗"
    },
    "rhythm_config": {
      "track_name": "Car Wash Disco",
      "tracks": [
        { "id": "soap", "color": "#3B82F6", "icon": "🧼", "label": "Soap" },
        { "id": "rinse", "color": "#60A5FA", "icon": "🚿", "label": "Rinse" },
        { "id": "wax", "color": "#FBBF24", "icon": "✨", "label": "Wax" }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_13_PETSALON",
    "name": "Pet Salon",
    "nameKey": "games.pet_salon.title",
    "category": "Services & E-Commerce",
    "game_type": "service_queue",
    "description": "Wash and groom cute pets. Keep them calm!",
    "descriptionKey": "games.pet_salon.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#A78BFA", "secondary": "#8B5CF6", "accent": "#F472B6", "background": "#F5F3FF" },
      "icon": "🐩"
    },
    "service_config": {
      "actions": [
        { "id": "wash", "labelKey": "actions.wash", "icon": "🚿", "color": "#60A5FA" },
        { "id": "dry", "labelKey": "actions.dry", "icon": "💨", "color": "#FBBF24" },
        { "id": "clip", "labelKey": "actions.clip", "icon": "✂️", "color": "#9CA3AF" },
        { "id": "brush", "labelKey": "actions.brush", "icon": "🦷", "color": "#F472B6" },
        { "id": "bow", "labelKey": "actions.bow", "icon": "🎀", "color": "#EC4899" }
      ],
      "customer_types": [
        { "id": "dog", "name": "Dog", "possible_requests": [["wash", "dry", "clip"], ["brush", "bow"]] },
        { "id": "poodle", "name": "Poodle", "possible_requests": [["wash", "dry", "clip", "bow"]] },
        { "id": "cat", "name": "Cat", "possible_requests": [["brush", "bow"], ["clip"]] }
      ]
    },
    "upgrade_tree": [
      { "id": "up_dryer", "name": "Silent Dryer", "effect": "Pets stay calm", "cost": 300 },
      { "id": "up_shampoo", "name": "Premium Soap", "effect": "Shinier coats (Higher tips)", "cost": 100 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Dog Show", "effect": "High-paying customers", "duration": "1d" },
      "negative": { "event_name": "Muddy Puddle", "effect": "Extra dirty dogs", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_14_LAWN",
    "name": "Lawn Master",
    "nameKey": "games.lawn_master.title",
    "category": "Services & E-Commerce",
    "game_type": "grid_territory",
    "description": "Mow the lawn perfectly before time runs out!",
    "descriptionKey": "games.lawn_master.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#22C55E", "secondary": "#15803D", "accent": "#EAB308", "background": "#F0FDF4" },
      "icon": "🚜"
    },
    "grid_config": {
      "rows": 8, "cols": 8,
      "start_pos": { "r": 0, "c": 0 },
      "obstacles": [{ "r": 3, "c": 3 }, { "r": 4, "c": 3 }, { "r": 2, "c": 6 }],
      "visuals": { "cell_empty": "#34D399", "cell_filled": "#065F46", "player_icon": "🚜" }
    },
    "scoring": { "base_points": 10, "time_limit": 60 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_15_DROPSHIP",
    "name": "Dropship Empire",
    "nameKey": "games.dropship.title",
    "category": "Services & E-Commerce",
    "game_type": "clicker_idle",
    "description": "Click to process orders! Automate your shipping empire.",
    "descriptionKey": "games.dropship.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#6366F1", "secondary": "#4F46E5", "accent": "#10B981", "background": "#EEF2FF" },
      "icon": "📦"
    },
    "clicker_config": {
      "resource_name": "Revenue",
      "click_label": "Process Order",
      "auto_label": "Auto-Fulfillment"
    },
    "entities": [
      { "id": "robot", "type": "item", "name": "Robot", "emoji": "🤖", "behavior": "fall" },
      { "id": "bear", "type": "item", "name": "Bear", "emoji": "🧸", "behavior": "fall" },
      { "id": "car", "type": "item", "name": "Car", "emoji": "🏎️", "behavior": "fall" },
      { "id": "broken", "type": "obstacle", "name": "Defect", "emoji": "🔥", "behavior": "fall" }
    ],
    "game_mechanics": { "spawn_rate": 1500, "lanes": 3 },
    "upgrade_tree": [
      { "id": "up_ads", "name": "Social Ads", "effect": "Auto-orders +5/sec", "cost": 200, "modifier_target": "auto_click_rate", "modifier_value": 5 },
      { "id": "up_supplier", "name": "Fast Supplier", "effect": "Click value +10", "cost": 500, "modifier_target": "click_value", "modifier_value": 10 }
    ],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_16_IFIX",
    "name": "iFix It",
    "nameKey": "games.ifix_it.title",
    "category": "Services & E-Commerce",
    "game_type": "puzzle_repair",
    "description": "Match the correct parts to repair phones and tablets.",
    "descriptionKey": "games.ifix_it.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#0EA5E9", "secondary": "#0284C7", "accent": "#FACC15", "background": "#F0F9FF" },
      "icon": "📱"
    },
    "repair_config": {
      "bg_color": "#1f2937",
      "parts": [
        { "id": "battery", "name": "Battery", "icon": "🔋", "initial_pos": { "x": 10, "y": 80 }, "target_pos": { "x": 50, "y": 50 } },
        { "id": "screen", "name": "Screen", "icon": "📲", "initial_pos": { "x": 80, "y": 80 }, "target_pos": { "x": 50, "y": 50 } }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Production & Manufacturing ---
  {
    "business_id": "BIZ_17_FACTORY",
    "name": "Toy Factory",
    "nameKey": "games.toy_factory.title",
    "category": "Production & Manufacturing",
    "game_type": "production_conveyor",
    "description": "Manage the assembly line. Speed vs Quality.",
    "descriptionKey": "games.toy_factory.desc",
    "visual_config": {
      "theme": "realistic",
      "colors": { "primary": "#64748B", "secondary": "#475569", "accent": "#F59E0B", "background": "#F1F5F9" },
      "icon": "🏭"
    },
    "variables": {
      "resources": ["plastic", "paint", "boxes"],
      "dynamic_factors": ["machine_heat", "worker_energy"],
      "player_inputs": ["conveyor_speed", "qc_check", "batch_size"]
    },
    "upgrade_tree": [
      { "id": "up_robot", "name": "Robot Arm", "effect": "Speed +50%", "cost": 500 },
      { "id": "up_paint", "name": "Auto-Painter", "effect": "Quality +20%", "cost": 300 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Holiday Rush", "effect": "Orders x3", "duration": "1d" },
      "negative": { "event_name": "Power Outage", "effect": "Speed -80%", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_18_PRINTSHOP",
    "name": "3D Print Shop",
    "nameKey": "games.print_shop.title",
    "category": "Production & Manufacturing",
    "game_type": "matching_pattern",
    "description": "Match the filament color to the 3D model order.",
    "descriptionKey": "games.print_shop.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#8B5CF6", "secondary": "#7C3AED", "accent": "#C084FC", "background": "#F3E8FF" },
      "icon": "🖨️"
    },
    "entities": [
      { "id": "red_fil", "type": "resource", "name": "Red", "emoji": "🔴" },
      { "id": "blue_fil", "type": "resource", "name": "Blue", "emoji": "🔵" },
      { "id": "green_fil", "type": "resource", "name": "Green", "emoji": "🟢" },
      { "id": "yellow_fil", "type": "resource", "name": "Yellow", "emoji": "🟡" },
      { "id": "white_fil", "type": "resource", "name": "White", "emoji": "⚪" },
      { "id": "black_fil", "type": "resource", "name": "Black", "emoji": "⚫" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_19_PUBLISHING",
    "name": "Book Publishing",
    "nameKey": "games.publishing.title",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Print and sell bestsellers. Manage ink and paper.",
    "descriptionKey": "games.publishing.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#713F12", "secondary": "#451a03", "accent": "#FCD34D", "background": "#FFFBEB" },
      "icon": "📚"
    },
    "variables": {
      "resources": ["paper", "ink", "glue"],
      "dynamic_factors": ["trend", "reviews"],
      "player_inputs": ["print_quality", "cover_art_budget", "marketing_spend"]
    },
    "upgrade_tree": [
      { "id": "up_press", "name": "Offset Press", "effect": "Bulk printing cheaper", "cost": 400 },
      { "id": "up_editor", "name": "Star Editor", "effect": "Better reviews", "cost": 250 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Book Club Pick", "effect": "Sales x2", "duration": "1d" },
      "negative": { "event_name": "Typo Found", "effect": "Reprint cost", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_20_BATTERY",
    "name": "Eco Battery Co.",
    "nameKey": "games.battery.title",
    "category": "Production & Manufacturing",
    "game_type": "physics_balance",
    "description": "Manufacture green batteries. Balance charge and safety.",
    "descriptionKey": "games.battery.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#16A34A", "secondary": "#15803D", "accent": "#22C55E", "background": "#F0FDF4" },
      "icon": "🔋"
    },
    "variables": {
      "resources": ["lithium", "metal", "plastic"],
      "dynamic_factors": ["charge_capacity", "heat"],
      "player_inputs": ["voltage", "safety_check", "production_speed"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_31_OFFICE",
    "name": "BizTycoon",
    "nameKey": "games.biz_tycoon.title",
    "category": "Tycoon Exclusive",
    "game_type": "office_tower",
    "description": "Build floors and manage departments.",
    "descriptionKey": "games.biz_tycoon.desc",
    "visual_config": {
      "theme": "modern",
      "colors": { "primary": "#1E40AF", "secondary": "#1E3A8A", "accent": "#60A5FA", "background": "#EFF6FF" },
      "icon": "🏢"
    },
    "office_config": {
      "max_floors": 10,
      "tenant_types": [
        { "id": "startup", "name": "Tech Startup", "cost": 50, "income": 5, "icon": "💻", "color": "#60A5FA" },
        { "id": "cafe", "name": "Coffee Shop", "cost": 150, "income": 12, "icon": "☕", "color": "#FBBF24" },
        { "id": "gym", "name": "Fitness Gym", "cost": 300, "income": 25, "icon": "🏋️", "color": "#34D399" },
        { "id": "bank", "name": "Investment Bank", "cost": 1000, "income": 100, "icon": "🏦", "color": "#F472B6" }
      ]
    },
    "upgrade_tree": [
      { "id": "upgrade_coffee", "name": "Premium Coffee", "effect": "Productivity +10%", "cost": 100, "modifier_target": "speed", "modifier_value": 1.1 },
      { "id": "upgrade_chairs", "name": "Ergo Chairs", "effect": "Happiness +15%", "cost": 250, "modifier_target": "quality", "modifier_value": 1.15 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Big Contract", "effect": "Revenue +500", "duration": "1d" },
      "negative": { "event_name": "Printer Jam", "effect": "Productivity -20%", "duration": "1d" }
    }
  },

  // --- Creative & Events ---
  {
    "business_id": "BIZ_21_PARTY",
    "name": "Party Planner",
    "nameKey": "games.party_planner.title",
    "category": "Creative & Events",
    "game_type": "timeline_planner",
    "description": "Schedule events in the perfect order.",
    "descriptionKey": "games.party_planner.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#C026D3", "secondary": "#A21CAF", "accent": "#E879F9", "background": "#FAE8FF" },
      "icon": "🎉"
    },
    "timeline_config": {
      "start_hour": 18, "end_hour": 24,
      "events": [
        { "id": "dj", "name": "DJ Set", "duration": 2, "fun": 50, "icon": "🎧", "color": "#E879F9" },
        { "id": "cake", "name": "Cake Cutting", "duration": 1, "fun": 30, "icon": "🎂", "color": "#F472B6" },
        { "id": "speech", "name": "Speeches", "duration": 1, "fun": 10, "icon": "🎤", "color": "#94A3B8" },
        { "id": "dance", "name": "Dance Off", "duration": 2, "fun": 60, "icon": "💃", "color": "#A78BFA" }
      ]
    },
    "upgrade_tree": [
      { "id": "up_dj", "name": "Pro DJ", "effect": "Fun meter maxed", "cost": 300 },
      { "id": "up_lights", "name": "Laser Lights", "effect": "Cool factor +50%", "cost": 200 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Celebrity Guest", "effect": "Reputation up", "duration": "1d" },
      "negative": { "event_name": "Rain on Parade", "effect": "Outdoor party ruined", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_22_ROCKSTAR",
    "name": "Rock Star Tour",
    "nameKey": "games.rock_star.title",
    "category": "Creative & Events",
    "game_type": "action_rhythm",
    "description": "Hit the notes to sell out stadiums!",
    "descriptionKey": "games.rock_star.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#EF4444", "secondary": "#991B1B", "accent": "#FCA5A5", "background": "#FEF2F2" },
      "icon": "🎸"
    },
    "rhythm_config": {
      "track_name": "Sold Out Stadium",
      "tracks": [
        { "id": "green", "color": "#10B981", "icon": "🟢", "label": "Green" },
        { "id": "red", "color": "#EF4444", "icon": "🔴", "label": "Red" },
        { "id": "blue", "color": "#3B82F6", "icon": "🔵", "label": "Blue" },
        { "id": "yellow", "color": "#FBBF24", "icon": "🟡", "label": "Yellow" }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_23_ARTDEALER",
    "name": "Art Dealer",
    "nameKey": "games.art_dealer.title",
    "category": "Creative & Events",
    "game_type": "trading_auction",
    "description": "Bid low, sell high! Spot the masterpieces.",
    "descriptionKey": "games.art_dealer.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#0F172A", "secondary": "#020617", "accent": "#64748B", "background": "#F1F5F9" },
      "icon": "🎨"
    },
    "trading_config": {
      "initial_budget": 500,
      "items": [
        { "id": "painting_1", "name": "Abstract #5", "min_value": 200, "max_value": 600, "start_price": 100, "icon": "🎨" },
        { "id": "vase_1", "name": "Ming Vase", "min_value": 800, "max_value": 2000, "start_price": 400, "icon": "🏺" },
        { "id": "statue_1", "name": "Bronze Bust", "min_value": 300, "max_value": 900, "start_price": 150, "icon": "🗿" }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_24_CRAFT",
    "name": "Craft Corner",
    "nameKey": "games.craft_corner.title",
    "category": "Creative & Events",
    "game_type": "matching_pattern",
    "description": "Make handmade jewelry. Precision matters.",
    "descriptionKey": "games.craft_corner.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#FBBF24", "secondary": "#D97706", "accent": "#FDE68A", "background": "#FFFBEB" },
      "icon": "🧵"
    },
    "entities": [
      { "id": "bead_gold", "name": "Gold Bead", "type": "resource", "emoji": "📿" },
      { "id": "string", "name": "String", "type": "resource", "emoji": "🧵" },
      { "id": "gem", "name": "Gem", "type": "resource", "emoji": "💎" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Digital & Tech ---
  {
    "business_id": "BIZ_25_APP",
    "name": "App Developer",
    "nameKey": "games.app_dev.title",
    "category": "Digital & Tech",
    "game_type": "clicker_idle",
    "description": "Tap to write code! Fix bugs and launch features.",
    "descriptionKey": "games.app_dev.desc",
    "visual_config": {
      "theme": "dark",
      "colors": { "primary": "#3B82F6", "secondary": "#1E3A8A", "accent": "#60A5FA", "background": "#F0F9FF" },
      "icon": "📱"
    },
    "clicker_config": {
      "resource_name": "Code Lines",
      "click_label": "Write Code",
      "auto_label": "AI Copilot"
    },
    "entities": [
      { "id": "bug", "type": "obstacle", "name": "Bug", "emoji": "🐛", "value": -10 },
      { "id": "feature", "type": "target", "name": "Feature", "emoji": "✨", "value": 50 }
    ],
    "upgrade_tree": [
      { "id": "upgrade_laptop", "name": "Dual Monitors", "effect": "Click value +5", "cost": 100, "modifier_target": "click_value", "modifier_value": 5 },
      { "id": "upgrade_server", "name": "Cloud Scaling", "effect": "Auto-code +2/sec", "cost": 500, "modifier_target": "auto_click_rate", "modifier_value": 2 },
      { "id": "upgrade_ai", "name": "AI Assistant", "effect": "Auto-code +10/sec", "cost": 1500, "modifier_target": "auto_click_rate", "modifier_value": 10 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Featured by Store", "effect": "Downloads x2 for 10s", "duration": "10s" },
      "negative": { "event_name": "Server Crash", "effect": "Production halted", "duration": "5s" }
    }
  },
  {
    "business_id": "BIZ_26_CYBER",
    "name": "Cyber Defense",
    "nameKey": "games.cyber.title",
    "category": "Digital & Tech",
    "game_type": "defense_game",
    "description": "Protect your network from cyber threats!",
    "descriptionKey": "games.cyber.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#10B981", "secondary": "#059669", "accent": "#34D399", "background": "#ECFDF5" },
      "icon": "🛡️"
    },
    "defense_config": {
      "spawn_rate": 1500,
      "win_time": 60,
      "enemies": [
        { "id": "malware", "name": "Malware", "speed": 100, "health": 1, "score": 10, "icon": "🦠", "color": "#EF4444" },
        { "id": "phishing", "name": "Phishing", "speed": 150, "health": 1, "score": 20, "icon": "🎣", "color": "#F59E0B" },
        { "id": "ddos", "name": "DDoS Packet", "speed": 200, "health": 2, "score": 50, "icon": "💥", "color": "#8B5CF6" }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_27_YOUTUBE",
    "name": "Content Creator",
    "nameKey": "games.youtube.title",
    "category": "Digital & Tech",
    "game_type": "streamer_sim",
    "description": "Go live, engage chat, and manage your mood!",
    "descriptionKey": "games.youtube.desc",
    "visual_config": {
      "theme": "streamer",
      "colors": { "primary": "#EF4444", "secondary": "#B91C1C", "accent": "#FCA5A5", "background": "#FFF1F2" },
      "icon": "📹"
    },
    "streamer_config": {
      "actions": [
        { "id": "hype", "name": "Hype Chat", "energy_cost": 10, "mood_effect": 5, "view_effect": 5, "icon": "🔥", "color": "#EF4444" },
        { "id": "game", "name": "Play Game", "energy_cost": 15, "mood_effect": -5, "view_effect": 20, "icon": "🎮", "color": "#3B82F6" },
        { "id": "chill", "name": "Just Chatting", "energy_cost": 5, "mood_effect": 10, "view_effect": 5, "icon": "☕", "color": "#10B981" },
        { "id": "sponsor", "name": "Ad Read", "energy_cost": 20, "mood_effect": -10, "view_effect": -5, "icon": "💰", "color": "#F59E0B" }
      ]
    },
    "upgrade_tree": [
      { "id": "up_camera", "name": "4K Camera", "effect": "Quality maxed", "cost": 500 },
      { "id": "up_editor", "name": "Editor Hire", "effect": "Speed +50%", "cost": 300 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Viral Hit", "effect": "Views x10", "duration": "1d" },
      "negative": { "event_name": "Internet Down", "effect": "No uploads", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_28_SPACE",
    "name": "Mars Colony Supply",
    "nameKey": "games.mars.title",
    "category": "Digital & Tech",
    "game_type": "simulation_tycoon",
    "description": "Manage oxygen and food for the colony.",
    "descriptionKey": "games.mars.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#EA580C", "secondary": "#9A3412", "accent": "#FDBA74", "background": "#FFF7ED" },
      "icon": "🚀"
    },
    "variables": {
      "resources": ["oxygen", "water", "potatoes"],
      "dynamic_factors": ["radiation", "morale"],
      "player_inputs": ["ration_size", "work_shift", "recycling_rate"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Social Impact ---
  {
    "business_id": "BIZ_29_RECYCLE",
    "name": "Recycling Center",
    "nameKey": "games.recycle.title",
    "category": "Social Impact",
    "game_type": "production_conveyor",
    "description": "Sort incoming trash into the correct bins. Don't let plastic go into paper!",
    "descriptionKey": "games.recycle.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#22C55E", "secondary": "#15803D", "accent": "#EAB308", "background": "#F0FDF4" },
      "icon": "♻️"
    },
    "game_mechanics": {
      "spawn_rate": 2000,
      "lanes": 3
    },
    "entities": [
      { "id": "paper", "type": "item", "name": "Paper", "emoji": "📄", "behavior": "fall" },
      { "id": "plastic", "type": "item", "name": "Plastic", "emoji": "🥤", "behavior": "fall" },
      { "id": "glass", "type": "item", "name": "Glass", "emoji": "🍾", "behavior": "fall" }
    ],
    "upgrade_tree": [
      { "id": "upgrade_belt", "name": "Fast Belt", "effect": "Spawn rate +20%", "cost": 200 },
      { "id": "upgrade_scanner", "name": "Auto-Sorter", "effect": "Auto-sorts 10% of trash", "cost": 500 }
    ],
    "event_triggers": {
      "positive": { "event_name": "City Grant", "effect": "Bonus Points", "duration": "instant" },
      "negative": { "event_name": "Jam", "effect": "Belt stops", "duration": "5s" }
    }
  },
  {
    "business_id": "BIZ_30_FAIRTRADE",
    "name": "Fair Trade Market",
    "nameKey": "games.fair_trade.title",
    "category": "Social Impact",
    "game_type": "trading_auction",
    "description": "Sell ethically sourced goods. Happiness > Profit.",
    "descriptionKey": "games.fair_trade.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#15803D", "secondary": "#14532D", "accent": "#86EFAC", "background": "#ECFDF5" },
      "icon": "🤝"
    },
    "trading_config": {
      "initial_budget": 300,
      "items": [
        { "id": "coffee", "name": "Fair Coffee", "min_value": 50, "max_value": 150, "start_price": 40, "icon": "☕" },
        { "id": "cocoa", "name": "Raw Cocoa", "min_value": 80, "max_value": 200, "start_price": 60, "icon": "🍫" },
        { "id": "cotton", "name": "Organic Cotton", "min_value": 100, "max_value": 250, "start_price": 90, "icon": "👕" }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_32_BIKE",
    "name": "Bike Repair",
    "nameKey": "games.bike.title",
    "category": "Social Impact",
    "game_type": "puzzle_repair",
    "description": "Fix bikes to encourage green transport!",
    "descriptionKey": "games.bike.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#0D9488", "secondary": "#0F766E", "accent": "#5EEAD4", "background": "#F0FDFA" },
      "icon": "🚲"
    },
    "repair_config": {
      "bg_color": "#064e3b",
      "parts": [
        { "id": "wheel", "name": "Wheel", "icon": "🛞", "initial_pos": { "x": 10, "y": 80 }, "target_pos": { "x": 20, "y": 50 } },
        { "id": "chain", "name": "Chain", "icon": "🔗", "initial_pos": { "x": 80, "y": 80 }, "target_pos": { "x": 50, "y": 50 } },
        { "id": "pedal", "name": "Pedal", "icon": "🦶", "initial_pos": { "x": 40, "y": 80 }, "target_pos": { "x": 70, "y": 60 } }
      ]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  // --- New Tycoon Exclusive ---
  {
    "business_id": "BIZ_NEGOTIATION",
    "name": "Negotiation Battle",
    "nameKey": "games.negotiation.title",
    "category": "Tycoon Exclusive",
    "game_type": "negotiation_game",
    "description": "Master the art of the deal. Face tough suppliers and win.",
    "descriptionKey": "games.negotiation.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#EAB308", "secondary": "#A16207", "accent": "#FEF08A", "background": "#FFFBEB" },
      "icon": "🤝"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_PRICING_GAME",
    "name": "Pricing Specialist",
    "nameKey": "games.pricing.title",
    "category": "Marketing",
    "game_type": "pricing_game",
    "description": "Find the perfect price! Balance profit magnitude with sales volume.",
    "descriptionKey": "games.pricing.desc",
    "visual_config": {
      "theme": "light",
      "colors": { "primary": "#10B981", "secondary": "#047857", "accent": "#34D399", "background": "#ECFDF5" },
      "icon": "🏷️"
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_AUDIENCE_GAME",
    "name": "Target Audience Master",
    "nameKey": "games.audience.title",
    "category": "Marketing",
    "game_type": "audience_game",
    "description": "Match the product to the right customer persona.",
    "descriptionKey": "games.audience.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#8B5CF6", "secondary": "#6D28D9", "accent": "#A78BFA", "background": "#F5F3FF" },
      "icon": "🎯"
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  // --- New Minigames (Phase 2) ---
  {
    "business_id": "BIZ_QUALITY_GAME",
    "name": "The Bug Hunter",
    "nameKey": "games.quality.title",
    "category": "Production & Manufacturing",
    "game_type": "quality_control",
    "description": "Spot defects on the line!",
    "descriptionKey": "games.quality.desc",
    "visual_config": {
      "theme": "neon",
      "colors": { "primary": "#EF4444", "secondary": "#991B1B", "accent": "#FEE2E2", "background": "#FEF2F2" },
      "icon": "🐞"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_ETHICS_GAME",
    "name": "The Ethical Dilemma",
    "nameKey": "games.ethics.title",
    "category": "Social Impact",
    "game_type": "narrative_choice",
    "description": "Make tough choices.",
    "descriptionKey": "games.ethics.desc",
    "visual_config": {
      "theme": "eco",
      "colors": { "primary": "#6366F1", "secondary": "#4338CA", "accent": "#A5B4FC", "background": "#EEF2FF" },
      "icon": "⚖️"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_INVEST_GAME",
    "name": "Stock Market Rollercoaster",
    "nameKey": "games.invest.title",
    "category": "Services & E-Commerce",
    "game_type": "stock_sim",
    "description": "Buy low, sell high!",
    "descriptionKey": "games.invest.desc",
    "visual_config": {
      "theme": "realistic",
      "colors": { "primary": "#10B981", "secondary": "#065F46", "accent": "#6EE7B7", "background": "#ECFDF5" },
      "icon": "📈"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_OPERATIONS_GAME",
    "name": "Fast Food Tycoon",
    "nameKey": "games.operations.title",
    "category": "Services & E-Commerce",
    "game_type": "cooking_game",
    "description": "Serve customers fast!",
    "descriptionKey": "games.operations.desc",
    "visual_config": {
      "theme": "pastel",
      "colors": { "primary": "#F59E0B", "secondary": "#B45309", "accent": "#FCD34D", "background": "#FFFBEB" },
      "icon": "🍔"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "cooking_config": {
      "ingredients": [
        { "id": "bun_bottom", "labelKey": "ingredients.bun_bottom", "icon": "🥯", "type": "base" },
        { "id": "patty", "labelKey": "ingredients.patty", "icon": "🥩", "type": "filling" },
        { "id": "cheese", "labelKey": "ingredients.cheese", "icon": "🧀", "type": "filling" },
        { "id": "lettuce", "labelKey": "ingredients.lettuce", "icon": "🥬", "type": "topping" },
        { "id": "tomato", "labelKey": "ingredients.tomato", "icon": "🍅", "type": "topping" },
        { "id": "bun_top", "labelKey": "ingredients.bun_top", "icon": "🥯", "type": "base" }
      ],
      "recipes": [
        { "id": "classic", "items": ["bun_bottom", "patty", "bun_top"] },
        { "id": "cheeseburger", "items": ["bun_bottom", "patty", "cheese", "bun_top"] },
        { "id": "deluxe", "items": ["bun_bottom", "patty", "cheese", "lettuce", "tomato", "bun_top"] }
      ]
    },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

];
