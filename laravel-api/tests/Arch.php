<?php

declare(strict_types=1);

// 1. Domain Layer Isolation
arch('domain models should be isolated')
    ->expect('App\*\Domain\Models')
    ->toOnlyUse(['App\*\Domain\Models', 'App\*\Domain\Events'])
    ->not->toUse('Illuminate');

// 2. Repository Contracts
arch('domain repositories should be interfaces')
    ->expect('App\*\Domain\Repositories')
    ->toBeInterfaces();

// 3. Application decoupling
arch('application actions should be decoupled from infrastructure')
    ->expect('App\*\Application\Actions')
    ->not->toUse('App\*\Infrastructure\EloquentModels')
    ->toHaveMethod('execute');

// 4. DTOs should be immutable
arch('dtos should be readonly')
    ->expect('App\*\Application\DTOs')
    ->toBeReadonly();

// 5. Controllers decoupling
arch('controllers should not use eloquent models directly')
    ->expect('App\Http\Api\Controllers')
    ->not->toUse(['App\Manga\Infrastructure\EloquentModels', 'App\Borrowing\Infrastructure\EloquentModels']);
