<?php

declare(strict_types=1);

namespace App\User\Domain\Exceptions;

use DomainException;

final class ProfileNotFoundOrPrivateException extends DomainException {}
