<?php

namespace App\Models\Base\Employee;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageEmployee extends Model
{
    use HasFactory;
    protected $table = 'employees_image';
    protected $primaryKey = 'id_employee_image';
    public $incrementing = true;
    protected $connection = 'mysql';

    protected $fillable = ['employee_card_id', 'image'];
}
