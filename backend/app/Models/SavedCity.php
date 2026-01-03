<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedCity extends Model
{
    use HasFactory;
    //fillable fields
    protected $fillable = [
        'user_id',
        'city_name'
    ];

}
