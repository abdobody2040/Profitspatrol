<?php

namespace App\Filament\Resources\ModeratedContents\Pages;

use App\Filament\Resources\ModeratedContents\ModeratedContentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateModeratedContent extends CreateRecord
{
    protected static string $resource = ModeratedContentResource::class;
}
