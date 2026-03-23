<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use App\Manga\Infrastructure\Services\MangaCollecScraperService;
use App\Manga\Infrastructure\Services\MangaCollecSeriesImportService;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

test('cannot import manga collec with invalid url', function () {
    $user = User::factory()->create();
    actingAs($user);

    $response = postJson('/api/user/settings/import/mangacollec', [
        'url' => 'https://random-website.com/user/xutech/collection',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('returns 202 and dispatches job', function () {
    $user = User::factory()->create();
    actingAs($user);

    \Illuminate\Support\Facades\Queue::fake();

    $response = postJson('/api/user/settings/import/mangacollec', [
        'url' => 'https://www.mangacollec.com/user/xutech/collection',
    ]);

    $response->assertStatus(202);
    \Illuminate\Support\Facades\Queue::assertPushed(\App\Manga\Application\Jobs\MangaCollecImportJob::class);
});

test('successfully dispatches import job', function () {
    $user = User::factory()->create();
    actingAs($user);

    \Illuminate\Support\Facades\Queue::fake();

    $response = postJson('/api/user/settings/import/mangacollec', [
        'url' => 'https://www.mangacollec.com/user/xutech/collection',
    ]);

    $response->assertStatus(202)
        ->assertJson(['message' => 'Import started in background.']);

    \Illuminate\Support\Facades\Queue::assertPushed(\App\Manga\Application\Jobs\MangaCollecImportJob::class, function ($job) use ($user) {
        return $job->dto->username === 'xutech' && $job->dto->userId === $user->id;
    });
});

test('mangacollec import route has rate limiting', function () {
    $user = User::factory()->create();
    actingAs($user);

    \Illuminate\Support\Facades\Queue::fake();

    $payload = ['url' => 'https://www.mangacollec.com/user/test/collection'];

    // First attempt
    postJson('/api/user/settings/import/mangacollec', $payload)->assertStatus(202);

    // Second attempt
    postJson('/api/user/settings/import/mangacollec', $payload)->assertStatus(202);

    // Third attempt should be rate limited
    $response = postJson('/api/user/settings/import/mangacollec', $payload);

    $response->assertStatus(429);
});
