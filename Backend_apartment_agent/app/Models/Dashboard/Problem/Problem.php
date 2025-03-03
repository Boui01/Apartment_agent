<?php

namespace App\Models\Dashboard\Problem;

use App\Models\Base\Employee\Employee;
use App\Models\Base\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    use HasFactory;
    protected $table = 'problems';
    protected $primaryKey = 'id_problem';
    public $incrementing = true;
    protected $connection = 'mysql';
    protected $fillable = [
        'content','type', 'solve',  'user_card_id', 'employee_card_id', 'permission'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_card_id', 'id_card');
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_card_id', 'id_card');
    }
}
