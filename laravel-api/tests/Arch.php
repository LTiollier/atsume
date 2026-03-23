<?php

declare(strict_types=1);

// 1. Domain Layer Isolation
arch('domain models should be isolated')
    ->expect('App\*\Domain\Models')
    ->toOnlyUse(['App\*\Domain\Models', 'App\*\Domain\Events'])
    ->not->toUse(['Illuminate', 'App\*\Infrastructure']);

arch('domain models should be pure POPOs')
    ->expect('App\*\Domain\Models')
    ->not->toUse([
        'App\*\Infrastructure',
        'Illuminate\Support\Facades',
    ]);

// 2. Repository Contracts & Implementations
arch('domain repositories should be interfaces')
    ->expect('App\*\Domain\Repositories')
    ->toBeInterfaces();

// 3. Application decoupling
arch('application actions should be decoupled from infrastructure')
    ->expect('App\*\Application\Actions')
    ->not->toUse('App\*\Infrastructure\EloquentModels')
    ->toHaveMethod('execute')
    ->toHaveSuffix('Action');

// 4. DTOs should be immutable and standard
arch('dtos should be readonly and have suffix')
    ->expect('App\*\Application\DTOs')
    ->toBeReadonly()
    ->toHaveSuffix('DTO');

// 5. Controllers decoupling
arch('controllers should not use eloquent models directly')
    ->expect('App\Http\Api\Controllers')
    ->not->toUse([
        'App\Manga\Infrastructure\EloquentModels',
        'App\Borrowing\Infrastructure\EloquentModels',
        'App\User\Infrastructure\EloquentModels',
        'App\ReadingProgress\Infrastructure\EloquentModels',
    ]);

arch('controllers should not use repositories directly')
    ->expect('App\Http\Api\Controllers')
    ->not->toUse([
        'App\*\Domain\Repositories',
        'App\*\Infrastructure\Repositories',
    ]);

// 6. Infrastructure Isolation
arch('domain layer should not use infrastructure services')
    ->expect('App\*\Domain')
    ->not->toUse('App\*\Infrastructure\Services');
