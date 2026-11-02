<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParentalGate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'parental_gate';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'last_attempt_at' => 'datetime',
            'locked_until' => 'datetime',
            'passed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
