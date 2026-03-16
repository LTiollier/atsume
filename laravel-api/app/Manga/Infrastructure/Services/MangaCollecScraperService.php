<?php

namespace App\Manga\Infrastructure\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MangaCollecScraperService
{
    private const BASE_URL = 'https://api.mangacollec.com';

    private ?string $accessToken = null;

    public function login(): bool
    {
        $response = Http::withHeaders([
            'x-app-version' => '2.15.0',
            'x-system-name' => 'Web',
            'x-app-build-number' => '110',
            'Accept' => 'application/json',
        ])->post(self::BASE_URL.'/oauth/token', [
            'client_id' => config('services.mangacollec.client_id'),
            'client_secret' => config('services.mangacollec.client_secret'),
            'grant_type' => 'password',
            'username' => config('services.mangacollec.username'),
            'password' => config('services.mangacollec.password'),
            'scope' => '',
        ]);

        if ($response->failed()) {
            Log::error('MangaCollec Login Failed', ['body' => $response->body()]);

            return false;
        }

        $this->accessToken = $response->json('access_token');

        return true;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getSeriesList(): array
    {
        if (! $this->accessToken && ! $this->login()) {
            return [];
        }

        $response = Http::withToken($this->accessToken)
            ->withHeaders([
                'x-app-version' => '2.15.0',
                'x-system-name' => 'Web',
                'x-app-build-number' => '110',
                'Accept' => 'application/json',
            ])->get(self::BASE_URL.'/v2/series');

        if ($response->failed()) {
            Log::error('MangaCollec Fetch Series Failed', ['body' => $response->body()]);

            return [];
        }

        return $response->json('series') ?? [];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getSeriesDetail(string $uuid): ?array
    {
        if (! $this->accessToken && ! $this->login()) {
            return null;
        }

        $response = Http::withToken($this->accessToken)
            ->withHeaders([
                'x-app-version' => '2.15.0',
                'x-system-name' => 'Web',
                'x-app-build-number' => '110',
                'Accept' => 'application/json',
            ])->get(self::BASE_URL."/v2/series/{$uuid}");

        if ($response->failed()) {
            Log::error("MangaCollec Fetch Series Detail Failed for {$uuid}", ['body' => $response->body()]);

            return null;
        }

        return $response->json();
    }
}
