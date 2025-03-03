<?php
namespace App\Models\Content\Apartment;

use App\Models\Base\User\User;
use App\Models\Content\ApartmentService;
use App\Models\Content\Favorite\Favorite;
use App\Models\Content\Reservation\Reservation;
use App\Models\Dashboard\Payment\Payment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Apartment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'apartments';
    protected $primaryKey = 'id_apartment';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'card_id','name' , 'thai_name', 'address', 'description' , 'thai_description', 'bedroom', 'bathroom', 'total_room', 'score','pet','rule', 'price' , 'status'
    ];
    protected $dates = ['deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class, 'card_id','id_card');
    }
    public function imageApartment()
    {
        return $this->hasMany(ImageApartment::class, 'apartment_id', 'id_apartment');
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'apartment_id', 'id_apartment');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class, 'apartment_id', 'id_apartment');
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'apartment_id', 'id_apartment');
    }
    public function service()
    {
        return $this->hasMany(ApartmentService::class, 'apartment_id', 'id_apartment');
    }
}