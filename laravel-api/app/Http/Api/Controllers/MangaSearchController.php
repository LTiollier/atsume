<?php

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\SearchMangaRequest;
use App\Http\Api\Resources\MangaSearchResultResource;
use App\Manga\Application\Actions\SearchMangaAction;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MangaSearchController
{
    public function search(SearchMangaRequest $request, SearchMangaAction $action): AnonymousResourceCollection
    {
        $dto = $request->toDTO();

        $paginator = $action->execute($dto);

        return MangaSearchResultResource::collection($paginator);
    }
}
