<?php

namespace App\Models\Content\Comment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remember_like_unlike extends Model
{
    use HasFactory;
    
    protected $table = 'remember_like_unlike';
    protected $primaryKey = 'id_remember_like_unlike';
    public $incrementing = true;
    protected $connection = 'mysql';
      // Define fillable properties for mass assignment
    protected $fillable = [
        'card_id', 'comment_id', 'like' , 'unlike'
    ];
    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id', 'id_comment');
    }
}
