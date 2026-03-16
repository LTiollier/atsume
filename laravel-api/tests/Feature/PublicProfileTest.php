<?php

use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\EloquentModels\Volume;
use App\User\Domain\Models\User as DomainUser;
use App\User\Domain\Repositories\UserRepositoryInterface;
use App\User\Infrastructure\EloquentModels\User;

use function Pest\Laravel\getJson;

test('it shows public user profile', function () {
    $user = User::factory()->create(['username' => 'johndoe', 'is_public' => true]);

    $response = getJson('/api/users/johndoe');

    $response->assertStatus(200)
        ->assertJsonPath('data.username', 'johndoe');
});

test('it returns 404 for private or non-existent profile', function () {
    $user = User::factory()->create(['username' => 'privateuser', 'is_public' => false]);

    $response = getJson('/api/users/privateuser');

    $response->assertStatus(404);

    $response = getJson('/api/users/nonexistent');

    $response->assertStatus(404);
});

test('it retrieves collection for public profile', function () {
    $user = User::factory()->create(['username' => 'publicuser', 'is_public' => true]);
    $series = Series::create(['title' => 'Naruto', 'authors' => null]);
    $edition = Edition::create(['series_id' => $series->id, 'name' => 'Standard', 'language' => 'fr']);
    $volume = Volume::create([
        'api_id' => 'api123',
        'title' => 'Naruto Vol. 1',
        'edition_id' => $edition->id,
        'authors' => null,
    ]);
    $user->volumes()->attach($volume->id);

    $response = getJson('/api/users/publicuser/collection');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Naruto Vol. 1');
});

test('it returns 404 for collection of private profile', function () {
    $user = User::factory()->create(['username' => 'privateuser', 'is_public' => false]);

    $response = getJson('/api/users/privateuser/collection');

    $response->assertStatus(404);
});

test('it returns 404 if user has no ID', function () {
    $user = Mockery::mock(DomainUser::class);
    $user->shouldReceive('isPublic')->andReturn(true);
    $user->shouldReceive('getId')->andReturn(null);

    $userRepository = Mockery::mock(UserRepositoryInterface::class);
    $userRepository->shouldReceive('findByUsername')->with('username')->andReturn($user);

    // Use the app() helper to bind the mock
    app()->instance(UserRepositoryInterface::class, $userRepository);

    $response = getJson('/api/users/username/collection');

    $response->assertStatus(404);
});
