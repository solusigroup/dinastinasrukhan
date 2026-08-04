<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use App\Models\Spouse;
use Inertia\Inertia;

class FamilyTreeController extends Controller
{
    /**
     * Display the public landing page.
     * Only aggregate stats are shared publicly — no personal family data.
     */
    public function index()
    {
        $totalMembers = FamilyMember::count();
        $totalGenerations = FamilyMember::max('generation') ?? 0;
        $totalMale = FamilyMember::male()->count();
        $totalFemale = FamilyMember::female()->count();
        $totalSpouses = Spouse::count();

        return Inertia::render('welcome', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'totalGenerations' => $totalGenerations,
                'totalMale' => $totalMale,
                'totalFemale' => $totalFemale,
                'totalSpouses' => $totalSpouses,
            ],
        ]);
    }
}

