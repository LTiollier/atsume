<?php

use App\Admin\Infrastructure\Services\JobStatusService;
use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

it('denies access to non-admin users', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->getJson('/api/admin/dashboard')
        ->assertForbidden();
});

it('allows access to admin users and returns correct stats', function () {
    $admin = User::factory()->admin()->create();

    // Create some data for this month using recycle to keep counts predictable
    $series = Series::factory()->count(2)->create();
    $editions = Edition::factory()->count(3)->recycle($series)->create();
    Volume::factory()->count(5)->recycle($editions)->create();

    // Create some data from last month (should not be counted)
    Series::factory()->create(['created_at' => now()->subMonth()]);

    $this->actingAs($admin)
        ->getJson('/api/admin/dashboard')
        ->assertOk()
        ->assertJson([
            'data' => [
                'stats' => [
                    'new_series' => 2,
                    'new_editions' => 3,
                    'new_volumes' => 5,
                ],
            ],
        ]);
});

it('returns correct cron status', function () {
    $admin = User::factory()->admin()->create();

    // Mock last run in cache
    $lastRunAt = now()->toIso8601String();
    Cache::put(JobStatusService::LAST_CRON_RUN_KEY, $lastRunAt);
    Cache::put(JobStatusService::LAST_CRON_TYPE_KEY, 'app:sync-series');

    // Create a failed job today
    DB::table('failed_jobs')->insert([
        'uuid' => (string) str()->uuid(),
        'connection' => 'database',
        'queue' => 'default',
        'payload' => '{}',
        'exception' => 'error',
        'failed_at' => now(),
    ]);

    $this->actingAs($admin)
        ->getJson('/api/admin/dashboard')
        ->assertOk()
        ->assertJson([
            'data' => [
                'cron' => [
                    'last_run_at' => $lastRunAt,
                    'last_run_type' => 'app:sync-series',
                    'failed_jobs_count' => 1,
                ],
            ],
        ]);
});

it('tracks cron runs via event listener', function () {
    $admin = User::factory()->admin()->create();

    // Clear cache
    Cache::forget(JobStatusService::LAST_CRON_RUN_KEY);

    // Manually dispatch the event to verify the listener in AppServiceProvider works
    event(new CommandFinished(
        'planning:send-daily-releases',
        new ArrayInput([]),
        new NullOutput,
        0
    ));

    $this->actingAs($admin)
        ->getJson('/api/admin/dashboard')
        ->assertOk()
        ->assertJsonPath('data.cron.last_run_type', 'planning:send-daily-releases')
        ->assertJson(fn ($json) => $json->has('data.cron.last_run_at')->etc());
});
