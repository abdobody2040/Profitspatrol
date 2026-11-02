<?php

namespace App\Filament\Resources\ModeratedContents\Pages;

use App\Filament\Resources\ModeratedContents\ModeratedContentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListModeratedContents extends ListRecords
{
    protected static string $resource = ModeratedContentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
