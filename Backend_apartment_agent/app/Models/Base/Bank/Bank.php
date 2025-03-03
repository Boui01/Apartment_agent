<?php

namespace App\Models\Base\Bank;

use App\Models\Base\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;
    protected $table = 'banks';
    protected $primaryKey = 'id_bank';
    public $incrementing = false;
    protected $connection = 'mysql';

    protected $fillable = [
        'type'
    ];

    protected $dates = ['created_at', 'updated_at'];

    public $timestamps = true;

    public function delete()
    {

        return parent::delete();
    }
    public function users(){

        return $this->hasMany(User::class, 'bank_id', 'id_bank');
    }

}
