<?php

namespace App\Manga\Infrastructure\EloquentModels;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Box extends Model
{
    protected $fillable = [
        'box_set_id',
        'api_id',
        'title',
        'number',
        'isbn',
        'release_date',
        'cover_url',
        'is_empty',
    ];

    /** @return BelongsTo<BoxSet, $this> */
    public function boxSet(): BelongsTo
    {
        return $this->belongsTo(BoxSet::class);
    }

    /** @return BelongsToMany<Volume, $this> */
    public function volumes(): BelongsToMany
    {
        return $this->belongsToMany(Volume::class, 'box_volumes', 'box_id', 'volume_id')->withTimestamps();
    }

    /** @return BelongsToMany<User, $this> */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_boxes', 'box_id', 'user_id')->withTimestamps();
    }
}
