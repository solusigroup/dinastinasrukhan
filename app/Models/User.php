<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'approved_at', 'approved_by'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    // Role constants
    const ROLE_SUPERADMIN = 'superadmin';
    const ROLE_EDITOR = 'editor';
    const ROLE_VIEWER = 'viewer';
    const ROLE_PENDING = 'pending';

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_PENDING = 'pending';
    const STATUS_REJECTED = 'rejected';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    // ── Role checks ──────────────────────────────────────────

    public function isSuperadmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function isEditor(): bool
    {
        return $this->role === self::ROLE_EDITOR;
    }

    public function isViewer(): bool
    {
        return $this->role === self::ROLE_VIEWER;
    }

    public function isPendingRole(): bool
    {
        return $this->role === self::ROLE_PENDING;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isPendingStatus(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function canChat(): bool
    {
        return $this->isActive() && !$this->isViewer() && !$this->isPendingRole();
    }

    // ── Relationships ────────────────────────────────────────

    /**
     * Branch assignments for this user.
     */
    public function branchAssignments(): HasMany
    {
        return $this->hasMany(UserBranchAssignment::class);
    }

    /**
     * Family members assigned as branch roots.
     */
    public function assignedBranches(): BelongsToMany
    {
        return $this->belongsToMany(FamilyMember::class, 'user_branch_assignments')
            ->withPivot('assigned_by')
            ->withTimestamps();
    }

    // ── Authorization helpers ────────────────────────────────

    /**
     * Get all family member IDs this user can manage.
     * Superadmin can manage all. Editor can manage assigned branches + their descendants.
     */
    public function getManageableMemberIds(): Collection
    {
        if ($this->isSuperadmin()) {
            return FamilyMember::pluck('id');
        }

        if (!$this->isEditor() || !$this->isActive()) {
            return collect(); // Viewer and pending users cannot manage any members
        }

        $branchRootIds = $this->assignedBranches()->pluck('family_members.id');
        $manageableIds = collect();

        foreach ($branchRootIds as $rootId) {
            $root = FamilyMember::find($rootId);
            if ($root) {
                $manageableIds->push($root->id);
                $manageableIds = $manageableIds->merge($root->getAllDescendantIds());
            }
        }

        return $manageableIds->unique();
    }

    /**
     * Check whether this user can manage a specific family member.
     */
    public function canManageMember(FamilyMember $member): bool
    {
        if ($this->isSuperadmin()) {
            return true;
        }

        return $this->getManageableMemberIds()->contains($member->id);
    }

    /**
     * Check whether this user can create a child under a given parent.
     */
    public function canCreateUnderParent(?int $parentId): bool
    {
        if ($this->isSuperadmin()) {
            return true;
        }

        // Editor must specify a parent within their branch
        if ($parentId === null) {
            return false;
        }

        $parent = FamilyMember::find($parentId);
        if (!$parent) {
            return false;
        }

        return $this->canManageMember($parent);
    }
}
