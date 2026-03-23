<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Manga\Application\Actions\AddBoxToCollectionAction;
use App\Manga\Application\Actions\RemoveBoxFromCollectionAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoxCollectionController
{
    public function store(Request $request, AddBoxToCollectionAction $action, int $boxId): JsonResponse
    {
        $action->execute($boxId, (int) auth()->id(), (bool) $request->input('include_volumes', true));

        return response()->json(['message' => 'Box added to collection'], 201);
    }

    public function destroy(Request $request, RemoveBoxFromCollectionAction $action, int $boxId): JsonResponse
    {
        $action->execute($boxId, (int) auth()->id());

        return response()->json(['message' => 'Box removed from collection']);
    }
}
