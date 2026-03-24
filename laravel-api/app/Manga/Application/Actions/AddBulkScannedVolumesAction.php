<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\ScanBulkVolumeDTO;
use App\Manga\Application\DTOs\ScanVolumeDTO;
use App\Manga\Domain\Models\Volume;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class AddBulkScannedVolumesAction
{
    public function __construct(
        private readonly AddScannedVolumeAction $addScannedMangaAction
    ) {}

    /**
     * @return Volume[]
     */
    public function execute(ScanBulkVolumeDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {
            $volumes = [];
            foreach ($dto->isbns as $isbn) {
                try {
                    $singleDto = new ScanVolumeDTO(isbn: $isbn, userId: $dto->userId);
                    $volumes[] = $this->addScannedMangaAction->execute($singleDto);
                } catch (Exception $e) {
                    Log::warning("Failed to scan ISBN {$isbn}: ".$e->getMessage());
                }
            }

            return $volumes;
        });
    }
}
