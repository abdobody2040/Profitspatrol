<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('username'),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('password')
                    ->password()
                    ->required(),
                TextInput::make('role')
                    ->required()
                    ->default('kid'),
                TextInput::make('age')
                    ->numeric(),
                TextInput::make('avatar'),
                Select::make('parent_id')
                    ->relationship('parent', 'name'),
                TextInput::make('invite_code'),
                TextInput::make('referred_by'),
                TextInput::make('total_referrals')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('xp')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('season_xp')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('level')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('pp_tokens')
                    ->required()
                    ->numeric()
                    ->default(100),
                TextInput::make('streak')
                    ->required()
                    ->numeric()
                    ->default(1),
                DatePicker::make('last_activity_date'),
                Toggle::make('streak_shield')
                    ->required(),
                DatePicker::make('streak_shield_used_date'),
                DatePicker::make('streak_last_bonus_date'),
                TextInput::make('current_module_id')
                    ->required()
                    ->default('mod_1'),
                Textarea::make('completed_lesson_ids')
                    ->columnSpanFull(),
                Textarea::make('read_book_ids')
                    ->columnSpanFull(),
                Textarea::make('completed_book_tasks')
                    ->columnSpanFull(),
                TextInput::make('book_task_streak')
                    ->required()
                    ->numeric()
                    ->default(0),
                DatePicker::make('last_book_task_date'),
                Textarea::make('badges')
                    ->columnSpanFull(),
                Textarea::make('inventory')
                    ->columnSpanFull(),
                Textarea::make('equipped_items')
                    ->columnSpanFull(),
                Textarea::make('placed_items')
                    ->columnSpanFull(),
                Textarea::make('business_logo')
                    ->columnSpanFull(),
                TextInput::make('hq_level')
                    ->required()
                    ->default('hq_garage'),
                TextInput::make('hq_theme')
                    ->required()
                    ->default('blue'),
                Textarea::make('unlocked_skills')
                    ->columnSpanFull(),
                Textarea::make('portfolio')
                    ->columnSpanFull(),
                Textarea::make('properties')
                    ->columnSpanFull(),
                TextInput::make('subscription_status')
                    ->required()
                    ->default('FREE'),
                TextInput::make('subscription_tier')
                    ->required()
                    ->default('intern'),
                TextInput::make('billing_cycle'),
                TextInput::make('stripe_customer_id'),
                TextInput::make('stripe_subscription_id'),
                TextInput::make('energy')
                    ->required()
                    ->numeric()
                    ->default(5),
                TextInput::make('last_energy_refill')
                    ->numeric(),
                Textarea::make('settings')
                    ->columnSpanFull(),
                Toggle::make('has_graduated')
                    ->required(),
                DatePicker::make('last_spin_date'),
                TextInput::make('total_spins')
                    ->required()
                    ->numeric()
                    ->default(0),
                Textarea::make('weekly_challenges')
                    ->columnSpanFull(),
                Textarea::make('biz_pulse_read')
                    ->columnSpanFull(),
                Textarea::make('completed_seasonal_challenges')
                    ->columnSpanFull(),
                TextInput::make('lessons_completed')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('gigs_completed')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('streak_days')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('top_achievement')
                    ->required()
                    ->default('Completed first lesson!'),
                Toggle::make('monthly_report_enabled')
                    ->required(),
                TextInput::make('parental_gate_attempts')
                    ->required()
                    ->numeric()
                    ->default(0),
                DateTimePicker::make('parental_gate_locked_until'),
                DateTimePicker::make('parental_gate_passed_at'),
                DateTimePicker::make('deletion_requested_at'),
                DateTimePicker::make('deletion_scheduled_for'),
                DateTimePicker::make('deletion_cancelled_at'),
                DateTimePicker::make('email_verified_at'),
            ]);
    }
}
