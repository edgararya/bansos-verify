<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'monthly_income',
        'dependents',
        'employment_status',
        'housing_status',
        'has_chronic_illness',
        'has_disability',
        'ktp_path',
        'kk_path',
        'score',
        'status',
        'rejection_reason',
        'notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'has_chronic_illness' => 'boolean',
        'has_disability'      => 'boolean',
        'reviewed_at'         => 'datetime',
    ];

    // --- Status Constants ---
    public const STATUS_PENDING      = 'pending';
    public const STATUS_APPROVED     = 'approved';
    public const STATUS_REJECTED     = 'rejected';
    public const STATUS_UNDER_REVIEW = 'under_review';

    // --- Employment Status Constants ---
    public const EMPLOYMENT_UNEMPLOYED = 'unemployed';
    public const EMPLOYMENT_INFORMAL   = 'informal';
    public const EMPLOYMENT_FORMAL     = 'formal';

    // --- Housing Status Constants ---
    public const HOUSING_POOR_CONDITION = 'poor_condition';
    public const HOUSING_FREE           = 'free'; // numpang
    public const HOUSING_RENT           = 'rent';
    public const HOUSING_OWN            = 'own';

    // --- Relationships ---
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // --- Helper ---
    public function isEligible(): bool
    {
        return $this->score >= 70;
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_APPROVED     => 'Disetujui',
            self::STATUS_REJECTED     => 'Ditolak',
            self::STATUS_UNDER_REVIEW => 'Sedang Ditinjau',
            default                   => 'Menunggu',
        };
    }

    public function getPriorityLevelAttribute(): string
    {
        if ($this->score >= 70) return 'high';
        if ($this->score >= 40) return 'medium';
        return 'low';
    }
}
