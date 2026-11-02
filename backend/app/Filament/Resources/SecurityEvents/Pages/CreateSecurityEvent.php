<?php

namespace App\Filament\Resources\SecurityEvents\Pages;

use App\Filament\Resources\SecurityEvents\SecurityEventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSecurityEvent extends CreateRecord
{
    protected static string $resource = SecurityEventResource::class;
}
