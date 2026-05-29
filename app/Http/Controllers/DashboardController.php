<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get or create user's default workspace
        $workspace = $user->ownedWorkspaces()->firstOrCreate(
            ['owner_id' => $user->id],
            ['name' => 'Personal Workspace', 'description' => 'Workspace pribadi']
        );

        $stats = [
            'totalNotes' => $workspace->notes()->whereNull('deleted_at')->count(),
            'totalFolders' => $workspace->folders()->count(),
            'totalFavorites' => $user->favoriteNotes()
                ->whereHas('workspace', fn ($q) => $q->where('id', $workspace->id))
                ->count(),
        ];

        $recentNotes = $workspace->notes()
            ->whereNull('deleted_at')
            ->with(['folder:id,name', 'tags:id,name,color'])
            ->latest('updated_at')
            ->take(5)
            ->get(['id', 'title', 'folder_id', 'color', 'is_pinned', 'updated_at']);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentNotes' => $recentNotes,
            'workspaceId' => $workspace->id,
        ]);
    }

    public function export(Request $request)
    {
        $user = $request->user();
        $workspace = $user->ownedWorkspaces()->first();

        if (! $workspace) {
            abort(404, 'Workspace not found.');
        }

        $notes = $workspace->notes()->whereNull('deleted_at')->with(['folder', 'tags'])->get();

        $fileName = 'catatin_export_'.date('Y-m-d_H-i-s').'.pdf';

        $pdf = Pdf::loadView('pdf.export', compact('notes'));

        return $pdf->download($fileName);
    }
}
