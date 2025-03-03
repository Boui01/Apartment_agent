<?php

namespace App\Models\Content\Comment;

use App\Models\Base\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory , SoftDeletes;
    protected $table = 'comments';
    protected $primaryKey = 'id_comment';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'name', 'description', 'card_id' , 'apartment_id','comment_like','comment_unlike'
    ];
    public function users()
    {
        return $this->belongsTo(User::class, 'card_id', 'id_card');
    }
    public function remember()
    {
        return $this->hasMany(Remember_like_unlike::class, 'comment_id', 'id_comment');
    }

}
