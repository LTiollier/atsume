<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\BoxSet as EloquentBoxSet;
use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

test('can add edition to wishlist', function () {
    $user = User::factory()->create();
    $series = Series::factory()->create();
    $edition = Edition::factory()->create(['series_id' => $series->id]);

    actingAs($user);

    postJson('/api/wishlist', [
        'wishlist_id' => $edition->id,
        'wishlist_type' => 'edition',
    ])->assertCreated();

    assertDatabaseHas('wishlist_items', [
        'user_id' => $user->id,
        'wishlistable_id' => $edition->id,
        'wishlistable_type' => 'edition',
    ]);
});

test('can add box to wishlist', function () {
    $user = User::factory()->create();
    $series = Series::factory()->create();
    $boxSet = EloquentBoxSet::create(['series_id' => $series->id, 'title' => 'Box Set']);
    $box = EloquentBox::create(['box_set_id' => $boxSet->id, 'title' => 'Box 1']);

    actingAs($user);

    postJson('/api/wishlist', [
        'wishlist_id' => $box->id,
        'wishlist_type' => 'box',
    ])->assertCreated();

    assertDatabaseHas('wishlist_items', [
        'user_id' => $user->id,
        'wishlistable_id' => $box->id,
        'wishlistable_type' => 'box',
    ]);
});

test('returns 422 when wishlist_type is missing', function () {
    $user = User::factory()->create();
    actingAs($user);

    postJson('/api/wishlist', ['wishlist_id' => 1])->assertUnprocessable();
});

test('returns 422 when wishlist_type is invalid', function () {
    $user = User::factory()->create();
    actingAs($user);

    postJson('/api/wishlist', ['wishlist_id' => 1, 'wishlist_type' => 'volume'])->assertUnprocessable();
});

test('returns 404 when edition does not exist', function () {
    $user = User::factory()->create();
    actingAs($user);

    postJson('/api/wishlist', [
        'wishlist_id' => 99999,
        'wishlist_type' => 'edition',
    ])->assertNotFound();
});

test('can list wishlist items', function () {
    $user = User::factory()->create();
    $series = Series::factory()->create(['title' => 'Naruto']);
    $edition = Edition::factory()->create(['series_id' => $series->id, 'name' => 'Edition Standard']);

    $user->wishlistEditions()->attach($edition->id);

    actingAs($user);

    getJson('/api/wishlist')
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.type', 'edition')
        ->assertJsonPath('data.0.name', 'Edition Standard');
});

test('can remove edition from wishlist', function () {
    $user = User::factory()->create();
    $series = Series::factory()->create();
    $edition = Edition::factory()->create(['series_id' => $series->id]);

    $user->wishlistEditions()->attach($edition->id);

    actingAs($user);

    deleteJson("/api/wishlist/{$edition->id}", ['wishlist_type' => 'edition'])
        ->assertSuccessful();

    assertDatabaseMissing('wishlist_items', [
        'user_id' => $user->id,
        'wishlistable_id' => $edition->id,
        'wishlistable_type' => 'edition',
    ]);
});

test('can remove box from wishlist', function () {
    $user = User::factory()->create();
    $series = Series::factory()->create();
    $boxSet = EloquentBoxSet::create(['series_id' => $series->id, 'title' => 'Box Set']);
    $box = EloquentBox::create(['box_set_id' => $boxSet->id, 'title' => 'Box 1']);

    $user->wishlistBoxes()->attach($box->id);

    actingAs($user);

    deleteJson("/api/wishlist/{$box->id}", ['wishlist_type' => 'box'])
        ->assertSuccessful();

    assertDatabaseMissing('wishlist_items', [
        'user_id' => $user->id,
        'wishlistable_id' => $box->id,
        'wishlistable_type' => 'box',
    ]);
});
