<?php

declare(strict_types=1);

namespace App\Manga\Application\Jobs;

use App\Manga\Infrastructure\Services\MangaCollecScraperService;
use App\Manga\Infrastructure\Services\MangaCollecSeriesImportService;
use DateTime;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

final class ImportMangaCollecSeriesJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $maxExceptions = 3;

    public function retryUntil(): DateTime
    {
        return now()->addHours(2);
    }

    /** @return array<int, RateLimited> */
    public function middleware(): array
    {
        return [new RateLimited('mangacollec-api')];
    }

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

        Log::info("Starting import for series {$this->seriesApiId}");

        try {
            $detail = $scraperService->getSeriesDetail($this->seriesApiId);
            if ($detail !== null) {
                $importService->import($this->seriesApiId, $detail);
            }
        } catch (Throwable $e) {
            Log::error("Failed to import series {$this->seriesApiId} in job", [
                'error' => $e->getMessage(),
                'class' => get_class($e),
                'series_id' => $this->seriesApiId,
                'stack' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }
}
