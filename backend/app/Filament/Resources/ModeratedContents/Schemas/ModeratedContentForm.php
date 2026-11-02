<?php

namespace App\Filament\Resources\ModeratedContents\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ModeratedContentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('content_type')
                    ->required(),
                Textarea::make('original_content')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('sanitized_content')
                    ->columnSpanFull(),
                Textarea::make('flags')
                    ->columnSpanFull(),
                TextInput::make('severity'),
                TextInput::make('reviewed_by'),
                DateTimePicker::make('reviewed_at'),
                TextInput::make('action_taken'),
            ]);
    }
}
