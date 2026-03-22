<?php

declare(strict_types=1);

use App\User\Application\Actions\ForgotPasswordAction;
use App\User\Application\DTOs\ForgotPasswordDTO;
use Illuminate\Support\Facades\Password;

test('it sends reset link and returns status', function () {
    Password::shouldReceive('sendResetLink')
        ->once()
        ->with(['email' => 'test@example.com'])
        ->andReturn(Password::RESET_LINK_SENT);

    $action = new ForgotPasswordAction;
    $dto = new ForgotPasswordDTO('test@example.com');

    $status = $action->execute($dto);

    expect($status)->toBe(Password::RESET_LINK_SENT);
});
