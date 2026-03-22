<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\EloquentModels;

use Illuminate\Database\Eloquent\Model;

class BoxVolume extends Model
{
    protected $fillable = [
        'box_id',
        'volume_id',
    ];
}
