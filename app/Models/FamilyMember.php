<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Spouse;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class FamilyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'death_date',
        'is_deceased',
        'birth_place',
        'bio',
        'photo',
        'parent_id',
        'parent_spouse_id',
        'generation',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'death_date' => 'date',
            'is_deceased' => 'boolean',
        ];
    }

    /**
     * Get the parent of this family member.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class, 'parent_id');
    }

    /**
     * Get the children of this family member.
     */
    public function children(): HasMany
    {
        return $this->hasMany(FamilyMember::class, 'parent_id');
    }

    /**
     * Get the spouse parent of this family member (if any).
     */
    public function parentSpouse(): BelongsTo
    {
        return $this->belongsTo(Spouse::class, 'parent_spouse_id');
    }

    /**
     * Get the spouses for this family member.
     */
    public function spouses(): HasMany
    {
        return $this->hasMany(Spouse::class);
    }

    /**
     * Recursively load all descendants with their spouses.
     */
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with(['spouses', 'childrenRecursive']);
    }

    /**
     * Scope to get root members (no parent).
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to filter male members.
     */
    public function scopeMale($query)
    {
        return $query->where('gender', 'male');
    }

    /**
     * Scope to filter female members.
     */
    public function scopeFemale($query)
    {
        return $query->where('gender', 'female');
    }

    /**
     * Scope to search member by name or birth place.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('birth_place', 'like', "%{$search}%");
        });
    }

    public static function getTree(): \Illuminate\Database\Eloquent\Collection
    {
        return static::roots()->with(['spouses', 'childrenRecursive'])->orderBy('birth_date')->get();
    }

    protected static function booted(): void
    {
        static::saved(function (FamilyMember $member) {
            if ($member->wasChanged('parent_id') || $member->wasRecentlyCreated) {
                self::recalculateAllGenerations();
            }
        });

        static::deleted(function (FamilyMember $member) {
            self::recalculateAllGenerations();
        });
    }

    public static function recalculateAllGenerations(): void
    {
        $roots = self::whereNull('parent_id')->get();
        foreach ($roots as $root) {
            self::updateDescendantGenerations($root, 1);
        }
    }

    private static function updateDescendantGenerations(FamilyMember $model, int $generation): void
    {
        if ($model->generation !== $generation) {
            $model->updateQuietly(['generation' => $generation]);
        }
        
        foreach ($model->children as $child) {
            self::updateDescendantGenerations($child, $generation + 1);
        }
    }

    /**
     * Get all descendant IDs using a single recursive CTE query.
     * This avoids the N+1 query problem of the previous recursive PHP approach.
     *
     * @return \Illuminate\Support\Collection<int, int>
     */
    public function getAllDescendantIds(): \Illuminate\Support\Collection
    {
        return \Illuminate\Support\Facades\DB::table(
            \Illuminate\Support\Facades\DB::raw(
                '(WITH RECURSIVE descendants AS (
                    SELECT id FROM family_members WHERE parent_id = ?
                    UNION ALL
                    SELECT fm.id FROM family_members fm
                    INNER JOIN descendants d ON fm.parent_id = d.id
                ) SELECT id FROM descendants) AS descendant_ids'
            )
        )->setBindings([$this->id])->pluck('id');
    }

    /**
     * Get all ancestor IDs up to the root.
     *
     * @return array<int>
     */
    public function getAncestorIds(): array
    {
        $ids = [];
        $current = $this->parent;
        while ($current) {
            $ids[] = $current->id;
            $current = $current->parent;
        }
        return $ids;
    }
}
