<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\ImportMangaCollecRequest;
use App\Manga\Application\Actions\ImportFromMangaCollecAction;
use App\Manga\Application\DTOs\ImportMangaCollecDTO;
use Illuminate\Http\JsonResponse;

class MangaCollecImportController
{
    public function store(ImportMangaCollecRequest $request, ImportFromMangaCollecAction $action): JsonResponse
    {
        $username = $request->getUsername();

        if (empty($username)) {
            return response()->json(['message' => 'Invalid MangaCollec URL'], 422);
        }

        $dto = new ImportMangaCollecDTO(
            username: $username,
            userId: (int) auth()->id(),
        );

        $action->execute($dto);

        return response()->json(['message' => 'Import started in background.'], 202);
    }
}
