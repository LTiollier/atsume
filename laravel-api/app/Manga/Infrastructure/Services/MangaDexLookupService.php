<?php

namespace App\Manga\Infrastructure\Services;

use Illuminate\Support\Facades\Http;

class MangaDexLookupService implements MangaLookupServiceInterface
{
    private const BASE_URL = 'https://api.mangadex.org';

    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query): array
    {
        // MangaDex API works with includes[0]=author or includes[]=author
        // Laravel's Http client with an array will produce includes[0]=author
        $response = Http::get(self::BASE_URL.'/manga', [
            'title' => $query,
            'limit' => 5,
            'includes' => ['author', 'cover_art'],
            'contentRating' => ['safe', 'suggestive', 'erotica', 'pornographic'],
        ]);

        if ($response->failed()) {
            return [];
        }

        $data = $response->json();
        if (! is_array($data) || empty($data['data']) || ! is_array($data['data'])) {
            return [];
        }

        /** @var array<int, mixed> $items */
        $items = $data['data'];

        return array_map(function (mixed $item) {
            /** @var array<string, mixed> $item */
            return $this->transform($item);
        }, $items);
    }

    /**
     * MangaDex does not support ISBN directly.
     */
    public function findByIsbn(string $isbn): ?array
    {
        return null;
    }

    public function findByApiId(string $apiId): ?array
    {
        $response = Http::get(self::BASE_URL.'/manga/'.$apiId, [
            'includes' => ['author', 'cover_art'],
        ]);

        if ($response->failed()) {
            return null;
        }

        $data = $response->json();
        if (! is_array($data) || ! isset($data['data']) || ! is_array($data['data'])) {
            return null;
        }

        /** @var array<string, mixed> $item */
        $item = $data['data'];

        return $this->transform($item);
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function transform(array $item): array
    {
        if (empty($item)) {
            return [];
        }

        /** @var array<string, mixed> $attributes */
        $attributes = is_array($item['attributes'] ?? null) ? $item['attributes'] : [];
        /** @var array<int, mixed> $relationships */
        $relationships = is_array($item['relationships'] ?? null) ? $item['relationships'] : [];

        /** @var array<string, mixed> $titleData */
        $titleData = is_array($attributes['title'] ?? null) ? $attributes['title'] : [];
        $titleValues = array_values($titleData);
        /** @var string $title */
        $title = $titleData['fr']
            ?? $titleData['en']
            ?? ($titleValues[0] ?? 'Unknown Title');

        /** @var array<string, mixed> $descData */
        $descData = is_array($attributes['description'] ?? null) ? $attributes['description'] : [];
        $descValues = array_values($descData);
        /** @var string|null $description */
        $description = $descData['fr']
            ?? $descData['en']
            ?? ($descValues[0] ?? null);

        // Authors
        $authors = [];
        /** @var array<int, mixed> $relationships */
        foreach ($relationships as $rel) {
            if (! is_array($rel)) {
                continue;
            }
            if (($rel['type'] ?? '') === 'author' || ($rel['type'] ?? '') === 'artist') {
                $relAttr = $rel['attributes'] ?? [];
                /** @var array<string, mixed> $relAttr */
                $authors[] = is_string($relAttr['name'] ?? null) ? $relAttr['name'] : 'Unknown Author';
            }
        }
        $authors = array_unique($authors);

        // Cover
        $coverUrl = null;
        /** @var array<int, mixed> $relationships */
        foreach ($relationships as $rel) {
            if (! is_array($rel)) {
                continue;
            }
            if (($rel['type'] ?? '') === 'cover_art') {
                $relAttr = $rel['attributes'] ?? [];
                /** @var array<string, mixed> $relAttr */
                $fileName = $relAttr['fileName'] ?? null;
                if (is_string($fileName)) {
                    $itemId = is_string($item['id'] ?? null) ? $item['id'] : '';
                    $coverUrl = 'https://uploads.mangadex.org/covers/'.$itemId.'/'.$fileName;
                }
            }
        }

        return [
            'api_id' => $item['id'] ?? null,
            'title' => $title,
            'authors' => $authors,
            'description' => $description,
            'status' => is_string($attributes['status'] ?? null) ? $attributes['status'] : null,
            'total_volumes' => is_string($attributes['lastVolume'] ?? null) ? $attributes['lastVolume'] : null,
            'cover_url' => $coverUrl,
        ];
    }
}
