<?php

use App\Borrowing\Infrastructure\EloquentModels\Loan;
use App\Manga\Infrastructure\EloquentModels\Volume;
use App\User\Infrastructure\EloquentModels\User;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;

test('it can loan multiple mangas in bulk', function () {
    $user = User::factory()->create();
    $volumes = Volume::factory()->count(3)->create();

    foreach ($volumes as $volume) {
        $user->volumes()->attach($volume->id);
    }

    Sanctum::actingAs($user);

    $response = postJson('/api/loans/bulk', [
        'volume_ids' => $volumes->pluck('id')->toArray(),
        'borrower_name' => 'Jean Bulk',
        'notes' => 'Bulk loan notes',
    ]);

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');

    foreach ($volumes as $volume) {
        assertDatabaseHas('manga_loans', [
            'user_id' => $user->id,
            'volume_id' => $volume->id,
            'borrower_name' => 'Jean Bulk',
            'returned_at' => null,
        ]);
    }
});

test('it rolls back all loans if one fails', function () {
    $user = User::factory()->create();
    $volumes = Volume::factory()->count(2)->create();

    // Only attach the first volume
    $user->volumes()->attach($volumes[0]->id);

    Sanctum::actingAs($user);

    // This should fail because the second volume is not in the collection
    $response = postJson('/api/loans/bulk', [
        'volume_ids' => $volumes->pluck('id')->toArray(),
        'borrower_name' => 'Jean Failed',
    ]);

    $response->assertStatus(403);

    // Verify that NO loans were created (atomicity check)
    expect(Loan::where('borrower_name', 'Jean Failed')->count())->toBe(0);
});

test('it returns 403 when bulk loan volume_ids is not an array', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = postJson('/api/loans/bulk', [
        'volume_ids' => 'not-an-array',
        'borrower_name' => 'Jean',
    ]);

    $response->assertStatus(403);
});

test('it returns 403 when bulk return volume_ids is not an array', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = postJson('/api/loans/return/bulk', [
        'volume_ids' => 'not-an-array',
    ]);

    $response->assertStatus(403);
});

test('it returns 403 when bulk return volume not owned by user', function () {
    $user = User::factory()->create();
    $volume = Volume::factory()->create();
    Sanctum::actingAs($user);

    $response = postJson('/api/loans/return/bulk', [
        'volume_ids' => [$volume->id],
    ]);

    $response->assertStatus(403);
});

test('it can return multiple loans in bulk', function () {
    $user = User::factory()->create();
    $volumes = Volume::factory()->count(3)->create();

    foreach ($volumes as $volume) {
        $user->volumes()->attach($volume->id);
        Loan::create([
            'user_id' => $user->id,
            'volume_id' => $volume->id,
            'borrower_name' => 'Jean Returner',
            'loaned_at' => now(),
        ]);
    }

    Sanctum::actingAs($user);

    $response = postJson('/api/loans/return/bulk', [
        'volume_ids' => $volumes->pluck('id')->toArray(),
    ]);

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');

    foreach ($volumes as $volume) {
        $loan = Loan::where('volume_id', $volume->id)->first();
        expect($loan->returned_at)->not->toBeNull();
    }
});
