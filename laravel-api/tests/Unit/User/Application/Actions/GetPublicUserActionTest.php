<?php

declare(strict_types=1);

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\GetPublicUserAction;
use App\User\Domain\Exceptions\ProfileNotFoundOrPrivateException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Mockery;

test('it returns a public user by username', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id: 1,
        username: 'johndoe',
        isPublic: true
    );

    $repository->shouldReceive('findByUsername')
        ->once()
        ->with('johndoe')
        ->andReturn($user);

    $action = new GetPublicUserAction($repository);
    $result = $action->execute('johndoe');

    expect($result->getUsername())->toBe('johndoe');
});

test('it throws exception if user is private', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id: 1,
        username: 'johndoe',
        isPublic: false
    );

    $repository->shouldReceive('findByUsername')
        ->once()
        ->with('johndoe')
        ->andReturn($user);

    $action = new GetPublicUserAction($repository);
    $action->execute('johndoe');
})->throws(ProfileNotFoundOrPrivateException::class);
