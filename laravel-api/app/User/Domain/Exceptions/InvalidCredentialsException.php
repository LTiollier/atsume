<?php

declare(strict_types=1);

namespace App\User\Domain\Exceptions;

use Exception;

class InvalidCredentialsException extends Exception
{
    protected $message = 'Invalid credentials provided.';
}
