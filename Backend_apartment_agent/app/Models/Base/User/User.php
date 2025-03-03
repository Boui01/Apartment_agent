<?php


namespace App\Models\Base\User;

use App\Models\Base\Bank\Bank;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Comment\Comment;
use App\Models\Content\Reservation\Reservation;
use App\Models\Dashboard\Payment\Payment;
use App\Models\Dashboard\Problem\Problem;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
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
        'english_fname',
        'english_lname',
        'address',
        'birthday',
        'age',
        'religion',
        'sex',
        'phone',
        'line_id',
        'bank_id',
        'financial_statement',           
        'guarantor_english_fname', 
        'guarantor_english_lname', 
        'guarantor_address',      
        'guarantor_phone',           
        'email',
        'password',
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
        'user_create' => 'datetime',
        'last_login' => 'datetime',
    ];

    public $timestamps = false;



    public function apartments() {
        return $this->hasMany(Apartment::class, 'card_id', 'id_card');
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'card_id', 'id_card');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_card_id', 'id_card');
    }
    public function problems()
    {
        return $this->hasMany(Problem::class, 'user_card_id', 'id_card');
    }
    public function comments()
    {
        return $this->hasMany(Comment::class, 'user_card_id', 'id_card');
    }
    public function banks()
    {
        return $this->belongsTo(Bank::class, 'bank_id', 'id_bank');
    }

}