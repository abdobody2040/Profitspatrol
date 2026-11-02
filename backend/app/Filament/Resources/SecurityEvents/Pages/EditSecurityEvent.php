<?php

namespace App\Filament\Resources\SecurityEvents\Pages;

use App\Filament\Resources\SecurityEvents\SecurityEventResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSecurityEvent extends EditRecord
{
    protected static string $resource = SecurityEventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
