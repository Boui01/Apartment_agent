<?php

namespace App\Models\Dashboard\Payment;

use App\Models\Base\Employee\Employee;
use App\Models\Base\User\User;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Reservation\Reservation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table = 'payments';
    protected $primaryKey = 'id_payment';
    public $incrementing = true;
    protected $connection = 'mysql';
    protected $fillable = [
        'user_card_id',
        'employee_card_id',
        'reservation_id',
        'apartment_id',
        'price',
        'status_user',
        'status_employee',
    ];
    protected $dates = ['created_at', 'updated_at','deleted_at'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_card_id', 'id_card');
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_card_id', 'id_card');
    }
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'id_reservation');
    }
    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apartment_id', 'id_apartment');
    }
}
