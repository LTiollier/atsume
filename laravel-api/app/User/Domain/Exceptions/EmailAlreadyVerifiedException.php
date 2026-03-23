<?php

declare(strict_types=1);

namespace App\User\Domain\Exceptions;

use Exception;

final class EmailAlreadyVerifiedException extends Exception
{
    protected $message = 'Email already verified.';
}
