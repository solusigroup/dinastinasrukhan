<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFamilyMosaicRequest;
use App\Http\Requests\UpdateFamilyMosaicRequest;
use App\Models\FamilyMember;
use App\Models\FamilyMosaic;
use App\Services\ImageCompressionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FamilyMosaicController extends Controller
{
    /**
     * Display a listing of family mosaics.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $search = $request->query('search');
        $memberId = $request->query('member_id');
        $branchId = $request->query('branch_id');

        $query = FamilyMosaic::with([
            'user:id,name,role',
            'familyMember:id,name,gender,generation,parent_id',
            'taggedMembers:id,name,gender,generation',
        ]);

        if ($search) {
            $query->search($search);
        }

        if ($memberId) {
            $query->forMember($memberId);
        }

        if ($branchId) {
            $branchMember = FamilyMember::find($branchId);
            if ($branchMember) {
                $branchIds = collect([$branchMember->id])->merge($branchMember->getAllDescendantIds());
                $query->where(function ($q) use ($branchIds) {
                    $q->whereIn('family_member_id', $branchIds)
                        ->orWhereHas('taggedMembers', function ($tq) use ($branchIds) {
                            $tq->whereIn('family_members.id', $branchIds);
                        });
                });
            }
        }

        $mosaics = $query->orderByRaw('COALESCE(activity_date, created_at) DESC')
            ->orderBy('id', 'DESC')
            ->paginate(36)
            ->withQueryString();

        // Manageable members for the current user
        $manageableMemberIds = $user ? $user->getManageableMemberIds() : collect();
        $isSuperadmin = $user ? $user->isSuperadmin() : false;
        $isEditor = $user ? ($user->isEditor() && $user->isActive()) : false;
        $canUpload = $isSuperadmin || ($isEditor && $manageableMemberIds->isNotEmpty());

        // Get members list for the upload form selection
        if ($isSuperadmin) {
            $uploadableMembers = FamilyMember::orderBy('generation')
                ->orderBy('name')
                ->get(['id', 'name', 'generation', 'parent_id']);
        } elseif ($isEditor) {
            $uploadableMembers = FamilyMember::whereIn('id', $manageableMemberIds)
                ->orderBy('generation')
                ->orderBy('name')
                ->get(['id', 'name', 'generation', 'parent_id']);
        } else {
            $uploadableMembers = collect();
        }

        // All root branches for the filter dropdown
        $rootBranches = FamilyMember::roots()
            ->orderBy('birth_date')
            ->orderBy('name')
            ->get(['id', 'name', 'generation']);

        // All members for filter dropdown
        $allMembers = FamilyMember::orderBy('generation')
            ->orderBy('name')
            ->get(['id', 'name', 'generation']);

        // Map manageable info into mosaics
        $mosaics->getCollection()->transform(function ($mosaic) use ($user, $isSuperadmin, $manageableMemberIds) {
            $canManage = false;
            if ($user) {
                if ($isSuperadmin) {
                    $canManage = true;
                } elseif ($mosaic->user_id === $user->id) {
                    $canManage = true;
                } elseif ($manageableMemberIds->contains($mosaic->family_member_id)) {
                    $canManage = true;
                }
            }
            $mosaic->can_manage = $canManage;
            return $mosaic;
        });

        return Inertia::render('mosaic/index', [
            'mosaics' => $mosaics,
            'filters' => [
                'search' => $search ?? '',
                'member_id' => $memberId ?? '',
                'branch_id' => $branchId ?? '',
            ],
            'uploadableMembers' => $uploadableMembers,
            'rootBranches' => $rootBranches,
            'allMembers' => $allMembers,
            'canUpload' => $canUpload,
            'userRole' => $user ? $user->role : null,
            'currentUserId' => $user ? $user->id : null,
        ]);
    }

    /**
     * Store a newly created mosaic photo.
     */
    public function store(StoreFamilyMosaicRequest $request, ImageCompressionService $compressionService): RedirectResponse
    {
        $user = auth()->user();

        // Check if editor has permission for this family member
        if ($user->isEditor() && !$user->canManageMember(FamilyMember::findOrFail($request->family_member_id))) {
            abort(403, 'Anda hanya dapat mengaitkan foto dengan anggota keluarga di dalam cabang wewenang Anda.');
        }

        // Process and compress image (both enlarged high-res & 3cmx3cm thumbnail)
        $processedPaths = $compressionService->processMosaicImage($request->file('photo'));

        $mosaic = FamilyMosaic::create([
            'user_id' => $user->id,
            'family_member_id' => $request->family_member_id,
            'title' => $request->title,
            'caption' => $request->caption,
            'activity_date' => $request->activity_date,
            'photo_path' => $processedPaths['photo_path'],
            'thumbnail_path' => $processedPaths['thumbnail_path'],
        ]);

        if ($request->filled('tagged_member_ids')) {
            $mosaic->taggedMembers()->sync($request->tagged_member_ids);
        }

        return back()->with('success', 'Foto kenangan mozaik berhasil diunggah.');
    }

    /**
     * Update the specified mosaic photo.
     */
    public function update(UpdateFamilyMosaicRequest $request, FamilyMosaic $mosaic, ImageCompressionService $compressionService): RedirectResponse
    {
        $user = auth()->user();

        // Check authorization
        if (!$user->isSuperadmin()) {
            $canManage = ($mosaic->user_id === $user->id) || $user->getManageableMemberIds()->contains($mosaic->family_member_id);
            if (!$canManage) {
                abort(403, 'Anda tidak memiliki hak untuk mengedit foto ini.');
            }

            // Check new family_member_id
            if ($request->family_member_id != $mosaic->family_member_id) {
                if (!$user->getManageableMemberIds()->contains($request->family_member_id)) {
                    abort(403, 'Anda tidak dapat memindahkan foto ke cabang di luar wewenang Anda.');
                }
            }
        }

        $data = [
            'family_member_id' => $request->family_member_id,
            'title' => $request->title,
            'caption' => $request->caption,
            'activity_date' => $request->activity_date,
        ];

        // If a new photo is uploaded
        if ($request->hasFile('photo')) {
            // Delete old files
            if ($mosaic->photo_path && Storage::disk('public')->exists($mosaic->photo_path)) {
                Storage::disk('public')->delete($mosaic->photo_path);
            }
            if ($mosaic->thumbnail_path && Storage::disk('public')->exists($mosaic->thumbnail_path)) {
                Storage::disk('public')->delete($mosaic->thumbnail_path);
            }

            $processedPaths = $compressionService->processMosaicImage($request->file('photo'));
            $data['photo_path'] = $processedPaths['photo_path'];
            $data['thumbnail_path'] = $processedPaths['thumbnail_path'];
        }

        $mosaic->update($data);

        if ($request->has('tagged_member_ids')) {
            $mosaic->taggedMembers()->sync($request->tagged_member_ids ?? []);
        }

        return back()->with('success', 'Data foto mozaik berhasil diperbarui.');
    }

    /**
     * Remove the specified mosaic photo.
     */
    public function destroy(FamilyMosaic $mosaic): RedirectResponse
    {
        $user = auth()->user();

        if (!$user->isSuperadmin()) {
            $canManage = ($mosaic->user_id === $user->id) || $user->getManageableMemberIds()->contains($mosaic->family_member_id);
            if (!$canManage) {
                abort(403, 'Anda tidak memiliki wewenang untuk menghapus foto mozaik ini.');
            }
        }

        $mosaic->delete();

        return back()->with('success', 'Foto mozaik berhasil dihapus.');
    }
}
