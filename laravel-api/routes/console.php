<?php

declare(strict_types=1);

use App\Console\Commands\SendDailyReleasesCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command(SendDailyReleasesCommand::class)
    ->dailyAt('06:00')
    ->withoutOverlapping()
    ->runInBackground();
