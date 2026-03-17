<?php

namespace Tests\Unit\Manga\Infrastructure\Services;

use App\Manga\Infrastructure\Services\MangaCollecScraperService;

test('MangaCollecScraperService can be instantiated', function () {
    $service = new MangaCollecScraperService;
    expect($service)->toBeInstanceOf(MangaCollecScraperService::class);
});
