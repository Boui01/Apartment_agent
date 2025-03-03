<?php

namespace App\Models\Base\Employee;

use App\Models\Dashboard\Payment\Payment;
use App\Models\Dashboard\Problem\Problem;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Employee extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id_card';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_card',
        'thai_fname',
        'thai_lname',
        'english_fname',
        'english_lname',
        'address',
        'birthday',
        'age',
        'religion',
        'sex',
        'phone',
        'line_id',
        'email',
        'password',
        'empolyee_create',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'empolyee_create' => 'datetime',
        'last_login' => 'datetime',
    ];
    public $timestamps = false;
    
    public function payment()
    {
        return $this->hasMany(Payment::class, 'employee_card_id', 'id_card');
    }
    public function problem()
    {
        return $this->hasMany(Problem::class, 'employee_card_id', 'id_card');
    }

}
