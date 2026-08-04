<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFamilyMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_date' => ['nullable', 'date'],
            'death_date' => ['nullable', 'date', 'after_or_equal:birth_date'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:10000'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'parent_id' => ['nullable', 'exists:family_members,id'],
            'parent_spouse_id' => ['nullable', 'exists:spouses,id'],
            'spouses' => ['nullable', 'array'],
            'spouses.*.id' => ['nullable', 'exists:spouses,id'],
            'spouses.*.name' => ['required', 'string', 'max:255'],
            'spouses.*.gender' => ['required', 'in:male,female'],
            'spouses.*.birth_date' => ['nullable', 'date'],
            'spouses.*.death_date' => ['nullable', 'date', 'after_or_equal:spouses.*.birth_date'],
            'spouses.*.status' => ['nullable', 'in:married,divorced'],
            'spouses.*.photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'gender' => 'jenis kelamin',
            'birth_date' => 'tanggal lahir',
            'death_date' => 'tanggal wafat',
            'birth_place' => 'tempat lahir',
            'bio' => 'biografi',
            'photo' => 'foto',
            'parent_id' => 'orang tua',
            'parent_spouse_id' => 'pasangan dari orang tua',
            'spouses' => 'data pasangan',
            'spouses.*.name' => 'nama pasangan',
        ];
    }
}
