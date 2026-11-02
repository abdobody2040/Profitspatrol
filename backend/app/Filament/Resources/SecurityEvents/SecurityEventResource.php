<?php

namespace App\Filament\Resources\SecurityEvents;

use App\Filament\Resources\SecurityEvents\Pages\CreateSecurityEvent;
use App\Filament\Resources\SecurityEvents\Pages\EditSecurityEvent;
use App\Filament\Resources\SecurityEvents\Pages\ListSecurityEvents;
use App\Filament\Resources\SecurityEvents\Schemas\SecurityEventForm;
use App\Filament\Resources\SecurityEvents\Tables\SecurityEventsTable;
use App\Models\SecurityEvent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SecurityEventResource extends Resource
{
    protected static ?string $model = SecurityEvent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return SecurityEventForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SecurityEventsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSecurityEvents::route('/'),
            'create' => CreateSecurityEvent::route('/create'),
            'edit' => EditSecurityEvent::route('/{record}/edit'),
        ];
    }
}
