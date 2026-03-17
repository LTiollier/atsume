<?php

namespace App\Manga\Infrastructure\EloquentModels;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoxSet extends Model
{
    protected $fillable = [
        'series_id',
        'api_id',
        'title',
        'publisher',
    ];

    /** @return BelongsTo<Series, $this> */
    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }

    /** @return HasMany<Box, $this> */
    public function boxes(): HasMany
    {
        return $this->hasMany(Box::class);
    }
}
