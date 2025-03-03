<?php

namespace App\Models\Base\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageAdmin extends Model
{
    use HasFactory;
    protected $table = 'admins_image';
    protected $primaryKey = 'id_admin_image';
    public $incrementing = true;
    protected $connection = 'mysql';

    protected $fillable = ['admin_card_id', 'image'];
}
