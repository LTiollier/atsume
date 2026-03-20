<?php

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\SearchMangaByIsbnRequest;
use App\Http\Api\Requests\SearchMangaRequest;
use App\Http\Api\Resources\MangaSearchResultResource;
use App\Http\Api\Resources\VolumeSearchResultResource;
use App\Manga\Application\Actions\SearchMangaAction;
use App\Manga\Application\Actions\SearchMangaByIsbnAction;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MangaSearchController
{
    public function search(SearchMangaRequest $request, SearchMangaAction $action): AnonymousResourceCollection
    {
        $dto = $request->toDTO();

        $paginator = $action->execute($dto);

        return MangaSearchResultResource::collection($paginator);
    }

    public function searchByIsbn(SearchMangaByIsbnRequest $request, SearchMangaByIsbnAction $action): VolumeSearchResultResource
    {
        $volume = $action->execute($request->string('isbn')->toString());

        return new VolumeSearchResultResource($volume);
    }
}
