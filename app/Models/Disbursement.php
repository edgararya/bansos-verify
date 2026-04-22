<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disbursement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'program',
        'status',
        'amount',
        'disbursed_at',
        'schedule_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
