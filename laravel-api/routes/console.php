<?php

declare(strict_types=1);

use App\Manga\Infrastructure\Console\SendDailyReleasesCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command(SendDailyReleasesCommand::class)
    ->dailyAt('06:00')
    ->timezone('Europe/Paris')
    ->withoutOverlapping()
    ->runInBackground();

// Le 1er du mois : sync-all-series
Schedule::command('app:sync-all-series')
    ->timezone('Europe/Paris')
    ->monthlyOn(1, '00:00')
    ->runInBackground();

// Les autres jours (2 au 31) : sync-series
Schedule::command('app:sync-series')
    ->dailyAt('00:00')
    ->timezone('Europe/Paris')
    ->skip(fn () => now()->day === 1)
    ->runInBackground();
