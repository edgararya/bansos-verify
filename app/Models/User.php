<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    // Roles: citizen, admin, auditor
    public const ROLE_CITIZEN = 'citizen';
    public const ROLE_ADMIN   = 'admin';
    public const ROLE_AUDITOR = 'auditor';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nik',
        'phone',
        'address',
        'occupation',
        'monthly_income',
        'ktp_photo',
        'bansos_status',
        'program',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function isCitizen(): bool
    {
        return $this->role === self::ROLE_CITIZEN;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isAuditor(): bool
    {
        return $this->role === self::ROLE_AUDITOR;
    }

    public function application()
    {
        return $this->hasOne(Application::class);
    }
}
