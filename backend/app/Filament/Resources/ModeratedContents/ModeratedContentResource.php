<?php

namespace App\Filament\Resources\ModeratedContents;

use App\Filament\Resources\ModeratedContents\Pages\CreateModeratedContent;
use App\Filament\Resources\ModeratedContents\Pages\EditModeratedContent;
use App\Filament\Resources\ModeratedContents\Pages\ListModeratedContents;
use App\Filament\Resources\ModeratedContents\Schemas\ModeratedContentForm;
use App\Filament\Resources\ModeratedContents\Tables\ModeratedContentsTable;
use App\Models\ModeratedContent;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ModeratedContentResource extends Resource
{
    protected static ?string $model = ModeratedContent::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ModeratedContentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ModeratedContentsTable::configure($table);
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
            'index' => ListModeratedContents::route('/'),
            'create' => CreateModeratedContent::route('/create'),
            'edit' => EditModeratedContent::route('/{record}/edit'),
        ];
    }
}
