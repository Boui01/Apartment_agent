<?php

namespace App\Models\Content\Apartment\RememberLikeApartment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remember_Like_Apartment extends Model
{
    use HasFactory;
    protected $table = 'remember_like_apartments';
    protected $primaryKey = 'id_remember_like_apartment';
    public $incrementing = true;
    protected $connection = 'mysql';

    protected $fillable = [
       'card_id','apartment_id','like'
    ];

    protected $dates = ['created_at','updated_at'];
}
