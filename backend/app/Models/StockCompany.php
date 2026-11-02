<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockCompany extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'price_history' => 'array',
            'current_price' => 'integer',
        ];
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(StockPortfolio::class, 'stock_id');
    }
}
