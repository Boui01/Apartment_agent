<?php

namespace App\Models\Content;

use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Service\Service;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentService extends Model
{
    use HasFactory;
    protected $table = 'apartment_services';
    protected $primaryKey = 'id_apartment_service';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'apartment_id' , 'service_id' 
    ];
    protected $dates = ['deleted_at'];

  public function apartments() {
    return $this->belongsTo(Apartment::class, 'apartment_id', 'id_apartment');
  }
  public function services() {
    return $this->belongsTo(Service::class, 'service_id', 'id_service');
  }

}
