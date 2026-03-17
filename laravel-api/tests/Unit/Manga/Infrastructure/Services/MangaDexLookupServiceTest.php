<?php

namespace Tests\Unit\Manga\Infrastructure\Services;

use App\Manga\Infrastructure\Services\MangaDexLookupService;

test('MangaDexLookupService can be instantiated', function () {
    $service = new MangaDexLookupService;
    expect($service)->toBeInstanceOf(MangaDexLookupService::class);
});
