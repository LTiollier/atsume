<?php

declare(strict_types=1);

namespace App\Manga\Application\Jobs;

use App\Manga\Infrastructure\Services\MangaCollecScraperService;
use App\Manga\Infrastructure\Services\MangaCollecSeriesImportService;
use Exception;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class ImportMangaCollecSeriesJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        private readonly string $seriesApiId,
    ) {}

    public function handle(
        MangaCollecScraperService $scraperService,
        MangaCollecSeriesImportService $importService,
    ): void {
        if ($this->batch()?->cancelled()) {
            return;
        }

        try {
            $detail = $scraperService->getSeriesDetail($this->seriesApiId);
            if ($detail !== null) {
                $importService->import($this->seriesApiId, $detail);
            }
        } catch (Exception $e) {
            Log::error("Failed to import series {$this->seriesApiId} in job", [
                'error' => $e->getMessage(),
                'series_id' => $this->seriesApiId,
            ]);
            throw $e;
        }
    }
}
