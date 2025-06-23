<?php

namespace App\Modules\Organization\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'domain',
        'date_of_establishment',
    ];
}
