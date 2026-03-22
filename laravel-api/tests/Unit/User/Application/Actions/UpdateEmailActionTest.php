<?php

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\UpdateEmailAction;
use App\User\Application\DTOs\UpdateEmailDTO;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;
use Mockery;

test('it updates user email with correct password', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $userId = 1;
    $currentPassword = 'password123';
    $newEmail = 'new@example.com';

    $dto = new UpdateEmailDTO(
        email: $newEmail,
        currentPassword: $currentPassword
    );

    $user = new User(
        name: 'John Doe',
        email: 'old@example.com',
        password: Hash::make($currentPassword),
        id: $userId
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with($userId)
        ->andReturn($user);

    $repository->shouldReceive('update')
        ->once()
        ->with(Mockery::on(function (User $updatedUser) use ($newEmail) {
            return $updatedUser->getEmail() === $newEmail;
        }))
        ->andReturnArg(0);

    $action = new UpdateEmailAction($repository);
    $result = $action->execute($dto, $userId);

    expect($result)->toBeInstanceOf(User::class)
        ->and($result->getEmail())->toBe($newEmail);
});

test('it throws exception if user not found', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $userId = 999;

    $dto = new UpdateEmailDTO(
        email: 'new@example.com',
        currentPassword: 'password123'
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with($userId)
        ->andReturn(null);

    $action = new UpdateEmailAction($repository);
    $action->execute($dto, $userId);
})->throws(InvalidArgumentException::class, 'User not found.');

test('it throws exception for incorrect current password', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $userId = 1;

    $dto = new UpdateEmailDTO(
        email: 'new@example.com',
        currentPassword: 'wrong_password'
    );

    $user = new User(
        name: 'John Doe',
        email: 'old@example.com',
        password: Hash::make('correct_password'),
        id: $userId
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with($userId)
        ->andReturn($user);

    $action = new UpdateEmailAction($repository);
    $action->execute($dto, $userId);
})->throws(InvalidCredentialsException::class, 'Le mot de passe actuel est incorrect.');
