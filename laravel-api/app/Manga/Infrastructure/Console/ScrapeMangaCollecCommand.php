<?php

declare(strict_types=1);

namespace App\Manga\Infrastructure\Console;

use App\Manga\Application\Jobs\ImportMangaCollecSeriesJob;
use App\Manga\Infrastructure\Services\MangaCollecScraperService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ScrapeMangaCollecCommand extends Command
{
    protected $signature = 'app:scrape-mangacollec {--limit= : The number of series to scrape (default: all)} {--rps=3 : Requests per second} {--reset : Clear progress file and start from scratch}';

    protected $description = 'Scrape manga data from MangaCollec API';

    private ?float $lastRequestTime = null;

    public function __construct(
        private readonly MangaCollecScraperService $scraperService,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Starting MangaCollec Scraper...');

        if ($this->option('reset')) {
            $this->resetProgress();
            $this->info('Progress cleared in cache.');
        }

        if (! $this->scraperService->login()) {
            $this->error('Failed to login to MangaCollec');

            return 1;
        }

        /** @var array<int, array<string, mixed>> $seriesList */
        $seriesList = $this->scraperService->getSeriesList();
        $limitOption = $this->option('limit');
        $limit = $limitOption !== null ? (int) $limitOption : null;
        $count = 0;

        foreach ($seriesList as $seriesData) {
            if ($limit !== null && $count >= $limit) {
                break;
            }

            /** @var string $seriesUuid */
            $seriesUuid = $seriesData['id'] ?? '';
            /** @var string $title */
            $title = $seriesData['title'] ?? '';

            if ($this->isSeriesComplete($seriesUuid)) {
                $this->line("Skipping (already imported): {$title}");

                continue;
            }

            $this->info("Dispatching import job for series: {$title} ({$seriesUuid})");

            ImportMangaCollecSeriesJob::dispatch($seriesUuid);

            $this->markSeriesComplete($seriesUuid);
            $count++;
        }

        $this->info("Dispatched {$count} series import jobs. Scraping completed!");

        return 0;
    }

    private function resetProgress(): void
    {
        Cache::forget('scrape_mangacollec_progress');
    }

    private function isSeriesComplete(string $uuid): bool
    {
        /** @var array<string, string> $progress */
        $progress = Cache::get('scrape_mangacollec_progress', []);

        return ($progress[$uuid] ?? '') === 'ok';
    }

    private function markSeriesComplete(string $uuid): void
    {
        /** @var array<string, string> $progress */
        $progress = Cache::get('scrape_mangacollec_progress', []);
        $progress[$uuid] = 'ok';
        Cache::put('scrape_mangacollec_progress', $progress, now()->addWeeks(2));
    }
}
