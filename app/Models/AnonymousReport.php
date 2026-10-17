<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnonymousReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'reporter_name',
        'category',
        'location',
        'description',
        'is_anonymous',
        'risk_level',
        'status',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
