<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\ImportMangaCollecDTO;
use App\Manga\Domain\Exceptions\MangaCollecProfilePrivateException;
use App\Manga\Domain\Repositories\BoxRepositoryInterface;
use App\Manga\Domain\Repositories\VolumeRepositoryInterface;
use App\Manga\Infrastructure\Services\MangaCollecScraperService;
use App\Manga\Infrastructure\Services\MangaCollecSeriesImportService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class ImportFromMangaCollecAction
{
    public function __construct(
        private readonly MangaCollecScraperService $scraperService,
        private readonly MangaCollecSeriesImportService $importService,
        private readonly VolumeRepositoryInterface $volumeRepository,
        private readonly BoxRepositoryInterface $boxRepository,
    ) {}

    /**
     * @return array<string, int>
     */
    public function execute(ImportMangaCollecDTO $dto): array
    {
        $collection = $this->scraperService->getUserCollection($dto->username);

        if ($collection === null) {
            throw new MangaCollecProfilePrivateException('Unable to fetch collection. The profile might be private or invalid.');
        }

        /** @var array<int, array<string, mixed>> $editions */
        $editions = is_array($collection['editions'] ?? null) ? $collection['editions'] : [];
        /** @var array<int, array<string, mixed>> $possessions */
        $possessions = is_array($collection['possessions'] ?? null) ? $collection['possessions'] : [];
        /** @var array<int, array<string, mixed>> $boxPossessions */
        $boxPossessions = is_array($collection['box_possessions'] ?? null) ? $collection['box_possessions'] : [];

        // 1. Import Series (from editions)
        $importedSeriesIds = [];
        foreach ($editions as $editionData) {
            /** @var string|null $seriesId */
            $seriesId = $editionData['series_id'] ?? null;
            if (is_string($seriesId) && $seriesId !== '' && ! in_array($seriesId, $importedSeriesIds, true)) {
                $importedSeriesIds[] = $seriesId;
                try {
                    $detail = $this->scraperService->getSeriesDetail($seriesId);
                    if ($detail !== null) {
                        $this->importService->import($seriesId, $detail);
                    }
                } catch (Exception $e) {
                    Log::error("Failed to import series {$seriesId}", ['error' => $e->getMessage()]);
                }
            }
        }

        // 2. Map and Attach Volumes
        $volumeApiIds = [];
        foreach ($possessions as $volData) {
            /** @var string|null $volApiId */
            $volApiId = $volData['volume_id'] ?? null;
            if (is_string($volApiId) && $volApiId !== '') {
                $volumeApiIds[] = $volApiId;
            }
        }

        // 3. Map and Attach Boxes
        $boxApiIds = [];
        foreach ($boxPossessions as $boxData) {
            /** @var string|null $boxApiId */
            $boxApiId = $boxData['box_id'] ?? null;
            if (is_string($boxApiId) && $boxApiId !== '') {
                $boxApiIds[] = $boxApiId;
            }
        }

        // Attach inside transaction mapping to API IDs
        return DB::transaction(function () use ($volumeApiIds, $boxApiIds, $dto) {
            $volumeSync = $this->volumeRepository->attachByApiIdsToUser($volumeApiIds, $dto->userId);
            $boxSync = $this->boxRepository->attachByApiIdsToUser($boxApiIds, $dto->userId);

            $totalRequested = count($volumeApiIds) + count($boxApiIds);
            $totalFound = $volumeSync['found'] + $boxSync['found'];
            $newlyAttached = $volumeSync['attached'] + $boxSync['attached'];
            $failed = $totalRequested - $totalFound;

            return [
                'imported' => $newlyAttached,
                'failed' => $failed,
            ];
        });
    }
}
