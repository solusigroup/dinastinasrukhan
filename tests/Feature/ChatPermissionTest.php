<?php

use App\Models\User;

test('viewer role cannot access chat index', function () {
    $viewer = User::factory()->create([
        'role' => User::ROLE_VIEWER,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $this->actingAs($viewer);

    $response = $this->get(route('chat.index'));
    $response->assertStatus(403);
});

test('viewer role cannot send chat messages', function () {
    $viewer = User::factory()->create([
        'role' => User::ROLE_VIEWER,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $editor = User::factory()->create([
        'role' => User::ROLE_EDITOR,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $this->actingAs($viewer);

    $response = $this->post(route('chat.store', $editor), [
        'message' => 'Halo dari viewer',
    ]);
    $response->assertStatus(403);
});

test('editor and superadmin can access chat', function () {
    $editor = User::factory()->create([
        'role' => User::ROLE_EDITOR,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $this->actingAs($editor);

    $response = $this->get(route('chat.index'));
    $response->assertOk();
});
