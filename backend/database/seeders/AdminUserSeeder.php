<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Account
        User::updateOrCreate(
            ['email' => 'admin@profitspatrol.com'],
            [
                'name' => 'Profits Patrol Admin',
                'username' => 'patrol_admin',
                'password' => Hash::make('Admin@123456'),
                'role' => 'admin',
                'subscription_status' => 'PREMIUM',
                'subscription_tier' => 'tycoon',
                'xp' => 99999,
                'pp_tokens' => 99999,
                'level' => 10,
                'invite_code' => 'ADMINVIP',
            ]
        );

        // 2. Demo Teacher
        User::updateOrCreate(
            ['email' => 'teacher@profitspatrol.com'],
            [
                'name' => 'Prof. Oak',
                'username' => 'prof_oak',
                'password' => Hash::make('Teacher@123456'),
                'role' => 'teacher',
                'subscription_status' => 'PREMIUM',
                'subscription_tier' => 'classroom',
                'invite_code' => 'TEACH01',
            ]
        );

        // 3. Demo Parent
        $parent = User::updateOrCreate(
            ['email' => 'parent@profitspatrol.com'],
            [
                'name' => 'Sarah Connor',
                'username' => 'sarah_parent',
                'password' => Hash::make('Parent@123456'),
                'role' => 'parent',
                'subscription_status' => 'PREMIUM',
                'subscription_tier' => 'founder',
                'invite_code' => 'FAMILY1',
            ]
        );

        // 4. Demo Kid (Linked to Parent)
        User::updateOrCreate(
            ['email' => 'kid@profitspatrol.com'],
            [
                'name' => 'John Connor',
                'username' => 'john_ceo',
                'password' => Hash::make('Kid@123456'),
                'role' => 'kid',
                'parent_id' => $parent->id,
                'age' => 12,
                'xp' => 1250,
                'level' => 3,
                'pp_tokens' => 350,
                'streak' => 5,
                'current_module_id' => 'mod_1',
                'badges' => ['Newbie', 'First Sale', 'Saver'],
                'subscription_status' => 'FREE',
                'subscription_tier' => 'intern',
                'energy' => 5,
            ]
        );
    }
}
