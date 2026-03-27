<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\EloquentModels;

use App\User\Infrastructure\EloquentModels\User;
use Database\Factories\EditionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Edition extends Model
{
    /** @use HasFactory<EditionFactory> */
    use HasFactory;

    protected $fillable = [
        'series_id',
        'name',
        'publisher',
        'language',
        'total_volumes',
        'last_volume_number',
        'is_finished',
    ];

    /**
     * @return BelongsTo<Series, $this>
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }

    /**
     * @return HasMany<Volume, $this>
     */
    public function volumes(): HasMany
    {
        return $this->hasMany(Volume::class);
    }

    /**
     * @return HasOne<Volume, $this>
     */
    public function firstVolume(): HasOne
    {
        return $this->hasOne(Volume::class)->orderBy('number');
    }

    /**
     * @return MorphToMany<User, $this>
     */
    public function wishlistedBy(): MorphToMany
    {
        return $this->morphToMany(User::class, 'wishlistable', 'wishlist_items')->withTimestamps();
    }

    /**
     * @param  Builder<Edition>  $query
     * @return Builder<Edition>
     */
    public function scopeWithReleasedVolumesCount(Builder $query): Builder
    {
        return $query->withCount(['volumes as released_volumes_count' => function ($q): void {
            $q->whereNull('published_date')->orWhere('published_date', '<=', now()->toDateString());
        }]);
    }
}
