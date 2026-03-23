<?php

declare(strict_types=1);

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\SendVerificationNotificationAction;
use App\User\Domain\Exceptions\EmailAlreadyVerifiedException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Mockery;

test('it sends verification notification', function () {
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

    $repository->shouldReceive('sendEmailVerification')
        ->once()
        ->with($user);

    $action = new SendVerificationNotificationAction($repository);
    $action->execute(1);

    expect(true)->toBeTrue();
});

test('it throws exception if email is already verified', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id: 1,
        emailVerifiedAt: now()->toIso8601String()
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with(1)
        ->andReturn($user);

    $action = new SendVerificationNotificationAction($repository);
    $action->execute(1);
})->throws(EmailAlreadyVerifiedException::class);
