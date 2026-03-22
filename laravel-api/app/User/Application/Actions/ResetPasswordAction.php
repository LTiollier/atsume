<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Application\DTOs\ResetPasswordDTO;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

final class ResetPasswordAction
{
    public function execute(ResetPasswordDTO $dto): string
    {
        /** @var string $status */
        $status = Password::reset([
            'email' => $dto->email,
            'password' => $dto->password,
            'password_confirmation' => $dto->passwordConfirmation,
            'token' => $dto->token,
        ], function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();
        });

        return $status;
    }
}
