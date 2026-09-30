<?php

use App\Models\FamilyMember;
use App\Models\FamilyMosaic;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('authenticated user can view mosaic gallery', function () {
    $user = User::factory()->create([
        'role' => User::ROLE_VIEWER,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('mosaic.index'));
    $response->assertOk();
});

test('editor can upload mosaic photo for member in their branch', function () {
    $editor = User::factory()->create([
        'role' => User::ROLE_EDITOR,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $rootMember = FamilyMember::create([
        'name' => 'Bani Pertama',
        'gender' => 'male',
        'generation' => 1,
    ]);

    // Assign branch to editor
    $editor->assignedBranches()->attach($rootMember->id);

    $file = UploadedFile::fake()->image('activity.jpg', 800, 600);

    $response = $this->actingAs($editor)->post(route('mosaic.store'), [
        'family_member_id' => $rootMember->id,
        'title' => 'Reuni Akbar',
        'caption' => 'Kegiatan silaturahmi keluarga di kampung halaman.',
        'activity_date' => '2026-05-15',
        'photo' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $this->assertDatabaseHas('family_mosaics', [
        'user_id' => $editor->id,
        'family_member_id' => $rootMember->id,
        'title' => 'Reuni Akbar',
        'caption' => 'Kegiatan silaturahmi keluarga di kampung halaman.',
    ]);
});

test('editor cannot upload mosaic photo for member outside their branch', function () {
    $editor = User::factory()->create([
        'role' => User::ROLE_EDITOR,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $branchA = FamilyMember::create([
        'name' => 'Bani A',
        'gender' => 'male',
        'generation' => 1,
    ]);

    $branchB = FamilyMember::create([
        'name' => 'Bani B',
        'gender' => 'male',
        'generation' => 1,
    ]);

    // Editor is assigned to branch A only
    $editor->assignedBranches()->attach($branchA->id);

    $file = UploadedFile::fake()->image('activity.jpg', 800, 600);

    $response = $this->actingAs($editor)->post(route('mosaic.store'), [
        'family_member_id' => $branchB->id,
        'title' => 'Reuni B',
        'caption' => 'Mencoba posting ke cabang lain.',
        'photo' => $file,
    ]);

    $response->assertStatus(403);
});

test('viewer role cannot upload mosaic photo', function () {
    $viewer = User::factory()->create([
        'role' => User::ROLE_VIEWER,
        'status' => User::STATUS_ACTIVE,
        'email_verified_at' => now(),
        'approved_at' => now(),
    ]);

    $member = FamilyMember::create([
        'name' => 'Anggota Keluarga',
        'gender' => 'male',
        'generation' => 1,
    ]);

    $file = UploadedFile::fake()->image('activity.jpg', 800, 600);

    $response = $this->actingAs($viewer)->post(route('mosaic.store'), [
        'family_member_id' => $member->id,
        'caption' => 'Viewer posting foto',
        'photo' => $file,
    ]);

    $response->assertStatus(403);
});
