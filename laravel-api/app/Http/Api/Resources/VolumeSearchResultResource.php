<?php

namespace App\Http\Api\Resources;

use App\Manga\Domain\Models\Volume;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Volume $resource
 */
class VolumeSearchResultResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $series = $this->resource->getSeries();

        return [
            'id' => $this->resource->getId(),
            'api_id' => $this->resource->getApiId(),
            'title' => $this->resource->getTitle(),
            'authors' => $series && $series->getAuthors() ? explode(', ', $series->getAuthors()) : [],
            'description' => null,
            'published_date' => $this->resource->getPublishedDate(),
            'page_count' => null,
            'cover_url' => $this->resource->getCoverUrl(),
            'isbn' => $this->resource->getIsbn(),
        ];
    }
}
