<?php

declare(strict_types=1);

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\VerifyEmailAction;
use App\User\Domain\Events\UserVerified;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Mockery;

test('it verifies user email', function () {
    Event::fake();
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id: 1,
        emailVerifiedAt: null
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with(1)
        ->andReturn($user);

    $verifiedUser = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id: 1,
        emailVerifiedAt: now()->toIso8601String()
    );

    $repository->shouldReceive('markAsVerified')
        ->once()
        ->with($user)
        ->andReturn($verifiedUser);

    $action = new VerifyEmailAction($repository);
    $result = $action->execute(1);

    expect($result->isEmailVerified())->toBeTrue();
    Event::assertDispatched(UserVerified::class);
});

test('it throws exception if user not found during verification', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $repository->shouldReceive('findById')
        ->once()
        ->with(999)
        ->andReturn(null);

    $action = new VerifyEmailAction($repository);
    $action->execute(999);
})->throws(\Exception::class, 'User not found');
