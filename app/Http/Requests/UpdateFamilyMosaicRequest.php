<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFamilyMosaicRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        if ($user->isSuperadmin()) {
            return true;
        }

        if ($user->isEditor() && $user->isActive()) {
            return true;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:15360'],
            'family_member_id' => ['required', 'integer', 'exists:family_members,id'],
            'title' => ['nullable', 'string', 'max:150'],
            'caption' => ['required', 'string', 'max:2500'],
            'activity_date' => ['nullable', 'date'],
            'tagged_member_ids' => ['nullable', 'array'],
            'tagged_member_ids.*' => ['integer', 'exists:family_members,id'],
        ];
    }

    /**
     * Custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'photo' => 'foto',
            'family_member_id' => 'anggota keluarga terkait',
            'title' => 'judul kegiatan',
            'caption' => 'keterangan / caption',
            'activity_date' => 'tanggal kegiatan',
            'tagged_member_ids' => 'anggota yang ditandai',
        ];
    }
}
