<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

test('a user can verify their email even if not authenticated', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
    );

    /** @var TestCase $this */
    $response = $this->get($verificationUrl);

    $user->refresh();
    expect($user->hasVerifiedEmail())->toBeTrue();

    $frontendUrl = config('app.frontend_url');
    $response->assertRedirect($frontendUrl.'/dashboard?verified=1');
});

test('a user can verify their email via JSON request', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
    );

    /** @var TestCase $this */
    $response = $this->getJson($verificationUrl);

    $user->refresh();
    expect($user->hasVerifiedEmail())->toBeTrue();
    $response->assertStatus(200)
        ->assertJson(['message' => 'Email verified successfully.']);
});

test('a user cannot verify email with invalid hash', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => 'invalid-hash']
    );

    /** @var TestCase $this */
    $response = $this->get($verificationUrl);

    $user->refresh();
    expect($user->hasVerifiedEmail())->toBeFalse();
    $response->assertStatus(403);
});

test('it can resend verification email', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    /** @var TestCase $this */
    $response = $this->actingAs($user)
        ->postJson('/api/auth/email/verification-notification');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Verification link sent.']);
});

test('it does not resend verification email if already verified', function () {
    /** @var User $user */
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    /** @var TestCase $this */
    $response = $this->actingAs($user)
        ->postJson('/api/auth/email/verification-notification');

    $response->assertStatus(400)
        ->assertJson(['message' => 'Email already verified.']);
});
