<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Spouse extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'death_date',
        'photo',
        'status',
    ];

    /**
     * Get the family member that is this spouse's legal bloodline partner.
     */
    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class);
    }

    /**
     * Get the children that were born specifically from this spouse.
     */
    public function children(): HasMany
    {
        return $this->hasMany(FamilyMember::class, 'parent_spouse_id');
    }
}
