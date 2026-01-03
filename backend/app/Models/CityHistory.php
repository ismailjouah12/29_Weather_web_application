<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CityHistory extends Model
{
    use HasFactory;
    //the only fillable feilds in the database table
    protected $fillable = [
        'user_id',
        'city_name'
    ];
}
