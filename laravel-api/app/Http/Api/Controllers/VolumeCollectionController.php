<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\AddLocalVolumesRequest;
use App\Http\Api\Requests\AddVolumeRequest;
use App\Http\Api\Requests\BulkRemoveVolumesRequest;
use App\Http\Api\Requests\RemoveSeriesRequest;
use App\Http\Api\Requests\ScanBulkVolumeRequest;
use App\Http\Api\Resources\VolumeResource;
use App\Manga\Application\Actions\AddBulkScannedVolumesAction;
use App\Manga\Application\Actions\AddLocalVolumesToEditionAction;
use App\Manga\Application\Actions\AddVolumeAction;
use App\Manga\Application\Actions\BulkRemoveVolumesFromCollectionAction;
use App\Manga\Application\Actions\ListUserVolumesAction;
use App\Manga\Application\Actions\RemoveSeriesFromCollectionAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VolumeCollectionController
{
    public function index(Request $request, ListUserVolumesAction $action): AnonymousResourceCollection
    {
        $mangas = $action->execute((int) auth()->id());

        return VolumeResource::collection(collect($mangas));
    }

    public function store(AddVolumeRequest $request, AddVolumeAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $manga = $action->execute($dto);

        return (new VolumeResource($manga))->response()->setStatusCode(201);
    }

    public function scanBulk(ScanBulkVolumeRequest $request, AddBulkScannedVolumesAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $mangas = $action->execute($dto);

        return VolumeResource::collection(collect($mangas))->response()->setStatusCode(201);
    }

    public function bulkAdd(AddLocalVolumesRequest $request, AddLocalVolumesToEditionAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $mangas = $action->execute($dto);

        return VolumeResource::collection(collect($mangas))->response()->setStatusCode(201);
    }

    public function bulkRemove(BulkRemoveVolumesRequest $request, BulkRemoveVolumesFromCollectionAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $action->execute($dto);

        return response()->json(['message' => 'Volumes removed from collection'], 200);
    }

    public function removeSeries(RemoveSeriesRequest $request, RemoveSeriesFromCollectionAction $action, int $seriesId): JsonResponse
    {
        $action->execute($seriesId, (int) auth()->id());

        return response()->json(['message' => 'Series removed from collection'], 200);
    }
}
