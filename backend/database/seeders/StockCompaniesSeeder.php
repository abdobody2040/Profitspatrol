<?php

namespace Database\Seeders;

use App\Models\StockCompany;
use Illuminate\Database\Seeder;

class StockCompaniesSeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'id' => 'ollie_robotics',
                'name' => 'Ollie Robotics',
                'sector' => 'Tech',
                'description' => 'AI-powered robots that help kids learn coding',
                'emoji' => '🤖',
                'current_price' => 120,
                'price_history' => [110, 115, 112, 118, 120],
            ],
            [
                'id' => 'lemoco_inc',
                'name' => 'LemoCo Inc.',
                'sector' => 'Retail',
                'description' => "The world's biggest virtual lemonade empire",
                'emoji' => '🍋',
                'current_price' => 80,
                'price_history' => [75, 78, 82, 79, 80],
            ],
            [
                'id' => 'spacefreight',
                'name' => 'SpaceFreight',
                'sector' => 'Logistics',
                'description' => 'Delivering packages to the moon and beyond',
                'emoji' => '🚀',
                'current_price' => 200,
                'price_history' => [180, 190, 195, 192, 200],
            ],
            [
                'id' => 'byteboss_ai',
                'name' => 'ByteBoss AI',
                'sector' => 'Tech',
                'description' => 'Smart study assistant powered by AI',
                'emoji' => '🧠',
                'current_price' => 150,
                'price_history' => [135, 140, 148, 145, 150],
            ],
            [
                'id' => 'greengrow',
                'name' => 'GreenGrow',
                'sector' => 'Energy',
                'description' => 'Solar-powered farms that feed entire cities',
                'emoji' => '🌱',
                'current_price' => 95,
                'price_history' => [90, 92, 91, 94, 95],
            ],
            [
                'id' => 'cookie_capital',
                'name' => 'Cookie Capital',
                'sector' => 'Retail',
                'description' => 'Artisan cookies sold in 50 countries',
                'emoji' => '🍪',
                'current_price' => 60,
                'price_history' => [55, 58, 62, 59, 60],
            ],
            [
                'id' => 'aquanova',
                'name' => 'AquaNova',
                'sector' => 'Energy',
                'description' => 'Clean water technology for developing nations',
                'emoji' => '💧',
                'current_price' => 110,
                'price_history' => [100, 105, 108, 107, 110],
            ],
            [
                'id' => 'mediakids',
                'name' => 'MediaKids',
                'sector' => 'Finance',
                'description' => 'Kid-safe streaming platform and creator fund',
                'emoji' => '🎬',
                'current_price' => 175,
                'price_history' => [160, 165, 170, 168, 175],
            ],
        ];

        foreach ($companies as $company) {
            StockCompany::updateOrCreate(['id' => $company['id']], $company);
        }
    }
}
