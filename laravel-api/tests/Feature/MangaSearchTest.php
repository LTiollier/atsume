<?php

namespace Tests\Feature;

use App\Manga\Infrastructure\EloquentModels\Series;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MangaSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_mangas()
    {
        Series::create([
            'api_id' => 'WddYEAAAQBAJ',
            'title' => 'Naruto Vol. 1',
            'authors' => 'Masashi Kishimoto',
            'cover_url' => 'https://books.google.com/books/content?id=WddYEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        ]);

        $response = $this->getJson('/api/mangas/search?query=naruto');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.api_id', 'WddYEAAAQBAJ')
            ->assertJsonPath('data.0.title', 'Naruto Vol. 1')
            ->assertJsonPath('data.0.authors', ['Masashi Kishimoto'])
            ->assertJsonPath('data.0.cover_url', 'https://books.google.com/books/content?id=WddYEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_search_requires_query()
    {
        $response = $this->getJson('/api/mangas/search');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['query']);
    }

    public function test_search_handles_empty_results()
    {
        $response = $this->getJson('/api/mangas/search?query=unknownmanga');

        $response->assertStatus(200)
            ->assertJson(['data' => []])
            ->assertJsonPath('meta.total', 0);
    }

    public function test_search_supports_pagination()
    {
        for ($i = 1; $i <= 5; $i++) {
            Series::create([
                'api_id' => "api_id_{$i}",
                'title' => "Naruto Vol. {$i}",
                'authors' => 'Masashi Kishimoto',
                'cover_url' => null,
            ]);
        }

        $response = $this->getJson('/api/mangas/search?query=naruto&per_page=2&page=2');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 5)
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 2)
            ->assertJsonCount(2, 'data');
    }
}
