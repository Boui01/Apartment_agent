<?php

namespace App\Models\Content\Service;

use App\Models\Content\ApartmentService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory;
    protected $table = 'services';
    protected $primaryKey = 'id_service';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'name' , 'thai_name'
    ];
    public function apartment()
    {
        return $this->hasMany(ApartmentService::class, 'service_id', 'id_service');
    }
}
