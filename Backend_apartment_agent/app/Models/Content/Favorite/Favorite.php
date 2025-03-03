<?php

namespace App\Models\Content\Favorite;

use App\Models\Content\Apartment\Apartment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Favorite extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'favorites';
    protected $primaryKey = 'id_favorite';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'card_id', 
        'apartment_id',
        'room',
        'people',
        'other',
        'rental_date',
        'objective_rental',
        'pet',

    ];
    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apartment_id', 'id_apartment');
    }
}
