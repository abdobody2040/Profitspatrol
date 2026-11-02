<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    /**
     * The attributes that are guarded against mass assignment.
     *
     * @var array<int, string>
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'completed_lesson_ids' => 'array',
            'read_book_ids' => 'array',
            'completed_book_tasks' => 'array',
            'badges' => 'array',
            'inventory' => 'array',
            'equipped_items' => 'array',
            'placed_items' => 'array',
            'business_logo' => 'array',
            'unlocked_skills' => 'array',
            'portfolio' => 'array',
            'properties' => 'array',
            'settings' => 'array',
            'weekly_challenges' => 'array',
            'biz_pulse_read' => 'array',
            'completed_seasonal_challenges' => 'array',
            'last_activity_date' => 'date',
            'last_spin_date' => 'date',
            'last_book_task_date' => 'date',
            'streak_shield_used_date' => 'date',
            'streak_last_bonus_date' => 'date',
            'parental_gate_locked_until' => 'datetime',
            'parental_gate_passed_at' => 'datetime',
            'deletion_requested_at' => 'datetime',
            'deletion_scheduled_for' => 'datetime',
            'deletion_cancelled_at' => 'datetime',
            'streak_shield' => 'boolean',
            'has_graduated' => 'boolean',
            'monthly_report_enabled' => 'boolean',
        ];
    }

    /**
     * Filament Admin Panel access gate.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'admin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    public function isParent(): bool
    {
        return $this->role === 'parent';
    }

    public function isKid(): bool
    {
        return $this->role === 'kid';
    }

    public function isTycoon(): bool
    {
        return $this->subscription_tier === 'tycoon' || $this->subscription_status === 'PREMIUM';
    }

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(User::class, 'parent_id');
    }

    public function bountiesCreated(): HasMany
    {
        return $this->hasMany(Bounty::class, 'parent_id');
    }

    public function bountiesClaimed(): HasMany
    {
        return $this->hasMany(Bounty::class, 'claimed_by');
    }

    public function classroomsTeaching(): HasMany
    {
        return $this->hasMany(Classroom::class, 'teacher_id');
    }

    public function classroomsEnrolled(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'classroom_members', 'user_id', 'classroom_id')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'student_id');
    }

    public function friends(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function corporationMembership(): HasOne
    {
        return $this->hasOne(CorporationMember::class, 'user_id');
    }

    public function corporation(): HasOneThrough
    {
        return $this->hasOneThrough(
            Corporation::class,
            CorporationMember::class,
            'user_id', // Foreign key on corporation_members table...
            'id',      // Foreign key on corporations table...
            'id',      // Local key on users table...
            'corporation_id' // Local key on corporation_members table...
        );
    }

    public function stockPortfolios(): HasMany
    {
        return $this->hasMany(StockPortfolio::class, 'user_id');
    }
}
