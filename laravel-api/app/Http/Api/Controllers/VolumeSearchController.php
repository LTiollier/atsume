<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\SearchVolumeByIsbnRequest;
use App\Http\Api\Requests\SearchVolumeRequest;
use App\Http\Api\Resources\SeriesSearchResultResource;
use App\Http\Api\Resources\VolumeSearchResultResource;
use App\Manga\Application\Actions\SearchVolumeAction;
use App\Manga\Application\Actions\SearchVolumeByIsbnAction;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VolumeSearchController
{
    public function search(SearchVolumeRequest $request, SearchVolumeAction $action): AnonymousResourceCollection
    {
        $dto = $request->toDTO();

        $paginator = $action->execute($dto);

        return SeriesSearchResultResource::collection($paginator);
    }

    public function searchByIsbn(SearchVolumeByIsbnRequest $request, SearchVolumeByIsbnAction $action): VolumeSearchResultResource
    {
        $volume = $action->execute($request->string('isbn')->toString());

        return new VolumeSearchResultResource($volume);
    }
}
