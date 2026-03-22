<?php

declare(strict_types=1);

use App\Manga\Infrastructure\EloquentModels\Box as EloquentBox;
use App\Manga\Infrastructure\EloquentModels\BoxSet as EloquentBoxSet;
use App\Manga\Infrastructure\EloquentModels\Edition as EloquentEdition;
use App\Manga\Infrastructure\EloquentModels\Series as EloquentSeries;
use App\Manga\Infrastructure\Services\WishlistAuthorizationService;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

test('authorizeAdd passes for edition when gate allows', function () {
    $user = User::factory()->create();
    actingAs($user);

    $edition = EloquentEdition::factory()->create();

    Gate::shouldReceive('authorize')->with('addEdition', Mockery::type(EloquentEdition::class))->once();

    $service = new WishlistAuthorizationService;
    $service->authorizeAdd($edition->id, 'edition');
});

test('authorizeAdd passes for box when gate allows', function () {
    $user = User::factory()->create();
    actingAs($user);

    $series = EloquentSeries::create(['title' => 'Test', 'authors' => 'Author']);
    $boxSet = EloquentBoxSet::create(['series_id' => $series->id, 'title' => 'Box Set']);
    $box = EloquentBox::create(['box_set_id' => $boxSet->id, 'title' => 'Box 1']);

    Gate::shouldReceive('authorize')->with('addBox', Mockery::type(EloquentBox::class))->once();

    $service = new WishlistAuthorizationService;
    $service->authorizeAdd($box->id, 'box');
});

test('authorizeAdd throws when edition does not exist', function () {
    $user = User::factory()->create();
    actingAs($user);

    $service = new WishlistAuthorizationService;

    expect(fn () => $service->authorizeAdd(99999, 'edition'))
        ->toThrow(ModelNotFoundException::class);
});

test('authorizeAdd throws InvalidArgumentException for unknown type', function () {
    $user = User::factory()->create();
    actingAs($user);

    $service = new WishlistAuthorizationService;

    expect(fn () => $service->authorizeAdd(1, 'volume'))
        ->toThrow(InvalidArgumentException::class);
});
