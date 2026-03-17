<?php

namespace App\Manga\Infrastructure\EloquentModels;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    /** @return HasOne<Box, $this> */
    public function firstBox(): HasOne
    {
        return $this->hasOne(Box::class)->orderBy('number');
    }
}
