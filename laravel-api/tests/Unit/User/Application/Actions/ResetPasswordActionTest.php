<?php

declare(strict_types=1);

use App\User\Application\Actions\ResetPasswordAction;
use App\User\Application\DTOs\ResetPasswordDTO;
use Illuminate\Support\Facades\Password;

test('it resets password and returns status', function () {
    Password::shouldReceive('reset')
        ->once()
        ->andReturn(Password::PASSWORD_RESET);

    $action = new ResetPasswordAction;
    $dto = new ResetPasswordDTO(
        email: 'test@example.com',
        password: 'new-password',
        passwordConfirmation: 'new-password',
        token: 'valid-token'
    );

    $status = $action->execute($dto);

    expect($status)->toBe(Password::PASSWORD_RESET);
});
