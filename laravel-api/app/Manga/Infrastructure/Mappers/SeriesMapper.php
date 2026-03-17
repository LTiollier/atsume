<?php

namespace App\Manga\Infrastructure\Mappers;

use App\Manga\Domain\Models\BoxSet;
use App\Manga\Domain\Models\Edition;
use App\Manga\Domain\Models\Series;
use App\Manga\Infrastructure\EloquentModels\Series as EloquentSeries;

class SeriesMapper
{
    public static function toDomain(EloquentSeries $eloquent): Series
    {
        $authors = $eloquent->authors;

        /** @var array<Edition> $editions */
        $editions = $eloquent->relationLoaded('editions')
            ? $eloquent->editions->map(fn ($e) => EditionMapper::toDomain($e))->toArray()
            : [];

        /** @var array<BoxSet> $boxSets */
        $boxSets = $eloquent->relationLoaded('boxSets')
            ? $eloquent->boxSets->map(fn ($bs) => BoxSetMapper::toDomain($bs))->toArray()
            : [];

        return new Series(
            id: $eloquent->id,
            api_id: $eloquent->api_id,
            title: $eloquent->title,
            authors: $authors,
            cover_url: $eloquent->cover_url,
            editions: $editions,
            boxSets: $boxSets,
        );
    }
}
