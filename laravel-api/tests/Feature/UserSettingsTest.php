<?php

use App\User\Infrastructure\EloquentModels\User;

it('updates user settings successfully', function () {
    $user = User::factory()->create([
        'username' => 'old_username',
        'is_public' => false,
    ]);

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => 'new_username',
        'is_public' => true,
        'theme' => 'void',
        'palette' => 'oni',
    ]);

    $response->assertOk()
        ->assertJson([
            'data' => [
                'username' => 'new_username',
                'is_public' => true,
                'theme' => 'void',
                'palette' => 'oni',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'username' => 'new_username',
        'is_public' => true,
        'theme' => 'void',
        'palette' => 'oni',
    ]);
});

it('prevents duplicate usernames', function () {
    User::factory()->create([
        'username' => 'taken_username',
    ]);

    $user = User::factory()->create([
        'username' => 'my_username',
    ]);

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => 'taken_username',
        'is_public' => true,
        'theme' => 'void',
        'palette' => 'oni',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['username']);
});

it('allows updating settings without changing username', function () {
    $user = User::factory()->create([
        'username' => 'my_username',
        'is_public' => false,
    ]);

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => 'my_username',
        'is_public' => true,
        'theme' => 'void',
        'palette' => 'oni',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'username' => 'my_username',
        'is_public' => true,
    ]);
});

it('persists theme and palette choices', function () {
    $user = User::factory()->create([
        'theme' => 'void',
        'palette' => 'oni',
    ]);

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => $user->username,
        'is_public' => false,
        'theme' => 'light',
        'palette' => 'kaminari',
    ]);

    $response->assertOk()
        ->assertJson([
            'data' => [
                'theme' => 'light',
                'palette' => 'kaminari',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'theme' => 'light',
        'palette' => 'kaminari',
    ]);
});

it('rejects invalid theme', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => $user->username,
        'is_public' => false,
        'theme' => 'dark',
        'palette' => 'oni',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['theme']);
});

it('rejects invalid palette', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->putJson('/api/user/settings', [
        'username' => $user->username,
        'is_public' => false,
        'theme' => 'void',
        'palette' => 'pink',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['palette']);
});
