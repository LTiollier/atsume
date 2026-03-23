<?php

declare(strict_types=1);

namespace Tests\Unit\User\Domain\Exceptions;

use App\User\Domain\Exceptions\ProfileNotFoundOrPrivateException;

test('profile not found or private exception can be thrown', function () {
    $exception = new ProfileNotFoundOrPrivateException('Test message');
    expect($exception->getMessage())->toBe('Test message');
});
