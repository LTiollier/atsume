<?php

declare(strict_types=1);

namespace App\Http\Api\Resources;

use App\Manga\Domain\Models\Edition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class WishlistItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->resource instanceof Edition) {
            return array_merge(['type' => 'edition'], (new EditionResource($this->resource))->toArray($request));
        }

        return array_merge(['type' => 'box'], (new BoxResource($this->resource))->toArray($request));
    }
}
