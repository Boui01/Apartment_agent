<?php

namespace App\Models\Base\VerificationTokens;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationTokens extends Model
{
    use HasFactory;
    protected $table = 'verification_tokens';
    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $connection = 'mysql';
    public $timestamps = true; 

    protected $fillable = [
       'token','created_at'
    ];

    protected $dates = ['created_at'];
}
