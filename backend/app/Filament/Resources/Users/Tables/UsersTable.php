<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('username')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('role')
                    ->searchable(),
                TextColumn::make('age')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('avatar')
                    ->searchable(),
                TextColumn::make('parent.name')
                    ->searchable(),
                TextColumn::make('invite_code')
                    ->searchable(),
                TextColumn::make('referred_by')
                    ->searchable(),
                TextColumn::make('total_referrals')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('xp')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('season_xp')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('level')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pp_tokens')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('streak')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('last_activity_date')
                    ->date()
                    ->sortable(),
                IconColumn::make('streak_shield')
                    ->boolean(),
                TextColumn::make('streak_shield_used_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('streak_last_bonus_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('current_module_id')
                    ->searchable(),
                TextColumn::make('book_task_streak')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('last_book_task_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('hq_level')
                    ->searchable(),
                TextColumn::make('hq_theme')
                    ->searchable(),
                TextColumn::make('subscription_status')
                    ->searchable(),
                TextColumn::make('subscription_tier')
                    ->searchable(),
                TextColumn::make('billing_cycle')
                    ->searchable(),
                TextColumn::make('stripe_customer_id')
                    ->searchable(),
                TextColumn::make('stripe_subscription_id')
                    ->searchable(),
                TextColumn::make('energy')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('last_energy_refill')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('has_graduated')
                    ->boolean(),
                TextColumn::make('last_spin_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('total_spins')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('lessons_completed')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('gigs_completed')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('streak_days')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('top_achievement')
                    ->searchable(),
                IconColumn::make('monthly_report_enabled')
                    ->boolean(),
                TextColumn::make('parental_gate_attempts')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('parental_gate_locked_until')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('parental_gate_passed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('deletion_requested_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('deletion_scheduled_for')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('deletion_cancelled_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
