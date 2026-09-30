<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFamilyMemberRequest;
use App\Http\Requests\UpdateFamilyMemberRequest;
use App\Models\FamilyMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FamilyMemberController extends Controller
{
    /**
     * Display a listing of family members.
     */
    public function index(): Response
    {
        $members = FamilyMember::with(['parent', 'spouses'])
            ->orderBy('generation')
            ->orderBy('name')
            ->get();

        $user = auth()->user();
        $manageableIds = $user->getManageableMemberIds()->toArray();

        return Inertia::render('family-members/index', [
            'members' => $members,
            'manageableIds' => $manageableIds,
            'userRole' => $user->role,
        ]);
    }

    /**
     * Show the form for creating a new family member.
     */
    public function create(): Response
    {
        $this->authorize('create', FamilyMember::class);

        $user = auth()->user();
        $parents = FamilyMember::with('spouses')
            ->orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'gender', 'generation']);

        // For editors, filter to only parents within their manageable branches
        $manageableIds = $user->getManageableMemberIds();
        if ($user->isEditor()) {
            $parents = $parents->filter(function ($parent) use ($manageableIds) {
                return $manageableIds->contains($parent->id);
            })->values();
        }

        return Inertia::render('family-members/form', [
            'parents' => $parents,
        ]);
    }

    /**
     * Store a newly created family member.
     */
    public function store(StoreFamilyMemberRequest $request): RedirectResponse
    {
        $this->authorize('create', FamilyMember::class);

        $user = auth()->user();
        $data = $request->validated();
        $spousesData = $data['spouses'] ?? [];
        unset($data['spouses']);

        // For editors, verify the parent is within their branch
        if ($user->isEditor() && !$user->canCreateUnderParent($data['parent_id'] ?? null)) {
            abort(403, 'Anda tidak memiliki izin untuk menambah anggota di cabang ini.');
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('family-photos', 'public');
        }

        // Auto-calculate generation
        if (isset($data['parent_id']) && $data['parent_id']) {
            $parent = FamilyMember::find($data['parent_id']);
            $data['generation'] = $parent ? $parent->generation + 1 : 1;
        } else {
            $data['generation'] = 1;
        }

        $member = FamilyMember::create($data);

        // Save spouses
        if (!empty($spousesData)) {
            foreach ($spousesData as $key => $spouseData) {
                if (isset($spouseData['photo']) && $spouseData['photo'] instanceof \Illuminate\Http\UploadedFile) {
                    $spousesData[$key]['photo'] = $spouseData['photo']->store('family-photos', 'public');
                } else {
                    unset($spousesData[$key]['photo']);
                }
            }
            $member->spouses()->createMany($spousesData);
        }

        return redirect()->route('family-members.index')
            ->with('success', 'Anggota keluarga berhasil ditambahkan.');
    }

    /**
     * Display the specified family member.
     */
    public function show(FamilyMember $familyMember): Response
    {
        $familyMember->load([
            'parent',
            'children',
            'spouses',
            'parentSpouse',
            'mosaics.user:id,name,role',
            'taggedMosaics.user:id,name,role',
        ]);

        $user = auth()->user();
        $canManage = $user ? $user->canManageMember($familyMember) : false;

        return Inertia::render('family-members/show', [
            'member' => $familyMember,
            'canManage' => $canManage,
        ]);
    }

    /**
     * Show the form for editing the specified family member.
     */
    public function edit(FamilyMember $familyMember): Response
    {
        $this->authorize('update', $familyMember);

        $familyMember->load('spouses');

        $user = auth()->user();
        $parents = FamilyMember::with('spouses')
            ->where('id', '!=', $familyMember->id)
            ->orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'gender', 'generation']);

        // For editors, filter parents to only their manageable branches
        if ($user->isEditor()) {
            $manageableIds = $user->getManageableMemberIds();
            $parents = $parents->filter(function ($parent) use ($manageableIds) {
                return $manageableIds->contains($parent->id);
            })->values();
        }

        return Inertia::render('family-members/form', [
            'member' => $familyMember,
            'parents' => $parents,
        ]);
    }

    /**
     * Update the specified family member.
     */
    public function update(UpdateFamilyMemberRequest $request, FamilyMember $familyMember): RedirectResponse
    {
        $this->authorize('update', $familyMember);

        $data = $request->validated();
        $spousesData = $data['spouses'] ?? [];
        unset($data['spouses']);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($familyMember->photo) {
                Storage::disk('public')->delete($familyMember->photo);
            }
            $data['photo'] = $request->file('photo')->store('family-photos', 'public');
        } else {
            // Remove photo from data if not uploading a new one
            unset($data['photo']);
        }

        // Prevent setting self or descendant as parent
        if (isset($data['parent_id']) && $data['parent_id']) {
            if ($data['parent_id'] == $familyMember->id || $familyMember->getAllDescendantIds()->contains((int) $data['parent_id'])) {
                return back()->withErrors(['parent_id' => 'Tidak dapat memilih anggota ini atau keturunannya sebagai orang tua.']);
            }
        }

        // Auto-calculate generation
        if (isset($data['parent_id']) && $data['parent_id']) {
            $parent = FamilyMember::find($data['parent_id']);
            $data['generation'] = $parent ? $parent->generation + 1 : 1;
        } else {
            $data['generation'] = 1;
        }

        $familyMember->update($data);

        // Update spouses
        $existingSpouseIds = [];
        foreach ($spousesData as $spouseData) {
            $isNewPhotoUploaded = isset($spouseData['photo']) && $spouseData['photo'] instanceof \Illuminate\Http\UploadedFile;
            
            if ($isNewPhotoUploaded) {
                $spouseData['photo'] = $spouseData['photo']->store('family-photos', 'public');
            } else {
                unset($spouseData['photo']);
            }

            if (!empty($spouseData['id'])) {
                $existingSpouse = $familyMember->spouses()->where('id', $spouseData['id'])->first();
                if ($existingSpouse) {
                    if ($isNewPhotoUploaded && $existingSpouse->photo) {
                        Storage::disk('public')->delete($existingSpouse->photo);
                    }
                    $existingSpouse->update($spouseData);
                }
                $existingSpouseIds[] = $spouseData['id'];
            } else {
                $newSpouse = $familyMember->spouses()->create($spouseData);
                $existingSpouseIds[] = $newSpouse->id;
            }
        }
        
        $removedSpouses = $familyMember->spouses()->whereNotIn('id', $existingSpouseIds)->get();
        foreach ($removedSpouses as $removedSpouse) {
            if ($removedSpouse->photo) {
                Storage::disk('public')->delete($removedSpouse->photo);
            }
            $removedSpouse->delete();
        }

        return redirect()->route('family-members.index')
            ->with('success', 'Data anggota keluarga berhasil diperbarui.');
    }

    /**
     * Remove the specified family member.
     */
    public function destroy(FamilyMember $familyMember): RedirectResponse
    {
        $this->authorize('delete', $familyMember);

        // Prevent deletion if member has children
        if ($familyMember->children()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus anggota yang masih memiliki anak. Hapus atau pindahkan anak-anaknya terlebih dahulu.');
        }

        // Delete photo if exists
        if ($familyMember->photo) {
            Storage::disk('public')->delete($familyMember->photo);
        }

        foreach ($familyMember->spouses as $spouse) {
            if ($spouse->photo) {
                Storage::disk('public')->delete($spouse->photo);
            }
        }

        $familyMember->delete();

        return redirect()->route('family-members.index')
            ->with('success', 'Anggota keluarga berhasil dihapus.');
    }

    /**
     * Display the interactive family tree.
     */
    public function tree(): Response
    {
        $tree = FamilyMember::getTree();

        return Inertia::render('family-tree', [
            'tree' => $tree,
        ]);
    }

    /**
     * Display the family gallery.
     */
    public function gallery(): Response
    {
        $members = FamilyMember::with('spouses')
            ->orderBy('generation')
            ->orderBy('name')
            ->get();

        return Inertia::render('family-members/gallery', [
            'members' => $members,
        ]);
    }
}
