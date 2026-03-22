<?php

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\UpdatePasswordAction;
use App\User\Application\DTOs\UpdatePasswordDTO;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Mockery;

test('it updates user password with correct current password', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $userId = 1;
    $currentPassword = 'OldPassword123!';
    $newPassword = 'NewSecurePassword123!';

    $dto = new UpdatePasswordDTO(
        currentPassword: $currentPassword,
        newPassword: $newPassword
    );

    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: Hash::make($currentPassword),
        id: $userId
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with($userId)
        ->andReturn($user);

    $repository->shouldReceive('update')
        ->once()
        ->with(Mockery::on(function (User $updatedUser) use ($newPassword) {
            return Hash::check($newPassword, $updatedUser->getPassword());
        }))
        ->andReturnArg(0);

    $action = new UpdatePasswordAction($repository);
    $result = $action->execute($dto, $userId);

    expect($result)->toBeInstanceOf(User::class)
        ->and(Hash::check($newPassword, $result->getPassword()))->toBeTrue();
});

test('it throws exception for incorrect current password during password update', function () {
    $repository = Mockery::mock(UserRepositoryInterface::class);
    $userId = 1;

    $dto = new UpdatePasswordDTO(
        currentPassword: 'wrong_password',
        newPassword: 'NewSecurePassword123!'
    );

    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: Hash::make('correct_password'),
        id: $userId
    );

    $repository->shouldReceive('findById')
        ->once()
        ->with($userId)
        ->andReturn($user);

    $action = new UpdatePasswordAction($repository);
    $action->execute($dto, $userId);
})->throws(InvalidCredentialsException::class, 'Le mot de passe actuel est incorrect.');
