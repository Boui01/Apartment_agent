<?php

namespace App\Models\Content\Reservation;

use App\Models\Base\User\User;
use App\Models\Content\Apartment\Apartment;
use App\Models\Dashboard\Payment\Payment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reservations';

    protected $primaryKey = 'id_reservation';

    public $incrementing = true;
    public $timestamps = false; // Set to true if you want Eloquent to handle created_at and updated_at

    protected $fillable = [
        'card_id',
        'apartment_id',
        'reservation_date',
        'room',
        'people',
        'other',
        'status',
        'rental_date',
        'objective_rental',
        'pet',
    ];

    protected $dates = ['reservation_date', 'rental_date', 'deleted_at'];

    // Define relationships if needed
    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apartment_id', 'id_apartment');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'card_id', 'id_card');
    }
    public function payment()
    {
        return $this->hasOne(Payment::class, 'reservation_id', 'id_reservation');
    }
}
