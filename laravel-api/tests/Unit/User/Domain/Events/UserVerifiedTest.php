<?php

declare(strict_types=1);

namespace Tests\Unit\User\Domain\Events;

use App\User\Domain\Events\UserVerified;
use App\User\Domain\Models\User;

test('UserVerified holds user', function () {
    $user = new User(
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password'
    );

    $event = new UserVerified(user: $user);

    expect($event->user)->toBe($user);
});
