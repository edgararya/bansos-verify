<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'application_id',
        'action',
        'is_suspicious',
        'is_suspended',
        'suspended_by',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function applicant() // Relationship name used in controller
    {
        return $this->belongsTo(Application::class, 'application_id');
    }
}
