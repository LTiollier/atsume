<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

test('a user can register and registration event is dispatched', function () {
    Event::fake();

    /** @var TestCase $this */
    $response = $this->postJson('/api/auth/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user' => [
                'id',
                'name',
                'email',
            ],
            'token',
        ]);

    Event::assertDispatched(Registered::class);

    $user = User::where('email', 'john@example.com')->first();
    Event::assertDispatched(function (Registered $event) use ($user) {
        return $event->user->id === $user->id;
    });
});

test('it validates registration data', function () {
    /** @var TestCase $this */
    $response = $this->postJson('/api/auth/register', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => 'short',
        'password_confirmation' => 'mismatch',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});
