<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhistleblowerReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'reported_subject',
        'report_type',
        'location',
        'description',
        'evidence_path',
        'status',
        'investigator_note',
        'assigned_to',
    ];

    // --- Status Constants ---
    public const STATUS_OPEN         = 'open';
    public const STATUS_INVESTIGATING = 'investigating';
    public const STATUS_RESOLVED     = 'resolved';
    public const STATUS_DISMISSED    = 'dismissed';

    // --- Report Type Constants ---
    public const TYPE_FRAUD             = 'fraud';
    public const TYPE_DATA_MANIPULATION = 'data_manipulation';
    public const TYPE_NEPOTISM          = 'nepotism';
    public const TYPE_OTHER             = 'other';

    // --- Relationships ---
    public function investigator()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // --- Helpers ---
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_INVESTIGATING => 'Sedang Diselidiki',
            self::STATUS_RESOLVED      => 'Selesai',
            self::STATUS_DISMISSED     => 'Ditutup',
            default                    => 'Dibuka',
        };
    }

    public function getReportTypeLabelAttribute(): string
    {
        return match ($this->report_type) {
            self::TYPE_FRAUD             => 'Kecurangan',
            self::TYPE_DATA_MANIPULATION => 'Manipulasi Data',
            self::TYPE_NEPOTISM          => 'Nepotisme',
            default                      => 'Lainnya',
        };
    }
}
