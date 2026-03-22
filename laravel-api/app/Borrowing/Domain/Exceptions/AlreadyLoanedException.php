<?php

declare(strict_types=1);

namespace App\Borrowing\Domain\Exceptions;

use DomainException;

class AlreadyLoanedException extends DomainException {}
