<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class FamilyMosaic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'family_member_id',
        'title',
        'caption',
        'photo_path',
        'thumbnail_path',
        'activity_date',
    ];

    protected function casts(): array
    {
        return [
            'activity_date' => 'date',
        ];
    }

    /**
     * The user (editor/admin) who uploaded the mosaic.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The primary family member linked in the tree.
     */
    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class);
    }

    /**
     * Additional family members tagged in this activity photo.
     */
    public function taggedMembers(): BelongsToMany
    {
        return $this->belongsToMany(FamilyMember::class, 'family_mosaic_members')
            ->withTimestamps();
    }

    /**
     * Scope to search by caption, title, or family member name.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('caption', 'like', "%{$search}%")
                ->orWhere('title', 'like', "%{$search}%")
                ->orWhereHas('familyMember', function ($mq) use ($search) {
                    $mq->where('name', 'like', "%{$search}%");
                });
        });
    }

    /**
     * Scope to filter by specific family member or descendants.
     */
    public function scopeForMember($query, $memberId)
    {
        return $query->where('family_member_id', $memberId)
            ->orWhereHas('taggedMembers', function ($q) use ($memberId) {
                $q->where('family_members.id', $memberId);
            });
    }

    protected static function booted(): void
    {
        static::deleted(function (FamilyMosaic $mosaic) {
            if ($mosaic->photo_path && Storage::disk('public')->exists($mosaic->photo_path)) {
                Storage::disk('public')->delete($mosaic->photo_path);
            }
            if ($mosaic->thumbnail_path && Storage::disk('public')->exists($mosaic->thumbnail_path)) {
                Storage::disk('public')->delete($mosaic->thumbnail_path);
            }
        });
    }
}
