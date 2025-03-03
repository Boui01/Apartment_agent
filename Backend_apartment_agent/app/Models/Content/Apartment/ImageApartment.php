<?php

namespace App\Models\Content\Apartment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageApartment extends Model
{
    use HasFactory;
    protected $table = 'apartment_image';
    protected $primaryKey = 'id_apartment_image';
    public $incrementing = true;
    protected $connection = 'mysql';

    protected $fillable = [
       'apartment_id','image'
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class, 'apartment_id', 'id_apartment');
    }
}
