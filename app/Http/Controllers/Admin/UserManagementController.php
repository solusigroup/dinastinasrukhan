<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FamilyMember;
use App\Models\User;
use App\Models\UserBranchAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->withCount('branchAssignments');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $users = $query->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingCount = User::where('status', 'pending')->count();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'pendingCount' => $pendingCount,
            'currentFilter' => $request->status ?? 'all',
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['branchAssignments.familyMember']);

        // Get all family members for branch assignment dropdown (flat list)
        $familyMembers = FamilyMember::orderBy('generation')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/users/show', [
            'targetUser' => $user,
            'familyMembers' => $familyMembers,
        ]);
    }




    /**
     * Approve a pending user and set them as editor.
     */
    public function approve(User $user): RedirectResponse
    {
        if (!$user->isPendingStatus()) {
            return back()->with('error', 'User ini tidak berstatus pending.');
        }

        $user->update([
            'role' => User::ROLE_VIEWER,
            'status' => User::STATUS_ACTIVE,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', "User \"{$user->name}\" berhasil disetujui sebagai Viewer.");
    }

    /**
     * Reject a pending user.
     */
    public function reject(User $user): RedirectResponse
    {
        if (!$user->isPendingStatus()) {
            return back()->with('error', 'User ini tidak berstatus pending.');
        }

        $user->update([
            'status' => User::STATUS_REJECTED,
        ]);

        return back()->with('success', "User \"{$user->name}\" telah ditolak.");
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => 'required|in:editor,viewer,pending',
        ]);

        // Prevent demoting yourself
        if ($user->id === auth()->id() && $request->role !== User::ROLE_SUPERADMIN) {
            return back()->with('error', 'Anda tidak dapat mengubah role Anda sendiri.');
        }

        $user->update([
            'role' => $request->role,
            'status' => $request->role === User::ROLE_PENDING ? User::STATUS_PENDING : User::STATUS_ACTIVE,
        ]);

        return back()->with('success', "Role user \"{$user->name}\" berhasil diubah.");
    }

    /**
     * Reset password for a non-superadmin user.
     */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        // Prevent resetting superadmin password via this method
        if ($user->isSuperadmin()) {
            return back()->with('error', 'Password akun Superadmin tidak dapat direset melalui menu ini.');
        }

        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user->update([
            'password' => $request->password,
        ]);

        return back()->with('success', "Password untuk user \"{$user->name}\" berhasil direset.");
    }

    /**
     * Assign a branch to a user.
     */
    public function assignBranch(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'family_member_id' => 'required|exists:family_members,id',
        ]);

        // Check if already assigned
        $exists = UserBranchAssignment::where('user_id', $user->id)
            ->where('family_member_id', $request->family_member_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Cabang ini sudah di-assign ke user ini.');
        }

        UserBranchAssignment::create([
            'user_id' => $user->id,
            'family_member_id' => $request->family_member_id,
            'assigned_by' => auth()->id(),
        ]);

        $memberName = FamilyMember::find($request->family_member_id)->name;

        return back()->with('success', "Cabang \"{$memberName}\" berhasil di-assign ke \"{$user->name}\".");
    }

    /**
     * Remove a branch assignment from a user.
     */
    public function removeBranch(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'family_member_id' => 'required|exists:family_members,id',
        ]);

        UserBranchAssignment::where('user_id', $user->id)
            ->where('family_member_id', $request->family_member_id)
            ->delete();

        return back()->with('success', 'Assignment cabang berhasil dihapus.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', "User \"{$user->name}\" berhasil dihapus.");
    }
}
