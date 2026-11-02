<?php

namespace App\Filament\Resources\ModeratedContents\Pages;

use App\Filament\Resources\ModeratedContents\ModeratedContentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditModeratedContent extends EditRecord
{
    protected static string $resource = ModeratedContentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
