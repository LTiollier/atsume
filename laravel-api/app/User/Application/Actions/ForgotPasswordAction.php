<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Application\DTOs\ForgotPasswordDTO;
use Illuminate\Support\Facades\Password;

final class ForgotPasswordAction
{
    public function execute(ForgotPasswordDTO $dto): string
    {
        return Password::sendResetLink(['email' => $dto->email]);
    }
}
