<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Corporation extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];

    public function founder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'founder_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(CorporationMember::class);
    }
}
