<?php

namespace Tests\Unit\Manga\Infrastructure\Repositories;

use App\Manga\Infrastructure\EloquentModels\Edition;
use App\Manga\Infrastructure\EloquentModels\Series;
use App\Manga\Infrastructure\Repositories\EloquentWishlistRepository;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class EloquentWishlistRepositoryTest extends TestCase
{
    use DatabaseTransactions;

    private EloquentWishlistRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new EloquentWishlistRepository;
    }

    public function test_it_can_add_edition_to_wishlist()
    {
        $user = User::factory()->create();
        $series = Series::create(['title' => 'Test', 'authors' => null]);
        $edition = Edition::create(['series_id' => $series->id, 'name' => 'Std', 'language' => 'fr']);

        $this->repository->addEditionWishlistToUser($edition->id, $user->id);

        $this->assertDatabaseHas('wishlist_items', [
            'user_id' => $user->id,
            'wishlistable_id' => $edition->id,
            'wishlistable_type' => 'edition',
        ]);
    }

    public function test_it_can_remove_edition_from_wishlist()
    {
        $user = User::factory()->create();
        $series = Series::create(['title' => 'Test', 'authors' => null]);
        $edition = Edition::create(['series_id' => $series->id, 'name' => 'Std', 'language' => 'fr']);

        $user->wishlistEditions()->attach($edition->id);

        $this->repository->removeWishlistItemFromUser($edition->id, 'edition', $user->id);

        $this->assertDatabaseMissing('wishlist_items', [
            'user_id' => $user->id,
            'wishlistable_id' => $edition->id,
            'wishlistable_type' => 'edition',
        ]);
    }
}
