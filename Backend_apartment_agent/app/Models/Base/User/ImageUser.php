<?php

namespace App\Models\Base\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageUser extends Model
{
    use HasFactory;
    protected $table = 'users_image';
    protected $primaryKey = 'id_user_image';
    public $incrementing = true;
    protected $connection = 'mysql';

    protected $fillable = ['user_card_id', 'image'];

    public function delete()
    {
        return parent::delete();
    }
}
